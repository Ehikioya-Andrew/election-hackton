import { BillingComparisonComponent } from './../billing-comparison.component';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { subMonths } from 'date-fns';
import { AnimationOptions } from 'ngx-lottie';
import {
  AssetTypeEnumBilling,
  AssetTypeNameBilling,
} from 'src/app/@core/enums/asset-type.enum';
import { DateFormatter } from 'src/app/@core/functions/formatter.funtion';
import { BillingComfigureFormComponent } from '../billing-comfigure-form/billing-comfigure-form.component';
import { BillingHeaderFormComponent } from '../billing-header-form/billing-header-form.component';
import { UploadFormComponent } from '../upload-form/upload-form.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-billing-header-block',
  templateUrl: './billing-header-block.component.html',
  styleUrls: ['./billing-header-block.component.scss'],
})
export class BillingHeaderBlockComponent implements OnInit {
  @Output()
  optionSelected: EventEmitter<any> = new EventEmitter();

  @Output()
  comparison: EventEmitter<any> = new EventEmitter();

  @Output()
  uploadSelection: EventEmitter<any> = new EventEmitter();

  downloadType!: string;
  assetType!: AssetTypeEnumBilling;
  date!: any;

  isLoading: boolean = true;
  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };
  constructor(
    private dialogService: NbDialogService,
    private billingComponent: BillingComparisonComponent
  ) {}
  ngOnInit(): void {
    let now = new Date();
    const date = subMonths(now, 1);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.date = new Date(`${month}/1/${year}`);
    this.assetType = AssetTypeEnumBilling.LOADPOINT;
  }

  async downloadTemplate() {
    const date = new DatePipe('en-US').transform(this.date, 'MMMM 01, yyyy');
    const data = {
      assetType: this.assetType,
      downloadType: 0,
      date,
    };
    this.optionSelected.next(data);
  }

  async uploadForm() {
    const config = await lastValueFrom(
      this.dialogService.open(UploadFormComponent, {
        closeOnBackdropClick: true,
        context: { assetType: this.assetType, date: this.date },
        hasScroll: true,
        closeOnEsc: true,
      }).onClose
    );
    if (config) {
      const date = new DatePipe('en-EU').transform(
        this.date,
        'MM/dd/YYYY'
      ) as string;
      const data = {
        assetType: this.assetType,
        dateOfBilling: date,
      };
      this.billingComponent.requestData(data, true);
    }
  }

  async configureForm() {
    const config = await lastValueFrom(
      this.dialogService.open(BillingComfigureFormComponent, {
        closeOnBackdropClick: true,
        context: { assetType: this.assetType, startDate: this.date },
        hasScroll: true,
        closeOnEsc: true,
      }).onClose
    );
    if (config) {
      const { date, assetType } = config;
      this.assetType = assetType;
      this.date = date;

      const data = {
        assetType: assetType,
        dateOfBilling: date.toLocaleDateString('en-US'),
      };
      this.comparison.next(data);
    }
  }
}
