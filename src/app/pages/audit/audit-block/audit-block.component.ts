import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { NbDateService, NbDialogService } from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { lastValueFrom } from 'rxjs';
import { filter, takeWhile } from 'rxjs/operators';
import { XlsxService } from 'src/app/@core/utils/xlsx.service';
import { AuditConfigFormComponent } from '../audit-config-form/audit-config-form.component';

@Component({
  selector: 'app-audit-block',
  templateUrl: './audit-block.component.html',
  styleUrls: ['./audit-block.component.scss'],
  providers: [UntypedFormBuilder],
})
export class AuditBlockComponent implements OnDestroy {
  // Outputs
  @Output()
  optionSelected: EventEmitter<any> = new EventEmitter();
  @Output()
  auditDownloadCSV: EventEmitter<any> = new EventEmitter();
  @Output()
  auditDownloadPDF: EventEmitter<any> = new EventEmitter();

  @Input()
  isDownloading = false;

  startDate!: string;
  endDate!: string;

  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };
  isSummary!: boolean;
  isLive = true;

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }
  get currentDate(): Date {
    return this.dateService.today();
  }

  constructor(
    private dialogService: NbDialogService,
    private route: ActivatedRoute,
    private router: Router,
    protected dateService: NbDateService<Date>,
    private xlsxService: XlsxService
  ) {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeWhile(() => this.isLive)
      )
      .subscribe((e) => {
        this.startDate =
          this.route.snapshot.queryParams.startDate ?? this.monthStart;
        this.endDate = this.route.snapshot.queryParams.endDate ?? this.currentDate;
      });
  }

  ngOnDestroy() {
    this.isLive = false;
  }
  async generateReportCSV() {
    this.auditDownloadCSV.emit();
  }
  async generateReportPDF() {
    this.auditDownloadPDF.emit();
  }

  async configureForm() {
    const config = await lastValueFrom(
      this.dialogService.open(AuditConfigFormComponent, {
        closeOnBackdropClick: true,
        hasScroll: true,
        closeOnEsc: true,
      }).onClose
    );
    if (config) {
      const { date } = config;
      this.startDate = (date.start as Date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      this.endDate = (date.end as Date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const queryParams: Params = {
        startDate: this.startDate,
        endDate: this.endDate,
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });
      this.optionSelected.next(queryParams);
    }
  }
}
