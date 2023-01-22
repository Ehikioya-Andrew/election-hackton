import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbCalendarRange, NbDateService, NbDialogRef, NbDialogService } from '@nebular/theme';
import { forkJoin, merge, Observable, of } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { GeneratingSetsService } from 'src/app/@core/data-services/generating-set.service';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { PowerSourceService } from 'src/app/@core/data-services/power-source.service';
import { ListDto } from 'src/app/@core/dtos/list.dto';
import { ResponseDto } from 'src/app/@core/dtos/response-dto';
import { AssetTypeEnum, AssetTypeName } from 'src/app/@core/enums/asset-type.enum';
import { ReportGroupMap } from 'src/app/@core/enums/report-type-enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reporting-config-form',
  templateUrl: './reporting-config-form.component.html',
  styleUrls: ['./reporting-config-form.component.scss'],
  providers: [UntypedFormBuilder]
})
export class ReportingConfigFormComponent implements OnInit, OnDestroy {

  reportingForm!: UntypedFormGroup;
  isLoading = false;
  redirectDelay = 0;
  range: NbCalendarRange<Date>;
  assetName!: string;
  // assetMap!: Map<AssetTypeEnum, any>;

  assetTypeName = Array.from(AssetTypeName);
  assetTypeSelected: any;
  reportGroup: any;

  @Input()
  assetType!: AssetTypeEnum;

  @Output()
  showTableData = new EventEmitter<any>();

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
    public dialogRef: NbDialogRef<ReportingConfigFormComponent>,
    private formBuilder: UntypedFormBuilder,
    protected dateService: NbDateService<Date>,
    private loadpointService: LoadPointService,
    private genSetService: GeneratingSetsService,
    private powerSourceService: PowerSourceService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    protected router: Router,
  ) {
    this.range = {
      start: this.monthStart,
      end: this.currentDate,
    };
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    const hasQueryParamDate = params.startDate && params.endDate;
    const hasStartDate = params.startDate;

    const hasEndDate = params.endDate;
    const hasLocation = params.locationName && params.locationId;
    const hasAssetType = params.assetType;

    this.reportingForm = this.formBuilder.group({
      startDate: [hasStartDate? new Date(params?.startDate): this.range.start, Validators.required],
      endDate: [hasEndDate? new Date(params.endDate): this.range.end, Validators.required],
      assetType: [this.assetTypeName[params?.assetType]?.[0], Validators.required],
      reportType: [''],
      location: [params?.locationName],
      locationId: [params?.locationId]
    })
    this.reportingForm.get('location')?.valueChanges.pipe(takeWhile(() => this.isLive)).subscribe((data) => {
      this.filteredOptions$ = this.getFilteredOptions(data);
    });

    if (hasLocation) {
      this.reportingForm.get('location')?.disable();
    }
    if (hasAssetType) {
      this.reportGroup = Array.from(ReportGroupMap.get(this.reportingForm.get('assetType')?.value))
      this.assetType = (this.reportingForm.get('assetType')?.value);
      this.filteredOptions$ = this.callService();
    }
    this.filteredOptions$ = this.callService();
  }
  onSelectAssetType() {
    this.reportGroup = Array.from(ReportGroupMap.get(this.reportingForm.get('assetType')?.value))
    this.assetType = (this.reportingForm.get('assetType')?.value);
    this.reportingForm.get('locationId')?.setValue(undefined);
    this.reportingForm.get('location')?.setValue('');
    this.reportingForm.get('location')?.enable();
  }
  getFilteredOptions(value: string) {
    return merge(
      of(this.options).pipe(
        map(arr => {
          return arr.filter(d => (d.name.includes(value) || d.meter?.includes(value)))
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

  loadTable() {
    this.showTableData.emit();
    this.dialogRef.close({
      // date: this.reportingForm.get('dateRange')?.value,
      startDate: this.reportingForm.get('startDate')?.value,
      endDate: this.reportingForm.get('endDate')?.value,
      locationId: this.reportingForm.get('locationId')?.value,
      locationName: this.reportingForm.get('location')?.value,
      assetType: this.reportingForm.get('assetType')?.value,
      reportType: this.reportingForm.get('reportType')?.value,
    });
  }

  onChange($event: any) {
    this.filteredOptions$ = this.getFilteredOptions($event);

  }

  onSelectionChange(option: any) {
    this.reportingForm.get('locationId')?.setValue(option.id);
    this.reportingForm.get('location')?.disable();
  }

  clearLocationSelection() {
    this.reportingForm.get('locationId')?.setValue(undefined);
    this.reportingForm.get('location')?.setValue('');
    this.reportingForm.get('location')?.enable();
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }

  private callService(data?: any) {
    switch (this.assetType) {
      case AssetTypeEnum.LOADPOINT:
        return this.loadpointService.getLoadPoints(data).pipe(map(d => {
          const response = d.data?.itemList ?? [];
          this.options = GetUniqueArray(response, this.options)
          return response
        }));
      case AssetTypeEnum.GEN_SET:
        return this.genSetService.getGeneratingSets(data).pipe(map(d => {
          const response = d.data?.itemList ?? [];
          this.options = GetUniqueArray(response, this.options)
          return response
        }));
      case AssetTypeEnum.POWER_SOURCE:
        return this.powerSourceService.getPowerSource(data).pipe(map(d => {
          const response = d.data?.itemList ?? [];
          this.options = GetUniqueArray(response, this.options)
          return response
        }));
      case AssetTypeEnum.OUTAGE:
        return this.powerSourceService.getPowerSource(data).pipe(map(d => {
          const response = d.data?.itemList ?? [];
          this.options = GetUniqueArray(response, this.options)
          return response
        }));
    }
  }


}
