import { DatePipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbColorHelper, NbThemeService } from '@nebular/theme';
import { Observable, timer } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { PowerSourceService } from 'src/app/@core/data-services/power-source.service';
import { EchartModel } from 'src/app/@core/models/echart.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-power-source-analytics-expanded',
  templateUrl: './power-source-analytics-expanded.component.html',
  styleUrls: ['./power-source-analytics-expanded.component.scss'],
})
export class PowerSourceAnalyticsExpandedComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input()
  isLoadingData = false;

  assetType!: number;
  locationId!: string;
  predictionLength!: number;
  forecastAssetTypeValue!: number;
  flipped: boolean = false;

  startDate!: string;
  endDate!: string;

  forecastChartData!: EchartModel;
  showForecastChart = false;

  forecastForm!: UntypedFormGroup;
  themeVariables: any = null;

  returnButtonDisable: boolean = false;

  PowerSourceEnergyChartData!: any;
  selectCostChart = false;

  $PowerSourcePowerDemandChartData!: Observable<any>;

  $PowerSourceEnergySummary!: Observable<any>;
  $PowerSourceEnergyConsumptionChartData!: Observable<any>;
  $PowerSourceAssetPercentageChartData!: Observable<any>;
  $EnergyUtilizationPercentageChartData!: Observable<any>;
  isLive = true;

  constructor(
    private theme: NbThemeService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private PowerSourceService: PowerSourceService,
    private loadPointService: LoadPointService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.getThemeData();
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
        this.locationId = id;
        this.assetType = assetType;
        this.startDate = startDate;
        this.startDate = startDate;
        this.forecastAssetTypeValue = forecastAssetTypeValue;
        this.setEnergyLineChart({ id, startDate, endDate });
        this.setPowerSummary({ id, startDate, endDate });
        this.setEnergySummary({ id, startDate, endDate });
        this.setAssetPercentageChart({ id, startDate, endDate });
        this.setEnergyUtilizationChart({ id, startDate, endDate });
      });
    this.forecastForm = this.formBuilder.group({
      predictionLength: '',
    });
  }
  ngAfterViewInit(): void {
    const id = this.locationId;
    const startDate = this.startDate;
    const endDate = this.endDate;

    timer(0, environment.refreshInterval)
      .pipe(takeWhile(() => this.isLive))
      .subscribe(() => {
        this.setEnergyLineChart({ id, startDate, endDate });
        this.setPowerSummary({ id, startDate, endDate });
        this.setEnergySummary({ id, startDate, endDate });
        this.setAssetPercentageChart({ id, startDate, endDate });
        this.setEnergyUtilizationChart({ id, startDate, endDate });
      });
  }

  toggleFlip() {
    this.flipped = !this.flipped;
  }

  setEnergyLineChart(params: {
    id: string;
    startDate: string;
    endDate: string;
  }): void {
    const colors: any = this.themeVariables;
    this.PowerSourceService.getPowerSourceAnalyticExpandedPowerComsuptionChart(
      params
    )
      .pipe(
        takeWhile((_) => this.isLive),
        map((response) => response.data),
        map((data) => {
          return {
            consumption: {
              seriesNameString: 'Supply',
              labels: data?.map((d: any) =>
                this.datePipe.transform(d.readingPeriod, 'medium', 'UTC')
              ),
              xdata: data?.map((d: any) =>
                this.datePipe.transform(d.readingPeriod, 'medium', 'UTC')
              ),
              datasets: [
                {
                  data: data?.map((d: any) => d.energyConsumption),
                  label: 'Energy Supplied (kWh)',
                  backgroundColor: [colors.primary, colors.success],
                  valueFormat: 'kWh',
                },
              ],
            },
            cost: {
              seriesNameString: 'Cost',
              labels: data?.map((d: any) =>
                this.datePipe.transform(d.readingPeriod, 'medium', 'UTC')
              ),
              xdata: data?.map((d: any) =>
                this.datePipe.transform(d.readingPeriod, 'medium', 'UTC')
              ),
              datasets: [
                {
                  data: data?.map((d: any) => d.energyCost),
                  label: 'Energy Cost (₦)',
                  backgroundColor: [colors.danger, colors.warning],
                  valueFormat: '(₦)',
                },
              ],
            },
          };
        })
      )
      .subscribe((data) => {
        this.PowerSourceEnergyChartData = data;
      });
  }

  setEnergySummary(params: { id: string; startDate: string; endDate: string }) {
    this.$PowerSourceEnergySummary =
      this.PowerSourceService.getPowerSourceAnalyticExpandedEnergySummary(
        params
      ).pipe(map((d) => d.data as any));
  }

  setPowerSummary(params: {
    id: string;
    startDate: string;
    endDate: string;
  }): void {
    const colors: any = this.themeVariables;
    this.$PowerSourcePowerDemandChartData =
      this.PowerSourceService.getPowerSourceAnalyticExpandedPowerDemandSummary(
        params
      ).pipe(
        map((response) => response.data),
        map((data) => {
          return {
            maxPower: data?.maxPeak,
            minPower: data?.minPeak,
            avgPower:
              (data?.powerDemands.map((d: any) => d.powerDemand) ?? []).reduce(
                (a: any, b: any) => a + b,
                0
              ) /
              (data?.powerDemands.map((d: any, i: any) => d.powerDemand) ?? [])
                .length,
          };
        })
      );
  }

  setEnergyUtilizationChart(params: {
    id: string;
    startDate: string;
    endDate: string;
  }): void {
    const colors: any = this.themeVariables;
    this.$EnergyUtilizationPercentageChartData =
      this.PowerSourceService.getPowerSourceAnalyticExpandedPowerComsuptionChart(
        params
      ).pipe(
        map((response) => {
          return {
            labels: ['Used Capacity (%)', 'Unused Capacity (%)'],
            datasets: [
              {
                data: [
                  Math.floor(response.data?.utilization * 100) || 0,
                  Math.floor((1 - response.data?.utilization) * 100) || 100,
                ],
                label: 'Energy Utilization',
                backgroundColor: ['#D6E4ED', colors.danger],
                borderColor: colors.primary,
              },
            ],
          };
        })
      );
  }

  setAssetPercentageChart(params: {
    id: string;
    startDate: string;
    endDate: string;
  }): void {
    const colors: any = this.themeVariables;
    const colorOptions = [
      colors.primary,
      colors.warning,
      colors.success,
      colors.danger,
      colors.info,
      colors.dangerLight,
      colors.primaryLight,
      colors.infoLight,
      colors.warningLight,
      colors.successLight,
    ];
    this.$PowerSourceAssetPercentageChartData =
      this.PowerSourceService.getPowerSourceAnalyticExpandedAssetPercentageChart(
        params
      ).pipe(
        map((response) => response.data),
        map((data) => {
          return {
            labels: data?.map((d: any) => `${d.name}`),
            datasets: [
              {
                data: data?.map((d: any) => d.energyConsumed),
                label: 'Power Consumption (kW)',
                backgroundColor: data?.map(
                  (d: any, i: number) => colorOptions[i % 10]
                ),
                borderColor: colors.primary,
              },
            ],
          };
        })
      );
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

    this.loadPointService
      .getLoadPointForecastData(
        this.locationId,
        this.assetType ? this.assetType : this.forecastAssetTypeValue,
        this.predictionLength ? this.predictionLength : 1
      )
      .pipe(
        takeWhile((_) => this.isLive),
        map((response) => response.data),
        map((data) => {
          return {
            seriesNameString: 'Forecast',
            labels: 'Forecast',
            datasets: [
              {
                data: data?.map((d: any, i: any) => d.forcastData),
                backgroundColor: [colors.primary, colors.fg],
                backgroundColorTop: [colors.danger, colors.warning],
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

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
