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
import { AssetTypeEnum, AssetTypeEnumOutage, AssetTypeNameOutage } from 'src/app/@core/enums/asset-type.enum';
import { ReportGroupMap } from 'src/app/@core/enums/report-type-enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-outage-config-form',
  templateUrl: './outage-config-form.component.html',
  styleUrls: ['./outage-config-form.component.scss'],
  providers: [UntypedFormBuilder]
})
export class OutageConfigFormComponent implements OnInit, OnDestroy {

  outageForm!: UntypedFormGroup;
  isLoading = false;
  redirectDelay = 0;
  range: NbCalendarRange<Date>;
  assetName!: string;
  // assetMap!: Map<AssetTypeEnum, any>;

  assetTypeName = Array.from(AssetTypeNameOutage);
  assetTypeSelected: any;
  reportGroup: any;

  assetType!: AssetTypeEnumOutage;

  @Input()
  isSummary!: boolean;

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
    public dialogRef: NbDialogRef<OutageConfigFormComponent>,
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
    const hasLocation = params.locationName && params.locationId;
    const hasAssetType = params.assetType;

    this.outageForm = this.formBuilder.group({
      dateRange: [hasQueryParamDate ? {
        start: new Date(params.startDate), end: new Date(params.endDate)
      } : this.range, Validators.required],
      assetType: [this.assetTypeName[params?.assetType]?.[0], Validators.required],
      location: [params?.locationName],
      locationId: [params?.locationId]
    })
    this.outageForm.get('location')?.valueChanges.pipe(takeWhile(() => this.isLive)).subscribe((data) => {
      this.filteredOptions$ = this.getFilteredOptions(data);
    });

    if (hasLocation) {
      this.outageForm.get('location')?.disable();
    }

    if (hasAssetType) {
      this.assetType = (this.outageForm.get('assetType')?.value);
      this.filteredOptions$ = this.callService();
    }
    this.filteredOptions$ = this.callService();
  }
  onSelectAssetType() {
    this.assetType = (this.outageForm.get('assetType')?.value);
    this.outageForm.get('locationId')?.setValue(undefined);
    this.outageForm.get('location')?.setValue('');
    this.outageForm.get('location')?.enable();
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
      date: this.outageForm.get('dateRange')?.value,
      locationId: this.outageForm.get('locationId')?.value,
      locationName: this.outageForm.get('location')?.value,
      assetType: this.outageForm.get('assetType')?.value,
    });
  }

  onChange(ev: any) {
    this.filteredOptions$ = this.getFilteredOptions(ev);

  }

  onSelectionChange(option: any) {
    this.outageForm.get('locationId')?.setValue(option.id);
    this.outageForm.get('location')?.disable();
  }

  clearLocationSelection() {
    this.assetType =  this.outageForm.get('assetType')?.value,
    this.outageForm.get('locationId')?.setValue(undefined);
    this.outageForm.get('location')?.setValue('');
    this.outageForm.get('location')?.enable();
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }

  private callService(data?: any) {
    switch (this.assetType) {
      case AssetTypeEnumOutage.LOADPOINT:
        return this.loadpointService.getLoadPoints(data).pipe(map(d => {
          const response = d.data?.itemList ?? [];
          this.options = GetUniqueArray(response, this.options)
          return response
        }));
      case AssetTypeEnumOutage.GEN_SET:
        return this.genSetService.getGeneratingSets(data).pipe(map(d => {
          const response = d.data?.itemList ?? [];
          this.options = GetUniqueArray(response, this.options)
          return response
        }));
    }
  }


}
