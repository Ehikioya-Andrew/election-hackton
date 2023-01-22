import { ClientResources } from './client-resources';
import { PermissionService } from 'src/app/@core/utils/permission.service';
import { ClientDto } from 'src/app/@core/dtos/client.dto';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { ClientService } from 'src/app/@core/data-services/client.service';
import { ClientFormComponent } from './client-form/client-form.component';
import { OnlineStatService } from 'src/app/@core/utils/online-stat.service';
import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { SeoService } from 'src/app/@core/utils';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  isLoadingData = true;

  clientResources = ClientResources;

  clients: ClientDto[] = [];

  columns = {
    businessName: {
      title: 'Business Name',
    },
    address: {
      title: 'Address',
    },
    userName: {
      title: 'User Name',
    },
    city: {
      title: 'City',
    },
    contactEmail: {
      title: 'Contact Email',
    },
    contactPerson: {
      title: 'Contact Person',
    },
    contactPhone: {
      title: 'Contact Phone',
    },
    jobRole: {
      title: 'Role',
    },
  };

  constructor(
    public onlineStat: OnlineStatService,
    private dialogService: NbDialogService,
    private clientService: ClientService,
    public permissionService: PermissionService,
    private seo: SeoService
  ) {}

  async handleCreateNewClientClick() {
    const client = await lastValueFrom(
      this.dialogService.open(ClientFormComponent, {
        closeOnBackdropClick: false,
        context: { isCreateRequest: true },
        hasScroll: true,
        closeOnEsc: false,
      }).onClose
    );
    if (client) {
      this.clients = [client, ...this.clients];
    }
  }
  async updateClient({ data }: { data: ClientDto }) {
    const client = await lastValueFrom(
      this.dialogService.open(ClientFormComponent, {
        closeOnBackdropClick: false,
        context: { isCreateRequest: false, clientForUpdate: data as ClientDto },
        hasScroll: true,
        closeOnEsc: false,
      }).onClose
    );
    if (client) {
      this.clients = GetUniqueArray([client], [...this.clients], true);
    }
  }

  ngOnInit(): void {
    this.requestData();
    this.seo.setSeoData(
      'Client Management',
      'Manage application users groups (clients)'
    );
  }
  requestData(data?: any) {
    this.isLoadingData = true;
    this.clientService.getClients(data).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.status) {
          this.clients = GetUniqueArray(
            [...(response.data?.itemList ?? [])],
            [...this.clients]
          );
        }
      },
      (err) => {
        this.isLoadingData = false;
      }
    );
  }
}
