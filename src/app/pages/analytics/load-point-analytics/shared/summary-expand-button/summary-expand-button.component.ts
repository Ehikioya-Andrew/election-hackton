import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { LoadPointAnalyticsSummaryDto } from 'src/app/@core/dtos/loadpoint-analytics-summary-data';
import {
  AssetTypeEnum,
  ForecastAssetTypeSelectionEnum,
} from 'src/app/@core/enums/asset-type.enum';
import {
  LoadPointAnalyticsResources,
  LoadPointAnalyticsResourcesNavMap,
} from '../../load-point-analytics-resources';

@Component({
  selector: 'app-summary-expand-button',
  templateUrl: './summary-expand-button.component.html',
  styleUrls: ['./summary-expand-button.component.scss'],
})
export class SummaryExpandButtonComponent {
  @Input() rowData!: LoadPointAnalyticsSummaryDto;
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
  ) {}

  routeTo() {
    const { startDate, endDate } = this.route.snapshot.queryParams;

    const startDateFormatted = (
      startDate ? new Date(startDate) : new Date(this.monthStart)
    ).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const endDateFormatted = (
      endDate ? new Date(endDate) : new Date(this.currentDate)
      ).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const queryParams: Params = {
      locationName: this.rowData.location,
      locationId: this.rowData.locationId,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      assetType: ForecastAssetTypeSelectionEnum.LOADPOINT,
    };

    this.router.navigate(
      [
        LoadPointAnalyticsResourcesNavMap.get(
          LoadPointAnalyticsResources.ExpandedView
        )?.route,
      ],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      }
    );
  }
}
