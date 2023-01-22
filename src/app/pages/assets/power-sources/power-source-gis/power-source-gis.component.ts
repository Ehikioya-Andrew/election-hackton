import { Component, OnInit, Input } from '@angular/core';
import { NbDateService } from '@nebular/theme';
import { PowerSourceDto } from 'src/app/@core/dtos/power-source.dto';
import { PowerSourceAnalyticsResources, PowerSourceAnalyticsResourcesNavMap } from 'src/app/pages/analytics/power-source-analytics/power-source-analytics-resources';

@Component({
  selector: 'app-power-source-gis',
  templateUrl: './power-source-gis.component.html',
  styleUrls: ['./power-source-gis.component.scss']
})
export class PowerSourceGisComponent implements OnInit {
  @Input() value!: string | number;
  @Input() rowData!: PowerSourceDto;
  powerSatationAnalyticsLink = PowerSourceAnalyticsResourcesNavMap.get(PowerSourceAnalyticsResources.ExpandedView)?.route;
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
