import { LoadPointDialogComponent } from './../load-point-dialog/load-point-dialog.component';
import { PowerSourceService } from './../../../../@core/data-services/power-source.service';
import { PowerSourceDto } from 'src/app/@core/dtos/power-source.dto';
import { Component, OnInit, Input } from '@angular/core';
import { PowerStationLoadPointDto } from 'src/app/@core/dtos/power-station-load-points.dto';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-load-point-column',
  templateUrl: './load-point-column.component.html',
  styleUrls: ['./load-point-column.component.scss']
})
export class LoadPointColumnComponent implements OnInit {
  @Input() rowData!: PowerSourceDto;
  powerStationLoadPointDto!: PowerStationLoadPointDto;

  isLoadingData = true;

  constructor(
    private dialogService: NbDialogService,
    private powerSourceService: PowerSourceService
  ) { }

  ngOnInit(): void {
    console.log('');
  }


  viewLoadPointModal(rowData: any) {
    this.dialogService.open(LoadPointDialogComponent, {
      closeOnBackdropClick: false,
      context: {
        // powerSourceGenSet: (response.data?.itemList)
        powerSourceRowData: rowData
      },
      hasScroll: true,
      closeOnEsc: false
    });
    this.isLoadingData = true;
  }

}
