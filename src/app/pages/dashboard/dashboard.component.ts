import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SeoService } from 'src/app/@core/utils';
import { DashBoardService } from 'src/app/@core/data-services/dashboard.service';
import {
  HomePageAssetTypeSelection,
  HomePageAssetTypeSelectionEnum,
} from '../../@core/enums/asset-type.enum';
import {
  GeneratingSets,
  HomePageGeneratingSet,
  HomePageLoadPointDto,
  HomePageLoadPoints,
  HomePagePowerSource,
} from 'src/app/@core/dtos/home-page.dto';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { forkJoin, merge, Observable, of, Subscription, timer } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { environment } from 'src/environments/environment';
import { MapMarkerModel } from 'src/app/@core/models/map-marker.model';
import {
  DEFAULT_THEME,
  NbDateService,
  NbIconLibraries,
  NbThemeService,
} from '@nebular/theme';
import { SvgAssetEnum } from './dashboard-resources';
import {
  GeneratingUnitAnalyticsResources,
  GeneratingUnitAnalyticsResourcesNavMap,
} from '../analytics/generating-unit-analytics/genearting-unit-analytics-resources';
import {
  LoadPointAnalyticsResources,
  LoadPointAnalyticsResourcesNavMap,
} from '../analytics/load-point-analytics/load-point-analytics-resources';
import {
  PowerSourceAnalyticsResources,
  PowerSourceAnalyticsResourcesNavMap,
} from '../analytics/power-source-analytics/power-source-analytics-resources';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { isMobile } from 'mobile-device-detect';

type DashboardMarker =
  | HomePageGeneratingSet
  | HomePageLoadPointDto
  | HomePagePowerSource;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  searchForm!: UntypedFormGroup;
  isLive = true;
  isLoadingData = true;
  isSearch = false;

  isMobile = isMobile;

  mapDataLoadPoint!: HomePageLoadPoints;
  mapDataGenSet!: GeneratingSets;
  mapDataPowerSource: HomePagePowerSource[] = [];

  totalPowerCut: number = 0;
  totalOnline: number = 0;
  totalOffline: number = 0;

  searchType: any;

  selectedAssetType!: HomePageAssetTypeSelectionEnum;
  selectedAsset:
    | MapMarkerModel<{
        type: HomePageAssetTypeSelectionEnum;
        data: DashboardMarker;
      }>
    | undefined;
  selectedLoadPointData!: HomePageLoadPointDto;
  selectedPowerSourceData!: HomePagePowerSource;
  selectedGenSetData!: HomePageGeneratingSet;
  genSetDemandDuration!: number;

  markers: MapMarkerModel<{
    type: HomePageAssetTypeSelectionEnum;
    data: DashboardMarker;
  }>[] = [];

  filteredMarkers: MapMarkerModel<{
    type: HomePageAssetTypeSelectionEnum;
    data: DashboardMarker;
  }>[] = [];

  assetType = HomePageAssetTypeSelectionEnum;

  assetTypeName = Array.from(HomePageAssetTypeSelection);
  assetSelected = HomePageAssetTypeSelectionEnum.ALL;

  subscription!: Subscription;

  themeVariables: any = null;
  pieChartOptions: any = null;
  pieChartData: any = null;
  chartInitialized = false;

  assetUrlValue!: HomePageAssetTypeSelectionEnum;

  public get canSelectOption() {
    return !this.markers?.length;
  }

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }
  get currentDate(): Date {
    return this.dateService.today();
  }

  constructor(
    private seo: SeoService,
    private iconLibraries: NbIconLibraries,
    private dashBoardService: DashBoardService,
    private formBuilder: UntypedFormBuilder,
    private theme: NbThemeService,
    private router: Router,
    private route: ActivatedRoute,
    private dateService: NbDateService<Date>
  ) {
    this.getThemeData();
  }

  clearLocationSelection() {
    this.searchForm.get('location')?.setValue('');
  }

  async ngOnInit() {
    this.initForm();
    this.seo.setSeoData('Dashboard', 'Logged in user page analytics');
  }

  ngAfterViewInit(): void {
    if (!this.isSearch) {
      timer(0, environment.refreshInterval)
        .pipe(takeWhile(() => this.isLive))
        .subscribe((x) => {
          this.callService()?.subscribe();
        });
    }
  }

  initForm(): void {
    this.searchForm = this.formBuilder.group({
      location: '',
      assetType: '',
    });

    this.searchForm
      .get('location')
      ?.valueChanges.pipe(takeWhile(() => this.isLive))
      .subscribe((data) => {
        this.isSearch = true;
        this.getFilteredMarkers(data);
      });
  }

  onAssetSelectionChange(): void {
    setTimeout(() => {
      this.getFilteredMarkers();
    }, 0);
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
        this.getFilteredMarkers();
        this.isLoadingData = false;
        return response;
      })
    );
  }

  resetHomePageAnalytics() {
    this.totalOnline = this.totalOffline = this.totalPowerCut = 0;
  }

  onSelectedMarkerChange(index: number): void {
    this.selectedAsset = this.filteredMarkers[index];
    this.assetUrlValue = this.filteredMarkers[index].info
      ?.type as HomePageAssetTypeSelectionEnum;
    switch (this.selectedAsset.info?.type) {
      case HomePageAssetTypeSelectionEnum.LOADPOINT:
        this.selectedLoadPointData = this.filteredMarkers[index].info
          ?.data as HomePageLoadPointDto;
        break;
      case HomePageAssetTypeSelectionEnum.POWER_SOURCE:
        this.selectedPowerSourceData = this.filteredMarkers[index].info
          ?.data as HomePagePowerSource;
        break;
      case HomePageAssetTypeSelectionEnum.GEN_SET:
        this.selectedGenSetData = this.filteredMarkers[index].info
          ?.data as HomePageGeneratingSet;
        break;

      default:
        break;
    }
  }
  msToTime(arg0: number): any {
    throw new Error('Method not implemented.');
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

  routeTo() {
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
    let url: string | undefined = '';
    let queryParams: Params = {};
    switch (this.assetUrlValue) {
      case HomePageAssetTypeSelectionEnum.GEN_SET:
        queryParams = {
          locationName: this.selectedGenSetData.name,
          locationId: this.selectedGenSetData.id,
          startDate: startDateFormatted,
          endDate: endDateFormatted,
          assetType: HomePageAssetTypeSelectionEnum.GEN_SET,
        };
        url = GeneratingUnitAnalyticsResourcesNavMap.get(
          GeneratingUnitAnalyticsResources.ExpandedView
        )?.route;
        break;
      case HomePageAssetTypeSelectionEnum.LOADPOINT:
        queryParams = {
          locationName: this.selectedLoadPointData.name,
          locationId: this.selectedLoadPointData.id,
          startDate: startDateFormatted,
          endDate: endDateFormatted,
          assetType: HomePageAssetTypeSelectionEnum.LOADPOINT,
        };
        url = LoadPointAnalyticsResourcesNavMap.get(
          LoadPointAnalyticsResources.ExpandedView
        )?.route;
        break;
      case HomePageAssetTypeSelectionEnum.POWER_SOURCE:
        queryParams = {
          locationName: this.selectedPowerSourceData.name,
          locationId: this.selectedPowerSourceData.id,
          startDate: startDateFormatted,
          endDate: endDateFormatted,
          assetType: HomePageAssetTypeSelectionEnum.POWER_SOURCE,
        };
        url = PowerSourceAnalyticsResourcesNavMap.get(
          PowerSourceAnalyticsResources.ExpandedView
        )?.route;
        break;
    }
    this.router.navigate([url], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy() {
    this.isLive = false;
    this.isSearch = true;
  }
}
