import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbCalendarRange, NbDateService, NbDialogRef, NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { ListDto } from 'src/app/@core/dtos/list.dto';
import { ResponseDto } from 'src/app/@core/dtos/response-dto';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-audit-config-form',
  templateUrl: './audit-config-form.component.html',
  styleUrls: ['./audit-config-form.component.scss'],
  providers: [UntypedFormBuilder]
})
export class AuditConfigFormComponent implements OnInit, OnDestroy {

  auditForm!: UntypedFormGroup;
  isLoading = false;
  redirectDelay = 0;
  range: NbCalendarRange<Date>;

  @Output()
  showConfigData = new EventEmitter<any>();

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }
  get currentDate(): Date {
    return this.dateService.today();
  }


  isLive = true;

  dataSource!: (data?: any) => Observable<ResponseDto<ListDto<any>>>;

  constructor(
    public dialogRef: NbDialogRef<AuditConfigFormComponent>,
    private formBuilder: UntypedFormBuilder,
    protected dateService: NbDateService<Date>,
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

    this.auditForm = this.formBuilder.group({
      dateRange: [hasQueryParamDate ? {
        start: new Date(params.startDate), end: new Date(params.endDate)
      } : this.range, Validators.required],
    })

  }
  close(): void {
    this.dialogRef.close(false);
  }

  loadTable() {
    this.showConfigData.emit();
    this.dialogRef.close({
      date: this.auditForm.get('dateRange')?.value,
    });
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }


}
