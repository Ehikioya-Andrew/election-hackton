import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-user-idle',
  templateUrl: './user-idle.component.html',
  styleUrls: ['./user-idle.component.scss']
})
export class UserIdleComponent {

  options: AnimationOptions = {
    path: '/assets/animations/38063-log-out.json',
  };

  constructor() { }

  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(0.5);
    // setTimeout(() => {
    // animationItem.goToAndStop(animationItem.firstFrame + animationItem.totalFrames-1, true);
    // }, 3000);
  }

}
