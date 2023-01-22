import { LoadPointColumnComponent } from './load-point-column/load-point-column.component';
import { GenSetColumnComponent } from './gen-set-column/gen-set-column.component';
import { UserModel } from 'src/app/@core/models/user.model';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { ClientService } from 'src/app/@core/data-services/client.service';
import { OnlineStatService } from 'src/app/@core/utils/online-stat.service';
import { SeoService } from './../../../@core/utils/seo.service';
import { PermissionService } from 'src/app/@core/utils/permission.service';
import { PowerSourceStatusToggleComponent } from './power-source-status-toggle/power-source-status-toggle.component';
import { PowerSourceGisComponent } from './power-source-gis/power-source-gis.component';
import { PowerSourceService } from './../../../@core/data-services/power-source.service';
import { Component, OnInit, Input } from '@angular/core';
import { PowerSourceDto } from 'src/app/@core/dtos/power-source.dto';
import { PowerSourceResources } from './power-source-resources';
import { PermissionEnum } from 'src/app/@core/enums/permission.enum';
import {
  NbDialogService,
  NbToastrService,
  NbGlobalPhysicalPosition,
} from '@nebular/theme';
import { TokenService } from 'src/app/@core/utils/token.service';
import { PowerSourceFormComponent } from './power-source-form/power-source-form.component';
import {
  PowerSourceAnalyticsResources,
  PowerSourceAnalyticsResourcesNavMap,
} from '../../analytics/power-source-analytics/power-source-analytics-resources';
import { AnimationOptions } from 'ngx-lottie';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-power-sources',
  templateUrl: './power-sources.component.html',
  styleUrls: ['./power-sources.component.scss'],
})
export class PowerSourcesComponent implements OnInit {
  powerSourceAnalyticsLink = PowerSourceAnalyticsResourcesNavMap.get(
    PowerSourceAnalyticsResources.SummaryView
  )?.route;

  @Input()
  isCreateRequest = true;

  @Input()
  powerSourceForUpdate!: PowerSourceDto;

  errors: string[] = [];
  messages: string[] = [];
  submitted = false;

  isLoadingData = true;
  powerSourcesResources = PowerSourceResources;

  powerSources: PowerSourceDto[] = [];

  columns = {
    name: {
      title: 'Name',
    },
    address: {
      title: 'Address',
    },
    state: {
      title: 'State',
    },
    lga: {
      title: 'LGA',
    },
    genSetCount: {
      title: 'Generating Unit',
      renderComponent: GenSetColumnComponent,
      type: 'custom',
      filter: false,
    },
    loadPointCount: {
      title: 'Load Point',
      renderComponent: LoadPointColumnComponent,
      type: 'custom',
      filter: false,
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
        PowerSourceResources.ViewPowerSourceColumn
      ),
    },

    status: {
      title: 'Status',
      renderComponent: PowerSourceStatusToggleComponent,
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
    more: {
      title: 'More',
      renderComponent: PowerSourceGisComponent,
      type: 'custom',
      filter: false,
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
    private powerSourceService: PowerSourceService,
    private tokenService: TokenService
  ) {}

  async handleCreateNewPowerSourceClick() {
    const powerSource = await lastValueFrom(
      this.dialogService.open(PowerSourceFormComponent, {
        closeOnBackdropClick: false,
        context: { isCreateRequest: true },
        hasScroll: true,
        closeOnEsc: false,
      }).onClose
    );
    if (powerSource) {
      this.powerSources = [powerSource, ...this.powerSources];
    }
  }

  ngOnInit(): void {
    this.seo.setSeoData(
      'Asset Management - [Power Source]',
      'Manage Power Station assets'
    );
    this.requestData();
    this.getClients();
  }

  requestData(data?: any) {
    this.isLoadingData = true;
    this.powerSourceService.getPowerSource(data).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.status) {
          this.powerSources = GetUniqueArray(
            [...(response.data?.itemList ?? [])],
            [...this.powerSources]
          );
        }
      },
      (err) => {
        this.isLoadingData = false;
      }
    );
  }

  async updatePowerSource({ data }: { data: PowerSourceDto }) {
    const userModel: UserModel = JSON.parse(this.tokenService.getPayload().sub);
    const hasPermission = data.clientId === userModel.clientId;
    if (hasPermission) {
      const powerSource: PowerSourceDto = await lastValueFrom(
        this.dialogService.open(PowerSourceFormComponent, {
          closeOnBackdropClick: false,
          context: { isCreateRequest: false, powerSourceForUpdate: data },
          hasScroll: true,
          closeOnEsc: false,
        }).onClose
      );
      if (powerSource) {
        this.powerSources = GetUniqueArray(
          [powerSource],
          [...this.powerSources],
          true
        );
      }
    } else {
      this.toastr.danger(
        'You do not have permission to update this power station',
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
