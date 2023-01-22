import { TariffService } from './../../../../@core/data-services/tariff.service';
import { TariffDto } from './../../../../@core/dtos/tariff.dto';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { MeterDto } from 'src/app/@core/dtos/meter.dto';
import { MeterManufaturerDto } from 'src/app/@core/dtos/meter-manufacturer.dto';
import { MeterResources } from '../meter-resources';
import { Observable } from 'rxjs';
import { MeterService } from 'src/app/@core/data-services/meter.service';
import { map } from 'rxjs/operators';
import { PostMeterDto } from 'src/app/@core/dtos/post-meter.dto';
import { ResponseDto } from 'src/app/@core/dtos/response-dto';
import { UpdateMeterDto } from 'src/app/@core/dtos/update-meter.dto';

@Component({
  selector: 'app-meter-form',
  templateUrl: './meter-form.component.html',
  styleUrls: ['./meter-form.component.scss'],
  providers: [UntypedFormBuilder],
})
export class MeterFormComponent implements OnInit {
  @Input()
  isCreateRequest = true;

  @Input()
  meterForUpdate!: MeterDto;

  errors: string[] = [];
  messages: string[] = [];
  submitted = false;

  meterForm!: UntypedFormGroup;

  meterManufacturer$: Observable<MeterManufaturerDto[]>;
  tariff$!: Observable<TariffDto[]>;

  meterResources = MeterResources;
  isLive = true;

  constructor(
    public dialogRef: NbDialogRef<MeterFormComponent>,
    private formBuilder: UntypedFormBuilder,
    private meterService: MeterService,
    private tariffService: TariffService
  ) {
    this.meterManufacturer$ = this.meterService
      .getMeterManufacturer()
      .pipe(map((d) => d.data as MeterManufaturerDto[]));
    this.tariff$ = this.tariffService
      .getTariff()
      .pipe(map((d) => d.data?.itemList as TariffDto[]));
  }

  ngOnInit(): void {
    this.initCreateForm();
    if (this.isCreateRequest) {
    } else {
      this.initUpdateForm();
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
  keyPressNumbersOnly(event: any) {
    let charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  initCreateForm(): void {
    this.meterForm = this.formBuilder.group({
      number: ['', Validators.required],
      phaseCount: [null, Validators.required],
      meterManufacturerId: [null, Validators.required],
      meterModel: ['', Validators.required],
      tariffId: ['', Validators.required],
    });
  }

  initUpdateForm(): void {
    this.meterForm = this.formBuilder.group({
      phaseCount: [this.meterForUpdate.phaseCount, Validators.required],
      meterManufacturerId: [
        this.meterForUpdate.meterManufacturerId,
        Validators.required,
      ],
      meterModel: [this.meterForUpdate.meterModel, Validators.required],
      tariffId: [this.meterForUpdate.tariffId, Validators.required],
    });
  }

  saveMeter(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const postMeterDto: PostMeterDto = {
      number: (this.meterForm.get('number')?.value as string).trim(),
      phaseCount: this.meterForm.get('phaseCount')?.value as number,
      meterManufacturer: this.meterForm.get('meterManufacturerId')
        ?.value as number,
      meterModel: (this.meterForm.get('meterModel')?.value as string).trim(),
      tarriffId: (this.meterForm.get('tariffId')?.value as string).trim(),
    };
    this.meterService.postMeter(postMeterDto).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Meter creation successful'];
          setTimeout(() => {
            this.dialogRef.close(result.data);
          }, 1200);
        } else {
          this.errors = [result.message as string];
        }
      },
      (error: ResponseDto<string>) => {
        this.submitted = false;
        this.errors = ['An Error occured while creating meter.'];
      }
    );
  }

  updateMeter(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const updateMeterDto: UpdateMeterDto = {
      number: this.meterForUpdate.number,
      phaseCount: this.meterForm.get('phaseCount')?.value as number,
      meterManufacturer: this.meterForm.get('meterManufacturerId')
        ?.value as number,
      meterModel: (this.meterForm.get('meterModel')?.value as string).trim(),
      tarriffId: (this.meterForm.get('tariffId')?.value as string).trim(),
      id: this.meterForUpdate.id,
    };

    this.meterService.updateMeter(updateMeterDto).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Meter update successful'];
          setTimeout(() => {
            this.dialogRef.close(result.data);
          }, 1200);
        } else {
          this.errors = [result.message as string];
        }
      },
      (error: ResponseDto<string>) => {
        this.submitted = false;
        this.errors = ['An Error occured while updating meter.'];
      }
    );
  }
}
