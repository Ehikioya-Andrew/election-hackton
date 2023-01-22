import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { takeWhile } from 'rxjs/operators';
import { GeneratingSetsService } from 'src/app/@core/data-services/generating-set.service';
import { GenSetAnalyticsTableDto } from 'src/app/@core/dtos/gen-set-analytics-table.dto';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { NumberFormatter } from 'src/app/@core/functions/formatter.funtion';
import { SeoService } from 'src/app/@core/utils';
import { ExpandedButtonComponent } from '../expanded-button/expanded-button.component';
import { GeneratingUnitAnalyticsExpandedComponent } from '../generating-unit-analytics-expanded/generating-unit-analytics-expanded.component';

@Component({
  selector: 'app-generating-unit-analytics-summary',
  templateUrl: './generating-unit-analytics-summary.component.html',
  styleUrls: ['./generating-unit-analytics-summary.component.scss'],
  providers: [DatePipe],
})
export class GeneratingUnitAnalyticsSummaryComponent
  implements OnInit, OnDestroy
{
  isLive = true;
  isLoadingData = true;

  generatingUnits: GenSetAnalyticsTableDto[] = [];

  noData!: string;

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
      filter: false,
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

  constructor(
    private datePipe: DatePipe,
    protected dateService: NbDateService<Date>,
    private route: ActivatedRoute,
    private seo: SeoService,
    private generatingSetService: GeneratingSetsService
  ) {}

  ngOnInit(): void {
    this.seo.setSeoData(
      'Analytics Management - [Generating Unit Analytics]',
      'Manage generating units analytics'
    );
    this.route.queryParams
      .pipe(takeWhile(() => this.isLive))
      .subscribe(({ startDate, endDate }) => {
        if (!!startDate && !!endDate) {
          this.dateRange = {
            startDate: new Date(startDate).toUTCString(),
            endDate: new Date(endDate).toUTCString()
          };
        }

        this.getSummaryAnalytics(this.dateRange, true);
      });
    console.log(this.generatingUnits);
  }

  getSummaryAnalytics(data?: any, reset = false) {
    this.isLoadingData = true;
    this.generatingSetService
      .getGeneratingSetAnalyticSummary({ ...this.dateRange, ...data })
      .subscribe(
        (data) => {
          this.isLoadingData = false;
          this.generatingUnits = reset
            ? [...(data.data ?? [])]
            : GetUniqueArray([...(data.data ?? [])], [...this.generatingUnits]);
          console.log(this.generatingUnits);
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
