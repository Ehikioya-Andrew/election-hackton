import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Params,
  Router,
} from '@angular/router';
import {
  NbDateService,
  NbDialogService,
  NbThemeService,
  NbColorHelper,
} from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { filter, takeWhile } from 'rxjs/operators';
import { GeneratingSetsService } from 'src/app/@core/data-services/generating-set.service';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { PowerSourceService } from 'src/app/@core/data-services/power-source.service';
import {
  AssetTypeEnum,
  ForecastAssetTypeSelectionEnum,
} from 'src/app/@core/enums/asset-type.enum';
import { GlobalResources } from 'src/app/@core/maps/global-resources';
import { LoadPointResources } from 'src/app/pages/assets/load-points/load-point-resources';
import { PagesResources } from 'src/app/pages/pages-resources';
import { AnalyticsConfigFormComponent } from '../analytics-config-form/analytics-config-form.component';
import * as Chart from 'chart.js';
import {
  LoadPointAnalyticsResources,
  LoadPointAnalyticsResourcesNavMap,
} from '../../load-point-analytics/load-point-analytics-resources';
import { GeneratingUnitAnalyticsResources } from '../../generating-unit-analytics/genearting-unit-analytics-resources';
import { PowerSourceAnalyticsResources } from '../../power-source-analytics/power-source-analytics-resources';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-analytics-block',
  templateUrl: './analytics-block.component.html',
  styleUrls: ['./analytics-block.component.scss'],
})
export class AnalyticsBlockComponent implements OnDestroy {
  // Outputs
  @Output()
  selection: EventEmitter<any> = new EventEmitter();

  assetMap: Map<AssetTypeEnum, any>;
  assetResources: any;

  summaryPageRoute = LoadPointAnalyticsResourcesNavMap.get(
    LoadPointAnalyticsResources.SummaryView
  )?.route;

  locationName!: string;
  locationId!: Date;
  startDate!: Date;
  endDate!: string;
  assetType!: string;
  forecastAssetTypeValue!: number;

  canViewAnalytics = false;

  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };
  isSummary!: boolean;
  isLive = true;

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }
  get currentDate(): Date {
    return this.dateService.today();
  }

  constructor(
    private dialogService: NbDialogService,
    private route: ActivatedRoute,
    private router: Router,
    private loadpointService: LoadPointService,
    private genSetService: GeneratingSetsService,
    private powerSourceService: PowerSourceService,
    protected dateService: NbDateService<Date>
  ) {
    this.assetMap = new Map<AssetTypeEnum, any>([
      [
        AssetTypeEnum.LOADPOINT,
        {
          assetRoute: GlobalResources.get(PagesResources.LoadPointsView)?.route,
          assetRouteSummary: GlobalResources.get(
            LoadPointAnalyticsResources.SummaryView
          )?.route,
          service: this.loadpointService.getLoadPoints.bind(this),
          title: 'Load Point',
          subTitle:
            'View insight into Load point asset performance though energy consumption and event metrics',
        },
      ],
      [
        AssetTypeEnum.GEN_SET,
        {
          assetRoute: GlobalResources.get(PagesResources.GeneratingSetView)
            ?.route,
          assetRouteSummary: GlobalResources.get(
            GeneratingUnitAnalyticsResources.SummaryView
          )?.route,
          service: this.genSetService.getGeneratingSets.bind(this),
          title: 'Generating Unit',
          subTitle:
            'View insight into Gen-Set asset performance through power delivery and event metrics',
        },
      ],
      [
        AssetTypeEnum.POWER_SOURCE,
        {
          assetRoute: GlobalResources.get(PagesResources.PowerStationsView)
            ?.route,
          assetRouteSummary: GlobalResources.get(
            PowerSourceAnalyticsResources.SummaryView
          )?.route,
          service: this.powerSourceService.getPowerSource.bind(this),
          title: 'Power Station',
          subTitle:
            'View insight into Power Station asset performance through power delivery and event metrics',
        },
      ],
      [
        AssetTypeEnum.OUTAGE,
        {
          assetRoute: GlobalResources.get(PagesResources.PowerStationsView)
            ?.route,
          assetRouteSummary: GlobalResources.get(
            PowerSourceAnalyticsResources.SummaryView
          )?.route,
          service: this.powerSourceService.getPowerSource.bind(this),
          title: 'Outage',
          subTitle:
            'View insight into Outage performance through power delivery and event metrics',
        },
      ],
    ]);

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeWhile(() => this.isLive)
      )
      .subscribe((e) => {
        this.isSummary = window.location.href.split('?')[0].includes('summary');

        this.assetResources = this.assetMap.get(
          this.route.snapshot.data.assetType
        );

        this.assetType = this.assetResources.title;
        switch (this.assetType) {
          case 'Load Point':
            this.forecastAssetTypeValue =
              ForecastAssetTypeSelectionEnum.LOADPOINT;
            break;
          case 'Power Station':
            this.forecastAssetTypeValue =
              ForecastAssetTypeSelectionEnum.POWER_SOURCE;
            break;
          case 'Generating Unit':
            this.forecastAssetTypeValue =
              ForecastAssetTypeSelectionEnum.GEN_SET;
            break;
          default:
            this.forecastAssetTypeValue =
              ForecastAssetTypeSelectionEnum.UNKNOWN;
            break;
        }
        this.startDate =
          this.route.snapshot.queryParams.startDate ?? this.monthStart;
        this.endDate = this.route.snapshot.queryParams.endDate ?? this.currentDate;
        this.locationId = this.route.snapshot.queryParams.locationId;
        this.locationName = this.route.snapshot.queryParams.locationName;
        this.canViewAnalytics =
          !!this.startDate &&
          !!this.endDate &&
          ((!!this.locationId && !!this.locationName) || this.isSummary);
      });
  }

  ngOnDestroy() {
    this.isLive = false;
  }

  async configureForm() {
    const config = await lastValueFrom(
      this.dialogService.open(AnalyticsConfigFormComponent, {
        closeOnBackdropClick: true,
        context: {
          assetType: this.route.snapshot.data.assetType,
          isSummary: this.isSummary,
          forecastAssetTypeValue: this.forecastAssetTypeValue,
        },
        hasScroll: true,
        closeOnEsc: true,
      }).onClose
    );
    if (config) {
      const {
        locationId,
        locationName,
        startDate,
        endDate,
        assetType,
        forecastAssetTypeValue,
      } = config;
      this.locationName = locationName;
      this.locationId = locationId;
      this.startDate = startDate;
      this.endDate = endDate;
      this.assetType = assetType;
      this.forecastAssetTypeValue = forecastAssetTypeValue;

      console.log(assetType);
      this.canViewAnalytics =
        !!this.startDate &&
        !!this.endDate &&
        ((!!this.locationId && !!this.locationName) || this.isSummary);

      const queryParams: Params = {
        locationName: this.locationName,
        locationId: this.locationId,
        startDate: this.startDate,
        endDate: this.endDate,
        forecastAssetTypeValue: this.forecastAssetTypeValue,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });
      this.selection.next(queryParams);
    }
  }
}
