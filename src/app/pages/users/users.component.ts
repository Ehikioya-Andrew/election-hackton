import { Component, OnInit } from '@angular/core';
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { lastValueFrom } from 'rxjs';
import { ClientService } from 'src/app/@core/data-services/client.service';
import { RoleService } from 'src/app/@core/data-services/role.service';
import { UserService } from 'src/app/@core/data-services/user.service';
import { UserDto } from 'src/app/@core/dtos/user.dto';
import { PermissionEnum } from 'src/app/@core/enums/permission.enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { RoleMap } from 'src/app/@core/maps/role.map';
import { SeoService } from 'src/app/@core/utils';
import { OnlineStatService } from 'src/app/@core/utils/online-stat.service';
import { PermissionService } from 'src/app/@core/utils/permission.service';
import { UserFormComponent } from './user-form/user-form.component';
import { UserStatusToggleComponent } from './user-table-components/user-status-toggle/user-status-toggle.component';
import { UsersResources } from './users-resources';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  usersResources = UsersResources;
  isLoadingData = true;

  users: UserDto[] = [];

  columns = {
    firstName: {
      title: 'First Name',
    },
    lastName: {
      title: 'Last Name',
    },
    email: {
      title: 'Email',
    },
    phone: {
      title: 'Phone Nos',
    },
    roleId: {
      title: 'Function',
      filter: {
        type: 'list',
        config: {
          selectText: 'Loading...',
          list: [],
        },
      },
      valuePrepareFunction: (d: string, r: any) => {
        return r.role;
      },
      filterFunction: (x: string, y: string) => {
        return x.toLowerCase() === y.toLowerCase();
      },
    },
    ssoRole: {
      title: 'Role',
      filter: {
        type: 'list',
        config: {
          selectText: 'Select...',
          list: Array.from(RoleMap.entries())
            .map((x) => ({ value: x[0], title: x[1] }))
            .filter((r) =>
              this.permissionService.canAccessByResource(
                'view',
                UsersResources.ViewAllRoles
              )
                ? true
                : !r.value.includes('vgg')
            ),
        },
      },
      valuePrepareFunction: (d: string) => RoleMap.get(d.toLowerCase()),
    },
    clientId: {
      title: 'Client',
      filter: {
        type: 'list',
        config: {
          selectText: 'Loading...',
          list: [],
        },
      },
      valuePrepareFunction: (d: string, r: any) => {
        return r.client;
      },
      hide: !this.permissionService.canAccessByResource(
        PermissionEnum.View,
        UsersResources.ViewClientColumn
      ),
    },
    status: {
      title: 'Status',
      renderComponent: UserStatusToggleComponent,
      type: 'custom',
      filter: {
        type: 'list',
        config: {
          selectText: 'Select...',
          list: [
            { value: 'Active', title: 'Active' },
            { value: 'InActive', title: 'Inactive' },
          ],
        },
      },
      filterFunction: (x: string, y: string) =>
        x.toLowerCase() === y.toLowerCase(),
    },
  };

  options: AnimationOptions = {
    path: '/assets/animations/36499-page-not-found.json',
  };

  constructor(
    private dialogService: NbDialogService,
    private seo: SeoService,
    public onlineStat: OnlineStatService,
    private userService: UserService,
    public permissionService: PermissionService,
    private roleService: RoleService,
    private clientService: ClientService,
    private toastr: NbToastrService
  ) {}

  async createUser() {
    const user: UserDto = await lastValueFrom(
      this.dialogService.open(UserFormComponent, {
        closeOnBackdropClick: false,
        context: { isCreateRequest: true },
        closeOnEsc: false,
        hasScroll: true,
      }).onClose
    );
    if (user) {
      this.users = [user, ...this.users];
    }
  }

  async updateUser({ data }: { data: UserDto }) {
    const hasPermission = this.permissionService.canAccessByResource(
      'update',
      'users:update-' + data.ssoRole.toLowerCase()
    );
    if (hasPermission) {
      const user: UserDto = await lastValueFrom(
        this.dialogService.open(UserFormComponent, {
          closeOnBackdropClick: false,
          context: { isCreateRequest: false, userForUpdate: data },
          hasScroll: true,
          closeOnEsc: false,
        }).onClose
      );
      if (user) {
        this.users = GetUniqueArray([user], [...this.users], true);
      }
    } else {
      this.toastr.danger(
        'You do not have permission to update this user',
        'UNAUTHORISED',
        {
          position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
          preventDuplicates: true,
        }
      );
    }
  }

  ngOnInit() {
    this.seo.setSeoData('User Management', 'Manage application users');
    this.requestData();
    this.getAppRoles();
    this.getClients();
  }

  requestData(data?: any) {
    this.isLoadingData = true;
    this.userService.getUsers(data).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.status) {
          this.users = GetUniqueArray(
            [...(response.data?.itemList ?? [])],
            [...this.users]
          );
        }
      },
      (err) => {
        this.isLoadingData = false;
      }
    );
  }

  getAppRoles() {
    this.roleService.getAppRoles().subscribe((data) => {
      const roles = data.data ?? [];
      const roleSearchFilterList = roles.map((r) => ({
        value: r.id,
        title: r.name,
      }));
      this.columns.roleId.filter.config.selectText = 'Select...';
      this.columns.roleId.filter.config.list = roleSearchFilterList as any;
      this.columns = { ...this.columns };
    });
  }

  getClients() {
    this.clientService.getClients().subscribe((data) => {
      const clients = data.data?.itemList ?? [];
      const clientSearchFilterList = clients.map((r) => ({
        value: r.clientId,
        title: r.businessName,
      }));
      this.columns.clientId.filter.config.selectText = 'Select...';
      this.columns.clientId.filter.config.list = clientSearchFilterList as any;
      this.columns = { ...this.columns };
    });
  }
}
