import { SeoService } from './../../../@core/utils/seo.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid-analytics-dashboard',
  templateUrl: './grid-analytics-dashboard.component.html',
  styleUrls: ['./grid-analytics-dashboard.component.scss']
})
export class GridAnalyticsDashboardComponent implements OnInit {

  constructor(
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    this.seo.setSeoData('Grid Analytix Dashboard - [OCC]', 'View Grid Analytix Dashboard');
  }

}
