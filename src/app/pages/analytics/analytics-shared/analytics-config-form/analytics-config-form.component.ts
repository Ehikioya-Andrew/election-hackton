import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbCalendarRange, NbDateService, NbDialogRef } from '@nebular/theme';
import { concat, forkJoin, merge, Observable, of } from 'rxjs';
import { filter, map, takeWhile } from 'rxjs/operators';
import { GeneratingSetsService } from 'src/app/@core/data-services/generating-set.service';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { PowerSourceService } from 'src/app/@core/data-services/power-source.service';
import { ListDto } from 'src/app/@core/dtos/list.dto';
import { ResponseDto } from 'src/app/@core/dtos/response-dto';
import { AssetTypeEnum } from 'src/app/@core/enums/asset-type.enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';

@Component({
  selector: 'app-analytics-config-form',
  templateUrl: './analytics-config-form.component.html',
  styleUrls: ['./analytics-config-form.component.scss'],
  providers: [UntypedFormBuilder],
})
export class AnalyticsConfigFormComponent implements OnInit, OnDestroy {
  analyticsForm!: UntypedFormGroup;
  isLoading = false;

  startDate: Date;
  endDate: Date;
  assetMap!: Map<AssetTypeEnum, any>;

  @Input()
  assetType!: AssetTypeEnum;
  @Input()
  forecastAssetTypeValue!: number;

  @Input()
  isSummary!: boolean;

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }
  get currentDate(): Date {
    return this.dateService.today();
  }

  filteredOptions$: Observable<any[]> = of([]);
  options: any[] = [];

  isLive = true;

  dataSource!: (data?: any) => Observable<ResponseDto<ListDto<any>>>;

  constructor(
    public dialogRef: NbDialogRef<AnalyticsConfigFormComponent>,
    private formBuilder: UntypedFormBuilder,
    protected dateService: NbDateService<Date>,
    private loadpointService: LoadPointService,
    private genSetService: GeneratingSetsService,
    private powerSourceService: PowerSourceService,
    private route: ActivatedRoute
  ) {
    // this.range = {
    //   start: this.monthStart,
    //   end: this.monthEnd,
    // };

    this.startDate = this.monthStart;
    this.endDate = this.currentDate;
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    const hasQueryParamDate = params.startDate && params.endDate;
    const hasLocation = params.locationName && params.locationId;
    let assetTypeNameString =
      params.assetTypeNameString && params.assetTypeName;

    this.analyticsForm = this.formBuilder.group({
      startDate: [
        hasQueryParamDate ? new Date(params.startDate) : this.startDate,
        Validators.required,
      ],
      endDate: [
        hasQueryParamDate ? new Date(params.endDate) : this.endDate,
        Validators.required,
      ],
      location: [params?.locationName],
      locationId: [
        params?.locationId,
        !this.isSummary ? Validators.required : undefined,
      ],
    });
    this.analyticsForm
      .get('location')
      ?.valueChanges.pipe(takeWhile(() => this.isLive))
      .subscribe((data) => {
        this.filteredOptions$ = this.getFilteredOptions(data);
      });

    if (hasLocation) {
      this.analyticsForm.get('location')?.disable();
    }

    this.filteredOptions$ = this.callService();
  }

  getFilteredOptions(value: string) {
    console.log(this.options);
    return merge(
      of(this.options).pipe(
        map((arr) => {
          console.log(arr);
          return arr.filter(
            (d) => d?.name?.includes(value) || d?.meter?.includes(value)
          );
        })
      ),
      forkJoin([
        this.callService({ name: (value ?? '').toLowerCase() }),
        this.callService({ meterNumber: (value ?? '').toLowerCase() }),
      ]).pipe(map((data: any) => GetUniqueArray(data[0], data[1])))
    );
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close({
      startDate: new Date(
        this.analyticsForm.get('startDate')?.value
      ).toISOString(),
      endDate: new Date(this.analyticsForm.get('endDate')?.value).toISOString(),
      locationId: this.analyticsForm.get('locationId')?.value,
      locationName: this.analyticsForm.get('location')?.value,
      forecastAssetTypeValue: this.forecastAssetTypeValue,
    });
  }

  onChange($event: any) {
    console.log($event);
    this.filteredOptions$ = this.getFilteredOptions($event);
  }

  onSelectionChange(option: any) {
    this.analyticsForm.get('locationId')?.setValue(option.id);
    this.analyticsForm.get('location')?.disable();
  }

  clearLocationSelection() {
    this.analyticsForm.get('locationId')?.setValue(undefined);
    this.analyticsForm.get('location')?.setValue('');
    this.analyticsForm.get('location')?.enable();
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }

  private callService(data?: any) {
    switch (this.assetType) {
      case AssetTypeEnum.LOADPOINT:
        return this.loadpointService.getLoadPoints(data).pipe(
          map((d) => {
            const response = d.data?.itemList ?? [];
            this.options = GetUniqueArray(response, this.options);
            return response;
          })
        );
      case AssetTypeEnum.GEN_SET:
        return this.genSetService.getGeneratingSets(data).pipe(
          map((d) => {
            const response = d.data?.itemList ?? [];
            this.options = GetUniqueArray(response, this.options);
            return response;
          })
        );
      case AssetTypeEnum.POWER_SOURCE:
        return this.powerSourceService.getPowerSource(data).pipe(
          map((d) => {
            const response = d.data?.itemList ?? [];
            this.options = GetUniqueArray(response, this.options);
            return response;
          })
        );
      case AssetTypeEnum.OUTAGE:
        return this.powerSourceService.getPowerSource(data).pipe(
          map((d) => {
            const response = d.data?.itemList ?? [];
            this.options = GetUniqueArray(response, this.options);
            return response;
          })
        );
    }
  }
}
