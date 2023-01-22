import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NbAccessChecker } from '@nebular/security';
import {
  NbDialogService,
  NbToastrService,
  NbGlobalPhysicalPosition,
} from '@nebular/theme';
import { lastValueFrom, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { LoadPointDto } from 'src/app/@core/dtos/load-point.dto';
import { UserModel } from 'src/app/@core/models/user.model';
import { OnlineStatService } from 'src/app/@core/utils/online-stat.service';
import { PermissionService } from 'src/app/@core/utils/permission.service';
import { TokenService } from 'src/app/@core/utils/token.service';
import { ConfirmationDialogComponent } from 'src/app/@theme/components/confirmation-dialog/confirmation-dialog.component';
import { LoadPointResources } from '../load-point-resources';

@Component({
  selector: 'app-load-point-status-toggle',
  templateUrl: './load-point-status-toggle.component.html',
  styleUrls: ['./load-point-status-toggle.component.scss'],
})
export class LoadPointStatusToggleComponent implements OnInit {
  checked = true;
  isSubmitted = false;

  renderValue!: string;
  renderStatus = 'primary';

  @Input() value!: string | number;
  @Input() rowData!: LoadPointDto;

  loadPointResources = LoadPointResources;
  isSameClient = false;

  constructor(
    private dialogService: NbDialogService,
    public loadPointService: LoadPointService,
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
          title: `${state ? 'Enable' : 'Disable'} Load Point`,
        },
      }).onClose
    );

    if (confirmed) {
      of(state)
        .pipe(
          switchMap((state) => {
            if (state) {
              return this.loadPointService.enableLoadPoint(this.rowData.id);
            }
            return this.loadPointService.disableLoadPoint(this.rowData.id);
          })
        )
        .subscribe(
          (response) => {
            if (response.status) {
              this.toastr.success(
                'Status update successful',
                'Load Point Update',
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
        'Load Point Update',
        { position: NbGlobalPhysicalPosition.BOTTOM_RIGHT, duration: 3000 }
      );
    }
  }
}
