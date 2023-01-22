import { UserModel } from './../../../@core/models/user.model';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { ServiceBandFormComponent } from './service-band-form/service-band-form.component';
import { ServiceBandStatusToggleComponent } from './service-band-status-toggle/service-band-status-toggle.component';
import { ClientService } from './../../../@core/data-services/client.service';
import { OnlineStatService } from './../../../@core/utils/online-stat.service';
import { PermissionService } from './../../../@core/utils/permission.service';
import { ServiceBandDto } from './../../../@core/dtos/service-band.dto';
import { ServiceBandResources } from './service-band-resources';
import { Component, OnInit } from '@angular/core';
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from '@nebular/theme';
import { SeoService } from 'src/app/@core/utils';
import { ServiceBandService } from 'src/app/@core/data-services/service-band.service';
import { TokenService } from 'src/app/@core/utils/token.service';
import { PermissionEnum } from 'src/app/@core/enums/permission.enum';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-service-band',
  templateUrl: './service-band.component.html',
  styleUrls: ['./service-band.component.scss'],
})
export class ServiceBandComponent implements OnInit {
  isLoadingData = true;
  serviceBandResources = ServiceBandResources;

  serviceBands: ServiceBandDto[] = [];

  columns = {
    name: {
      title: 'Name',
    },
    upperBand: {
      title: 'Upper Band',
    },
    lowerBand: {
      title: 'Lower Band',
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
        this.serviceBandResources.ViewClientColumn
      ),
    },
    status: {
      title: 'Status',
      renderComponent: ServiceBandStatusToggleComponent,
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

  constructor(
    public permissionService: PermissionService,
    private dialogService: NbDialogService,
    private seo: SeoService,
    public onlineStat: OnlineStatService,
    private clientService: ClientService,
    private toastr: NbToastrService,
    private serviceBandService: ServiceBandService,
    private tokenService: TokenService
  ) {}

  async handleCreateNewServiceBandClick() {
    const serviceBand = await lastValueFrom(
      this.dialogService.open(ServiceBandFormComponent, {
        closeOnBackdropClick: false,
        context: { isCreateRequest: true },
        hasScroll: true,
        closeOnEsc: false,
      }).onClose
    );
    if (serviceBand) {
      this.serviceBands = [serviceBand, ...this.serviceBands];
    }
  }

  ngOnInit(): void {
    this.seo.setSeoData(
      'Tariff Management - [Service Band]',
      'Manage Service Band'
    );
    this.requestData();
    this.getClients();
  }

  requestData(data?: any) {
    this.isLoadingData = true;
    this.serviceBandService.getServiceBand(data).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.status) {
          this.serviceBands = GetUniqueArray(
            [...(response.data?.itemList ?? [])],
            [...this.serviceBands]
          );
        }
      },
      (err) => {
        this.isLoadingData = false;
      }
    );
  }

  async updateServiceBand({ data }: { data: ServiceBandDto }) {
    const userModel: UserModel = JSON.parse(this.tokenService.getPayload().sub);
    const hasPermission = data.clientId === userModel.clientId;
    if (hasPermission) {
      const serviceBand: ServiceBandDto = await lastValueFrom(
        this.dialogService.open(ServiceBandFormComponent, {
          closeOnBackdropClick: false,
          context: { isCreateRequest: false, serviceBandForUpdate: data },
          hasScroll: true,
          closeOnEsc: false,
        }).onClose
      );
      if (serviceBand) {
        this.serviceBands = GetUniqueArray(
          [serviceBand],
          [...this.serviceBands],
          true
        );
      }
    } else {
      this.toastr.danger(
        'You do not have permission to update this Service Band',
        'UNAUTHORISED',
        {
          position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
          preventDuplicates: true,
        }
      );
    }
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
