import { Injectable } from '@angular/core';
import { NbRoleProvider } from '@nebular/security';
import { Observable, of } from 'rxjs';
import { UserModel } from '../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class RoleProvider implements NbRoleProvider {

  constructor(private tokenService: TokenService) { }

  getRole(): Observable<string[] | string> {
    return of(this.getRoleSync());
  }

  getRoleSync() {
    const payload = this.tokenService.getPayload();
    if (payload) {
      try {
        const user = (JSON.parse(payload.sub) as UserModel);
        return [user.ssoRole, user.appRole ? user.appRole : 'guest']
      } catch (error) {
        return ['guest'];
      }
    }
    return ['guest'];
  }
}
