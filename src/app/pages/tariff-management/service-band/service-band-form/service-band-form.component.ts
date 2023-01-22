import { ResponseDto } from './../../../../@core/dtos/response-dto';
import { ServiceBandService } from './../../../../@core/data-services/service-band.service';
import { NbDialogRef } from '@nebular/theme';
import { ServiceBandResources } from './../service-band-resources';
import { ServiceBandDto } from './../../../../@core/dtos/service-band.dto';
import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PostServiceBandDto } from 'src/app/@core/dtos/post-service-band.dto';
import { UpdateServiceBandDto } from 'src/app/@core/dtos/update-service-band.dto';

@Component({
  selector: 'app-service-band-form',
  templateUrl: './service-band-form.component.html',
  styleUrls: ['./service-band-form.component.scss'],
  providers: [UntypedFormBuilder]
})
export class ServiceBandFormComponent implements OnInit {

  @Input()
  isCreateRequest = true;

  @Input()
  serviceBandForUpdate!: ServiceBandDto;

  errors: string[] = [];
  messages: string[] = [];
  submitted = false;

  serviceBandForm!: UntypedFormGroup

  serviceBandResources = ServiceBandResources;
  isLive = true;

  constructor(
    public dialogRef: NbDialogRef<ServiceBandFormComponent>,
    private formBuilder: UntypedFormBuilder,
    private serviceBandService: ServiceBandService,
  ) {}

  ngOnInit(): void {
    this.initCreateForm();
    if (this.isCreateRequest) {
    } else {
      this.initUpdateForm();
      this.serviceBandForm.controls['name'].disable();
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  initCreateForm(): void {
    this.serviceBandForm = this.formBuilder.group({
      name: ['', Validators.required],
      upperBand: [null, Validators.required],
      lowerBand: [null, Validators.required],
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
    this.serviceBandForm = this.formBuilder.group({
      name: [this.serviceBandForUpdate.name, Validators.required],
      upperBand: [this.serviceBandForUpdate.upperBand, Validators.required],
      lowerBand: [this.serviceBandForUpdate.lowerBand, Validators.required],
    });
  }

  saveServiceBand(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const postServiceBandDto: PostServiceBandDto = {
      name: (this.serviceBandForm.get('name')?.value as string).trim(),
      upperBand: (this.serviceBandForm.get('upperBand')?.value as number),
      lowerBand: (this.serviceBandForm.get('lowerBand')?.value as number),
    }

    this.serviceBandService.postServiceBand(postServiceBandDto).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['LoadPoint creation successful'];
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
          'An Error occured while creating service bandst.',
        ];
      }
    );
  }

  updateServiceBand(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const updateServiceBandDto: UpdateServiceBandDto = {
      name: (this.serviceBandForm.get('name')?.value as string).trim(),
      upperBand: (this.serviceBandForm.get('upperBand')?.value as number),
      lowerBand: (this.serviceBandForm.get('lowerBand')?.value as number),
      id: this.serviceBandForUpdate.id
    };

    this.serviceBandService.updateServiceBand(updateServiceBandDto).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Service Band update successful'];
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
          'An Error occured while updating service band.',
        ];
      }
    );
  }

}
