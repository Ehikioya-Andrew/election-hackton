import { MeterFormComponent } from './meter-form/meter-form.component';
import { MeterResources } from './meter-resources';
import { PermissionService } from './../../../@core/utils/permission.service';
import { MeterDto } from './../../../@core/dtos/meter.dto';
import { Component, OnInit } from '@angular/core';
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from '@nebular/theme';
import { PermissionEnum } from 'src/app/@core/enums/permission.enum';
import { MeterStatusToggleComponent } from './meter-status-toggle/meter-status-toggle.component';
import { SeoService } from 'src/app/@core/utils';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { OnlineStatService } from 'src/app/@core/utils/online-stat.service';
import { AnimationOptions } from 'ngx-lottie';
import { MeterService } from 'src/app/@core/data-services/meter.service';
import { ClientService } from 'src/app/@core/data-services/client.service';
import { UserModel } from 'src/app/@core/models/user.model';
import { TokenService } from 'src/app/@core/utils/token.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-meters',
  templateUrl: './meters.component.html',
  styleUrls: ['./meters.component.scss'],
})
export class MetersComponent implements OnInit {
  isLoadingData = true;
  meterResources = MeterResources;

  meters: MeterDto[] = [];

  columns = {
    number: {
      title: 'Meter Number',
    },
    meterModel: {
      title: 'Model',
    },
    meterManufacturerId: {
      title: 'Manufacturer',
      filter: {
        type: 'list',
        config: {
          selectText: 'Loading...',
          list: [],
        },
      },
      valuePrepareFunction: (d: string, r: any) => {
        return r.meterManufacturer;
      },
    },
    tariff: {
      title: 'Tariff',
    },
    phaseCount: {
      title: 'Phase Count',
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
        MeterResources.ViewClientColumn
      ),
    },
    status: {
      title: 'Status',
      renderComponent: MeterStatusToggleComponent,
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
    public permissionService: PermissionService,
    private dialogService: NbDialogService,
    private seo: SeoService,
    public onlineStat: OnlineStatService,
    private clientService: ClientService,
    private toastr: NbToastrService,
    private meterService: MeterService,
    private tokenService: TokenService
  ) {}

  async handleCreateNewMeterClick() {
    const meter = await lastValueFrom(
      this.dialogService.open(MeterFormComponent, {
        closeOnBackdropClick: false,
        context: { isCreateRequest: true },
        hasScroll: true,
        closeOnEsc: false,
      }).onClose
    );
    if (meter) {
      this.meters = [meter, ...this.meters];
    }
  }

  ngOnInit(): void {
    this.seo.setSeoData('Asset Management - [Meters]', 'Manage meter assets');
    this.requestData();
    this.getClients();
    this.getMeterManufacturers();
  }

  requestData(data?: any) {
    this.isLoadingData = true;
    this.meterService.getMeters(data).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.status) {
          this.meters = GetUniqueArray(
            [...(response.data?.itemList ?? [])],
            [...this.meters]
          );
        }
      },
      (err) => {
        this.isLoadingData = false;
      }
    );
  }

  async updateMeter({ data }: { data: MeterDto }) {
    const userModel: UserModel = JSON.parse(this.tokenService.getPayload().sub);
    const hasPermission = data.clientId === userModel.clientId;
    if (hasPermission) {
      const meter: MeterDto = await lastValueFrom(
        this.dialogService.open(MeterFormComponent, {
          closeOnBackdropClick: false,
          context: { isCreateRequest: false, meterForUpdate: data },
          hasScroll: true,
          closeOnEsc: false,
        }).onClose
      );
      if (meter) {
        this.meters = GetUniqueArray([meter], [...this.meters], true);
      }
    } else {
      this.toastr.danger(
        'You do not have permission to update this meter',
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

  getMeterManufacturers() {
    this.meterService.getMeterManufacturer().subscribe((data) => {
      const meterManufacturers = data.data ?? [];
      const meterManufacturerSearchFilterList = meterManufacturers.map((r) => ({
        value: r.id,
        title: r.meterType,
      }));
      this.columns.meterManufacturerId.filter.config.selectText = 'Select...';
      this.columns.meterManufacturerId.filter.config.list =
        meterManufacturerSearchFilterList as any;
      this.columns = { ...this.columns };
    });
  }
}
