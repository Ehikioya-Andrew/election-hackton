import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbAuthJWTToken,
  NbAuthToken,
  NbAuthTokenParceler,
  NbTokenLocalStorage,
} from '@nebular/auth';
import { SecureLocalStorageService } from '../secure-local-storage.service';
import { LocalStorageKey } from '../../enums/local-storage-key.enum';

export interface TokenExport {
  token: string;
  createdAt: Date;
}

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class CustomTokenStorageModule extends NbTokenLocalStorage {
  constructor(
    parceler: NbAuthTokenParceler,
    private secureLS: SecureLocalStorageService
  ) {
    super(parceler);
  }

  override clear(): void {
    this.secureLS.clear();
  }

  override get(): NbAuthToken {
    const token = this.secureLS.get<TokenExport>(
      LocalStorageKey.JWT.toString()
    );
    return this.createToken(token);
  }

  override set(token: NbAuthJWTToken): void {
    this.secureLS.set<any>(LocalStorageKey.JWT.toString(), token);
  }

  createToken(token?: TokenExport): NbAuthJWTToken {
    if (token) {
      return new NbAuthJWTToken(token.token, 'email', token.createdAt);
    }
    return new NbAuthJWTToken(null, 'email');
  }
}
