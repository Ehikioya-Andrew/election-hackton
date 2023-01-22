import { Component, Input, OnInit } from '@angular/core';
import { BillingComparison } from 'src/app/@core/dtos/billing-comparison.dto';

@Component({
  selector: 'app-billing-status-toggle',
  templateUrl: './billing-status-toggle.component.html',
  styleUrls: ['./billing-status-toggle.component.scss']
})
export class BillingStatusToggleComponent implements OnInit {

  checked = true;
  @Input() rowData!: BillingComparison;

  constructor() { }

  ngOnInit(): void {
    this.checked = this.rowData?.hasBillingData === true ? true : false;
  }

}
