import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { LoadPointAnalyticsSummaryDto } from './../../../../@core/dtos/loadpoint-analytics-summary-data';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbColorHelper, NbThemeService, NbDateService } from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { take, takeWhile } from 'rxjs/operators';
import { LoadPointAnalyticsService } from 'src/app/@core/data-services/load-point-analytics.service';
import { LoadPointDto } from 'src/app/@core/dtos/load-point.dto';
import { LoadPointAnalyticsExpandedComponent } from '../load-point-analytics-expanded/load-point-analytics-expanded.component';
import { SummaryExpandButtonComponent } from '../shared/summary-expand-button/summary-expand-button.component';
import { NumberFormatter } from 'src/app/@core/functions/formatter.funtion';
import { SeoService } from 'src/app/@core/utils';

@Component({
  selector: 'app-load-point-analytics-summary',
  templateUrl: './load-point-analytics-summary.component.html',
  styleUrls: ['./load-point-analytics-summary.component.scss'],
})
export class LoadPointAnalyticsSummaryComponent implements OnInit, OnDestroy {
  isLive = true;
  isLoadingData = true;

  loadPointsSummary: LoadPointAnalyticsSummaryDto[] = [];

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

  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };

  columns = {
    location: {
      title: 'Location',
    },
    energyConsumption: {
      title: 'Energy Consumption (kWh)',
      valuePrepareFunction: (d: number) => {
        return NumberFormatter.format(d || 0) + ' kWh';
      },
      sortDirection: 'desc',
    },
    minPowerDemand: {
      title: 'Min. Demand (kW)',
      valuePrepareFunction: (d: number) => {
        return NumberFormatter.format(d || 0) + ' kW';
      },
    },

    maxPowerDemand: {
      title: 'Max. Demand (kW)',
      valuePrepareFunction: (d: number) => {
        return NumberFormatter.format(d || 0) + ' kW';
      },
    },

    Action: {
      title: 'Action',
      type: 'custom',
      filter: false,
      renderComponent: SummaryExpandButtonComponent,
    },
  };

  constructor(
    private route: ActivatedRoute,
    private seo: SeoService,
    private loadPointService: LoadPointService,
    protected dateService: NbDateService<Date>
  ) {}

  ngOnInit(): void {
    this.seo.setSeoData(
      'Analytics Management - [Load Point Analytics]',
      'Manage load Point analtics'
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
            })
          };
        }
        this.requestData(this.dateRange, true);
      });
  }

  requestData(data?: any, reset = false) {
    this.isLoadingData = true;
    this.loadPointService
      .getLoadPointAnalyticsSummary({ ...this.dateRange, ...data })
      .subscribe(
        (response) => {
          this.isLoadingData = false;
          if (response.status) {
            this.loadPointsSummary = reset
              ? [...(response.data?.itemList ?? [])]
              : GetUniqueArray(
                  [...(response.data?.itemList ?? [])],
                  [...this.loadPointsSummary],
                  false,
                  'locationId'
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
