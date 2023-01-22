import { GeneratingSetDto } from './../../../../@core/dtos/generating-set.dto';
import { Component, OnInit, Input } from '@angular/core';
import { GeneratingUnitAnalyticsResources, GeneratingUnitAnalyticsResourcesNavMap } from 'src/app/pages/analytics/generating-unit-analytics/genearting-unit-analytics-resources';
import { NbDateService } from '@nebular/theme';

@Component({
  selector: 'app-generating-set-gis',
  templateUrl: './generating-set-gis.component.html',
  styleUrls: ['./generating-set-gis.component.scss']
})
export class GeneratingSetGisComponent implements OnInit {

  @Input() value!: string | number;
  @Input() rowData!: GeneratingSetDto;

  genSetAnalyticsLink = GeneratingUnitAnalyticsResourcesNavMap.get(GeneratingUnitAnalyticsResources.ExpandedView)?.route;
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
    console.log('');
  }
}
