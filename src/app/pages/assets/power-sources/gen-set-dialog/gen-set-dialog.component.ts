import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { PowerSourceService } from './../../../../@core/data-services/power-source.service';
import { PowerSourceDto } from 'src/app/@core/dtos/power-source.dto';
import { NbDialogRef } from '@nebular/theme';
import { Component, OnInit, Input } from '@angular/core';
import { PowerSourceGenSetDto } from 'src/app/@core/dtos/gen-set-details.dto';

@Component({
  selector: 'app-gen-set-dialog',
  templateUrl: './gen-set-dialog.component.html',
  styleUrls: ['./gen-set-dialog.component.scss'],
})
export class GenSetDialogComponent implements OnInit {
  powerSourceGenSet: PowerSourceGenSetDto[] = [];

  @Input() powerSourceRowData!: any;

  isLoadingData = true;

  columns = {
    name: {
      title: 'Name',
    },
    meter: {
      title: 'Meter Number',
    },
    energySourceName: {
      title: 'Energy Source',
    },
  };

  constructor(
    public dialogRef: NbDialogRef<GenSetDialogComponent>,
    private powerSourceService: PowerSourceService
  ) {}

  ngOnInit(): void {
    this.initTableData(this.powerSourceRowData.id);
  }
  initTableData(id: any) {
    this.isLoadingData = true;
    this.powerSourceService.getPowerSourceGeneratingSet(id).subscribe(
      (response) => {
        this.isLoadingData = false;
        if (response.status) {
          this.powerSourceGenSet = GetUniqueArray(
            [...(response.data?.itemList ?? [])],
            [...this.powerSourceGenSet]
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
