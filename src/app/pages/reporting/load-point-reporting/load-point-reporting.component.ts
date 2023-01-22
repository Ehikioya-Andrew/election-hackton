import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { LoadPointsReportDto } from 'src/app/@core/dtos/load-points-report.dto';
import { ReportPerLoadPointDto } from 'src/app/@core/dtos/report-per-load-point.dto';
import { AssetTypeEnum } from 'src/app/@core/enums/asset-type.enum';
import { XlsxTemplateEnum } from 'src/app/@core/enums/xlsx-template.enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { XlsxService } from 'src/app/@core/utils/xlsx.service';
import { environment } from 'src/environments/environment';
import { LoadPointByIdReportColumns, LoadPointsReportColumns } from './load-point-reporting.table-columns';

@Component({
  selector: 'app-load-point-reporting',
  templateUrl: './load-point-reporting.component.html',
  styleUrls: ['./load-point-reporting.component.scss']
})
export class LoadPointReportingComponent implements OnInit {
  isLive = true;
  isLoadingData = true;
  isDownloading = false;

  loadPointsReportDto: LoadPointsReportDto[] = [];
  loadpointIdSummary: LoadPointsReportDto | any = {};
  reportPerLoadPointsDto: ReportPerLoadPointDto[] = [];

  @Input()
  formData!: any;
  @Input()
  assetType = AssetTypeEnum;

  dateRange = {
    startDate: this.dateService.getMonthStart(new Date()).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    endDate: this.dateService.today().toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };

  loadPointsColumns = LoadPointsReportColumns;
  loadPointByIdColumns = LoadPointByIdReportColumns;

  constructor(
    private loadPointService: LoadPointService,
    protected dateService: NbDateService<Date>,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeWhile(() => this.isLive)).subscribe(
      (params) => {
        this.formData = params;
        this.showTable()
      }
    );
  }

  showTable(tableData?: any): void {
    if (this.formData.assetType === AssetTypeEnum.LOADPOINT.toString() && !this.formData.locationId) {
      this.requestLoadPointData(tableData, true);
    } else if (this.formData.assetType === AssetTypeEnum.LOADPOINT.toString() && this.formData.locationId) {
      this.requestLoadPointDataById(tableData, true)
    }
  }

  requestLoadPointData(data?: any, reset = false) {
    this.isLoadingData = true;
    this.loadPointService.getAllLoadPointsReport({ ...this.dateRange, ...data, ...this.formData })
      .subscribe(
        (response) => {
          this.isLoadingData = false;
          if (response.status) {
            this.loadPointsReportDto = reset ? [...response.data?.itemList ?? []] : GetUniqueArray([...response.data?.itemList ?? []], [...this.loadPointsReportDto]);
          }
        },
        () => {
          this.isLoadingData = false;
        }
      )
  }
  requestLoadPointDataById(data?: any, reset = false) {
    this.isLoadingData = true;
    this.loadPointService.getLoadPointsReportById({ ...this.dateRange, ...data, ...this.formData })
      .subscribe(
        (response) => {
          this.isLoadingData = false;
          if (response.status) {
            this.loadpointIdSummary = response.data;
            this.reportPerLoadPointsDto = reset ? [...response.data?.breakdowns ?? []] : [...response.data?.breakdowns as LoadPointsReportDto['breakdowns'], ...this.reportPerLoadPointsDto];
          }
        },
        () => {
          this.isLoadingData = false;
        }
      )
  }
}
