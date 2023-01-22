import { PowerSourceService } from './../../../../@core/data-services/power-source.service';
import { PowerSourceDto } from './../../../../@core/dtos/power-source.dto';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { isLatitude, isLongitude } from 'class-validator';
import { Observable, of } from 'rxjs';
import { debounce, map, takeWhile } from 'rxjs/operators';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { LocationService } from 'src/app/@core/data-services/location.service';
import { MeterService } from 'src/app/@core/data-services/meter.service';
import { LoadPointDto } from 'src/app/@core/dtos/load-point.dto';
import { LocationDto } from 'src/app/@core/dtos/location.dto';
import { PostLoadPointDto } from 'src/app/@core/dtos/post-load-point.dto';
import { ResponseDto } from 'src/app/@core/dtos/response-dto';
import { UpdateLoadPointDto } from 'src/app/@core/dtos/update-load-point.dto';
import { LoadPointResources } from '../load-point-resources';

@Component({
  selector: 'app-load-point-form',
  templateUrl: './load-point-form.component.html',
  styleUrls: ['./load-point-form.component.scss'],
  providers: [UntypedFormBuilder]
})
export class LoadPointFormComponent implements OnInit {

  @Input()
  isCreateRequest = true;

  @Input()
  loadPointForUpdate!: LoadPointDto;

  powerStation$!: Observable<PowerSourceDto[]>;

  errors: string[] = [];
  messages: string[] = [];
  submitted = false;

  loadPointForm!: UntypedFormGroup

  loadPointResources = LoadPointResources;
  isLive = true;

  countries$: Observable<LocationDto[]>
  states$: Observable<LocationDto[]>
  areas$: Observable<LocationDto[]>

  constructor(
    public dialogRef: NbDialogRef<LoadPointFormComponent>,
    private formBuilder: UntypedFormBuilder,
    private loadPointService: LoadPointService,
    private meterService: MeterService,
    private locationService: LocationService,
    private powerSourceService: PowerSourceService
  ) {
    this.countries$ = locationService.getCountries().pipe(map((r) => r.data as LocationDto[]));
    this.states$ = of([]);
    this.areas$ = of([]);
    this.powerStation$ = this.powerSourceService.getPowerSource().pipe(map(d => d.data?.itemList as PowerSourceDto[]));
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
    this.loadPointForm = this.formBuilder.group({
      name: ['', Validators.required],
      countryId: [null, Validators.required],
      stateId: [null, Validators.required],
      lgaId: [null, Validators.required],
      meterId: [null, Validators.required],
      powerStation: [null, Validators.required],
      meterNumber: [null,
        [
          Validators.required
        ],
        this.validateMeterAvailability.bind(this)
      ],
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
    console.log(this.loadPointForUpdate.powerSourceId)
    this.loadPointForm = this.formBuilder.group({
      name: [this.loadPointForUpdate.name, Validators.required],
      countryId: [this.loadPointForUpdate.countryId, Validators.required],
      stateId: [this.loadPointForUpdate.stateId, Validators.required],
      lgaId: [this.loadPointForUpdate.lgaId, Validators.required],
      meterId: [this.loadPointForUpdate.meterId, Validators.required],
      powerStation: [this.loadPointForUpdate.powerSourceId, Validators.required],
      meterNumber: [
        this.loadPointForUpdate.meter,
        [
          Validators.required
        ],
        this.validateMeterAvailability.bind(this)
      ],
      latitude: [this.loadPointForUpdate.latitude, [
        Validators.required,
        this.validateLatitude.bind(this)]],
      longitude: [this.loadPointForUpdate.longitude, [
        Validators.required,
        this.validateLongitude.bind(this)]],
      address: [this.loadPointForUpdate.address, Validators.required],
    });

    this.states$ = this.locationService.getStates({ countryId: this.loadPointForUpdate.countryId }).pipe(map((r) => r.data as LocationDto[]));
    this.areas$ = this.locationService.getAreas({ stateId: this.loadPointForUpdate.stateId }).pipe(map((r) => r.data as LocationDto[]));
  }

  validateMeterAvailability(input: UntypedFormControl) {
    const value = (input.value as string)?.trim();
    if (!value) {
      return of(undefined);
    }
    if (!this.isCreateRequest) {
      if (value === this.loadPointForUpdate.meter) {
        this.loadPointForm.get('meterId')?.setValue(this.loadPointForUpdate.meterId);
        return of(undefined);
      }
    }
    return this.meterService.getUnassignedMeter(value)
      .pipe(
        map(m => {
          if (m.data) {
            this.loadPointForm.get('meterId')?.setValue(m.data.id);
            return;
          } else {
            if (m.message?.includes(' not exist')) {
              return { meterUnavailable: `Meter ${value} does not exist` }
            }
            return { meterUnavailable: `Meter ${value} is already assigned to a loadpoint` }
          }
        })
      )
  }

  trackRetrievedOptions() {
    this.loadPointForm.get('countryId')?.valueChanges
      .pipe(takeWhile(() => this.isLive))
      .subscribe(
        (val) => {
          this.loadPointForm.get('stateId')?.setValue(undefined);
          this.states$ = this.locationService.getStates({ countryId: val }).pipe(map((r) => r.data as LocationDto[]));
        }
      );
    this.loadPointForm.get('stateId')?.valueChanges
      .pipe(takeWhile(() => this.isLive))
      .subscribe(
        (val) => {
          this.loadPointForm.get('lgaId')?.setValue(undefined);
          this.areas$ = this.locationService.getAreas({ stateId: val }).pipe(map((r) => r.data as LocationDto[]));
        }
      );
  }

  saveLoadPoint(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const postLoadPointDto: PostLoadPointDto = {
      name: (this.loadPointForm.get('name')?.value as string).trim(),
      locationId: (this.loadPointForm.get('lgaId')?.value as string).trim(),
      meterId: (this.loadPointForm.get('meterId')?.value as string).trim(),
      latitude: (this.loadPointForm.get('latitude')?.value as number),
      longitude: (this.loadPointForm.get('longitude')?.value as number),
      address: (this.loadPointForm.get('address')?.value as string).trim(),
      powerStationId: (this.loadPointForm.get('powerStation')?.value as string).trim(),
    }

    this.loadPointService.postLoadPoint(postLoadPointDto).subscribe(
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
          'An Error occured while creating load point.',
        ];
      }
    );
  }

  updateLoadPoint(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    const updateLoadPointDto: UpdateLoadPointDto = {
      name: (this.loadPointForm.get('name')?.value as string).trim(),
      locationId: (this.loadPointForm.get('lgaId')?.value as string).trim(),
      meterId: (this.loadPointForm.get('meterId')?.value as string).trim(),
      latitude: (this.loadPointForm.get('latitude')?.value as number),
      longitude: (this.loadPointForm.get('longitude')?.value as number),
      address: (this.loadPointForm.get('address')?.value as string).trim(),
      powerStationId: (this.loadPointForm.get('powerStation')?.value as string).trim(),
      id: this.loadPointForUpdate.id
    };

    this.loadPointService.updateLoadPoint(updateLoadPointDto).subscribe(
      (result) => {
        this.submitted = false;
        if (result.status) {
          this.messages = ['Load Point update successful'];
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
          'An Error occured while updating load point.',
        ];
      }
    );
  }

}
