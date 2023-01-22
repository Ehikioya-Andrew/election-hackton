import { environment } from './../../../environments/environment';
import { takeWhile } from 'rxjs/operators';
import { OccService } from './../../@core/data-services/occ.service';
import { SecureLocalStorageService } from './../../@core/utils/secure-local-storage.service';
import { AuditService } from './../../@core/data-services/audit.services';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageKey } from 'src/app/@core/enums/local-storage-key.enum';
import {  interval } from 'rxjs';

@Component({
  selector: 'app-occ',
  templateUrl: './occ.component.html',
  styleUrls: ['./occ.component.scss'],
})
export class OccComponent implements OnInit, OnDestroy {
  isLive = true;
  nunberCount!: number;
  startDate!: Date;
  endate!: Date;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auditService: AuditService,
    private storageService: SecureLocalStorageService,
    private occService: OccService
  ) {}

  ngOnInit(): void {
    this.getHourRange();
    if (this.route.snapshot.queryParams['logout']) {
      this.handLogOut();
    }
  }

  async handLogOut() {
    this.auditService.postLogout().subscribe();
    this.storageService.remove(LocalStorageKey.JWT.toString());
    this.router.navigateByUrl('/');
  }

  getHourRange() {
    const { nosOfHours, nosOfDays, nosOfWeeks, nosOfMonths } =
      this.route.snapshot.queryParams;
    const count = nosOfHours ?? nosOfDays ?? nosOfWeeks ?? nosOfMonths;

    interval(environment.refreshInterval)
      .pipe(takeWhile(() => this.isLive))
      .subscribe(() => {
        const endDate = new Date();

        const defaultStartDate = new Date(
          new Date().setHours(
            new Date().getHours() - environment.occDefaultNoOfDays
          )
        );
        if (nosOfHours) {
          const currentDate = new Date();
          this.startDate = new Date(
            currentDate.setHours(currentDate.getHours() - count)
          );
        }
        if (nosOfDays) {
          const currentDate = new Date();
          this.startDate = new Date(
            currentDate.setDate(currentDate.getDate() - count)
          );
        }
        if (nosOfWeeks) {
          const currentDate = new Date();
          this.startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - 7 * count
          );
        }
        if (nosOfMonths) {
          const currentDate = new Date();
          this.startDate = new Date(
            currentDate.setMonth(currentDate.getMonth() - count)
          );
        }
        const dateRange = {
          startDate:
            this.startDate?.toISOString() ?? defaultStartDate.toISOString(),
          endDate: endDate.toISOString(),
        };
        this.occService.setDateRange(dateRange);
      });
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
