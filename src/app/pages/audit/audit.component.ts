import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { lastValueFrom } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AuditService } from 'src/app/@core/data-services/audit.services';
import { AuditDto } from 'src/app/@core/dtos/audit.dto';
import { PdfTemplateEnum } from 'src/app/@core/enums/pdf-template.enum';
import { XlsxTemplateEnum } from 'src/app/@core/enums/xlsx-template.enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { DateFormatter } from 'src/app/@core/functions/formatter.funtion';
import { SeoService } from 'src/app/@core/utils';
import { PdfService } from 'src/app/@core/utils/pdf.service';
import { XlsxService } from 'src/app/@core/utils/xlsx.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
})
export class AuditComponent implements OnInit {
  isLoadingData = true;
  isDownloading = false;

  @Input()
  formData!: any;

  startDate!: string;
  endDate!: string;

  auditDto: AuditDto[] = [];

  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };
  isLive = true;

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
    }),
  };

  columns = {
    actionCategory: {
      title: 'Category',
    },
    action: {
      title: 'Action',
    },
    description: {
      title: 'Description',
    },

    role: {
      title: 'Role',
    },
    created: {
      title: 'Date',
      valuePrepareFunction: (date: string) => {
        return DateFormatter.format(new Date(date));
      },
    },
  };
  constructor(
    private route: ActivatedRoute,
    protected dateService: NbDateService<Date>,
    private xlsxService: XlsxService,
    private pdfService: PdfService,
    private auditService: AuditService,
    private seo: SeoService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.seo.setSeoData('Audit Trail - [Audit]', 'View Audit Trail');
    this.route.queryParams
      .pipe(takeWhile(() => this.isLive))
      .subscribe(({ startDate, endDate }) => {
        if (!!startDate && !!endDate) {
          this.dateRange = {
            startDate: new Date(startDate).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            endDate: new Date(endDate).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
          };
        }
        this.requestData(this.dateRange, true);
      });
  }
  async downloadAuditLogsCSV() {
    this.isDownloading = true;
    const records = await this.getReportData();
    const reportName = `Audit Logs - (${this.dateRange.startDate} - ${this.dateRange.endDate})`;
    const reportData: any[][] = [];
    reportData.push(
      ...records.map((d) => {
        const row = [
          d.actionCategory,
          d.action,
          d.description,
          d.role,
          DateFormatter.format(new Date(d.created)),
        ];
        return row;
      })
    );

    const reportDate = [[this.dateRange.startDate, this.dateRange.endDate]];
    await this.xlsxService.generateReport(
      XlsxTemplateEnum.AuditReport,
      { date: reportDate, body: reportData },
      `${reportName}.xlsx`
    ),
      (this.isDownloading = false);
  }
  async downloadAuditLogsPDF() {
    this.isDownloading = true;
    const records = await this.getReportData();
    const reportName = `Audit Logs - (${this.dateRange.startDate} - ${this.dateRange.endDate})`;
    const reportData: any[][] = [];
    reportData.push(
      ...records.map((d) => {
        const row = [
          d.actionCategory,
          d.action,
          d.description,
          d.role,
          DateFormatter.format(new Date(d.created)),
        ];
        return row;
      })
    );

    await this.pdfService.generateReport(
      PdfTemplateEnum.LoadPointReport,
      {
        title: reportName,
        header: [
          Object.entries(this.columns).map(([key, values]) => values.title),
        ],
        breakdown: reportData,
      },
      `${reportName}.pdf`
    );

    this.isDownloading = false;
  }

  async getReportData() {
    let canRequestData = true;
    let auditRecords: AuditDto[] = [];
    let page = 1;
    const size = environment.downloadLength;
    while (canRequestData) {
      let response = await lastValueFrom(
        this.auditService.getAudit({ ...this.dateRange, ...{ page, size } })
      ).catch(() => undefined);
      canRequestData = !!response?.data?.itemList?.length;
      if (canRequestData) {
        auditRecords = GetUniqueArray(
          [...(response?.data?.itemList ?? [])],
          [...auditRecords]
        );
        page++;
      }
    }
    return auditRecords;
  }

  showTable(ev: any): void {
    this.formData = ev;
    this.isLoadingData = true;
    this.requestData(this.formData);
  }

  requestData(data?: any, reset = false) {
    this.isLoadingData = true;
    this.auditService.getAudit({ ...this.dateRange, ...data }).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.status) {
          this.auditDto = reset
            ? [...(response.data?.itemList ?? [])]
            : GetUniqueArray(
                [...(response.data?.itemList ?? [])],
                [...this.auditDto]
              );
        }
      },
      (err) => {
        this.isLoadingData = false;
      }
    );
  }
}
