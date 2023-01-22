import { Router } from '@angular/router';
import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SeoService } from 'src/app/@core/utils/seo.service';
import { GridAnalyticsService } from 'src/app/@core/data-services/grid-analytics.service';
import {
  gridAnalyticsCredentials,
  gridAnalyticsSites,
} from 'src/environments/grid-analytics-config';
import { map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-grid-analytics',
  templateUrl: './grid-analytics.component.html',
  styleUrls: ['./grid-analytics.component.scss'],
})
export class GridAnalyticsComponent implements OnInit {
  states = gridAnalyticsSites;
  state$ = new BehaviorSubject<string>(this.states[0].state);
  jwt$ = this.gridAnalyticsService.jwt$;
  isLoading$ = this.gridAnalyticsService.isLoading$;
  public iframeLoaded = false;

  public iframeSrc$: Observable<SafeResourceUrl | undefined> = combineLatest([
    this.jwt$,
    this.state$,
  ]).pipe(map(([jwt, state]) => this.setIframeSrc(jwt as string, state)));

  options: AnimationOptions = {
    path: '/assets/animations/9844-loading-40-paperplane.json',
  };

  constructor(
    private seo: SeoService,
    public sanitizer: DomSanitizer,
    private gridAnalyticsService: GridAnalyticsService,
    private router: Router
  ) {}

  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(1.5);
  }

  public get showIframeLoader(): boolean {
    return !this.iframeLoaded;
  }

  /** update iframe loaded prop */
  public onLoaded(): void {
    this.iframeLoaded = true;
    const width = (document.querySelector('div.title') as HTMLDivElement).clientWidth;
    (document.querySelector('iframe') as HTMLIFrameElement).style.width = `${width}`;
  }

  private setIframeSrc(
    token: string,
    state: string
  ): SafeResourceUrl | undefined {
    this.iframeLoaded = false;
    if (!(token && state)) {
      return undefined;
    }
    const url = `${gridAnalyticsCredentials.url}/dashboard/${gridAnalyticsCredentials.id}?state=${state}&accessToken=${token}`;
    window.open(url, '_blank');
    this.router.navigateByUrl('app/dashboard');

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
    this.seo.setSeoData('Grid Analytics', 'Manage Grid Analytics');
  }

  updateState(stateName: string): void {
    const state = this.states.find((s) => (s.name = stateName));
    if (state) {
      this.state$.next(state.state);
    }
  }

  onSiteChange(state: string): void {
    this.state$.next(state);
  }

  getStateName(stateId: string | null): string {
    return this.states.find((s) => s.state === stateId)?.name || '';
  }

  refreshIframe() {
    this.gridAnalyticsService.subscribeToGridAnalyticsService();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.refreshIframe();
  }
}
