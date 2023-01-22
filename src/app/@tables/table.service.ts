import { Injectable } from '@angular/core';
import { NbComponentStatus } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor() { }

  generateTagData(value: string, status: NbComponentStatus) {
    return JSON.stringify({ value, status });
  }
}
