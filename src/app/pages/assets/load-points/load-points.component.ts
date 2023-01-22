import { Component, OnInit } from '@angular/core';
import {
  NbDialogService,
  NbToastrService,
  NbGlobalPhysicalPosition,
} from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { lastValueFrom } from 'rxjs';
import { ClientService } from 'src/app/@core/data-services/client.service';
import { LoadPointService } from 'src/app/@core/data-services/load-point.service';
import { LoadPointDto } from 'src/app/@core/dtos/load-point.dto';
import { PermissionEnum } from 'src/app/@core/enums/permission.enum';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { UserModel } from 'src/app/@core/models/user.model';
import { SeoService } from 'src/app/@core/utils';
import { OnlineStatService } from 'src/app/@core/utils/online-stat.service';
import { PermissionService } from 'src/app/@core/utils/permission.service';
import { TokenService } from 'src/app/@core/utils/token.service';
import {
  LoadPointAnalyticsResources,
  LoadPointAnalyticsResourcesNavMap,
} from '../../analytics/load-point-analytics/load-point-analytics-resources';
import { LoadPointFormComponent } from './load-point-form/load-point-form.component';
import { LoadPointGisComponent } from './load-point-gis/load-point-gis.component';
import { LoadPointResources } from './load-point-resources';
import { LoadPointStatusToggleComponent } from './load-point-status-toggle/load-point-status-toggle.component';

@Component({
  selector: 'app-load-points',
  templateUrl: './load-points.component.html',
  styleUrls: ['./load-points.component.scss'],
})
export class LoadPointsComponent implements OnInit {
  isLoadingData = true;
  loadPointResources = LoadPointResources;
  loadPointAnalyticsLink = LoadPointAnalyticsResourcesNavMap.get(
    LoadPointAnalyticsResources.SummaryView
  )?.route;

  loadPoints: LoadPointDto[] = [];

  columns = {
    name: {
      title: 'Name',
    },
    meter: {
      title: 'Meter Number',
    },
    powerSource: {
      title: 'Power Source',
    },
    state: {
      title: 'State',
    },
    lga: {
      title: 'LGA',
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
        LoadPointResources.ViewClientColumn
      ),
    },
    status: {
      title: 'Status',
      renderComponent: LoadPointStatusToggleComponent,
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
    actions: {
      title: 'Actions',
      renderComponent: LoadPointGisComponent,
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
    private loadPointService: LoadPointService,
    private tokenService: TokenService
  ) {}

  async handleCreateNewLoadPointClick() {
    const loadPoint = await lastValueFrom(
      this.dialogService.open(LoadPointFormComponent, {
        closeOnBackdropClick: false,
        context: { isCreateRequest: true },
        hasScroll: true,
        closeOnEsc: false,
      }).onClose
    );
    if (loadPoint) {
      this.loadPoints = [loadPoint, ...this.loadPoints];
    }
  }

  ngOnInit(): void {
    this.seo.setSeoData(
      'Asset Management - [Load Points]',
      'Manage load Point assets'
    );
    this.requestData();
    this.getClients();
  }

  requestData(data?: any) {
    this.isLoadingData = true;
    this.loadPointService.getLoadPoints(data).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.status) {
          this.loadPoints = GetUniqueArray(
            [...(response.data?.itemList ?? [])],
            [...this.loadPoints]
          );
        }
      },
      (err) => {
        this.isLoadingData = false;
      }
    );
  }

  async updateLoadPoint({ data }: { data: LoadPointDto }) {
    const userModel: UserModel = JSON.parse(this.tokenService.getPayload().sub);
    const hasPermission = data.clientId === userModel.clientId;
    if (hasPermission) {
      const loadPoint: LoadPointDto = await lastValueFrom(
        this.dialogService.open(LoadPointFormComponent, {
          closeOnBackdropClick: false,
          context: { isCreateRequest: false, loadPointForUpdate: data },
          hasScroll: true,
          closeOnEsc: false,
        }).onClose
      );
      if (loadPoint) {
        this.loadPoints = GetUniqueArray(
          [loadPoint],
          [...this.loadPoints],
          true
        );
      }
    } else {
      this.toastr.danger(
        'You do not have permission to update this loadPoint',
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
