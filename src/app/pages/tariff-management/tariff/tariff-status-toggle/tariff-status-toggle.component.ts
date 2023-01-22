import { switchMap } from 'rxjs/operators';
import { UserModel } from './../../../../@core/models/user.model';
import { PermissionService } from './../../../../@core/utils/permission.service';
import { NbAccessChecker } from '@nebular/security';
import { OnlineStatService } from './../../../../@core/utils/online-stat.service';
import { TariffService } from './../../../../@core/data-services/tariff.service';
import { TariffResources } from './../tariff-resources';
import { TariffDto } from './../../../../@core/dtos/tariff.dto';
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
  selector: 'app-tariff-status-toggle',
  templateUrl: './tariff-status-toggle.component.html',
  styleUrls: ['./tariff-status-toggle.component.scss'],
})
export class TariffStatusToggleComponent implements OnInit {
  @Input() value!: string | number;
  @Input() rowData!: TariffDto;

  checked = true;
  isSubmitted = false;

  renderValue!: string;
  renderStatus = 'primary';

  tariffResources = TariffResources;
  isSameClient = false;

  constructor(
    private dialogService: NbDialogService,
    public tariffService: TariffService,
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
          title: `${state ? 'Enable' : 'Disable'} Tariff`,
        },
      }).onClose
    );

    if (confirmed) {
      of(state)
        .pipe(
          switchMap((state) => {
            if (state) {
              return this.tariffService.enableTariff(this.rowData.id);
            }
            return this.tariffService.disableTariff(this.rowData.id);
          })
        )
        .subscribe(
          (response) => {
            if (response.status) {
              this.toastr.success('Status update successful', 'Tariff', {
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
              });
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
        'Tariff Update',
        { position: NbGlobalPhysicalPosition.BOTTOM_RIGHT, duration: 3000 }
      );
    }
  }
}
