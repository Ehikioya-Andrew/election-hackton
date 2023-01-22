import { UpdatePowerSourceDto } from './../../../../@core/dtos/update-power-source.dto';
import { ResponseDto } from 'src/app/@core/dtos/response-dto';
import { map, takeWhile } from 'rxjs/operators';
import { LocationService } from 'src/app/@core/data-services/location.service';
import { PowerSourceService } from './../../../../@core/data-services/power-source.service';
import { LocationDto } from 'src/app/@core/dtos/location.dto';
import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { PowerSourceDto } from 'src/app/@core/dtos/power-source.dto';
import { PowerSourceResources } from '../power-source-resources';
import { Observable, of } from 'rxjs';
import { NbDialogRef } from '@nebular/theme';
import { isLatitude, isLongitude } from 'class-validator';
import { PostPowerSourceDto } from 'src/app/@core/dtos/post-power-source.dto';

@Component({
  selector: 'app-power-source-form',
  templateUrl: './power-source-form.component.html',
  styleUrls: ['./power-source-form.component.scss'],
  providers: [UntypedFormBuilder]
})
export class PowerSourceFormComponent implements OnInit {

  @Input()
  isCreateRequest = true;

  @Input()
  powerSourceForUpdate!: PowerSourceDto;

  errors: string[] = [];
  messages: string[] = [];
  submitted = false;

  powerSourceForm!: UntypedFormGroup

  powerSourceResources = PowerSourceResources;
  isLive = true;

  countries$: Observable<LocationDto[]>
  states$: Observable<LocationDto[]>
  areas$: Observable<LocationDto[]>

  constructor(
    public dialogRef: NbDialogRef<PowerSourceFormComponent>,
    private formBuilder: UntypedFormBuilder,
    private powerSourceService: PowerSourceService,
    private locationService: LocationService
  ) {
    this.countries$ = locationService.getCountries().pipe(map((r) => r.data as LocationDto[]));
    this.states$ = of([]);
    this.areas$ = of([]);
  }

  ngOnInit(): void {
    this.initCreateForm();
    if (this.isCreateRequest) {
    } else {
      this.initUpdateForm();
    }
    this.trackRetrievedOptions();
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  initCreateForm(): void {
    this.powerSourceForm = this.formBuilder.group({
      name: ['', Validators.required],
      countryId: [null, Validators.required],
      stateId: [null, Validators.required],
      lgaId: [null, Validators.required],
      latitude: ['', [
        Validators.required,
        this.validateLatitude.bind(this)]],
      longitude: ['', [
        Validators.required,
        this.validateLongitude.bind(this)]],
      address: ['', Validators.required],
    });
  }

  validateLatitude(input: UntypedFormControl) {
    const value = input.value;
    const isValidlatitude = isLatitude(input.value);
    if (isValidlatitude) {
      return;
    } else {
      return {
        invalidLatitude: `"${value}" is not a valid latitude`
      }
    }
  }
  validateLongitude(input: UntypedFormControl) {
    const value = input.value;
    const isValidLongitude = isLongitude(input.value);
    if (isValidLongitude) {
      return;
    } else {
      return {
        invalidLongitude: `"${value}" is not a valid Longitude`
      }
    }
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
    this.powerSourceForm = this.formBuilder.group({
      name: [this.powerSourceForUpdate.name, Validators.required],
      countryId: [this.powerSourceForUpdate.countryId, Validators.required],
      stateId: [this.powerSourceForUpdate.stateId, Validators.required],
      lgaId: [this.powerSourceForUpdate.lgaId, Validators.required],
      latitude: [this.powerSourceForUpdate.latitude, [
        Validators.required,
        this.validateLatitude.bind(this)]],
      longitude: [this.powerSourceForUpdate.longitude, [
        Validators.required,
        this.validateLongitude.bind(this)]],
      address: [this.powerSourceForUpdate.address, Validators.required],
    });

    this.states$ = this.locationService.getStates({ countryId: this.powerSourceForUpdate.countryId }).pipe(map((r) => r.data as LocationDto[]));
    this.areas$ = this.locationService.getAreas({ stateId: this.powerSourceForUpdate.stateId }).pipe(map((r) => r.data as LocationDto[]));
  }

  trackRetrievedOptions() {
    this.powerSourceForm.get('countryId')?.valueChanges
      .pipe(takeWhile(() => this.isLive))
      .subscribe(
        (val) => {
          this.powerSourceForm.get('stateId')?.setValue(undefined);
          this.states$ = this.locationService.getStates({ countryId: val }).pipe(map((r) => r.data as LocationDto[]));
        }
      );
    this.powerSourceForm.get('stateId')?.valueChanges
      .pipe(takeWhile(() => this.isLive))
      .subscribe(
        (val) => {
          this.powerSourceForm.get('lgaId')?.setValue(undefined);
          this.areas$ = this.locationService.getAreas({ stateId: val }).pipe(map((r) => r.data as LocationDto[]));
        }
      );
  }

  savePowerSource(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const postPowerSourceDto: PostPowerSourceDto = {
      name: (this.powerSourceForm.get('name')?.value as string).trim(),
      locationId: (this.powerSourceForm.get('lgaId')?.value as string).trim(),
      latitude: (this.powerSourceForm.get('latitude')?.value as number),
      longitude: (this.powerSourceForm.get('longitude')?.value as number),
      address: (this.powerSourceForm.get('address')?.value as string),
    }

    this.powerSourceService.postPowerSource(postPowerSourceDto).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Power Station creation successful'];
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
          'An Error occured while creating power station.',
        ];
      }
    );
  }

  updatePowerSource(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const updatePowerSourceDto: UpdatePowerSourceDto = {
      name: (this.powerSourceForm.get('name')?.value as string).trim(),
      locationId: (this.powerSourceForm.get('lgaId')?.value as string).trim(),
      latitude: (this.powerSourceForm.get('latitude')?.value as number),
      longitude: (this.powerSourceForm.get('longitude')?.value as number),
      address: (this.powerSourceForm.get('address')?.value as string),
      id: this.powerSourceForUpdate.id
    };

    this.powerSourceService.updatePowerSource(updatePowerSourceDto).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Power station update successful'];
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
          'An Error occured while updating power station.',
        ];
      }
    );
  }

}
