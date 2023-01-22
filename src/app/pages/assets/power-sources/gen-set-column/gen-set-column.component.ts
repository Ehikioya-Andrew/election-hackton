import { GetUniqueArray } from 'src/app/@core/functions/data-request.funtion';
import { PowerSourceGenSetDto } from 'src/app/@core/dtos/gen-set-details.dto';
import { GeneratingSetDto } from './../../../../@core/dtos/generating-set.dto';
import { PowerSourceService } from './../../../../@core/data-services/power-source.service';
import { GenSetDialogComponent } from './../gen-set-dialog/gen-set-dialog.component';
import { PowerSourceDto } from 'src/app/@core/dtos/power-source.dto';
import { Component, OnInit, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-gen-set-column',
  templateUrl: './gen-set-column.component.html',
  styleUrls: ['./gen-set-column.component.scss']
})
export class GenSetColumnComponent implements OnInit {
  @Input() rowData!: PowerSourceDto;
  powerSourceGenSetDto!: PowerSourceGenSetDto;

  isLoadingData = true;

  constructor(
    private dialogService: NbDialogService,
    private powerSourceService: PowerSourceService
  ) { }

  ngOnInit(): void {
    console.log('');
  }


  viewGenSetModal(rowdata: any) {
    this.dialogService.open(GenSetDialogComponent, {
      closeOnBackdropClick: false,
      context: {
        powerSourceRowData: rowdata
      },
      hasScroll: true,
      closeOnEsc: false
    });
    this.isLoadingData = true;
  }





}
