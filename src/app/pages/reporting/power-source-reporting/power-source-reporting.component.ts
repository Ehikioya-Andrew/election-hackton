import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { PowerSourceService } from 'src/app/@core/data-services/power-source.service';
import { PowerSourceReportDto } from 'src/app/@core/dtos/power-source-report.dto';
import { ReportPerPowerSourceDto } from 'src/app/@core/dtos/report-per-power-source.dto';
// import { PowerSouceReportLoadPoint, PowerSouceReportGeneratingUnit } from 'src/app/@core/dtos/report-per-power-source.dto';
import { AssetTypeEnum } from 'src/app/@core/enums/asset-type.enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { XlsxService } from 'src/app/@core/utils/xlsx.service';
import { PowerSourceColumns, PowerSourceGenSetColumns, PowerSourceLoadPointColumns } from './power-source-reporting.table-columns';

@Component({
  selector: 'app-power-source-reporting',
  templateUrl: './power-source-reporting.component.html',
  styleUrls: ['./power-source-reporting.component.scss']
})
export class PowerSourceReportingComponent implements OnInit {
  isLive = true;
  isLoadingData = true;
  isDownloading = false;

  powerSourceReportDto: PowerSourceReportDto[] = [];
  powerSourceIdSummary: ReportPerPowerSourceDto | any = {};
  powerSourceByIdDto: ReportPerPowerSourceDto[] = []
  reportPerPowerSourceLoadPoint: ReportPerPowerSourceDto['loadPoints'] = []
  reportPerPowerSourceGensetDto: ReportPerPowerSourceDto['generatingUnits'] = []

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

  powerSourceColumns = PowerSourceColumns
  powerSourceGenSetColumns = PowerSourceGenSetColumns
  powerSourceLoadPointColumns = PowerSourceLoadPointColumns

  constructor(
    private powerSourceService: PowerSourceService,
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
    if (this.formData.assetType === AssetTypeEnum.POWER_SOURCE.toString() && !this.formData.locationId) {
      this.requestPowerSourceData(tableData,true);
    } else if (this.formData.assetType === AssetTypeEnum.POWER_SOURCE.toString() && this.formData.locationId) {
      this.requestPowerSourceydByIdData(tableData);

    }
  }

  requestPowerSourceData(data?: any, reset = false) {
    this.isLoadingData = true;
    this.powerSourceService.getAllPowerSourceReport({ ...this.dateRange, ...data, ...this.formData })
      .subscribe(
        (response) => {
          this.isLoadingData = false;
          if (response.status) {
            this.powerSourceReportDto = reset ? [...response.data?.itemList ?? []] : GetUniqueArray([...response.data?.itemList ?? []], [...this.powerSourceReportDto]);
          }
        },
        (err) => {
          this.isLoadingData = false;
        }
      )
  }

  requestPowerSourceydByIdData(id: string, data?: any) {
    this.isLoadingData = true;
    this.powerSourceService.getPowerSourceReportById({ id, ...this.dateRange, ...data, ...this.formData })
      .subscribe(
        (response) => {
          this.isLoadingData = false;
          if (response.status) {
            this.powerSourceIdSummary = response.data;
            this.reportPerPowerSourceLoadPoint = response.data?.loadPoints ?? [];
            this.reportPerPowerSourceGensetDto = response.data?.generatingUnits ?? [];
          }
        },
        (err) => {
          this.isLoadingData = false;
        }
      )
  }

}
