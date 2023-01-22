import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Granim from 'granim';
import { AnimationItem } from 'lottie-web';
import { isMobile } from 'mobile-device-detect';
import { AnimationOptions } from 'ngx-lottie';
import { SeoService } from 'src/app/@core/utils/seo.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit, OnDestroy {
  options: AnimationOptions = {
    path: this.animationPicker(),
  };
  granimInstance: any;

  isMobile = isMobile;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.granimInstance = new Granim({
      element: '#landing-canvas',
      direction: 'left-right',
      isPausedWhenNotInView: true,
      states: {
        'default-state': {
          gradients: [
            ['#e4e9f2', '#8f9bb3'],
            ['#e4e9f2', '#8f9bb3'],
            ['#e4e9f2', '#8f9bb3'],
            ['#ffc94d', '#db8b00'],
            ['#2ce69b', '#00b887'],
            ['#ff708d', '#db2c66'],
          ],
        },
      },
      transitionSpeed: 2000,
    });
    this.seo.setSeoData('Home', 'Landing Page');
  }

  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(0.3);
    // setTimeout(() => {
    //   animationItem.goToAndStop(animationItem.firstFrame + animationItem.totalFrames-1, true);
    // }, 3000);
  }

  animationPicker(): string {
    const animationList = [
      'assets/animations/seo-new.json',
      '/assets/animations/seo-kpis-new.json',
      '/assets/animations/seo-monitoring-new.json',
    ];
    let presentAnimation =
      animationList[Math.floor(Math.random() * animationList.length)];
    return presentAnimation;
  }

  ngOnDestroy(): void {
    this.granimInstance.destroy();
  }
}
