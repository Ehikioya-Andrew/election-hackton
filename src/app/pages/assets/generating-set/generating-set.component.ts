import { GeneratingSetGisComponent } from './generating-set-gis/generating-set-gis.component';
import { UserModel } from 'src/app/@core/models/user.model';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { GeneratingSetFormComponent } from './generating-set-form/generating-set-form.component';
import { ClientService } from 'src/app/@core/data-services/client.service';
import { OnlineStatService } from 'src/app/@core/utils/online-stat.service';
import { PermissionService } from 'src/app/@core/utils/permission.service';
import { GeneratingSetStatusToggleComponent } from './generating-set-status-toggle/generating-set-status-toggle.component';
import { GeneratingSetDto } from './../../../@core/dtos/generating-set.dto';
import { GeneratingSetResources } from './generating-set-resources';
import { Component, OnInit } from '@angular/core';
import { PermissionEnum } from 'src/app/@core/enums/permission.enum';
import {
  NbDialogService,
  NbToastrService,
  NbGlobalPhysicalPosition,
} from '@nebular/theme';
import { AnimationOptions } from 'ngx-lottie';
import { SeoService } from 'src/app/@core/utils';
import { GeneratingSetsService } from 'src/app/@core/data-services/generating-set.service';
import { TokenService } from 'src/app/@core/utils/token.service';
import {
  GeneratingUnitAnalyticsResources,
  GeneratingUnitAnalyticsResourcesNavMap,
} from '../../analytics/generating-unit-analytics/genearting-unit-analytics-resources';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-generating-set',
  templateUrl: './generating-set.component.html',
  styleUrls: ['./generating-set.component.scss'],
})
export class GeneratingSetComponent implements OnInit {
  GenSetAnalyticsLink = GeneratingUnitAnalyticsResourcesNavMap.get(
    GeneratingUnitAnalyticsResources.SummaryView
  )?.route;

  isLoadingData = true;
  generatingSetResources = GeneratingSetResources;

  generatingSet: GeneratingSetDto[] = [];

  columns = {
    name: {
      title: 'Name',
    },
    energySourceName: {
      title: 'Energy Source',
    },
    powerSource: {
      title: 'Power Station',
    },
    meter: {
      title: 'Meter Number',
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
        this.generatingSetResources.ViewClientColumn
      ),
    },
    status: {
      title: 'Status',
      renderComponent: GeneratingSetStatusToggleComponent,
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
      renderComponent: GeneratingSetGisComponent,
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
    private generatingSetService: GeneratingSetsService,
    private tokenService: TokenService
  ) {}

  async handleCreateNewGeneratingSetClick() {
    const generatingSet = await lastValueFrom(
      this.dialogService.open(GeneratingSetFormComponent, {
        closeOnBackdropClick: false,
        context: { isCreateRequest: true },
        hasScroll: true,
        closeOnEsc: false,
      }).onClose
    );
    if (generatingSet) {
      this.generatingSet = [generatingSet, ...this.generatingSet];
    }
  }

  ngOnInit(): void {
    this.seo.setSeoData(
      'Asset Management - [Generating Units]',
      'Manage generating units assets'
    );
    this.requestData();
    this.getClients();
  }

  requestData(data?: any) {
    this.isLoadingData = true;
    this.generatingSetService.getGeneratingSets(data).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.status) {
          this.generatingSet = GetUniqueArray(
            [...(response.data?.itemList ?? [])],
            [...this.generatingSet]
          );
        }
      },
      (err) => {
        this.isLoadingData = false;
      }
    );
  }

  async updateGeneratingSet({ data }: { data: GeneratingSetDto }) {
    const userModel: UserModel = JSON.parse(this.tokenService.getPayload().sub);
    const hasPermission = data.clientId === userModel.clientId;
    if (hasPermission) {
      const generatingSet: GeneratingSetDto = await lastValueFrom(
        this.dialogService.open(GeneratingSetFormComponent, {
          closeOnBackdropClick: false,
          context: { isCreateRequest: false, generatingSetForUpdate: data },
          hasScroll: true,
          closeOnEsc: false,
        }).onClose
      );
      if (generatingSet) {
        this.generatingSet = GetUniqueArray(
          [generatingSet],
          [...this.generatingSet],
          true
        );
      }
    } else {
      this.toastr.danger(
        'You do not have permission to update this generating unit',
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
