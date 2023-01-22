import { Component, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NbDateService, NbDialogRef } from '@nebular/theme';
import { GeneratingSetExecutiveSummaryDto } from 'src/app/@core/dtos/generating-set-executive-summary.dto';
import { ForecastAssetTypeSelectionEnum } from 'src/app/@core/enums/asset-type.enum';
import {
  GeneratingUnitAnalyticsResourcesNavMap,
  GeneratingUnitAnalyticsResources,
} from '../../analytics/generating-unit-analytics/genearting-unit-analytics-resources';
import { ExecutiveSummaryDialogComponent } from '../executive-summary-dialog/executive-summary-dialog.component';

@Component({
  selector: 'app-executive-summary-expand-button',
  templateUrl: './executive-summary-gen-set-expand-button.component.html',
  styleUrls: ['./executive-summary-gen-set-expand-button.component.scss'],
})
export class ExecutiveSummaryGenSetExpandButtonComponent {
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
    const { startDate, endDate } = this.route.snapshot.queryParams;
    const queryParams: Params = {
      locationName: this.rowData.name,
      locationId: this.rowData.id,
      startDate: startDate,
      endDate: endDate,
      assetType: ForecastAssetTypeSelectionEnum.GEN_SET,
    };

    this.router.navigate(
      [
        GeneratingUnitAnalyticsResourcesNavMap.get(
          GeneratingUnitAnalyticsResources.ExpandedView
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
