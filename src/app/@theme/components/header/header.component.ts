import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { filter, map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { ServiceWorkerService } from 'src/app/@core/utils/service-worker.service';
import { AuthService } from 'src/app/@core/data-services/auth.service';
import { UserModel } from 'src/app/@core/models/user.model';
import { OnlineStatService } from 'src/app/@core/utils/online-stat.service';
import { GridAnalyticsService } from 'src/app/@core/data-services/grid-analytics.service';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly = false;
  autoToggleMenu = false;

  user: UserModel;

  currentTheme = 'default';

  userMenu = [
    { title: 'Settings' },
    { title: 'Log out' }
  ];

  canInstall$: BehaviorSubject<boolean>;

  constructor(
    private sw: ServiceWorkerService,
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userAuthService: AuthService,
    private layoutService: LayoutService,
    public onlineStatService: OnlineStatService,
    private gridAnalyticsService: GridAnalyticsService,
    private breakpointService: NbMediaBreakpointsService) {
    this.canInstall$ = this.sw.readyForInstall;
    this.user = this.userAuthService.getAuthenticatedUser() as UserModel;
  }

  ngOnInit(): void {
    this.currentTheme = this.themeService.currentTheme;

    const { xl, lg } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < lg),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanL: boolean) => this.autoToggleMenu = isLessThanL);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.menuService.onItemClick().pipe(
      filter(({ tag }) => (this.autoToggleMenu && tag === 'side-bar')),
      takeUntil(this.destroy$),
    ).subscribe(() => this.toggleSidebar());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string): void {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome(): boolean {
    this.menuService.navigateHome();
    return false;
  }

  installPwa() {
    this.sw.installPwa();
  }

  fullscreenLayout(): void {
    document.getElementById('layoutColumn')?.requestFullscreen();
  }

  @HostListener(`window:online`, ['$event.target'])
  setNetworkOnLine(): void {
    this.onlineStatService.updateOnlineStatus(true);
  }

  @HostListener(`window:offline`, ['$event.target'])
  setNetworkOffline(): void {
    this.onlineStatService.updateOnlineStatus(false);
  }
}
