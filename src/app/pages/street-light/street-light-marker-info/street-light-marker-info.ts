import { NbDialogRef } from '@nebular/theme';
import { Component, Input, OnInit } from '@angular/core';
import { StreetLightResources, StreetLightResourcesNavMap } from '../street-light-resources';
import { StreetDto } from 'src/app/@core/dtos/street.dto';
import { StreetLightService } from 'src/app/@core/data-services/street-light.service';
import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { Street } from 'src/app/@core/dtos/street-light-dashboard.dto';
import { StreetLightStatusComponent } from './street-light-status/street-light-status.component';

@Component({
  selector: 'app-street-light-marker-info',
  templateUrl: './street-light-marker-info.html',
  styleUrls: ['./street-light-marker-info.scss'],
})
export class StreetLightMarkerInfoComponent implements OnInit {
  streetDto: StreetDto[] = [];
  @Input() streetMarkerInfo!: Street;

  isLoadingData = true;

  constructor(
    public dialogRef: NbDialogRef<StreetLightMarkerInfoComponent>,
    private streetLightService: StreetLightService
  ) { }


  columns = {
    name: {
      title: 'Name',
    },
    sub_station: {
      title: 'Sub Station',
    },
    status: {
      title: 'Status',
      renderComponent: StreetLightStatusComponent,
      type: 'custom',
      filter: {
        type: 'list',
        config: {
          selectText: 'Select...',
          list: [
            { value: '1', title: 'Online' },
            { value: '0', title: 'Offline' },
          ],
        },
      },
      filterFunction: (x: string, y: string) => x.toLowerCase() === y.toLowerCase()
    },
    last_active: {
      title: 'Last Active',
    },
  }

  ngOnInit(): void {
    this.initTableData(this.streetMarkerInfo.street_id)
  }

  initTableData(id: any) {
    this.isLoadingData = true;
    this.streetLightService.getStreetLightPoles(id)
      .subscribe(
        (response) => {
          this.isLoadingData = false;
          if (response.status) {
            this.streetDto = GetUniqueArray([...response.data?.light_poles ?? []], [...this.streetDto]);
          }
        },
        (err) => {
          this.isLoadingData = false;
        }
      )
  }

  close(): void {
    this.dialogRef.close(false);
  }

}
