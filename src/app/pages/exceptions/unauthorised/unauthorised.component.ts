import { AnimationOptions } from 'ngx-lottie';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { SecureLocalStorageService } from 'src/app/@core/utils/secure-local-storage.service';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorised',
  templateUrl: './unauthorised.component.html',
  styleUrls: ['./unauthorised.component.scss']
})
export class UnauthorisedComponent implements OnInit, OnDestroy{

  options: AnimationOptions = {
    path: '/assets/animations/27608-security-lock.json'
  };

  isLive = true;

  constructor(
    private storageService: SecureLocalStorageService,
    private router: Router
    ) { }

  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(0.5);
  }

  ngOnInit(): void {
      timer(5_000).pipe(
        takeWhile(() => this.isLive)
      ).subscribe(
        () => {
          this.storageService.clear();
          this.router.navigateByUrl('');
        }
      )
  }

  ngOnDestroy(): void {
      this.isLive = false;
  }

}
