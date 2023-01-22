import { Injectable } from '@angular/core';
import * as SecureLS from 'secure-ls';

@Injectable({
  providedIn: 'root'
})
export class SecureLocalStorageService {

  private ls = new SecureLS({ encodingType: 'aes' });

  constructor() { }

  set<T>(key: string, data: T): void {
    this.ls.set(key, data);
  }

  get<T>(key: string): T {
    return this.ls.get(key) as T;
  }

  remove(key: string): void {
    this.ls.remove(key);
  }

  clear(): void {
    this.ls.removeAll();
  }
}
