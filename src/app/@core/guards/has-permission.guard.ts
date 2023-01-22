import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ExceptionResources, ExceptionResourcesNavMap } from 'src/app/pages/exceptions/exceptions-resources';
import { PermissionService } from '../utils/permission.service';

@Injectable({
  providedIn: 'root'
})
export class HasPermissionGuard implements CanActivate, CanActivateChild {

  constructor(
    private permissionService: PermissionService,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const hasAccess = this.permissionService.canView(state.url.split('?')[0]);
    if (hasAccess) {
      return true;
    } else {
      this.router.navigateByUrl(ExceptionResourcesNavMap.get(ExceptionResources.UnauthorisedView)?.route as string)
      return false;
    }
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(route, state)
  }

}
