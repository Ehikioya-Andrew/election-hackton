import { SeoService } from './../../../@core/utils/seo.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-streetlight-dashboard',
  templateUrl: './streetlight-dashboard.component.html',
  styleUrls: ['./streetlight-dashboard.component.scss']
})
export class StreetlightDashboardComponent implements OnInit {

  constructor(
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    this.seo.setSeoData('Streetlight Dashboard - [OCC]', 'View Streetlight Dashboard');
  }
}
