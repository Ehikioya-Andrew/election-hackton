import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NbDateService, NbDialogRef } from '@nebular/theme';
import { GeneratingSetExecutiveSummaryDto } from 'src/app/@core/dtos/generating-set-executive-summary.dto';
import { ForecastAssetTypeSelectionEnum } from 'src/app/@core/enums/asset-type.enum';
import {
  GeneratingUnitAnalyticsResourcesNavMap,
  GeneratingUnitAnalyticsResources,
} from '../../analytics/generating-unit-analytics/genearting-unit-analytics-resources';
import {
  LoadPointAnalyticsResources,
  LoadPointAnalyticsResourcesNavMap,
} from '../../analytics/load-point-analytics/load-point-analytics-resources';
import { ExecutiveSummaryDialogComponent } from '../executive-summary-dialog/executive-summary-dialog.component';

@Component({
  selector: 'app-executive-summary-loadpoint-expand-button',
  templateUrl: './executive-summary-loadpoint-expand-button.component.html',
  styleUrls: ['./executive-summary-loadpoint-expand-button.component.scss'],
})
export class ExecutiveSummaryLoadpointExpandButtonComponent {
  @Input() rowData!: GeneratingSetExecutiveSummaryDto;
  GeneratingUnitAnalyticsLink = GeneratingUnitAnalyticsResourcesNavMap.get(
    GeneratingUnitAnalyticsResources.ExpandedView
  )?.route;
  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }
  get currentDate(): Date {
    return this.dateService.today();
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dateService: NbDateService<Date>,
    public dialogRef: NbDialogRef<ExecutiveSummaryDialogComponent>
  ) {}

  routeTo() {
    console.log(this.rowData);
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
      locationName: this.rowData.name,
      locationId: this.rowData.id,
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
    setTimeout(() => this.dialogRef.close(), 1000);
  }
}
