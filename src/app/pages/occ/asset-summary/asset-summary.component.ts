import { ActivatedRoute } from '@angular/router';
import { map, takeWhile } from 'rxjs/operators';
import { OccService } from './../../../@core/data-services/occ.service';
import { SeoService } from './../../../@core/utils/seo.service';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { MapMarkerModel } from 'src/app/@core/models/map-marker.model';
import { HomePageAssetTypeSelectionEnum } from 'src/app/@core/enums/asset-type.enum';
import {
  HomePageGeneratingSet,
  HomePageLoadPointDto,
  HomePagePowerSource,
} from 'src/app/@core/dtos/home-page.dto';
import { DashBoardService } from 'src/app/@core/data-services/dashboard.service';
import { DEFAULT_THEME, NbThemeService } from '@nebular/theme';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { interval, Subscription, timer } from 'rxjs';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

type DashboardMarker =
  | HomePageGeneratingSet
  | HomePageLoadPointDto
  | HomePagePowerSource;

@Component({
  selector: 'app-asset-summary',
  templateUrl: './asset-summary.component.html',
  styleUrls: ['./asset-summary.component.scss'],
})
export class AssetSummaryComponent implements OnInit, OnDestroy {
  private markerSubscription!: Subscription;
  isLive = true;
  isLoadingData = true;
  pieChartData: any = null;
  themeVariables: any = null;
  pieChartOptions: any = null;
  chartInitialized = false;
  totalPowerCut: number = 0;
  totalOnline: number = 0;
  totalOffline: number = 0;

  isPanning = false;

  randomMarkerInfo = <MapMarkerModel>{};

  assetType = HomePageAssetTypeSelectionEnum;

  selectedAsset!: MapMarkerModel<{
    type: HomePageAssetTypeSelectionEnum;
    data: DashboardMarker;
  }>;

  assetSelected = HomePageAssetTypeSelectionEnum.ALL;

  markers: MapMarkerModel<{
    type: HomePageAssetTypeSelectionEnum;
    data: DashboardMarker;
  }>[] = [];

  filteredMarkers: MapMarkerModel<{
    type: HomePageAssetTypeSelectionEnum;
    data: DashboardMarker;
  }>[] = [];
  zoomMarker!: MapMarkerModel;
  selectedLoadPointData!: HomePageLoadPointDto;
  selectedPowerSourceData!: HomePagePowerSource;
  selectedGenSetData!: HomePageGeneratingSet;
  assetUrlValue!: HomePageAssetTypeSelectionEnum;

  animationOptions: AnimationOptions = {
    path: '/assets/animations/9844-loading-40-paperplane.json',
  };

  noMarkerAnimationOptions: AnimationOptions = {
    path: '/assets/animations/loading-gray.json',
  };

  constructor(
    private seo: SeoService,
    private occService: OccService,
    private route: ActivatedRoute,
    private dashBoardService: DashBoardService,
    private theme: NbThemeService,
    private el: ElementRef
  ) {
    this.getThemeData();
  }

  ngOnInit(): void {
    this.seo.setSeoData(
      'Asset Summary Dashboard - [OCC]',
      'View Asset Summary Dashboard'
    );
    this.subscribeToDateChanges();
  }
  animationCreated(animationItem: AnimationItem): void {
    animationItem.setSpeed(1.5);
  }

  subscribeToDateChanges() {
    this.occService.dateChange$
      .pipe(takeWhile(() => this.isLive))
      .subscribe((ev) => {
        this.callService()?.subscribe();
      });
  }

  initPieChart(): void {
    const colors: any = this.themeVariables;
    this.pieChartData = {
      labels: ['Online', 'Offline'],
      datasets: [
        {
          data: [1, 1],
          backgroundColor: [colors.successLight, colors.dangerLight],
          borderColor: colors.border,
        },
      ],
    };
  }

  updatePieChart(): void {
    const newData = { ...this.pieChartData };
    newData.datasets[0].data[0] = this.totalOnline;
    newData.datasets[0].data[1] = this.totalOffline;
    this.pieChartData = { ...newData };
  }

  getThemeData(): void {
    this.theme
      .getJsTheme()
      .pipe(takeWhile(() => this.isLive))
      .subscribe({
        next: (config) => {
          this.themeVariables = config.variables;

          this.pieChartOptions = {
            aspectRatio: 2.05,
            responsive: true,
            cutoutPercentage: 80,
            scales: {
              xAxes: [
                {
                  display: false,
                },
              ],
              yAxes: [
                {
                  display: false,
                },
              ],
            },
            legend: {
              position: 'right',
              labels: {
                fontColor: this.themeVariables.chartjs.textColor,
              },
            },
          };

          if (!this.chartInitialized) {
            this.initPieChart();
            this.chartInitialized = true;
          } else {
            this.pieChartOptions = { ...this.pieChartOptions };
          }
        },
      });
  }

  getFilteredMarkers(value?: string) {
    value = value?.toLowerCase();
    this.filteredMarkers = this.markers
      .filter((m) => {
        if (this.assetSelected) {
          return m.info?.type === this.assetSelected;
        }
        return true;
      })
      .filter((m) => {
        if (value) {
          return (
            m?.id?.toString().toLowerCase().includes(value) ||
            m?.info?.data.name.toLowerCase().includes(value)
          );
        }
        return true;
      });
  }

  getZoomMarker(value?: string) {
    value = value?.toLowerCase();
    this.zoomMarker = this.markers.find((m) => {
      if (value) {
        return (
          m?.id?.toString().toLowerCase().includes(value) ||
          m?.info?.data.name.toLowerCase().includes(value)
        );
      }
      return true;
    }) as MapMarkerModel;
  }

  private callService(data?: any) {
    this.isLoadingData = true;

    return this.dashBoardService.getDashBoardAnalyticMapAll(data).pipe(
      map((d) => {
        const power = this.getMarkerFromPayload(
          d[0].data ?? [],
          HomePageAssetTypeSelectionEnum.POWER_SOURCE
        );
        const genset = this.getMarkerFromPayload(
          d[1].data?.data ?? [],
          HomePageAssetTypeSelectionEnum.GEN_SET
        );
        const loadpoint = this.getMarkerFromPayload(
          d[2].data?.data ?? [],
          HomePageAssetTypeSelectionEnum.LOADPOINT
        );
        const response = [...power, ...genset, ...loadpoint];

        this.totalPowerCut =
          (d[1].data?.powerCuts ?? 0) + (d[2].data?.powerCuts ?? 0);
        this.totalOffline =
          (d[1].data?.locationStatus.offline ?? 0) +
          (d[2].data?.locationStatus.offline ?? 0);
        this.totalOnline =
          (d[1].data?.locationStatus.online ?? 0) +
          (d[2].data?.locationStatus.online ?? 0);

        this.updatePieChart();
        this.markers = GetUniqueArray(response, this.markers);
        this.markerSubscription?.unsubscribe();
        this.markerSubscription = timer(1000, 15_000)
          .pipe(takeWhile(() => this.isLive))
          .subscribe(() => {
            this.isPanning = true;
            this.randomMarkerInfo =
              this.markers[Math.floor(Math.random() * this.markers.length)];
            const markerName = this.randomMarkerInfo?.title;
            this.getZoomMarker(markerName);
          });
        this.getFilteredMarkers();
        this.isLoadingData = false;
        return response;
      })
    );
  }

  getMarkerFromPayload(
    data: DashboardMarker[],
    type: HomePageAssetTypeSelectionEnum
  ): MapMarkerModel<{
    type: HomePageAssetTypeSelectionEnum;
    data: DashboardMarker;
  }>[] {
    let response: MapMarkerModel<{
      type: HomePageAssetTypeSelectionEnum;
      data: DashboardMarker;
    }>[] = [];
    switch (type) {
      case HomePageAssetTypeSelectionEnum.POWER_SOURCE:
        response = (data as HomePagePowerSource[]).map(
          (d, i) =>
            ({
              title: d.name,
              labelText: { text: `PS-${i}`, color: 'white' },
              position: { lat: d.location.latitude, lng: d.location.longitude },
              iconColor: DEFAULT_THEME?.variables?.primary as string,
              info: { type, data: d },
              id: d.id,
            } as MapMarkerModel)
        );
        break;
      case HomePageAssetTypeSelectionEnum.LOADPOINT:
        response = (data as HomePageLoadPointDto[]).map(
          (d, i) =>
            ({
              title: d.name,
              labelText: { text: `LP-${i}`, color: 'white' },
              position: { lat: d.location.latitude, lng: d.location.longitude },
              iconColor: d.onlineStatus
                ? (DEFAULT_THEME?.variables?.success as string)
                : (DEFAULT_THEME?.variables?.danger as string),
              info: { type, data: d },
              id: d.id,
            } as MapMarkerModel)
        );
        break;
      case HomePageAssetTypeSelectionEnum.GEN_SET:
        response = (data as HomePageGeneratingSet[]).map(
          (d, i) =>
            ({
              title: d.name,
              labelText: { text: `GU-${i}`, color: 'white' },
              position: { lat: d.location.latitude, lng: d.location.longitude },
              iconColor: d.onlineStatus
                ? (DEFAULT_THEME?.variables?.success as string)
                : (DEFAULT_THEME?.variables?.danger as string),
              info: { type, data: d },
              id: d.id,
            } as MapMarkerModel)
        );
        break;
    }
    return [...response];
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
