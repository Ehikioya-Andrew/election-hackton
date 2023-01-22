import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { NbCalendarRange, NbDateService, NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-executive-summary-config',
  templateUrl: './executive-summary-config.component.html',
  styleUrls: ['./executive-summary-config.component.scss'],
  providers: [UntypedFormBuilder],
})
export class ExecutiveSummaryConfigComponent implements OnInit {
  executiveSummaryConfigForm!: UntypedFormGroup;
  isLoading = false;
  range!: NbCalendarRange<Date>;

 @Input() selectedStartDate!: string
 @Input() selectedEndDate!: string

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }
  get curentDate(): Date {
    return this.dateService.today();
  }

  constructor(
    public dialogRef: NbDialogRef<ExecutiveSummaryConfigComponent>,
    private formBuilder: UntypedFormBuilder,
    protected dateService: NbDateService<Date>
  ) {
    this.range = {
      start: this.monthStart,
      end: this.curentDate,
    };
  }

  ngOnInit(): void {
    this.executiveSummaryConfigForm = this.formBuilder.group({
      startDate: [this.selectedStartDate? new Date(this.selectedStartDate): this.range.start, Validators.required],
      endDate: [this.selectedEndDate? new Date(this.selectedEndDate): this.range.end, Validators.required],
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }

  loadChart(): void {
    this.dialogRef.close({
      startDate: new Date(
        this.executiveSummaryConfigForm.get('startDate')?.value
      ),
      endDate: new Date(
        this.executiveSummaryConfigForm.get('endDate')?.value
      ),
    });
  }
}
