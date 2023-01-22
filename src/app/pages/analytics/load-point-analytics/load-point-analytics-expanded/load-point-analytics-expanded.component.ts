import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { Observable, timer } from 'rxjs';
import { map, take, takeWhile, shareReplay } from 'rxjs/operators';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { ForecastAssetTypeSelectionEnum } from 'src/app/@core/enums/asset-type.enum';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { EnergySummaryDto } from 'src/app/@core/dtos/energy-summary.dto';
import { EchartModel } from 'src/app/@core/models/echart.model';
import { environment } from 'src/environments/environment';
import { SeoService } from 'src/app/@core/utils';
import { LoadPointChartModel } from 'src/app/@core/models/loadpoint-charts.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-load-point-analytics-expanded',
  templateUrl: './load-point-analytics-expanded.component.html',
  styleUrls: ['./load-point-analytics-expanded.component.scss'],
})
export class LoadPointAnalyticsExpandedComponent implements OnInit, OnDestroy {
  @Output()
  selection: EventEmitter<any> = new EventEmitter();
  locationName!: string;
  locationId!: string;
  assetType!: number;
  predictionLength!: number;
  forecastAssetTypeValue!: number;
  flipped: boolean = false;

  returnButtonDisable: boolean = false;

  minPowerDemand = 0;
  maxPowerDemand = 0;
  avgPowerDemand = 0;
  uptimeDuration = 0;
  downtimeDuration = 0;
  upTime!: string;
  downTime!: string;

  forecastForm!: UntypedFormGroup;

  forecastAssetType!: ForecastAssetTypeSelectionEnum;

  themeVariables: any = null;

  selectCostChart = false;
  showForecastChart = false;

  forecastChartData!: EchartModel;

  $loadPointChartsData!: Observable<LoadPointChartModel>;

  $loadPointEnergySummary!: Observable<EnergySummaryDto>;

  isLive = true;

  startDate!: string;
  endDate!: string;
  downTimeInterval: any[] = [];
  downInterval: any[] = [];

  @Input()
  isLoadingData = false;

  constructor(
    private theme: NbThemeService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private loadPointService: LoadPointService,
    private seo: SeoService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.getThemeData();
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeWhile(() => this.isLive))
      .subscribe((params) => {
        const {
          locationId: id,
          startDate,
          endDate,
          assetType,
          forecastAssetTypeValue,
        } = params;
        this.startDate = startDate;
        this.endDate = endDate;
        this.assetType = assetType;
        this.forecastAssetTypeValue = forecastAssetTypeValue;
        this.locationId = id;
        timer(0, environment.refreshInterval)
          .pipe(takeWhile(() => this.isLive))
          .subscribe(() => {
            this.isLoadingData = false;
            this.setEnergyConsumptionLineChart({ id, startDate, endDate });
            this.setEnergySummary({ id, startDate, endDate });
          });
        this.seo.setSeoData(
          `Load Point Analytics - [${params.locationName}]`,
          `Manage load Point analtics`
        );
      });
    this.forecastForm = this.formBuilder.group({
      predictionLength: 1,
    });
  }

  getThemeData(): void {
    this.theme
      .getJsTheme()
      .pipe(take(1))
      .subscribe({
        next: (config) => {
          this.themeVariables = config.variables;
        },
      });
  }

  setEnergyConsumptionLineChart(params: {
    id: string;
    startDate: string;
    endDate: string;
  }): void {
    const colors: any = this.themeVariables;
    this.$loadPointChartsData = this.loadPointService
      .getLoadPointAnalyticsEnergyChart(params)
      .pipe(
        map((response) => response.data),
        map((data) => {
          data = data ?? [];
          const downTimeArr: { start: number; end: number }[] = [];
          let prevPrevIndex = 0;
          let prevIndex = -1;
          let index = 0;
          while (index < data?.length) {
            if (prevIndex !== prevPrevIndex) {
              prevPrevIndex = prevIndex;
              const start =
                data
                  ?.slice(index)
                  ?.findIndex((d) => d?.energyConsumption === 0) + index ?? -1;
              if (start >= 0) {
                const end =
                  data
                    ?.slice(start + 1)
                    ?.findIndex((d) => d?.energyConsumption > 0) +
                    start +
                    1 ?? -1;
                if (end >= 0) {
                  downTimeArr.push({ start, end });
                  index = end;
                } else {
                  index = data?.length;
                }
              } else {
                index = data?.length;
              }
              prevIndex = index;
            } else {
              break;
            }
          }

          this.downTimeInterval = downTimeArr.map((d) => ({
            start: data?.[d?.start].readingPeriod,
            end: data?.[d?.end].readingPeriod,
          }));

          this.downInterval = this.downTimeInterval.map((d: any) => ({
            start: d.start,
            end: d.end,
            duration: this.timeConversion(
              new Date(d.end).getTime() - new Date(d.start).getTime()
            ),
          }));

          this.downInterval.pop();
          this.downInterval.sort(
            (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
          );

          const totalUpTimeCount =
            data?.filter((d) => d?.energyConsumption > 0)?.length ?? 0;

          const totalDownTime =
            data?.filter((d) => d?.energyConsumption === 0) ?? [];

          const totalDownTimeCount = totalDownTime?.length ?? 0;

          this.uptimeDuration = totalUpTimeCount * 5;
          this.downtimeDuration = totalDownTimeCount * 5;

          this.upTime = this.transformMinute(this.uptimeDuration);
          this.downTime = this.transformMinute(this.downtimeDuration);
          const upTimeDowntimeCount = totalUpTimeCount + totalDownTimeCount;

          this.maxPowerDemand = Math.max(
            ...(data?.map((d, i) => d.powerDemand) ?? [])
          );

          this.maxPowerDemand = this.isNumberValid(this.maxPowerDemand)
            ? this.maxPowerDemand
            : 0;
          this.minPowerDemand = Math.min(
            ...(data?.map((d, i) => d.powerDemand).filter((d) => d !== 0) ?? [])
          );
          this.minPowerDemand = this.isNumberValid(this.minPowerDemand)
            ? this.minPowerDemand
            : 0;
          this.avgPowerDemand =
            (data?.map((d, i) => d.powerDemand) ?? []).reduce(
              (a, b) => a + b,
              0
            ) / (data?.map((d, i) => d.powerDemand) ?? []).length;
          this.avgPowerDemand = this.avgPowerDemand || 0;

          const upTimePercentage =
            (totalUpTimeCount / upTimeDowntimeCount) * 100 ?? 0;
          const downTimePercentage =
            (totalDownTimeCount / upTimeDowntimeCount) * 100 ?? 100;
          const upTimePercentageValid = upTimePercentage || 0;
          const downTimePercentageValid = downTimePercentage || 100;

          return {
            consumption: {
              seriesNameString: 'Consumption',
              labels: data?.map((d, i) =>
                this.datePipe.transform(d.readingPeriod, 'medium', 'UTC')
              ),
              xdata: data?.map((d, i) =>
                this.datePipe.transform(d.readingPeriod, 'medium', 'UTC')
              ),
              datasets: [
                {
                  data: data?.map((d, i) => d.energyConsumption),
                  label: 'Energy Consumption (kWh)',
                  backgroundColor: ['', ''],
                  valueFormat: 'kWh',
                },
              ],
            },
            //cost
            cost: {
              seriesNameString: 'Cost',
              labels: data?.map((d, i) =>
                this.datePipe.transform(d.readingPeriod, 'medium', 'UTC')
              ),
              xdata: data?.map((d, i) =>
                this.datePipe.transform(d.readingPeriod, 'medium', 'UTC')
              ),
              datasets: [
                {
                  data: data?.map((d, i) => d.energyCost),
                  label: 'Energy Cost (₦)',
                  backgroundColor: [colors.successLight, colors.successLight],
                  valueFormat: '(₦)',
                },
              ],
            },
            //Power demand
            demand: {
              seriesNameString: 'Power',
              labels: data?.map((d, i) =>
                this.datePipe.transform(d.readingPeriod, 'medium', 'UTC')
              ),
              xdata: data?.map((d, i) =>
                this.datePipe.transform(d.readingPeriod, 'medium', 'UTC')
              ),
              datasets: [
                {
                  data: data?.map((d, i) => d.powerDemand),
                  label: 'Power Demand (kW)',
                  backgroundColor: [colors.fg, colors.fg],
                  valueFormat: 'kW',
                },
              ],
            },

            //Up time downtime
            uptimeChart: {
              labels: ['Up Time (%) ', 'Down Time (%) '],

              datasets: [
                {
                  data: [upTimePercentageValid, downTimePercentageValid],

                  backgroundColor: [colors.primary, colors.danger],
                  borderColor: colors.primary,
                },
              ],
            },
          } as LoadPointChartModel;
        }),
        shareReplay()
      );
  }

  setEnergySummary(params: { id: string; startDate: string; endDate: string }) {
    this.isLoadingData = false;
    this.$loadPointEnergySummary = this.loadPointService
      .getLoadPointAnalyticsEnergySummary(params)
      .pipe(map((d) => d.data as any));
  }

  toggleFlipFront(event: any) {
    this.flipped = !this.flipped;
    if (!this.forecastChartData) {
      this.setForecastChart(event);
    }
  }
  toggleFlipBlack() {
    this.flipped = !this.flipped;
  }

  setForecastChart(event: any): void {
    this.isLoadingData = true;
    this.returnButtonDisable = true;
    this.predictionLength = this.forecastForm.get('predictionLength')?.value;
    const colors: any = this.themeVariables;

    // generate time stamp for x-axis
    const now = Date.now();
    const integrationPeriod = environment.integrationPeriod;

    this.loadPointService
      .getLoadPointForecastData(
        this.locationId,
        this.assetType ? this.assetType : this.forecastAssetTypeValue,
        this.predictionLength
      )
      .pipe(
        takeWhile((_) => this.isLive),
        map((response) => {
          const data = response.data as { forcastData: number }[];
          const xAxisFormattedTime = data.map((d, i) =>
            this.datePipe.transform(
              new Date(now + i * integrationPeriod),
              'medium',
              'UTC'
            )
          );
          return {
            seriesNameString: 'Forecast',
            labels: xAxisFormattedTime,
            xdata: xAxisFormattedTime,
            datasets: [
              {
                data: data?.map((d) => d.forcastData),
                label: 'Forecast',
                backgroundColor: [colors.primary, colors.fg],
                valueFormat: 'kWh',
              },
            ],
          } as EchartModel;
        })
      )
      .subscribe((data) => {
        this.isLoadingData = false;
        this.returnButtonDisable = false;
        this.forecastChartData = data;
        this.showForecastChart = true;
      });
  }

  // to transform minutes to hours and minutes
  transformMinute(value: number) {
    const portions: string[] = [];

    const hours = Math.floor(value / 60);
    if (hours > 0) {
      portions.push(hours + ' hrs');
    }
    const minutes = Math.floor(value % 60);
    if (minutes > 0) {
      portions.push(minutes + ' mins');
    }
    return portions.join(' ');
  }

  // to convert millisecs to hours and minutes
  private timeConversion(duration: number) {
    const portions: string[] = [];

    const msInHour = 1000 * 60 * 60;
    const hours = Math.trunc(duration / msInHour);
    if (hours > 0) {
      portions.push(hours + ' hrs');
      duration = duration - hours * msInHour;
    }

    const msInMinute = 1000 * 60;
    const minutes = Math.trunc(duration / msInMinute);
    if (minutes > 0) {
      portions.push(minutes + ' mins');
      duration = duration - minutes * msInMinute;
    }

    return portions.join(' ');
  }
  private isNumberValid(data: any): boolean {
    if (
      data === Number('-Infinity') ||
      data === Number('Infinity') ||
      data === Number('NaN')
    ) {
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
