import { switchMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/@theme/components/confirmation-dialog/confirmation-dialog.component';
import { UserModel } from 'src/app/@core/models/user.model';
import { PermissionService } from 'src/app/@core/utils/permission.service';
import { NbAccessChecker } from '@nebular/security';
import { OnlineStatService } from 'src/app/@core/utils/online-stat.service';
import { PowerSourceService } from './../../../../@core/data-services/power-source.service';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import {
  NbDialogService,
  NbToastrService,
  NbGlobalPhysicalPosition,
} from '@nebular/theme';
import { PowerSourceDto } from 'src/app/@core/dtos/power-source.dto';
import { PowerSourceResources } from '../power-source-resources';
import { TokenService } from 'src/app/@core/utils/token.service';
import { lastValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-power-source-status-toggle',
  templateUrl: './power-source-status-toggle.component.html',
  styleUrls: ['./power-source-status-toggle.component.scss'],
})
export class PowerSourceStatusToggleComponent implements OnInit {
  checked = true;
  isSubmitted = false;

  renderValue!: string;
  renderStatus = 'primary';

  @Input() value!: string | number;
  @Input() rowData!: PowerSourceDto;

  powerSourceResources = PowerSourceResources;
  isSameClient = false;

  constructor(
    private dialogService: NbDialogService,
    public powerSourceService: PowerSourceService,
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
          title: `${state ? 'Enable' : 'Disable'} Power Station`,
        },
      }).onClose
    );

    if (confirmed) {
      of(state)
        .pipe(
          switchMap((state) => {
            if (state) {
              return this.powerSourceService.enablePowerSource(this.rowData.id);
            }
            return this.powerSourceService.disablePowerSource(this.rowData.id);
          })
        )
        .subscribe(
          (response) => {
            if (response.status) {
              this.toastr.success(
                'Status update successful',
                'Power Station Update',
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
        'Power Station Update',
        { position: NbGlobalPhysicalPosition.BOTTOM_RIGHT, duration: 3000 }
      );
    }
  }
}
