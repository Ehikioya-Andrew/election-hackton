import { UserModel } from './../../../@core/models/user.model';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { TariffFormComponent } from './tariff-form/tariff-form.component';
import { TariffService } from './../../../@core/data-services/tariff.service';
import { ClientService } from './../../../@core/data-services/client.service';
import { OnlineStatService } from './../../../@core/utils/online-stat.service';
import { PermissionService } from './../../../@core/utils/permission.service';
import { TariffStatusToggleComponent } from './tariff-status-toggle/tariff-status-toggle.component';
import { TariffDto } from './../../../@core/dtos/tariff.dto';
import { TariffResources } from './tariff-resources';
import { Component, OnInit } from '@angular/core';
import { PermissionEnum } from 'src/app/@core/enums/permission.enum';
import {
  NbDialogService,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from '@nebular/theme';
import { SeoService } from 'src/app/@core/utils';
import { TokenService } from 'src/app/@core/utils/token.service';
import { CurrencyFormatter } from 'src/app/@core/functions/formatter.funtion';
import { AnimationOptions } from 'ngx-lottie';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss'],
})
export class TariffComponent implements OnInit {
  isLoadingData = true;
  tariffResources = TariffResources;

  tariffs: TariffDto[] = [];

  columns = {
    name: {
      title: 'Name',
    },
    amount: {
      title: 'Amount',
      valuePrepareFunction: (d: number) => {
        return CurrencyFormatter.format(d || 0);
      },
    },
    rateClass: {
      title: 'Rate Class',
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
        this.tariffResources.ViewClientColumn
      ),
    },
    status: {
      title: 'Status',
      renderComponent: TariffStatusToggleComponent,
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
    private tariffService: TariffService,
    private tokenService: TokenService
  ) {}

  async handleCreateNewTariffClick() {
    const tariff = await lastValueFrom(
      this.dialogService.open(TariffFormComponent, {
        closeOnBackdropClick: false,
        context: { isCreateRequest: true },
        hasScroll: true,
        closeOnEsc: false,
      }).onClose
    );
    if (tariff) {
      this.tariffs = [tariff, ...this.tariffs];
    }
  }

  ngOnInit(): void {
    this.seo.setSeoData('Tariff Management - [Tariff]', 'Manage Tariff');
    this.requestData();
    this.getClients();
  }

  requestData(data?: any) {
    this.isLoadingData = true;
    this.tariffService.getTariff(data).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.status) {
          this.tariffs = GetUniqueArray(
            [...(response.data?.itemList ?? [])],
            [...this.tariffs]
          );
        }
      },
      (err) => {
        this.isLoadingData = false;
      }
    );
  }

  async updateTariff({ data }: { data: TariffDto }) {
    const userModel: UserModel = JSON.parse(this.tokenService.getPayload().sub);
    const hasPermission = data.clientId === userModel.clientId;
    if (hasPermission) {
      const tariff: TariffDto = await lastValueFrom(
        this.dialogService.open(TariffFormComponent, {
          closeOnBackdropClick: false,
          context: { isCreateRequest: false, tariffForUpdate: data },
          hasScroll: true,
          closeOnEsc: false,
        }).onClose
      );
      if (tariff) {
        this.tariffs = GetUniqueArray([tariff], [...this.tariffs], true);
      }
    } else {
      this.toastr.danger(
        'You do not have permission to update this tariff',
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
