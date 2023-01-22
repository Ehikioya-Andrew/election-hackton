import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { NbDateService, NbDialogService } from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { filter, takeWhile } from 'rxjs/operators';
import { GeneratingSetsService } from 'src/app/@core/data-services/generating-set.service';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { PowerSourceService } from 'src/app/@core/data-services/power-source.service';
import { OutageDto } from 'src/app/@core/dtos/generating-set-outage.dto';
import { AssetTypeEnum } from 'src/app/@core/enums/asset-type.enum';
import { GlobalResources } from 'src/app/@core/maps/global-resources';
import { PagesResources } from 'src/app/pages/pages-resources';
import { OutageConfigFormComponent } from '../outage-config-form/outage-config-form.component';

@Component({
  selector: 'app-outage-block',
  templateUrl: './outage-block.component.html',
  styleUrls: ['./outage-block.component.scss'],
  providers: [UntypedFormBuilder],
})
export class OutageBlockComponent implements OnInit, OnDestroy {
  // Outputs
  @Output()
  optionSelected: EventEmitter<any> = new EventEmitter();

  // Outputs
  @Output()
  showConfigForm: EventEmitter<any> = new EventEmitter();

  assetMap!: Map<AssetTypeEnum, any>;
  assetResources: any;

  locationName!: string;
  locationId!: string;
  assetType!: string;
  startDate!: string;
  endDate!: string;

  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };
  isSummary!: boolean;
  isLive = true;
  data!: any[];

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }
  get currentDate(): Date {
    return this.dateService.today();
  }

  @Input()
  isLoading = true;
  private _data = new BehaviorSubject<OutageDto[]>([]);

  @Input()
  public set status(value: any[]) {
    this._data.next(value);
  }
  public get status(): any[] {
    return this._data.getValue();
  }
  onlineStatus: any;
  constructor(
    private dialogService: NbDialogService,
    private route: ActivatedRoute,
    private router: Router,
    private loadpointService: LoadPointService,
    private genSetService: GeneratingSetsService,
    private powerSourceService: PowerSourceService,
    protected dateService: NbDateService<Date>
  ) {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeWhile(() => this.isLive)
      )
      .subscribe((e) => {
        this.startDate =
          this.route.snapshot.queryParams.startDate ?? this.monthStart;
        this.endDate = this.route.snapshot.queryParams.endDate ?? this.currentDate;
        this.locationId = this.route.snapshot.queryParams.locationId;
        this.locationName = this.route.snapshot.queryParams.locationName;
        this.assetType = this.route.snapshot.queryParams.assetType;
      });
  }

  ngOnInit(): void {
    console.log('');
    this._data.subscribe((x) => {
      this.onlineStatus = x;
    });
  }

  ngOnDestroy() {
    this.isLive = false;
  }

  async configureForm() {
    const config = await lastValueFrom(
      this.dialogService.open(OutageConfigFormComponent, {
        closeOnBackdropClick: true,
        context: { assetType: this.route.snapshot.data.assetType },
        hasScroll: true,
        closeOnEsc: true,
      }).onClose
    );
    if (config) {
      const { locationId, locationName, date, assetType } = config;
      this.locationName = locationName;
      this.locationId = locationId;
      this.assetType = assetType;
      this.startDate = (date.start as Date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
      this.endDate = (date.end as Date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

      const queryParams: Params = {
        locationName: this.locationName,
        locationId: this.locationId,
        startDate: this.startDate,
        endDate: this.endDate,
        assetType: this.assetType,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });
      this.optionSelected.next(queryParams);
    }
  }
}
