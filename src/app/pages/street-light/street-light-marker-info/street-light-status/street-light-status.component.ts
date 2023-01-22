import { Component, Input, OnInit } from '@angular/core';
import { NbComponentStatus } from '@nebular/theme';

@Component({
  selector: 'app-street-light-status',
  templateUrl: './street-light-status.component.html',
  styleUrls: ['./street-light-status.component.scss']
})
export class StreetLightStatusComponent implements OnInit {

  @Input()
  public set value(v : string) {
    this.#status = v;
    this.setStatus();
  }
  public get value() : string {
    return this.#status;
  }
  
  #status!: string;

  statusColor!: NbComponentStatus;
  statusText!: string;

  constructor() { }

  ngOnInit(): void {
    this.setStatus();
  }

  setStatus() {
    switch (this.#status) {
      case '0':
        this.statusColor = 'danger';
        this.statusText = 'Offline';
        break;
      case '1':
        this.statusColor = 'success';
        this.statusText = 'Online';
        break;

      default:
        this.statusColor = 'basic';
        this.statusText = 'Not Active';
        break;
    }
  }

}
