import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbCalendarRange, NbDateService, NbDialogRef, NbDialogService } from '@nebular/theme';
import { AssetTypeEnumBilling, AssetTypeNameBilling, DownloadTypeNameBilling } from 'src/app/@core/enums/asset-type.enum';

@Component({
  selector: 'app-billing-header-form',
  templateUrl: './billing-header-form.component.html',
  styleUrls: ['./billing-header-form.component.scss']
})
export class BillingHeaderFormComponent implements OnInit, OnDestroy {


  billingForm!: UntypedFormGroup;
  isLoading = false;
  range!: NbCalendarRange<Date>;
  assetName!: string;
  @Input() type!:number;
  @Input() date!:string;

  @Input()
  assetType!: AssetTypeEnumBilling;

  isLive = true;

  assetTypeName = Array.from(AssetTypeNameBilling);
  downloadTypeName = Array.from(DownloadTypeNameBilling);
  downloadType!:AssetTypeEnumBilling;

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }

  constructor(
    public dialogRef: NbDialogRef<BillingHeaderFormComponent>,
    private formBuilder: UntypedFormBuilder,
    protected dateService: NbDateService<Date>,
    private route: ActivatedRoute,
    protected router: Router,
  ) { }


  ngOnInit(): void {
    if(this.type && this.type === 2){
      this.assetType = this.assetTypeName[0][0] + 1
      
    }else if(this.type && this.type === 1){
      this.assetType = this.assetTypeName[1][0] + 1
    } 
    this.billingForm = this.formBuilder.group({
      date: [{value: this.date, disabled:true}, Validators.required],
      assetType: [{value: this.assetType, disabled: true}, Validators.required],
      downloadType: [{ value: this.downloadTypeName[0][0], disabled: true}, Validators.required],
    })
     
  }
  onSelectAssetType() {
    this.assetType = (this.billingForm.get('assetType')?.value);
  }

  onSelectFormat(){
    this.downloadType = (this.billingForm.get('downloadType')?.value);
  }
 
  close(): void {
    this.dialogRef.close(false);
  }

  loadTable() {
    this.dialogRef.close({
      date: this.billingForm.get('date')?.value,
      downloadType: this.billingForm.get('downloadType')?.value,
      assetType: this.billingForm.get('assetType')?.value,
    });
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }

}
