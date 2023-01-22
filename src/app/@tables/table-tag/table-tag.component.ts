import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'app-table-tag',
  templateUrl: './table-tag.component.html',
  styleUrls: ['./table-tag.component.scss'],
})
export class TableTagComponent implements ViewCell, OnInit {
  renderValue!: string;
  renderStatus = 'primary';

  @Input() value!: string | number;
  @Input() rowData: any;

  constructor() {}

  ngOnInit(): void {
    try {
      const { status, value } = JSON.parse(`${this.value}`);
      if (status && value) {
        this.renderStatus = status;
        this.renderValue = value;
      } else {
        this.renderValue = this.value.toString();
      }
    } catch (error) {
      this.renderValue = this.value.toString();
    }
  }
}
