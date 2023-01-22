import { SeoService } from './../../../@core/utils/seo.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-power-station-dashboard',
  templateUrl: './power-station-dashboard.component.html',
  styleUrls: ['./power-station-dashboard.component.scss']
})
export class PowerStationDashboardComponent implements OnInit {

  constructor(
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    this.seo.setSeoData('Power Stations Dashboard - [OCC]', 'View Power Stations Dashboard');
  }

}
