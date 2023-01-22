import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-invalid-device',
  templateUrl: './invalid-device.component.html',
  styleUrls: ['./invalid-device.component.scss']
})
export class InvalidDeviceComponent {

  options: AnimationOptions = {
    path: '/assets/animations/37452-mobile-phone-blue.json',
  };

  constructor() { }


  animationCreated(animationItem: AnimationItem): void {
    // setTimeout(() => {
    //   animationItem.goToAndStop(animationItem.firstFrame + animationItem.totalFrames-1, true);
    // }, 3000);
  }

}
