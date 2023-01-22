import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { GeneratingSetsService } from 'src/app/@core/data-services/generating-set.service';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { GeneratingSetReportDto } from 'src/app/@core/dtos/generating-set-report.dto';
import { LoadPointsReportDto } from 'src/app/@core/dtos/load-points-report.dto';
import { ReportPerGeneratingSetDto } from 'src/app/@core/dtos/report-per-generating-set.dto';
import { AssetTypeEnum } from 'src/app/@core/enums/asset-type.enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { XlsxService } from 'src/app/@core/utils/xlsx.service';
import { GeneratingUnitColumns, GeneratingUnitColumnsById } from './generating-unit-reporting.table-columns';

@Component({
  selector: 'app-generating-unit-reporting',
  templateUrl: './generating-unit-reporting.component.html',
  styleUrls: ['./generating-unit-reporting.component.scss']
})
export class GeneratingUnitReportingComponent implements OnInit, OnDestroy {
  isLive = true;
  isLoadingData = true;
  isDownloading = false;

  genSetIdSummary: GeneratingSetReportDto | any = {};
  genSetReportDto: GeneratingSetReportDto[] = [];
  reportPerGenSetDto: ReportPerGeneratingSetDto[] = [];

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

  generatingSetColumns = GeneratingUnitColumns
  generatingSetColumnsById = GeneratingUnitColumnsById

  constructor(
    private genSetService: GeneratingSetsService,
    protected dateService: NbDateService<Date>,
    private xlsxService: XlsxService,
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
    if (this.formData.assetType === AssetTypeEnum.GEN_SET.toString() && !this.formData.locationId) {
      this.requestGenSetData(tableData, true);
    } else if (this.formData.assetType === AssetTypeEnum.GEN_SET.toString() && this.formData.locationId) {
      this.requestGenSetDataById(tableData)
    }
  }

  requestGenSetData(data?: any, reset = false) {
    this.isLoadingData = true;
    this.genSetService.getAllGeneratingSetReport({ ...this.dateRange, ...data, ...this.formData })
      .subscribe(
        (response) => {
          this.isLoadingData = false;
          if (response.status) {
            this.genSetReportDto = reset ? [...response.data?.itemList ?? []] : GetUniqueArray([...response.data?.itemList ?? []], [...this.genSetReportDto]);
          }
        },
        (err) => {
          this.isLoadingData = false;
        }
      )
  }

  requestGenSetDataById(id: string, data?: any) {
    this.isLoadingData = true;
    this.genSetService.getGeneratingSetReportById({ id, ...this.dateRange, ...data, ...this.formData })
      .subscribe(
        (response) => {
          this.isLoadingData = false;
          if (response.status) {
            this.genSetIdSummary = response.data;
            this.reportPerGenSetDto = response.data?.breakdowns ?? [];
          }
        },
        (err) => {
          this.isLoadingData = false;
        }
      )
  }

  ngOnDestroy() {
    this.isLive = false;
  }


}
