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
import { GeneratingSetsService } from 'src/app/@core/data-services/generating-set.service';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { EchartModel } from 'src/app/@core/models/echart.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-generating-unit-analytics-expanded',
  templateUrl: './generating-unit-analytics-expanded.component.html',
  styleUrls: ['./generating-unit-analytics-expanded.component.scss'],
})
export class GeneratingUnitAnalyticsExpandedComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input()
  isLoadingData = false;

  locationId!: string;
  assetType!: number;
  predictionLength!: number;
  forecastAssetTypeValue!: number;
  flipped: boolean = false;
  showForecastChart = false;

  startDate!: string;
  endDate!: string;

  returnButtonDisable: boolean = false;

  themeVariables: any = null;

  genSetEnergyChartData!: any;
  selectCostChart = false;

  $GenSetPowerDemandChartData!: Observable<any>;

  $GenSetEnergySummary!: Observable<any>;
  $GenSetEnergyConsumptionChartData!: Observable<any>;
  $GenSetUpDownTimeChartData!: Observable<any>;

  forecastChartData!: EchartModel;

  isLive = true;

  forecastForm!: UntypedFormGroup;

  constructor(
    private theme: NbThemeService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private GenSetService: GeneratingSetsService,
    private formBuilder: UntypedFormBuilder,
    private loadPointService: LoadPointService
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

  toggleFlip() {
    this.flipped = !this.flipped;
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
        this.endDate = endDate;
        this.forecastAssetTypeValue = forecastAssetTypeValue;
        this.setEnergyConsumptionLineChart({ id, startDate, endDate });
        this.setEnergyLineChart({ id, startDate, endDate });
        this.setPowerLineChart({ id, startDate, endDate });
        this.setEnergySummary({ id, startDate, endDate });
        this.setUpDownTimeChart({ id, startDate, endDate });
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
        this.setEnergyConsumptionLineChart({ id, startDate, endDate });
        this.setEnergyLineChart({ id, startDate, endDate });
        this.setPowerLineChart({ id, startDate, endDate });
        this.setEnergySummary({ id, startDate, endDate });
        this.setUpDownTimeChart({ id, startDate, endDate });
      });
  }

  setEnergyLineChart(params: {
    id: string;
    startDate: string;
    endDate: string;
  }): void {
    const colors: any = this.themeVariables;
    this.GenSetService.getGeneratingSetAnalyticExpandedChart(params)
      .pipe(
        takeWhile((_) => this.isLive),
        map((response) => response.data),
        map((data) => {
          console.log(data);

          return {
            consumption: {
              seriesNameString: 'Consumption',
              labels: data.chartData?.map((d: any) =>
                this.datePipe.transform(d.readingPeriodString, 'medium', 'UTC')
              ),
              xdata: data.chartData?.map((d: any) =>
                this.datePipe.transform(d.readingPeriodString, 'medium', 'UTC')
              ),
              datasets: [
                {
                  data: data.chartData?.map((d: any) => d.energyDemand),
                  label: 'Energy Consumption (kWh)',
                  backgroundColor: [colors.primary, colors.success],
                  valueFormat: 'kWh',
                },
              ],
            },
            cost: {
              seriesNameString: 'Cost',
              labels: data.chartData?.map((d: any) =>
                this.datePipe.transform(d.readingPeriodString, 'medium', 'UTC')
              ),
              xdata: data.chartData?.map((d: any) =>
                this.datePipe.transform(d.readingPeriodString, 'medium', 'UTC')
              ),
              datasets: [
                {
                  data: data.chartData?.map((d: any) => d.energyValue),
                  label: 'Energy Cost (₦)',
                  backgroundColor: [colors?.danger, colors?.warning],
                  valueFormat: '(₦)',
                },
              ],
            },
          };
        })
      )
      .subscribe((data) => {
        this.genSetEnergyChartData = data;
      });
  }

  setEnergySummary(params: { id: string; startDate: string; endDate: string }) {
    this.$GenSetEnergySummary =
      this.GenSetService.getGeneratingSetAnalyticExpandedEnergySummary(
        params
      ).pipe(map((d) => d.data as any));
  }

  setPowerLineChart(params: {
    id: string;
    startDate: string;
    endDate: string;
  }): void {
    const colors: any = this.themeVariables;
    this.$GenSetPowerDemandChartData =
      this.GenSetService.getGeneratingSetAnalyticExpandedPowerDemandChart(
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

  setEnergyConsumptionLineChart(params: {
    id: string;
    startDate: string;
    endDate: string;
  }): void {
    const colors: any = this.themeVariables;
    this.$GenSetEnergyConsumptionChartData =
      this.GenSetService.getGeneratingSetAnalyticExpandedPowerComsuptionChart(
        params
      ).pipe(
        map((response) => response.data),
        map((data) => {
          return {
            seriesNameString: 'Power Consumption',
            labels: data?.energySupplied.map((d: any) =>
              this.datePipe.transform(d.readingPeriod, 'medium', 'UTC')
            ),
            xdata: data?.energySupplied.map((d: any) =>
              this.datePipe.transform(d.readingPeriod, 'medium', 'UTC')
            ),
            datasets: [
              {
                data: data?.energySupplied.map((d: any) => d.energyConsumption),
                label: 'Power Consumption (kW)',
                backgroundColor: [colors?.warning, colors?.info],
                valueFormat: '(₦)',
              },
            ],
          };
        })
      );
  }

  setUpDownTimeChart(params: {
    id: string;
    startDate: string;
    endDate: string;
  }): void {
    const colors: any = this.themeVariables;
    this.$GenSetUpDownTimeChartData =
      this.GenSetService.getGeneratingUpDownTime(params).pipe(
        map((response) => response.data),
        map((data) => {
          const upTimeCount = data?.totalUpTimeCount || 0;
          const downTimeCount = data?.totalDownTimeCount || 0;
          const totalUptimDowntimeCount = upTimeCount + downTimeCount;
          const upTimePercentage = ((upTimeCount / totalUptimDowntimeCount) * 100) || 0;
          const downTimePercentage = ((downTimeCount / totalUptimDowntimeCount) * 100) || 100;
          return {
            labels: ['Up Time (%)', 'Down Time (%)'],
            datasets: [
              {
                data: [upTimePercentage, downTimePercentage],
                backgroundColor: ['#D6E4ED', colors.danger],
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
