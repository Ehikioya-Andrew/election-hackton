import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { isMobile } from 'mobile-device-detect';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsMobileGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!isMobile) {
      this.router.navigateByUrl('/error/invalid-device');
      return false;
    } else {
      return true;
    }
  }
}
