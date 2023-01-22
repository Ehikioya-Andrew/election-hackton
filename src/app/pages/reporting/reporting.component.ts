import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { lastValueFrom } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AuditService } from 'src/app/@core/data-services/audit.services';
import { GeneratingSetsService } from 'src/app/@core/data-services/generating-set.service';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { PowerSourceService } from 'src/app/@core/data-services/power-source.service';
import { GeneratingSetReportDto } from 'src/app/@core/dtos/generating-set-report.dto';
import { LoadPointsReportDto } from 'src/app/@core/dtos/load-points-report.dto';
import { PowerSourceReportDto } from 'src/app/@core/dtos/power-source-report.dto';
import { PowerSourceDto } from 'src/app/@core/dtos/power-source.dto';
import { ReportDownloadAuditDto } from 'src/app/@core/dtos/report-download-audit.dto';
import { ReportPerGeneratingSetDto } from 'src/app/@core/dtos/report-per-generating-set.dto';
import { ReportPerPowerSourceDto } from 'src/app/@core/dtos/report-per-power-source.dto';
import {
  AssetTypeEnum,
  AssetTypeName,
  ForecastAssetTypeSelectionEnum,
} from 'src/app/@core/enums/asset-type.enum';
import { PdfTemplateEnum } from 'src/app/@core/enums/pdf-template.enum';
import { StatusEnum } from 'src/app/@core/enums/status-enum';
import { XlsxTemplateEnum } from 'src/app/@core/enums/xlsx-template.enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import {
  DateFormatter,
  NumberFormatter,
} from 'src/app/@core/functions/formatter.funtion';
import { SeoService } from 'src/app/@core/utils';
import { PdfService } from 'src/app/@core/utils/pdf.service';
import { XlsxService } from 'src/app/@core/utils/xlsx.service';
import { environment } from 'src/environments/environment';
import {
  GeneratingUnitColumns,
  GeneratingUnitColumnsById,
} from './generating-unit-reporting/generating-unit-reporting.table-columns';
import {
  LoadPointsReportColumns,
  LoadPointByIdReportColumns,
} from './load-point-reporting/load-point-reporting.table-columns';
import {
  PowerSourceColumns,
  PowerSourceGenSetColumns,
  PowerSourceLoadPointColumns,
} from './power-source-reporting/power-source-reporting.table-columns';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss'],
  providers: [UntypedFormBuilder],
})
export class ReportingComponent implements OnInit, OnDestroy {
  showChild1: boolean = true;
  isLive = true;
  isLoadingData = true;
  isDownloading = false;
  assetName!: string;
  @Input()
  formData!: any;

  @Input()
  assetType = AssetTypeEnum;

  @Input()
  assetTypeName = Array.from(AssetTypeName);

  status!: StatusEnum;

  isTotalAsset = false;

  auditAssetTypeValue!: number;
  downloadFormat!: string;

  dateRange = {
    startDate: this.dateService
      .getMonthStart(new Date())
      .toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    endDate: this.dateService.today().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  };
  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };
  loadPointsColumns = LoadPointsReportColumns;
  loadPointByIdColumns = LoadPointByIdReportColumns;

  powerSourceColumns = PowerSourceColumns;
  powerSourceGenSetColumns = PowerSourceGenSetColumns;
  powerSourceLoadPointColumns = PowerSourceLoadPointColumns;

  generatingSetColumns = GeneratingUnitColumns;
  generatingSetColumnsById = GeneratingUnitColumnsById;
  assetTypeName_!: string;

  constructor(
    private route: ActivatedRoute,
    private loadPointService: LoadPointService,
    private powerSourceService: PowerSourceService,
    private genSetService: GeneratingSetsService,
    protected dateService: NbDateService<Date>,
    private xlsxService: XlsxService,
    private seo: SeoService,
    private pdfService: PdfService,
    private auditService: AuditService
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeWhile(() => this.isLive))
      .subscribe((params) => {
        this.formData = params;
        if (this.formData.assetType === AssetTypeEnum.LOADPOINT.toString()) {
          this.assetTypeName_ = 'Load Points Reporting';
        } else if (
          this.formData.assetType === AssetTypeEnum.GEN_SET.toString()
        ) {
          this.assetTypeName_ = 'Generating Units Reporting';
        } else if (
          this.formData.assetType === AssetTypeEnum.POWER_SOURCE.toString()
        ) {
          this.assetTypeName_ = 'Power Stations Reporting';
        }
        this.seo.setSeoData(
          `Reporting - [${this.assetTypeName_},${this.formData?.locationName}]`,
          ''
        );
      });

    this.seo.setSeoData('Reporting - [Reporting]', '');
  }

  async downloadReportsCSV() {
    if (
      this.formData.assetType === AssetTypeEnum.LOADPOINT.toString() &&
      !this.formData.locationId
    ) {
      this.auditAssetTypeValue = ForecastAssetTypeSelectionEnum.LOADPOINT;
      await this.downloadLoadPointsSummaryReportCSV();
      this.assetName = 'All Loadpoints';
      this.isTotalAsset = true;
    } else if (
      this.formData.assetType === AssetTypeEnum.POWER_SOURCE.toString() &&
      !this.formData.locationId
    ) {
      this.auditAssetTypeValue = ForecastAssetTypeSelectionEnum.POWER_SOURCE;
      this.downloadPowerStationsSummaryReportCSV();
      this.assetName = 'All Power Stations';
      this.isTotalAsset = true;
    } else if (
      this.formData.assetType === AssetTypeEnum.GEN_SET.toString() &&
      !this.formData.locationId
    ) {
      this.auditAssetTypeValue = ForecastAssetTypeSelectionEnum.GEN_SET;
      this.downloadGeneratingUnitsSummaryReportCSV();
      this.assetName = 'All Generating Units';
      this.isTotalAsset = true;
    } else if (
      this.formData.assetType === AssetTypeEnum.LOADPOINT.toString() &&
      this.formData.locationId
    ) {
      this.auditAssetTypeValue = ForecastAssetTypeSelectionEnum.LOADPOINT;
      await this.downloadLoadPointReportByIdCSV();
      this.assetName = this.formData.locationName;
    } else if (
      this.formData.assetType === AssetTypeEnum.POWER_SOURCE.toString() &&
      this.formData.locationId
    ) {
      this.auditAssetTypeValue = ForecastAssetTypeSelectionEnum.POWER_SOURCE;
      this.downloadPowerSourceReportByIdCSV();
      this.assetName = this.formData.locationName;
    } else if (
      this.formData.assetType === AssetTypeEnum.GEN_SET.toString() &&
      this.formData.locationId
    ) {
      this.auditAssetTypeValue = ForecastAssetTypeSelectionEnum.GEN_SET;
      this.downloadGeneratingUnitReportByIdCSV();
      this.assetName = this.formData.locationName;
    }
    this.downloadFormat = 'csv';
    this.postReportDownloadAudit();
  }
  async downloadReportsPDF() {
    if (
      this.formData.assetType === AssetTypeEnum.LOADPOINT.toString() &&
      !this.formData.locationId
    ) {
      this.auditAssetTypeValue = ForecastAssetTypeSelectionEnum.LOADPOINT;
      await this.downloadLoadPointsSummaryReportPDF();
      this.assetName = 'All Loadpoints';
      this.isTotalAsset = true;
    } else if (
      this.formData.assetType === AssetTypeEnum.POWER_SOURCE.toString() &&
      !this.formData.locationId
    ) {
      this.auditAssetTypeValue = ForecastAssetTypeSelectionEnum.POWER_SOURCE;
      this.downloadPowerStationsSummaryReportPDF();
      this.assetName = 'All Power Stations';
      this.isTotalAsset = true;
    } else if (
      this.formData.assetType === AssetTypeEnum.GEN_SET.toString() &&
      !this.formData.locationId
    ) {
      this.auditAssetTypeValue = ForecastAssetTypeSelectionEnum.GEN_SET;
      this.downloadGeneratingUnitsSummaryReportPDF();
      this.assetName = 'All Generating Units';
      this.isTotalAsset = true;
    } else if (
      this.formData.assetType === AssetTypeEnum.LOADPOINT.toString() &&
      this.formData.locationId
    ) {
      this.auditAssetTypeValue = ForecastAssetTypeSelectionEnum.LOADPOINT;
      await this.downloadLoadPointReportByIdPDF();
      this.assetName = this.formData.locationName;
    } else if (
      this.formData.assetType === AssetTypeEnum.POWER_SOURCE.toString() &&
      this.formData.locationId
    ) {
      this.auditAssetTypeValue = ForecastAssetTypeSelectionEnum.POWER_SOURCE;
      this.downloadPowerSourceReportByIdPDF();
      this.assetName = this.formData.locationName;
    } else if (
      this.formData.assetType === AssetTypeEnum.GEN_SET.toString() &&
      this.formData.locationId
    ) {
      this.auditAssetTypeValue = ForecastAssetTypeSelectionEnum.GEN_SET;
      this.downloadtGeneratingUnitReportByIdPDF();
      this.assetName = this.formData.locationName;
    }
    this.downloadFormat = 'pdf';
    this.postReportDownloadAudit();
  }

  // Function to download Load point summary report in CSV
  async downloadLoadPointsSummaryReportCSV() {
    this.isDownloading = true;
    const records = await this.getLoadPointsSummaryReportData();
    const reportName = `Load Points Summary Report - (${this.formData.startDate} - ${this.formData.endDate}).xlsx`;
    const reportData: any[][] = [];
    reportData.push(
      ...records.allLoadPoints.map((d) => {
        const row = [
          d.name,
          d.address,
          d.meterNumber,
          NumberFormatter.format(d.totalEnergyDemand || 0) + 'kWh',
          NumberFormatter.format(d.minPowerDemand || 0) + ' kW',
          NumberFormatter.format(d.averagePowerDemand || 0) + ' kW',
          NumberFormatter.format(d.maxPowerDemand || 0) + ' kW',
          'NGN ' + NumberFormatter.format(d.totalEnergyCost || 0),
        ];
        return row;
      })
    );

    const reportDate = [[this.formData.startDate, this.formData.endDate]];
    await this.xlsxService.generateReport(
      XlsxTemplateEnum.LoadPointsSummaryReport,
      {
        date: reportDate,
        body: reportData,
      },
      reportName
    );
    this.status = StatusEnum.SUCCESS;
    this.isDownloading = false;
  }

  // Function to Download Load point by Id  in PDF
  async downloadLoadPointsSummaryReportPDF() {
    this.isDownloading = true;
    const records = await this.getLoadPointsSummaryReportData();
    const reportName = `Load Points Summary Report - (${this.formData.startDate} - ${this.formData.endDate})`;
    const reportData: any[][] = [];
    reportData.push(
      ...records.allLoadPoints.map((d) => {
        const row = [
          d.name,
          d.address,
          d.meterNumber,
          NumberFormatter.format(d.totalEnergyDemand || 0) + 'kWh',
          NumberFormatter.format(d.minPowerDemand || 0) + ' kW',
          NumberFormatter.format(d.averagePowerDemand || 0) + ' kW',
          NumberFormatter.format(d.maxPowerDemand || 0) + ' kW',
          'NGN ' + NumberFormatter.format(d.totalEnergyCost || 0),
        ];
        return row;
      })
    );
    await this.pdfService.generateReport(
      PdfTemplateEnum.LoadPointReport,
      {
        title: reportName,
        header: [
          Object.entries(this.loadPointsColumns).map(
            ([key, values]) => values.title
          ),
        ],
        breakdown: reportData ?? [],
      },
      `${reportName}.pdf`
    );
    this.status = StatusEnum.SUCCESS;
    this.isDownloading = false;
  }

  // All loadpoints report Data
  async getLoadPointsSummaryReportData() {
    let canRequestData = true;
    let allLoadPoints: LoadPointsReportDto[] = [];
    let page = 1;
    const size = environment.downloadLength;
    while (canRequestData) {
      let response = await lastValueFrom(
        this.loadPointService.getAllLoadPointsReport({
          ...this.dateRange,
          ...{ page, size },
          ...this.formData,
        })
      ).catch(() => undefined);
      canRequestData = !!response?.data?.itemList.length;
      if (canRequestData) {
        allLoadPoints = GetUniqueArray(
          [...(response?.data?.itemList ?? [])],
          [...allLoadPoints]
        );
        page++;
      }
    }
    return { allLoadPoints };
  }

  // Function to Download Load point by Id in CSV
  async downloadLoadPointReportByIdCSV() {
    this.isDownloading = true;
    const records = await this.getLoadPointReportDataById();
    const reportName = `Load Point Report - (${this.formData.startDate} - ${this.formData.endDate})`;
    const reportData: any[][] = [];
    reportData.push(
      ...records.loadPointBreakdown.map((d) => {
        const row = [
          d.name,
          NumberFormatter.format(d.energy || 0) + ' kWh',
          'NGN ' + NumberFormatter.format(d.tariff || 0),
          'NGN ' + NumberFormatter.format(d.cost || 0),
          d.powerSource,
          NumberFormatter.format(d.power || 0) + ' kW',
          DateFormatter.format(new Date(d.period)),
        ];
        return row;
      })
    );

    const reportDate = [[this.formData.startDate, this.formData.endDate]];
    await this.xlsxService.generateReport(
      XlsxTemplateEnum.LoadPointReport,
      {
        date: reportDate,
        breakdown: reportData ?? [],
        powerSummary: [
          [
            NumberFormatter.format(
              records.loadPointSummary?.maxPowerDemand || 0
            ) + ' kW',
          ],
          [
            NumberFormatter.format(
              records.loadPointSummary?.minPowerDemand || 0
            ) + ' kW',
          ],
          [
            NumberFormatter.format(
              records.loadPointSummary?.averagePowerDemand || 0
            ) + ' kW',
          ],
        ],
        energySummary: [
          [
            NumberFormatter.format(
              records.loadPointSummary?.totalEnergyDemand || 0
            ) + ' kWh',
          ],
          [
            'NGN ' +
              NumberFormatter.format(
                records.loadPointSummary?.totalEnergyCost || 0
              ),
          ],
          [
            'NGN ' +
              NumberFormatter.format(records.loadPointSummary?.tariff || 0),
          ],
        ],
        name: (this.formData.locationName as string).toUpperCase(),
      },
      `${reportName}.xlsx`
    );
    this.status = StatusEnum.SUCCESS;
    this.isDownloading = false;
  }
  // Function to Download Load point by Id  in PDF
  async downloadLoadPointReportByIdPDF() {
    this.isDownloading = true;
    const records = await this.getLoadPointReportDataById();
    const reportName = `${this.formData.locationName} Load Point Report - (${this.formData.startDate} - ${this.formData.endDate})`;
    const reportData: any[][] = [];
    reportData.push(
      ...records.loadPointBreakdown.map((d) => {
        const row = [
          d.name,
          NumberFormatter.format(d.energy || 0) + ' kWh',
          'NGN ' + NumberFormatter.format(d.tariff || 0),
          'NGN ' + NumberFormatter.format(d.cost || 0),
          d.powerSource,
          NumberFormatter.format(d.power || 0) + ' kW',
          DateFormatter.format(new Date(d.period)),
        ];
        return row;
      })
    );
    await this.pdfService.generateReport(
      PdfTemplateEnum.LoadPointReport,
      {
        title: reportName,
        header: [
          Object.entries(this.loadPointByIdColumns).map(
            ([key, values]) => values.title
          ),
        ],
        breakdown: reportData ?? [],
        powerSummary: [
          [
            'Max Power Demand',
            NumberFormatter.format(
              records.loadPointSummary?.maxPowerDemand || 0
            ) + ' kW',
          ],
          [
            'Min Power Demand',
            NumberFormatter.format(
              records.loadPointSummary?.minPowerDemand || 0
            ) + ' kW',
          ],
          [
            'Avg Power Demand',
            NumberFormatter.format(
              records.loadPointSummary?.averagePowerDemand || 0
            ) + ' kW',
          ],
        ],
        energySummary: [
          [
            'Total Energy Demand',
            NumberFormatter.format(
              records.loadPointSummary?.totalEnergyDemand || 0
            ) + ' kWh',
          ],
          [
            'Total Energy Cost',
            'NGN ' +
              NumberFormatter.format(
                records.loadPointSummary?.totalEnergyCost || 0
              ),
          ],
          [
            'Tariff',
            'NGN ' +
              NumberFormatter.format(records.loadPointSummary?.tariff || 0),
          ],
        ],
      },
      `${reportName}.pdf`
    );
    this.status = StatusEnum.SUCCESS;
    this.isDownloading = false;
  }
  // Loadpoint By Id report data
  async getLoadPointReportDataById() {
    let canRequestData = true;
    let loadPointBreakdown: LoadPointsReportDto['breakdowns'] = [];
    let loadPointSummary: LoadPointsReportDto | undefined;
    let page = 1;
    const size = environment.downloadLength;
    while (canRequestData) {
      let response = await lastValueFrom(
        this.loadPointService.getLoadPointsReportById({
          ...this.dateRange,
          ...{ page, size },
          ...this.formData,
        })
      ).catch(() => undefined);
      canRequestData = !!response?.data?.breakdowns?.length;
      if (canRequestData) {
        loadPointBreakdown = GetUniqueArray(
          [...(response?.data?.breakdowns ?? [])],
          [...loadPointBreakdown]
        );
        loadPointSummary = response?.data as LoadPointsReportDto;
        page++;
      }
    }
    return { loadPointBreakdown, loadPointSummary };
  }
  // Function to Download All Generating Units Summary Report in csv
  async downloadGeneratingUnitsSummaryReportCSV() {
    this.isDownloading = true;
    const records = await this.getGeneratingUnitsSummaryReportData();
    const reportName = `Generating Unit Summary Report - (${this.formData.startDate} - ${this.formData.endDate}).xlsx`;
    const reportData: any[][] = [];
    reportData.push(
      ...records.allGeneratingUnit.map((d) => {
        const row = [
          d.name,
          d.address,
          NumberFormatter.format(d.totalEnergySupply || 0) + ' kWh',
          NumberFormatter.format(d.minPowerDemand || 0) + ' kW',
          NumberFormatter.format(d.averagePowerDemand || 0) + ' kW',
          NumberFormatter.format(d.maxPowerDemand || 0) + ' kW',
          'NGN ' + NumberFormatter.format(d.totalEnergyCost || 0),
        ];
        return row;
      })
    );

    const reportDate = [[this.formData.startDate, this.formData.endDate]];
    await this.xlsxService.generateReport(
      XlsxTemplateEnum.GeneratingUnitsSummaryReport,
      {
        date: reportDate,
        body: reportData,
      },
      reportName
    );
    this.status = StatusEnum.SUCCESS;
    this.isDownloading = false;
  }
  //Gen Set Summary Report in PDF
  async downloadGeneratingUnitsSummaryReportPDF() {
    this.isDownloading = true;
    const records = await this.getGeneratingUnitsSummaryReportData();
    const reportName = `Generating Unit Summary Report - (${this.formData.startDate} - ${this.formData.endDate})`;
    const reportData: any[][] = [];
    reportData.push(
      ...records.allGeneratingUnit.map((d) => {
        const row = [
          d.name,
          d.address,
          NumberFormatter.format(d.totalEnergySupply || 0) + ' kWh',
          NumberFormatter.format(d.minPowerDemand || 0) + ' kW',
          NumberFormatter.format(d.averagePowerDemand || 0) + ' kW',
          NumberFormatter.format(d.maxPowerDemand || 0) + ' kW',
          'NGN ' + NumberFormatter.format(d.totalEnergyCost || 0),
        ];
        return row;
      })
    );
    await this.pdfService.generateReport(
      PdfTemplateEnum.LoadPointReport,
      {
        title: reportName,
        header: [
          Object.entries(this.generatingSetColumns).map(
            ([key, values]) => values.title
          ),
        ],
        breakdown: reportData ?? [],
      },
      `${reportName}.pdf`
    );
    this.status = StatusEnum.SUCCESS;
    this.isDownloading = false;
  }
  // All Generating Units Summary report data
  async getGeneratingUnitsSummaryReportData() {
    let canRequestData = true;
    let allGeneratingUnit: GeneratingSetReportDto[] = [];
    let page = 1;
    const size = environment.downloadLength;
    while (canRequestData) {
      let response = await lastValueFrom(
        this.genSetService.getAllGeneratingSetReport({
          ...this.dateRange,
          ...{ page, size },
          ...this.formData,
        })
      ).catch(() => undefined);
      canRequestData = !!response?.data?.itemList.length;
      if (canRequestData) {
        allGeneratingUnit = GetUniqueArray(
          [...(response?.data?.itemList ?? [])],
          [...allGeneratingUnit]
        );
        page++;
      }
    }
    return { allGeneratingUnit };
  }

  // Function to Download Generating Unit By Id report in CSV
  async downloadGeneratingUnitReportByIdCSV() {
    this.isDownloading = true;
    const records = await this.getGeneratingUnitReportDataById();
    const reportName = `Generating Unit Report - (${this.formData.startDate} - ${this.formData.endDate}).xlsx`;
    const reportData: any[][] = [];
    reportData.push(
      ...records.generatingUnitBreakdown.map((d) => {
        const row = [
          d.name,
          NumberFormatter.format(d.energy || 0) + ' kWh',
          'NGN ' + NumberFormatter.format(d.tariff || 0),
          'NGN ' + NumberFormatter.format(d.cost || 0),
          d.powerSource,
          NumberFormatter.format(d.power || 0) + ' kW',
          DateFormatter.format(new Date(d.period)),
        ];
        return row;
      })
    );

    const reportDate = [[this.formData.startDate, this.formData.endDate]];
    await this.xlsxService.generateReport(
      XlsxTemplateEnum.GeneratingUnitReport,
      {
        date: reportDate,
        breakdown: reportData,
        powerSummary: [
          [
            NumberFormatter.format(
              records.generatingUnitSummary?.maxPowerDemand || 0
            ) + ' kW',
          ],
          [
            NumberFormatter.format(
              records.generatingUnitSummary?.minPowerDemand || 0
            ) + ' kW',
          ],
          [
            NumberFormatter.format(
              records.generatingUnitSummary?.averagePowerDemand || 0
            ) + ' kW',
          ],
        ],
        energySummary: [
          [
            NumberFormatter.format(
              records.generatingUnitSummary?.totalEnergySupply || 0
            ) + ' kWh',
          ],
          [
            'NGN ' +
              NumberFormatter.format(
                records.generatingUnitSummary?.totalEnergyCost || 0
              ),
          ],
          [
            'NGN ' +
              NumberFormatter.format(
                records.generatingUnitSummary?.tariff || 0
              ),
          ],
        ],
        name: (this.formData.locationName as string).toUpperCase(),
      },
      reportName
    );
    this.status = StatusEnum.SUCCESS;
    this.isDownloading = false;
  }
  // Function to Generating Unit by Id  in PDF
  async downloadtGeneratingUnitReportByIdPDF() {
    this.isDownloading = true;
    const records = await this.getGeneratingUnitReportDataById();
    const reportName = `${this.formData.locationName} Generating Unit Report - (${this.formData.startDate} - ${this.formData.endDate})`;
    const reportData: any[][] = [];
    reportData.push(
      ...records.generatingUnitBreakdown.map((d) => {
        const row = [
          d.name,
          NumberFormatter.format(d.energy || 0) + ' kWh',
          'NGN ' + NumberFormatter.format(d.tariff || 0),
          'NGN ' + NumberFormatter.format(d.cost || 0),
          d.powerSource,
          NumberFormatter.format(d.power || 0) + ' kW',
          DateFormatter.format(new Date(d.period)),
        ];
        return row;
      })
    );
    await this.pdfService.generateReport(
      PdfTemplateEnum.LoadPointReport,
      {
        title: reportName,
        header: [
          Object.entries(this.generatingSetColumnsById).map(
            ([key, values]) => values.title
          ),
        ],
        breakdown: reportData ?? [],
        powerSummary: [
          [
            'Max Power Demand',
            NumberFormatter.format(
              records.generatingUnitSummary?.maxPowerDemand || 0
            ) + ' kW',
          ],
          [
            'Min Power Demand',
            NumberFormatter.format(
              records.generatingUnitSummary?.minPowerDemand || 0
            ) + ' kW',
          ],
          [
            'Avg Power Demand',
            NumberFormatter.format(
              records.generatingUnitSummary?.averagePowerDemand || 0
            ) + ' kW',
          ],
        ],
        energySummary: [
          [
            'Total Energy Demand',
            NumberFormatter.format(
              records.generatingUnitSummary?.totalEnergySupply || 0
            ) + ' kWh',
          ],
          [
            'Total Energy Cost',
            'NGN ' +
              NumberFormatter.format(
                records.generatingUnitSummary?.totalEnergyCost || 0
              ),
          ],
          [
            'Tariff',
            'NGN ' +
              NumberFormatter.format(
                records.generatingUnitSummary?.tariff || 0
              ),
          ],
        ],
      },
      `${reportName}.pdf`
    );
    this.status = StatusEnum.SUCCESS;
    this.isDownloading = false;
  }

  // Generating Unit By Id report data
  async getGeneratingUnitReportDataById() {
    let canRequestData = true;
    let generatingUnitBreakdown: ReportPerGeneratingSetDto['breakdowns'] = [];
    let generatingUnitSummary: ReportPerGeneratingSetDto | undefined;
    let page = 1;
    const size = environment.downloadLength;
    while (canRequestData) {
      let response = await lastValueFrom(
        this.genSetService.getGeneratingSetReportById({
          ...this.dateRange,
          ...{ page, size },
          ...this.formData,
        })
      ).catch(() => undefined);
      canRequestData = !!response?.data?.breakdowns.length;
      if (canRequestData) {
        generatingUnitBreakdown = GetUniqueArray(
          [...(response?.data?.breakdowns ?? [])],
          [...generatingUnitBreakdown]
        );
        generatingUnitSummary = response?.data as ReportPerGeneratingSetDto;
        page++;
      }
    }
    return { generatingUnitBreakdown, generatingUnitSummary };
  }

  // Function to Download All Power Stations Summary Report
  async downloadPowerStationsSummaryReportCSV() {
    this.isDownloading = true;
    const records = await this.getPowerStationsSummaryReportData();
    const reportName = `Power Stations Summary Report - (${this.formData.startDate} - ${this.formData.endDate}).xlsx`;
    const reportData: any[][] = [];
    reportData.push(
      ...records.allPowerStations.map((d) => {
        const row = [
          d.name,
          d.address,
          NumberFormatter.format(d.totalEnergyDemand || 0) + ' kWh',
          NumberFormatter.format(d.totalEnergySupply || 0) + ' kWh',
          NumberFormatter.format(d.minPowerSupply || 0) + ' kW',
          NumberFormatter.format(d.averagePowerSupply || 0) + ' kW',
          NumberFormatter.format(d.maxPowerSupply || 0) + ' kW',
          Math.floor(d.utilization * 100),
        ];
        return row;
      })
    );

    const reportDate = [[this.formData.startDate, this.formData.endDate]];
    await this.xlsxService.generateReport(
      XlsxTemplateEnum.PowerStationsSummaryReport,
      {
        date: reportDate,
        body: reportData,
      },
      reportName
    );
    this.isDownloading = false;
  }
  //Power Stations Summary Report in PDF
  async downloadPowerStationsSummaryReportPDF() {
    this.isDownloading = true;
    const records = await this.getPowerStationsSummaryReportData();
    const reportName = `Power Stations Summary Report - (${this.formData.startDate} - ${this.formData.endDate})`;
    const reportData: any[][] = [];
    reportData.push(
      ...records.allPowerStations.map((d) => {
        const row = [
          d.name,
          d.address,
          NumberFormatter.format(d.totalEnergyDemand || 0) + ' kWh',
          NumberFormatter.format(d.totalEnergySupply || 0) + ' kWh',
          NumberFormatter.format(d.minPowerSupply || 0) + ' kW',
          NumberFormatter.format(d.averagePowerSupply || 0) + ' kW',
          NumberFormatter.format(d.maxPowerSupply || 0) + ' kW',
          Math.floor(d.utilization * 100),
        ];
        return row;
      })
    );
    await this.pdfService.generateReport(
      PdfTemplateEnum.LoadPointReport,
      {
        title: reportName,
        header: [
          Object.entries(this.powerSourceColumns).map(
            ([key, values]) => values.title
          ),
        ],
        breakdown: reportData ?? [],
      },
      `${reportName}.pdf`
    );
    this.status = StatusEnum.SUCCESS;
    this.isDownloading = false;
  }
  // All Power Stations Summary report data
  async getPowerStationsSummaryReportData() {
    let canRequestData = true;
    let allPowerStations: PowerSourceReportDto[] = [];
    let page = 1;
    const size = environment.downloadLength;
    while (canRequestData) {
      let response = await lastValueFrom(
        this.powerSourceService.getAllPowerSourceReport({
          ...this.dateRange,
          ...{ page, size },
          ...this.formData,
        })
      ).catch(() => undefined);
      canRequestData = !!response?.data?.itemList.length;
      if (canRequestData) {
        allPowerStations = GetUniqueArray(
          [...(response?.data?.itemList ?? [])],
          [...allPowerStations]
        );
        page++;
      }
    }
    return { allPowerStations };
  }

  // Function to download Source report data by Id in CSV
  async downloadPowerSourceReportByIdCSV() {
    this.isDownloading = true;
    const records = await this.getPowerSourceReportDataById();
    const reportName = `Power Station Report - (${this.formData.startDate} - ${this.formData.endDate})`;
    const reportDataSheet2: any[][] = [];
    const reportDataSheet3: any[][] = [];
    reportDataSheet2.push(
      ...records.attachedLoadPoints.map((d) => {
        const row1 = [
          d.name,
          d.address,
          NumberFormatter.format(d.energyDemand || 0) + ' kWh',
          NumberFormatter.format(d.powerDemand || 0) + ' kW',
          'NGN ' + NumberFormatter.format(d.energyCost || 0),
          'NGN ' + NumberFormatter.format(d.tariff || 0),
        ];
        return row1;
      })
    );
    reportDataSheet3.push(
      ...records.attachedGeneratingUnits.map((d) => {
        const row2 = [
          d.name,
          d.address,
          NumberFormatter.format(d.energySupply || 0) + ' kWh',
          NumberFormatter.format(d.powerSupply || 0) + ' kW',
          'NGN ' + NumberFormatter.format(d.energyCost || 0),
          'NGN ' + NumberFormatter.format(d.tariff || 0),
        ];
        return row2;
      })
    );

    const reportDate = [[this.formData.startDate, this.formData.endDate]];
    await this.xlsxService.generateReport(
      XlsxTemplateEnum.PowerStationsReport,
      {
        date: reportDate,
        attachedLoadPoints: reportDataSheet2 ?? [],
        attachedGenSets: reportDataSheet3 ?? [],
        demandSummary: [
          [
            NumberFormatter.format(
              records.powerSourceSummary?.maxPowerDemand || 0
            ) + ' kW',
          ],
          [
            NumberFormatter.format(
              records.powerSourceSummary?.minPowerDemand || 0
            ) + ' kW',
          ],
          [
            NumberFormatter.format(
              records.powerSourceSummary?.averagePowerDemand || 0
            ) + ' kW',
          ],
          [
            'NGN ' +
              NumberFormatter.format(
                records.powerSourceSummary?.totalEnergyDemand || 0
              ),
          ],
          [
            Math.floor(records.powerSourceSummary?.utilization || 0 * 100) +
              ' %',
          ],
        ],
        supplySummary: [
          [
            NumberFormatter.format(
              records.powerSourceSummary?.maxPowerSupply || 0
            ) + ' kW',
          ],
          [
            NumberFormatter.format(
              records.powerSourceSummary?.minPowerDemand || 0
            ) + ' kW',
          ],
          [
            NumberFormatter.format(
              records.powerSourceSummary?.averagePowerDemand || 0
            ) + ' kW',
          ],
          [
            'NGN ' +
              NumberFormatter.format(
                records.powerSourceSummary?.totalEnergySupply || 0
              ),
          ],
        ],
        name: (this.formData.locationName as string).toUpperCase(),
      },
      `${reportName}.xlsx`
    );
    this.status = StatusEnum.SUCCESS;
    this.isDownloading = false;
  }
  // Function to Download  Source report data by Id in PDF
  async downloadPowerSourceReportByIdPDF() {
    this.isDownloading = true;
    const records = await this.getPowerSourceReportDataById();
    const reportName = `${this.formData.locationName} Power Station Report - (${this.formData.startDate} - ${this.formData.endDate})`;
    const reportDataSheet2: any[][] = [];
    const reportDataSheet3: any[][] = [];
    reportDataSheet2.push(
      ...records.attachedLoadPoints.map((d) => {
        const row1 = [
          d.name,
          d.address,
          NumberFormatter.format(d.energyDemand || 0) + ' kWh',
          NumberFormatter.format(d.powerDemand || 0) + ' kW',
          'NGN ' + NumberFormatter.format(d.energyCost || 0),
          'NGN ' + NumberFormatter.format(d.tariff || 0),
        ];
        return row1;
      })
    );
    reportDataSheet3.push(
      ...records.attachedGeneratingUnits.map((d) => {
        const row2 = [
          d.name,
          d.address,
          NumberFormatter.format(d.energySupply || 0) + ' kWh',
          NumberFormatter.format(d.powerSupply || 0) + ' kW',
          'NGN ' + NumberFormatter.format(d.energyCost || 0),
          'NGN ' + NumberFormatter.format(d.tariff || 0),
        ];
        return row2;
      })
    );

    await this.pdfService.generateReport(
      PdfTemplateEnum.PowerSourceReport,
      {
        title: reportName,
        loadPointHeader: [
          Object.entries(this.powerSourceLoadPointColumns).map(
            ([key, values]) => values.title
          ),
        ],
        GenSetHeader: [
          Object.entries(this.powerSourceGenSetColumns).map(
            ([key, values]) => values.title
          ),
        ],
        attachedLoadPoints: reportDataSheet2 ?? [],
        attachedGenSets: reportDataSheet3 ?? [],
        demandSummary: [
          [
            'Max. Power Demand',
            NumberFormatter.format(
              records.powerSourceSummary?.maxPowerDemand || 0
            ) + ' kW',
          ],
          [
            'Min. Power Demand',
            NumberFormatter.format(
              records.powerSourceSummary?.minPowerDemand || 0
            ) + ' kW',
          ],
          [
            'Av. Power Demand',
            NumberFormatter.format(
              records.powerSourceSummary?.averagePowerDemand || 0
            ) + ' kW',
          ],
          [
            'Energy Demand',
            'NGN ' +
              NumberFormatter.format(
                records.powerSourceSummary?.totalEnergyDemand || 0
              ),
          ],
          [
            'Utilization',
            Math.floor(records.powerSourceSummary?.utilization || 0 * 100) +
              ' %',
          ],
        ],
        supplySummary: [
          [
            'Max. Power Supply',
            NumberFormatter.format(
              records.powerSourceSummary?.maxPowerSupply || 0
            ) + ' kW',
          ],
          [
            'Min. Power Supply',
            NumberFormatter.format(
              records.powerSourceSummary?.minPowerDemand || 0
            ) + ' kW',
          ],
          [
            'Av. Power Supply',
            NumberFormatter.format(
              records.powerSourceSummary?.averagePowerDemand || 0
            ) + ' kW',
          ],
          [
            'Energy Supply',
            'NGN ' +
              NumberFormatter.format(
                records.powerSourceSummary?.totalEnergySupply || 0
              ),
          ],
        ],
      },
      `${reportName}.pdf`
    );
    this.status = StatusEnum.SUCCESS;
    this.isDownloading = false;
  }

  // Power Source report data by Id
  async getPowerSourceReportDataById() {
    let canRequestData = true;
    let attachedGeneratingUnits: ReportPerPowerSourceDto['generatingUnits'] =
      [];
    let attachedLoadPoints: ReportPerPowerSourceDto['loadPoints'] = [];
    let powerSourceSummary: PowerSourceReportDto | undefined;
    let page = 1;
    const size = environment.downloadLength;
    while (canRequestData) {
      let response = await lastValueFrom(
        this.powerSourceService.getPowerSourceReportById({
          ...this.dateRange,
          ...{ page, size },
          ...this.formData,
        })
      ).catch(() => undefined);
      canRequestData =
        !!response?.data.generatingUnits.length ||
        !!response?.data.loadPoints.length;
      if (canRequestData) {
        attachedGeneratingUnits = GetUniqueArray(
          [...(response?.data?.generatingUnits ?? [])],
          [...attachedGeneratingUnits]
        );
        attachedLoadPoints = GetUniqueArray(
          [...(response?.data?.loadPoints ?? [])],
          [...attachedLoadPoints]
        );
        powerSourceSummary = response?.data as PowerSourceReportDto;
        page++;
      }
    }

    return { attachedGeneratingUnits, attachedLoadPoints, powerSourceSummary };
  }
  postReportDownloadAudit() {
    const reportDownloadAuditDto: ReportDownloadAuditDto = {
      assetType: this.auditAssetTypeValue,
      assetName: this.assetName,
      startDate: this.formData.startDate,
      endDate: this.formData.endDate,
      format: this.downloadFormat,
      isAll: this.isTotalAsset,
    };
    this.auditService
      .postReportDownloadAudit(reportDownloadAuditDto)
      .subscribe();
  }

  ngOnDestroy() {
    this.isLive = false;
  }
}
