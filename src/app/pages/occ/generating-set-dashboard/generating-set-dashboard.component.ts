import { SeoService } from './../../../@core/utils/seo.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generating-set-dashboard',
  templateUrl: './generating-set-dashboard.component.html',
  styleUrls: ['./generating-set-dashboard.component.scss']
})
export class GeneratingSetDashboardComponent implements OnInit {

  constructor(
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    this.seo.setSeoData('Generating Units Dashboard - [OCC]', 'View Generating Units Dashboard');
  }

}
