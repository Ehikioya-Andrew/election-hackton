import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { GenSetAnalyticsTableDto } from 'src/app/@core/dtos/gen-set-analytics-table.dto';
import { ForecastAssetTypeSelectionEnum } from 'src/app/@core/enums/asset-type.enum';
import { GeneratingUnitAnalyticsResources, GeneratingUnitAnalyticsResourcesNavMap } from '../genearting-unit-analytics-resources';

@Component({
  selector: 'app-expanded-button',
  templateUrl: './expanded-button.component.html',
  styleUrls: ['./expanded-button.component.scss']
})
export class ExpandedButtonComponent implements OnInit {

  @Input() rowData!: GenSetAnalyticsTableDto;
  GeneratingUnitAnalyticsLink = GeneratingUnitAnalyticsResourcesNavMap.get(GeneratingUnitAnalyticsResources.ExpandedView)?.route;
  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }
  get currentDate(): Date {
    return this.dateService.today();
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dateService: NbDateService<Date>
  ) { }
  ngOnInit(): void {
    console.log("");
  }

  routeTo() {

    const { startDate, endDate } = this.route.snapshot.queryParams;

    const startDateFormatted = (startDate ? new Date(startDate) : new Date(this.monthStart)).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const endDateFormatted = (endDate ? new Date(endDate) : new Date(this.currentDate)).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

    const queryParams: Params = {
      locationName: this.rowData.location,
      locationId: this.rowData.locationId,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      assetType: ForecastAssetTypeSelectionEnum.GEN_SET
    };

    this.router.navigate(
      [GeneratingUnitAnalyticsResourcesNavMap.get(GeneratingUnitAnalyticsResources.ExpandedView)?.route],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      }
    );
  }
}
