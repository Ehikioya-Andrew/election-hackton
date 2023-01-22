import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageKey } from '../enums/local-storage-key.enum';
import { JwtPayloadModel } from '../models/jwt-payload-model';
import { TokenExport } from './custom-token-storage/custom-token-storage.module';
import { SecureLocalStorageService } from './secure-local-storage.service';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private secureLS: SecureLocalStorageService,
  ) { }

  getExpiry(): Date | null {
    const token = this.secureLS.get<TokenExport>(LocalStorageKey.JWT.toString());
    return helper.getTokenExpirationDate(token.token);
  }

  getCreatedAt(): Date {
    const token = this.secureLS.get<TokenExport>(LocalStorageKey.JWT.toString());
    return token.createdAt;
  }

  isExpired(): boolean {
    const token = this.secureLS.get<TokenExport>(LocalStorageKey.JWT.toString());
    return helper.isTokenExpired(token.token);
  }

  getPayload(): JwtPayloadModel {
    const token = this.secureLS.get<TokenExport>(LocalStorageKey.JWT.toString());
    return helper.decodeToken(token.token) as JwtPayloadModel;
  }
}
