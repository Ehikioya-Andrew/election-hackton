import { SeoService } from './../../../@core/utils/seo.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-load-point-dashboard',
  templateUrl: './load-point-dashboard.component.html',
  styleUrls: ['./load-point-dashboard.component.scss']
})
export class LoadPointDashboardComponent implements OnInit {

  constructor(
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    this.seo.setSeoData('Load Points Dashboard - [OCC]', 'View Load Points Dashboard');
  }

}
