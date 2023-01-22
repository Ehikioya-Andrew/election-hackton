import { ResponseDto } from './../../../../@core/dtos/response-dto';
import { PostTariffDto } from './../../../../@core/dtos/post-tariff.dto';
import { map } from 'rxjs/operators';
import { ServiceBandService } from 'src/app/@core/data-services/service-band.service';
import { TariffService } from './../../../../@core/data-services/tariff.service';
import { NbDialogRef } from '@nebular/theme';
import { TariffResources } from './../tariff-resources';
import { Observable } from 'rxjs';
import { ServiceBandDto } from './../../../../@core/dtos/service-band.dto';
import { TariffDto } from './../../../../@core/dtos/tariff.dto';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { UpdateTariffDto } from 'src/app/@core/dtos/update-tariff.dto';
import { RateClassDto } from 'src/app/@core/dtos/rateClass.dto';

@Component({
  selector: 'app-tariff-form',
  templateUrl: './tariff-form.component.html',
  styleUrls: ['./tariff-form.component.scss'],
  providers: [UntypedFormBuilder]
})
export class TariffFormComponent implements OnInit {


  @Input()
  isCreateRequest = true;

  @Input()
  tariffForUpdate!: TariffDto;

  errors: string[] = [];
  messages: string[] = [];
  submitted = false;

  tariffForm!: UntypedFormGroup;

  serviceBand$!: Observable<ServiceBandDto[]>;
  rateClass$!: Observable<RateClassDto>;

  tariffResources = TariffResources;
  isLive = true;

  constructor(
    public dialogRef: NbDialogRef<TariffFormComponent>,
    private formBuilder: UntypedFormBuilder,
    private tariffService: TariffService,
    private serviceBandService: ServiceBandService
  ) {
    this.serviceBand$ = this.serviceBandService.getServiceBand().pipe(map(d => d.data?.itemList as ServiceBandDto[]));
    this.rateClass$ = this.tariffService.getRateClass().pipe(map(d => d.data as RateClassDto));
  }

  ngOnInit(): void {
    this.initCreateForm();
    if (this.isCreateRequest) {
    } else {
      this.initUpdateForm();
      this.tariffForm.controls['name'].disable();
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  initCreateForm(): void {
    this.tariffForm = this.formBuilder.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      rateClass: ['', Validators.required],
    });
  }

  keyPressNumbersOnly(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  initUpdateForm(): void {
    this.tariffForm = this.formBuilder.group({
      name: [this.tariffForUpdate.name, Validators.required],
      amount: [this.tariffForUpdate.amount, Validators.required],
      rateClass: [this.tariffForUpdate.rateClassId, Validators.required],
    });

  }

  saveTariff(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const postTarriff: PostTariffDto = {
      name: (this.tariffForm.get('name')?.value as string).trim(),
      amount: (this.tariffForm.get('amount')?.value as number),
      rateClass: (this.tariffForm.get('rateClass')?.value as number),
    }

    this.tariffService.postTariff(postTarriff).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Tariff creation successful'];
          setTimeout(() => {
            this.dialogRef.close(result.data);
          }, 1200);
        } else {
          this.errors = [
            result.message as string
          ];
        }
      },
      (error: ResponseDto<string>) => {
        this.submitted = false;
        this.errors = [
          'An Error occured while creating tariff .',
        ];
      }
    );
  }

  updateTariff(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const updateTariff: UpdateTariffDto = {
      name: (this.tariffForm.get('name')?.value as string).trim(),
      rateClass: (this.tariffForm.get('rateClass')?.value as number),
      amount: (this.tariffForm.get('amount')?.value as number),
      id: this.tariffForUpdate.id
    };

    this.tariffService.updateTariff(updateTariff).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Tariff update successful'];
          setTimeout(() => {
            this.dialogRef.close(result.data);
          }, 1200);
        } else {
          this.errors = [
            result.message as string
          ];
        }
      },
      (error: ResponseDto<string>) => {
        this.submitted = false;
        this.errors = [
          'An Error occured while updating Tariff.',
        ];
      }
    );
  }

}
