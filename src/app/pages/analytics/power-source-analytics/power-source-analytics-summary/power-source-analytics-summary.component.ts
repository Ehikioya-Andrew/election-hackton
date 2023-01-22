import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { PowerSourceService } from 'src/app/@core/data-services/power-source.service';
import { UpDownTimeDto } from 'src/app/@core/dtos/generating-set-updowntimee.dto';
import { PowerSourceAnalyticsTableDto } from 'src/app/@core/dtos/power-source-analytics-table.dto';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { NumberFormatter } from 'src/app/@core/functions/formatter.funtion';
import { SeoService } from 'src/app/@core/utils';
import { ExpandedButtonComponent } from '../expanded-button/expanded-button.component';
// interface TreeNode<T> {
//   data: T;
//   loadPoints?: TreeNode<T>[];
//   expanded?: boolean;
// }

// interface FSEntry {
//   name: string;
//   size: string;
//   kind: string;
//   items?: number;
//   totalEnergySupplied:number,
//   totalEnergyConsumed:number,
//   difference:number,
//   differencePercentage:number,
// }
interface LoadPoint {
  id: string;
  name: string;
  energyConsumed: number;
  percentage: number;
}

interface PowerSource {
  id: string;
  name: string;
  totalEnergySupplied: number;
  totalEnergyConsumed: number;
  difference: number;
  differencePercentage: number;
  loadPoints: LoadPoint[];
}

interface DataReconcile {
  powerSources: PowerSource[];
}

@Component({
  selector: 'app-power-source-analytics-summary',
  templateUrl: './power-source-analytics-summary.component.html',
  styleUrls: ['./power-source-analytics-summary.component.scss'],
  providers: [DatePipe],
})
export class PowerSourceAnalyticsSummaryComponent implements OnInit, OnDestroy {
  customColumn = 'name';
  defaultColumns = ['size', 'kind', 'items'];
  allColumns = [this.customColumn, ...this.defaultColumns];

  // data: TreeNode<FSEntry>[] = [];

  isLive = true;
  isLoadingData = true;

  powerSources: PowerSourceAnalyticsTableDto[] = [];
  EnergyReconcilation: DataReconcile[] = [];

  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };

  dateRange = {
    startDate: this.dateService
      .getMonthStart(new Date())
      .toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    endDate: this.dateService.today().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  };

  columns = {
    location: {
      title: 'Location',
    },
    minPowerDemand: {
      title: 'Min. Demand  (kW)',
      valuePrepareFunction: (d: number) => {
        return NumberFormatter.format(d || 0) + ' kW';
      },
    },

    maxPowerDemand: {
      title: 'Max. Demand  (kW)',
      valuePrepareFunction: (d: number) => {
        return NumberFormatter.format(d || 0) + ' kW';
      },
    },
    totalEnergy: {
      title: 'Energy  (kW)',
      valuePrepareFunction: (d: number) => {
        return NumberFormatter.format(d || 0) + ' kW';
      },
      sortDirection: 'desc',
    },
    locationId: {
      title: 'Details',
      filter: false,
      type: 'custom',
      renderComponent: ExpandedButtonComponent,
    },
  };

  columnsReconcile = {
    name: {
      title: 'Power Satation',
      filter: false,
    },

    totalEnergySupplied: {
      title: 'Energy Supplied',
      filter: false,
    },

    totalEnergyConsumed: {
      title: 'Energy Comsumption',

      filter: false,
    },
    difference: {
      title: 'Energy  Diffrence',

      filter: false,
    },
    differencePercentage: {
      title: '% Diff',
      filter: false,
      valuePrepareFunction: (differencePercentage: string) => {
        return differencePercentage;
      },
    },
  };
  columnsReconciles = [
    // // 'name',
    // 'totalEnergySupplied',
    // 'totalEnergyConsumed',
    // 'difference',
    // 'differencePercentage',
  ];

  tableOnly: boolean = true;
  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }
  get currentDate(): Date {
    return this.dateService.today();
  }

  constructor(
    private datePipe: DatePipe,
    protected dateService: NbDateService<Date>,
    private route: ActivatedRoute,
    private seo: SeoService,
    private powerSourceService: PowerSourceService
  ) {}

  ngOnInit(): void {
    this.seo.setSeoData(
      'Analytics Management - [Power Station Analytics]',
      'Manage power station analytics'
    );
    this.route.queryParams
      .pipe(takeWhile(() => this.isLive))
      .subscribe(({ startDate, endDate }) => {
        if (!!startDate && !!endDate) {
          this.dateRange = {
            startDate: new Date(startDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
    }),
            endDate: new Date(endDate).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
    }),
          };
        }
        this.getSummaryAnalytics(this.dateRange, true);
        this.setEnergyReconcilation(this.dateRange);
      });
  }

  getSummaryAnalytics(data?: any, reset = false) {
    this.isLoadingData = true;
    this.powerSourceService
      .getPowerSourceAnalyticSummary({ ...this.dateRange, ...data })
      .subscribe(
        (data) => {
          this.isLoadingData = false;
          this.powerSources = reset
            ? [...(data.data ?? [])]
            : GetUniqueArray([...(data.data ?? [])], [...this.powerSources]);
        },
        (err) => {
          this.isLoadingData = false;
        }
      );
  }

  setEnergyReconcilation(
    params: { startDate: string; endDate: string },
    reset = false
  ): void {
    this.powerSourceService.getPowerSourceEnergyReconcilation(params).subscribe(
      (response) => {
        if (response.status) {
          console.log('data : ', response.data.powerSources);
          this.isLoadingData = false;
          this.EnergyReconcilation = reset
            ? [...(response.data?.powerSources ?? [])]
            : GetUniqueArray(
                [...(response.data?.powerSources ?? [])],
                [...this.EnergyReconcilation]
              );
        }
      },
      (err) => {
        this.isLoadingData = false;
      }
    );
  }

  ngOnDestroy() {
    this.isLive = false;
  }
}
