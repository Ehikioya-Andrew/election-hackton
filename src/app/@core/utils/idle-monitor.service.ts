import { Injectable, OnDestroy } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { TokenService } from './token.service';
import * as dayjs from 'dayjs';
import { interval, lastValueFrom } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenExport } from './custom-token-storage/custom-token-storage.module';
import { SecureLocalStorageService } from './secure-local-storage.service';

import { LocalStorageKey } from '../enums/local-storage-key.enum';
import {
  ExceptionResources,
  ExceptionResourcesNavMap,
} from 'src/app/pages/exceptions/exceptions-resources';
import { AuditService } from '../data-services/audit.services';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

@Injectable({
  providedIn: 'root',
})
export class IdleMonitorService implements OnDestroy {
  isIdle = false;
  isAlive = true;
  refreshAllowed = true;

  constructor(
    private tokenService: TokenService,
    private authService: NbAuthService,
    private secureLs: SecureLocalStorageService,
    private router: Router,
    private auditService: AuditService
  ) {
    this.startMonitor();
  }

  startMonitor(): void {
    interval(10 * 60 * 1000)
      .pipe(
        takeWhile(() => this.isAlive),
        switchMap(() => this.refreshTokenIfValid())
      )
      .subscribe(
        () => {},
        (err) => console.log('Token refresh failed')
      );
  }

  onVisibilityChange(): void {
    this.isIdle = document.hidden;
    this.refreshTokenIfValid();
  }

  async refreshTokenIfValid(): Promise<void> {
    if (this.tokenService.isExpired()) {
      this.auditService.postLogout().subscribe();
      this.router.navigateByUrl(
        ExceptionResourcesNavMap.get(ExceptionResources.UserIdleView)
          ?.route as string
      );
    }

    if (!this.tokenService.isExpired() && !this.isIdle) {
      const refreshTokenDto: RefreshTokenDto = {
        jwt: this.secureLs.get<TokenExport>(LocalStorageKey.JWT.toString())
          .token,
        refreshToken: this.secureLs.get<string>(
          LocalStorageKey.REFRESH_TOKEN.toString()
        ),
      };
      const createdAt = this.tokenService.getCreatedAt();

      if (dayjs().isAfter(dayjs(createdAt as Date).add(5, 'minutes'))) {
        if (this.refreshAllowed) {
          this.refreshAllowed = false;
          await lastValueFrom(
            this.authService.refreshToken('email', refreshTokenDto)
          ).catch((err) => console.log('token refresh failed'));
          this.refreshAllowed = true;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.isAlive = false;
  }
}
