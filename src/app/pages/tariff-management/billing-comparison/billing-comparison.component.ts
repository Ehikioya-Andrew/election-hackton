import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { format, subMonths } from 'date-fns';
import { AnimationOptions } from 'ngx-lottie';
import { lastValueFrom } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { TariffService } from 'src/app/@core/data-services/tariff.service';
import { BillingComparison } from 'src/app/@core/dtos/billing-comparison.dto';
import {
  AssetTypeEnumBilling,
  AssetTypeNameBilling,
  DownloadTypeNameBilling,
} from 'src/app/@core/enums/asset-type.enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import {
  CurrencyFormatter,
  DateFormatter,
  NumberFormatter,
} from 'src/app/@core/functions/formatter.funtion';
import { SeoService } from 'src/app/@core/utils';
import { BillingComfigureFormComponent } from './billing-comfigure-form/billing-comfigure-form.component';
import { BillingStatusToggleComponent } from './billing-status-toggle/billing-status-toggle.component';

@Component({
  selector: 'app-billing-comparison',
  templateUrl: './billing-comparison.component.html',
  styleUrls: ['./billing-comparison.component.scss'],
})
export class BillingComparisonComponent implements OnInit {
  isLoadingData!: boolean;
  blob: any;

  downloadTypeName = Array.from(DownloadTypeNameBilling);
  extensionValue!: string;
  filename!: string;
  columns = {
    hasBillingData: {
      title: 'Upload Status',
      renderComponent: BillingStatusToggleComponent,
      type: 'custom',
      filter: {
        type: 'list',
        config: {
          selectText: 'Select...',
          list: [
            { value: true, title: 'True' },
            { value: false, title: 'False' },
          ],
        },
      },
      filterFunction: (x: string, y: string) => x.toString() === y,
    },
    locationName: {
      title: 'Location Name',
      filter: true,
    },
    locationType: {
      title: 'Location Type',
      filter: true,
    },
    consumptionKWH: {
      title: 'Consumption',
      valuePrepareFunction: (d: number) => {
        return NumberFormatter.format(d || 0) + ' kWh';
      },
      filter: true,
    },
    billingTarriff: {
      title: 'Billing Tariff',
      valuePrepareFunction: (d: number) => {
        return CurrencyFormatter.format(d || 0);
      },
      filter: true,
    },
    amount: {
      title: 'Billing',
      valuePrepareFunction: (d: number) => {
        return CurrencyFormatter.format(d || 0);
      },
      filter: true,
    },
    billableUnit: {
      title: 'Billable Unit',
      valuePrepareFunction: (d: number) => {
        return CurrencyFormatter.format(d || 0);
      },
      filter: true,
    },
    systemConsumption: {
      title: 'System Consumption',
      valuePrepareFunction: (d: number) => {
        return NumberFormatter.format(d || 0) + ' kWh';
      },
      filter: true,
    },
    tariff: {
      title: 'System Tariff',
      valuePrepareFunction: (d: number) => {
        return CurrencyFormatter.format(d || 0);
      },
      filter: true,
    },
    systemBilling: {
      title: 'System Billing',
      valuePrepareFunction: (d: number) => {
        return CurrencyFormatter.format(d || 0);
      },
      filter: true,
    },
    consumptionVariance: {
      title: 'Consumption Variance',
      valuePrepareFunction: (d: number) => {
        return NumberFormatter.format(d || 0) + ' kWh';
      },
      filter: true,
    },

    billingVariance: {
      title: 'Billing Variance',
      valuePrepareFunction: (d: number) => {
        return CurrencyFormatter.format(d || 0);
      },
      filter: true,
    },
  };

  compareData: BillingComparison[] = [];
  assetType!: AssetTypeEnumBilling;
  assetTypeName = Array.from(AssetTypeNameBilling);
  configDate!: Date;

  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };

  constructor(
    private tariffService: TariffService,
    private dialogService: NbDialogService,
    private seo: SeoService,
    private toaster: NbToastrService
  ) {}
  ngOnInit(): void {
    this.seo.setSeoData(
      'Tariff Management - [Billing and Comparison]',
      'Manage billing and comparison'
    );
    this.defaultData();
  }

  defaultData() {
    let now = new Date();
    const date = subMonths(now, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.configDate = new Date(`${month}/1/${year}`);
    const assetType = AssetTypeEnumBilling.LOADPOINT;
    const defaultData = {
      assetType: assetType,
      dateOfBilling: this.configDate.toLocaleDateString('en-US'),
    };
    this.requestData(defaultData, true);
  }

  downloadTemplate(ev: any) {
    this.isLoadingData = true;
    this.extensionValue = 'text/csv';
    this.filename = `billing_invoice_${ev.date.split(',')[0]}.csv`;
    this.tariffService.downloadTariffTemplate({ ...ev }).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.message) {
          this.toaster.danger(response.message, 'Download Message');
        } else {
          this.blob = new Blob([response], { type: this.extensionValue });
          const url = window.URL.createObjectURL(this.blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = this.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      },
      (err) => {
        this.toaster.danger(
          'Billing records have already been uploaded for all locations.',
          'Download Error'
        );
        this.isLoadingData = false;
      }
    );
  }

  requestData(data?: any, reset = false) {
    this.isLoadingData = true;
    this.tariffService.compareTariffBilling({ ...data }).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.status) {
          let data = response?.data ?? Array<BillingComparison>();
          this.compareData = data;
        }
      },
      (err) => {
        this.isLoadingData = false;
      }
    );
  }

  async configureForm() {
    const config = await lastValueFrom(
      this.dialogService.open(BillingComfigureFormComponent, {
        closeOnBackdropClick: true,
        context: {},
        hasScroll: true,
        closeOnEsc: true,
      }).onClose
    );
    if (config) {
      const { date, assetType } = config;
      const data = {
        assetType: assetType,
        dateOfBilling: date.toLocaleDateString('en-US'),
      };
      this.requestData(data, true);
    }
  }
}
