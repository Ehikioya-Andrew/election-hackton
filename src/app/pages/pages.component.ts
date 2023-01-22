import { HostListener } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbMenuItem, NbMenuService } from '@nebular/theme';
import { lastValueFrom } from 'rxjs';
import { filter, map, takeWhile } from 'rxjs/operators';
import { AuditService } from '../@core/data-services/audit.services';
import { LocalStorageKey } from '../@core/enums/local-storage-key.enum';
import { IdleMonitorService } from '../@core/utils/idle-monitor.service';
import { PermissionService } from '../@core/utils/permission.service';
import { SecureLocalStorageService } from '../@core/utils/secure-local-storage.service';
import { ConfirmationDialogComponent } from '../@theme/components/confirmation-dialog/confirmation-dialog.component';
import { SettingsComponent } from '../@theme/components/settings/settings.component';
import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit, OnDestroy {
  menu = MENU_ITEMS;

  isLive = true;

  constructor(
    private permissionService: PermissionService,
    private nbMenuService: NbMenuService,
    private dialogService: NbDialogService,
    private storageService: SecureLocalStorageService,
    private idleMonitorService: IdleMonitorService,
    private router: Router,
    private auditService: AuditService
  ) {}

  ngOnInit() {
    this.setMenuPermissions(this.menu);
    this.onUserContextMenuClick();
  }

  @HostListener(`window:visibilitychange`, ['$event.target'])
  onVisibilityChange(): void {
    this.idleMonitorService.onVisibilityChange();
  }

  setMenuPermissions(menu: NbMenuItem[]) {
    for (let m of menu) {
      if (!m.link) {
        if (m.children?.length) {
          this.setMenuPermissions(m.children);
        }
        if (m.children?.filter((c) => !c.hidden).length) {
          m.hidden = false;
        } else {
          m.hidden = true;
        }
        if (m.group) {
          m.hidden = false;
        }
      } else if (this.permissionService.canView(m.link)) {
        m.hidden = false;
      } else {
        m.hidden = true;
      }
    }
  }

  onUserContextMenuClick() {
    this.nbMenuService
      .onItemClick()
      .pipe(
        takeWhile(() => this.isLive),
        filter(({ tag }) => tag === 'user-menu'),
        map(({ item: { title } }) => title)
      )
      .subscribe((title) => {
        switch (title) {
          case 'Settings':
            this.handleProfileMenuClick();
            break;

          case 'Log out':
            this.handleLogoutClick();
            break;

          default:
            break;
        }
      });
  }

  ngOnDestroy() {
    this.isLive = false;
  }

  async handleLogoutClick() {
    const confirmed = await lastValueFrom(
      this.dialogService.open(ConfirmationDialogComponent, {
        context: {
          context: `Are you sure you wish to proceed? `,
          title: 'Logout',
        },
      }).onClose
    );

    if (confirmed) {
      this.auditService.postLogout().subscribe();
      this.storageService.remove(LocalStorageKey.JWT.toString());
      this.router.navigateByUrl('/');
    }
  }

  async handleProfileMenuClick() {
    lastValueFrom(this.dialogService.open(SettingsComponent).onClose);
  }
}
