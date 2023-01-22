import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbColorHelper, NbIconLibraries, NbThemeService } from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { GeneratingSetsService } from 'src/app/@core/data-services/generating-set.service';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { SeoService } from 'src/app/@core/utils';
import { SvgAssetEnumOutage } from './outage-resources';

@Component({
  selector: 'app-outage-analytics',
  templateUrl: './outage-analytics.component.html',
  styleUrls: ['./outage-analytics.component.scss'],
})
export class OutageAnalyticsComponent implements OnInit, OnDestroy {
  isLive = true;
  themeVariables: any = null;
  isLoadingData = true;
  formData!: any;

  $outageData!: Observable<any>;
  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };
  constructor(
    private theme: NbThemeService,
    private GenSetService: GeneratingSetsService,
    private LoadPointervice: LoadPointService,
    private seo: SeoService,
    private iconLibraries: NbIconLibraries
  ) {
    this.getThemeData();
  }

  ngOnInit(): void {
    this.seo.setSeoData(
      'Analytics Management - [Outage Analytics]',
      'Manage outage analytics'
    );
    this.iconLibraries.registerSvgPack('packs', {
      count: SvgAssetEnumOutage.COUNT,
      duration: SvgAssetEnumOutage.COUNT,
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
  showView(ev: any): void {
    this.formData = ev;
    if (this.formData.assetType === 0 && this.formData.locationId) {
      this.setLoadPointOutageLineChart(this.formData);
    } else if (this.formData.assetType === 1 && this.formData.locationId) {
      this.setGenSetOutageLineChart(this.formData);
    }
  }
  ngOnDestroy() {
    this.isLive = false;
  }

  setGenSetOutageLineChart(
    params: { id: string; startDate: string; endDate: string },
    reset = false
  ): void {
    const colors: any = this.themeVariables;
    this.isLoadingData = false;
    this.$outageData = this.GenSetService.getGeneratingPowerOutage(params).pipe(
      map((response) => response.data),
      map((data) => {
        return {
          outageStat: {
            totalDuration: data?.totalDuration,
            totalOutageCount: data?.totalOutageCount,
          },
          statusData: {
            OnlineStatus: data?.assetOnlineStatus,
            commStatus: data?.assetOnlineStatus,
          },
          count: {
            labels: data?.outageCountData.map((d: any) => d?.outageBreakDate),
            datasets: [
              {
                data: data?.outageCountData.map((d: any) => d?.count),
                label: 'Outage Count',
                backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.15),
                borderColor: colors.danger,
              },
            ],
          },
          duration: {
            labels: data?.outageDurationData.map(
              (d: any) => d?.outageBreakDate
            ),
            datasets: [
              {
                data: data?.outageDurationData.map((d: any) => d?.duration),
                label: 'Outage Duration',
                backgroundColor: NbColorHelper.hexToRgbA(colors.success, 0.15),
                borderColor: colors.success,
              },
            ],
          },
        };
      })
    );
  }

  setLoadPointOutageLineChart(
    params: { id: string; startDate: string; endDate: string },
    reset = false
  ): void {
    const colors: any = this.themeVariables;
    this.isLoadingData = false;
    this.$outageData = this.LoadPointervice.getLoadPointOutage(params).pipe(
      map((response) => response.data),
      map((data) => {
        return {
          outageStat: {
            totalDuration: data?.totalDuration,
            totalOutageCount: data?.totalOutageCount,
          },
          statusData: {
            OnlineStatus: data?.assetOnlineStatus,
            commStatus: data?.assetOnlineStatus,
          },
          count: {
            labels: data?.outageCountData.map((d: any) => d?.outageBreakDate),
            datasets: [
              {
                data: data?.outageCountData.map((d: any) => d?.count),
                label: 'Outage Count',
                backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.15),
                borderColor: colors.danger,
              },
            ],
          },
          duration: {
            labels: data?.outageDurationData.map(
              (d: any) => d?.outageBreakDate
            ),
            datasets: [
              {
                data: data?.outageDurationData.map((d: any) => d?.duration),
                label: 'Outage Duration',
                backgroundColor: NbColorHelper.hexToRgbA(colors.success, 0.15),
                borderColor: colors.success,
              },
            ],
          },
        };
      })
    );
  }
}
