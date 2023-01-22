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
import { lastValueFrom } from 'rxjs';
import { filter, takeWhile } from 'rxjs/operators';
import { GeneratingSetsService } from 'src/app/@core/data-services/generating-set.service';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { PowerSourceService } from 'src/app/@core/data-services/power-source.service';
import { AssetTypeEnum } from 'src/app/@core/enums/asset-type.enum';
import { XlsxTemplateEnum } from 'src/app/@core/enums/xlsx-template.enum';
import { XlsxService } from 'src/app/@core/utils/xlsx.service';
import { ReportingConfigFormComponent } from '../reporting-config-form/reporting-config-form.component';

@Component({
  selector: 'app-reporting-block',
  templateUrl: './reporting-block.component.html',
  styleUrls: ['./reporting-block.component.scss'],
  providers: [UntypedFormBuilder],
})
export class ReportingBlockComponent implements OnDestroy {
  // Outputs
  @Output()
  optionSelected: EventEmitter<any> = new EventEmitter();
  @Output()
  reportDownloadCSV: EventEmitter<any> = new EventEmitter();
  @Output()
  reportDownloadPDF: EventEmitter<any> = new EventEmitter();

  @Input()
  isDownloading = false;

  assetMap!: Map<AssetTypeEnum, any>;
  assetResources: any;

  locationName!: string;
  locationId!: string;
  assetType!: string;
  reportType!: string;
  startDate!: string;
  endDate!: string;

  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };
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
    protected dateService: NbDateService<Date>,
    private xlsxService: XlsxService
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
        this.reportType = this.route.snapshot.queryParams.reportType;
      });
  }

  ngOnDestroy() {
    this.isLive = false;
  }
  async generateReportCSV() {
    this.reportDownloadCSV.emit();
  }
  async generateReportPDF() {
    this.reportDownloadPDF.emit();
  }

  async configureForm() {
    const config = await lastValueFrom(
      this.dialogService.open(ReportingConfigFormComponent, {
        closeOnBackdropClick: true,
        context: { assetType: this.route.snapshot.data.assetType },
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
        reportType,
      } = config;
      this.locationName = locationName;
      this.locationId = locationId;
      this.assetType = assetType;
      this.reportType = reportType;
      this.startDate = (startDate as Date).toLocaleString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      this.endDate = (endDate as Date).toLocaleString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const queryParams: Params = {
        locationName: this.locationName,
        locationId: this.locationId,
        startDate: this.startDate,
        endDate: this.endDate,
        assetType: this.assetType,
        reportType: this.reportType,
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
