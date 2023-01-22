import { Component, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NbDateService, NbDialogRef } from '@nebular/theme';
import {
  AssetTypeEnumBilling,
  AssetTypeNameBilling,
} from 'src/app/@core/enums/asset-type.enum';
import { format, subMonths } from 'date-fns';
import { SeoService } from 'src/app/@core/utils';

console.log(AssetTypeNameBilling.entries());

@Component({
  selector: 'app-billing-comfigure-form',
  templateUrl: './billing-comfigure-form.component.html',
  styleUrls: ['./billing-comfigure-form.component.scss'],
})
export class BillingComfigureFormComponent implements OnInit {
  configForm!: UntypedFormGroup;
  assetTypeName = Array.from(AssetTypeNameBilling);
  @Input() assetType!: AssetTypeEnumBilling;
  @Input() startDate!: Date;
  selectedDate!: string;
  assetTypeName_!: string;
  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }

  months: { name: string; month: number; year: number }[] = [];
  configDate!: Date;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private seo: SeoService,
    protected dateService: NbDateService<Date>,
    public dialogRef: NbDialogRef<BillingComfigureFormComponent>
  ) {}

  ngOnInit(): void {
    if (this.assetType === AssetTypeEnumBilling.LOADPOINT) {
      this.assetTypeName_ = 'Load Points';
    }
    this.seo.setSeoData(
      `Billing and Comparison - [${this.assetTypeName_}]`,
      `Manage billing and comparison`
    );
    if (this.startDate !== undefined) {
      let now = this.monthStart;
      const date = subMonths(now, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const name = format(date, 'MMMM, yyyy');
      this.configDate = new Date(`${month}/1/${year}`);
      this.selectedDate = name;
    } else {
      let now = this.monthStart;
      const date = subMonths(now, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const name = format(date, 'MMMM, yyyy');
      this.configDate = new Date(`${month}/1/${year}`);
      this.selectedDate = name;
    }
    this.configForm = this.formBuilder.group({
      date: [this.configDate, Validators.required],
      assetType: [this.assetType, Validators.required],
    });
    this.getMonths();
  }
  getDate(event?: any) {
    const { month, year } = (this.months.find((m) => m.name === event) as {
      month: number;
      year: number;
    }) ?? {
      month: this.months[this.months.length - 2]?.month,
      year: this.months[this.months.length - 2]?.year,
    };
    this.configDate = new Date(`${month}/1/${year}`);
  }
  getMonths() {
    let now = new Date();
    now = subMonths(now, 1);
    for (let i = 0; i < 12; i++) {
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const name = format(now, 'MMMM, yyyy');
      this.months.push({ month, year, name });
      now = subMonths(now, 1);
    }
  }

  onSelectAssetType() {
    this.assetType = this.configForm.get('assetType')?.value;
  }

  close(): void {
    this.dialogRef.close(false);
  }

  loadTable() {
    this.dialogRef.close({
      date: this.configDate,
      assetType: this.configForm.get('assetType')?.value,
    });
  }
}
