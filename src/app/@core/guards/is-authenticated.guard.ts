import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExceptionResources, ExceptionResourcesNavMap } from 'src/app/pages/exceptions/exceptions-resources';
import { TokenService } from '../utils/token.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private authService: NbAuthService,
    private tokenService: TokenService
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated().pipe(
      map((isAuth) => {
        if (isAuth) {
          return true;
        } else {
          if (this.tokenService.isExpired()) {
            this.router.navigateByUrl(ExceptionResourcesNavMap.get(ExceptionResources.UserIdleView)?.route as string);
          } else {
            this.router.navigateByUrl(ExceptionResourcesNavMap.get(ExceptionResources.UnauthorisedView)?.route as string);
          }
          return false;
        }
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(route, state)
  }

}
