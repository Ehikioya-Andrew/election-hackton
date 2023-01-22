import { ExecutiveSummaryLoadpointExpandButtonComponent } from '../executive-summary-loadpoint-expand-button/executive-summary-loadpoint-expand-button.component';
import { LoadPointExecutiveSummaryDto } from '../../../@core/dtos/load-point-executive-summary.dto';
import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { GeneratingSetExecutiveSummaryDto } from 'src/app/@core/dtos/generating-set-executive-summary.dto';
import {
  CapitalizeFunction,
  CurrencyFormatter,
  NumberFormatter,
} from 'src/app/@core/functions/formatter.funtion';
import { ExecutiveSummaryGenSetExpandButtonComponent } from '../executive-summary-gen-set-expand-button/executive-summary-gen-set-expand-button.component';

@Component({
  selector: 'app-executive-summary-dialog',
  templateUrl: './executive-summary-dialog.component.html',
  styleUrls: ['./executive-summary-dialog.component.scss'],
})
export class ExecutiveSummaryDialogComponent {
  @Input() genSetTableData: GeneratingSetExecutiveSummaryDto[] = [];
  @Input() loadPointTableData: LoadPointExecutiveSummaryDto[] = [];
  @Input() isloadPoint!: boolean;
  @Input() powerSourceName!: string;
  genSetColum = {
    name: {
      title: 'Name',
      valuePrepareFunction: (d: string) => {
        return CapitalizeFunction(d);
      },
    },
    powerSource: {
      title: 'Power Source',
      valuePrepareFunction: (d: string) => {
        return CapitalizeFunction(d);
      },
    },
    consumption: {
      title: 'Generation (kWh)',
      valuePrepareFunction: (d: number) => {
        return NumberFormatter.format(d || 0) + ' kWh';
      },
    },
    Action: {
      title: 'Action',
      type: 'custom',
      filter: false,
      renderComponent: ExecutiveSummaryGenSetExpandButtonComponent,
    },
  };

  loadPointColumn = {
    name: {
      title: 'Name',
      valuePrepareFunction: (d: string) => {
        return CapitalizeFunction(d);
      },
    },
    powerSource: {
      title: 'Power Source',
      valuePrepareFunction: (d: string) => {
        return CapitalizeFunction(d);
      },
    },
    consumption: {
      title: 'Consumption (kWh)',
      valuePrepareFunction: (d: number) => {
        return NumberFormatter.format(d || 0) + ' kWh';
      },
    },
    cost: {
      title: 'Cost (NGN)',
      valuePrepareFunction: (d: number) => {
        return CurrencyFormatter.format(d || 0);
      },
    },
    Action: {
      title: 'Action',
      type: 'custom',
      filter: false,
      renderComponent: ExecutiveSummaryLoadpointExpandButtonComponent,
    },
  };

  constructor(public dialogRef: NbDialogRef<ExecutiveSummaryDialogComponent>) {}

  public close(): void {
    this.dialogRef.close();
  }
}
