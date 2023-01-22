import { RoleProvider } from './../utils/role-provider.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppResources, AppResourcesNavMap } from 'src/app/app-resources';

@Injectable({
  providedIn: 'root',
})
export class ShowLandingGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: NbAuthService,
    private roleProvider: RoleProvider
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree>| boolean| UrlTree {
    return this.authService.isAuthenticated().pipe(
      map((isAuth) => {
        if (!isAuth) {
          return true;
        } else {
          const role = this.roleProvider.getRoleSync();
          if (role?.includes('occ')) {
            this.router.navigateByUrl(
              AppResourcesNavMap.get(AppResources.OccView)?.route as string
            );
            return false;
          }
          switch (role[0]) {
            case 'vgg_superadmin':
            case 'vgg_admin':
            case 'vgg_user':
            case 'clientadmin':
            case 'clientuser':
              this.router.navigateByUrl(
                AppResourcesNavMap.get(AppResources.AppView)?.route as string
              );
              break;
          }
          return false;
        }
      })
    );
  }
}
