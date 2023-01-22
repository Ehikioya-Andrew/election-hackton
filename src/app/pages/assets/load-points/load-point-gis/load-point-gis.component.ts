import { Component, Input, OnInit } from '@angular/core';
import { NbDateService } from '@nebular/theme';
import { LoadPointDto } from 'src/app/@core/dtos/load-point.dto';
import { LoadPointAnalyticsResourcesNavMap, LoadPointAnalyticsResources } from 'src/app/pages/analytics/load-point-analytics/load-point-analytics-resources';

@Component({
  selector: 'app-load-point-gis',
  templateUrl: './load-point-gis.component.html',
  styleUrls: ['./load-point-gis.component.scss']
})
export class LoadPointGisComponent implements OnInit {

  @Input() value!: string | number;
  @Input() rowData!: LoadPointDto;

  loadPointAnalyticsLink = LoadPointAnalyticsResourcesNavMap.get(LoadPointAnalyticsResources.ExpandedView)?.route;


  get monthStart(): string {
    return this.dateService.getMonthStart(new Date()).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  get currentDate(): string {
    return this.dateService.today().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  constructor(private dateService: NbDateService<Date>) { }

  ngOnInit(): void {
    console.log('')
  }

}
