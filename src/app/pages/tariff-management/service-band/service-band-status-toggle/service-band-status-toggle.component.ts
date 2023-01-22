import { switchMap } from 'rxjs/operators';
import { UserModel } from './../../../../@core/models/user.model';
import { PermissionService } from './../../../../@core/utils/permission.service';
import { NbAccessChecker } from '@nebular/security';
import { OnlineStatService } from './../../../../@core/utils/online-stat.service';
import { ServiceBandService } from 'src/app/@core/data-services/service-band.service';
import { ServiceBandResources } from './../service-band-resources';
import { ServiceBandDto } from './../../../../@core/dtos/service-band.dto';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from '@nebular/theme';
import { TokenService } from 'src/app/@core/utils/token.service';
import { ConfirmationDialogComponent } from 'src/app/@theme/components/confirmation-dialog/confirmation-dialog.component';
import { lastValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-service-band-status-toggle',
  templateUrl: './service-band-status-toggle.component.html',
  styleUrls: ['./service-band-status-toggle.component.scss'],
})
export class ServiceBandStatusToggleComponent implements OnInit {
  @Input() value!: string | number;
  @Input() rowData!: ServiceBandDto;

  checked = true;
  isSubmitted = false;

  renderValue!: string;
  renderStatus = 'primary';

  serviceBandResources = ServiceBandResources;
  isSameClient = false;

  constructor(
    private dialogService: NbDialogService,
    public serviceBandService: ServiceBandService,
    public onlineStat: OnlineStatService,
    private cd: ChangeDetectorRef,
    private toastr: NbToastrService,
    public accessChecker: NbAccessChecker,
    private tokenService: TokenService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.checked = this.value === 'Active' ? true : false;
    const userModel: UserModel = JSON.parse(this.tokenService.getPayload().sub);
    this.isSameClient = this.rowData.clientId === userModel.clientId;
  }

  async onStatusChange(state: boolean) {
    this.isSubmitted = true;
    this.cd.detectChanges();
    const confirmed = await lastValueFrom(
      this.dialogService.open(ConfirmationDialogComponent, {
        context: {
          context: `Are you sure you wish to proceed?`,
          title: `${state ? 'Enable' : 'Disable'} Service Band`,
        },
      }).onClose
    );

    if (confirmed) {
      of(state)
        .pipe(
          switchMap((state) => {
            if (state) {
              return this.serviceBandService.enableServiceBand(this.rowData.id);
            }
            return this.serviceBandService.disableServiceBand(this.rowData.id);
          })
        )
        .subscribe(
          (response) => {
            if (response.status) {
              this.toastr.success(
                'Status update successful',
                'Service Band Update',
                { position: NbGlobalPhysicalPosition.BOTTOM_RIGHT }
              );
              this.isSubmitted = false;
              this.checked = state;
              this.cd.detectChanges();
            } else {
              this.errorResponse(state, true, response.message);
            }
          },
          (error) => {
            this.errorResponse(state);
          }
        );
    } else {
      this.errorResponse(state, false);
    }
  }

  errorResponse(state: boolean, showToaster = true, message?: string) {
    this.isSubmitted = false;
    this.checked = !state;
    this.cd.detectChanges();
    if (showToaster) {
      this.toastr.danger(
        `${message ? message : 'An error occured during execution'}`,
        'Service Band Update',
        { position: NbGlobalPhysicalPosition.BOTTOM_RIGHT, duration: 3000 }
      );
    }
  }
}
