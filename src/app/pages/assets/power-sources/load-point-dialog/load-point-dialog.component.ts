import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { PowerSourceService } from './../../../../@core/data-services/power-source.service';
import { NbDialogRef } from '@nebular/theme';
import { PowerSourceDto } from 'src/app/@core/dtos/power-source.dto';
import { Component, Input, OnInit } from '@angular/core';
import { PowerSourceLoadPointDto } from 'src/app/@core/dtos/power-source-load-point.dto';

@Component({
  selector: 'app-load-point-dialog',
  templateUrl: './load-point-dialog.component.html',
  styleUrls: ['./load-point-dialog.component.scss'],
})
export class LoadPointDialogComponent implements OnInit {
  powerSourceLoadPoint: PowerSourceLoadPointDto[] = [];

  @Input() powerSourceRowData!: any;

  isLoadingData = true;

  columns = {
    name: {
      title: 'Name',
    },
    meter: {
      title: 'Meter Number',
    },
  };

  constructor(
    public dialogRef: NbDialogRef<LoadPointDialogComponent>,
    private powerSourceService: PowerSourceService
  ) {}

  ngOnInit(): void {
    this.initTableData(this.powerSourceRowData.id);
  }
  initTableData(id: any) {
    this.isLoadingData = true;
    this.powerSourceService.getPowerSourceLoadPoint(id).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.status) {
          this.powerSourceLoadPoint = GetUniqueArray(
            [...(response.data?.itemList ?? [])],
            [...this.powerSourceLoadPoint]
          );
        }
      },
      (err) => {
        this.isLoadingData = false;
      }
    );
  }

  requestData(data?: any) {
    this.isLoadingData = true;

    this.powerSourceService
      .getPowerSourceLoadPoint(this.powerSourceRowData.id, data)
      .subscribe(
        (response) => {
          this.isLoadingData = false;
          if (response.status) {
            this.powerSourceLoadPoint = GetUniqueArray(
              [...(response.data?.itemList ?? [])],
              [...this.powerSourceLoadPoint],
              false,
              'meter'
            );
          }
        },
        (err) => {
          this.isLoadingData = false;
        }
      );
  }

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
