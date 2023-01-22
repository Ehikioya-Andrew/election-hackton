import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NbAccessChecker } from '@nebular/security';
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from '@nebular/theme';
import { ViewCell } from 'ng2-smart-table';
import { lastValueFrom, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/@core/data-services/user.service';
import { UserDto } from 'src/app/@core/dtos/user.dto';
import { OnlineStatService } from 'src/app/@core/utils/online-stat.service';
import { PermissionService } from 'src/app/@core/utils/permission.service';
import { ConfirmationDialogComponent } from 'src/app/@theme/components/confirmation-dialog/confirmation-dialog.component';
import { UsersResources } from '../../users-resources';

@Component({
  selector: 'app-user-status-toggle',
  templateUrl: './user-status-toggle.component.html',
  styleUrls: ['./user-status-toggle.component.scss'],
})
export class UserStatusToggleComponent implements ViewCell, OnInit {
  checked = true;
  isSubmitted = false;

  renderValue!: string;
  renderStatus = 'primary';

  @Input() value!: string | number;
  @Input() rowData!: UserDto;

  usersResources = UsersResources;
  canUpdateRow = false;

  constructor(
    private dialogService: NbDialogService,
    public userService: UserService,
    public onlineStat: OnlineStatService,
    private cd: ChangeDetectorRef,
    private toastr: NbToastrService,
    public accessChecker: NbAccessChecker,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.checked = this.value === 'Active' ? true : false;
    this.canUpdateRow = this.permissionService.canAccessByResource(
      'update',
      'users:update-' + this.rowData.ssoRole.toLowerCase()
    );
  }

  async onStatusChange(state: boolean) {
    this.isSubmitted = true;
    this.cd.detectChanges();
    const confirmed = await lastValueFrom(
      this.dialogService.open(ConfirmationDialogComponent, {
        context: {
          context: `Are you sure you wish to proceed?`,
          title: `${state ? 'Enable' : 'Disable'} User`,
        },
      }).onClose
    );

    if (confirmed) {
      of(state)
        .pipe(
          switchMap((state) => {
            if (state) {
              return this.userService.enableUser(this.rowData.id);
            }
            return this.userService.disableUser(this.rowData.id);
          })
        )
        .subscribe(
          (response) => {
            if (response.status) {
              this.toastr.success('Status update successful', 'User Update', {
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
        'User Update',
        { position: NbGlobalPhysicalPosition.BOTTOM_RIGHT, duration: 3000 }
      );
    }
  }
}
