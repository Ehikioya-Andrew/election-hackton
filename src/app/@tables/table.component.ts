import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { takeWhile, filter } from 'rxjs/operators';
import { DataRequestTransformer } from '../@core/functions/data-request.funtion';

export interface TableConfig<T> {
  title: string;
  columns: {
    [Property in keyof T]: {
      title: string;
      filter: boolean;
    };
  };
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy {
  // Inputs
  @Input()
  tableTitle!: string;

  @Input()
  subTitle!: string;

  @Input()
  isLoading = false;

  @Input()
  tableOnly = false;

  @Input()
  hideHeader = false;

  @Input()
  showEdit = true;

  @Input()
  showAdd = true;

  @Input()
  pageLength = 10;

  @Input()
  hasCloseButton = false;
  @Output()
  closed = new EventEmitter<any>();

  @Input()
  public set config(v: TableConfig<any>[]) {
    this.#config = v;
  }
  public get config(): TableConfig<any>[] {
    return this.#config;
  }

  @Input()
  public set data(v: any[]) {
    this.source.load(v);
    this.#data = v;
  }
  public get data(): any[] {
    return this.#data;
  }
  @Input()
  public set columns(columns: any) {
    this.settings = { ...this.#baseSettings, columns: { ...columns } };
  }
  // < Inputs End >

  // Outputs
  @Output()
  requestData: EventEmitter<any> = new EventEmitter();
  @Output()
  optionsSelected: EventEmitter<any> = new EventEmitter();
  @Output()
  addClicked: EventEmitter<any> = new EventEmitter();
  @Output()
  rowCLicked: EventEmitter<any> = new EventEmitter();
  // < Outputs End >

  #config!: TableConfig<any>[];
  #data!: any[];
  readonly #baseSettings = {
    mode: 'external',
    actions: {
      add: true,
      edit: true,
      delete: false,
      // position: isMobile ? 'left' : 'right'
    },
    edit: {
      editButtonContent: '<i class="eva eva-edit-2-outline table-icon"></i>',
    },
    add: {
      addButtonContent: '<i class="eva eva-plus-circle-outline"></i>',
    },
  };
  settings = {};
  source: LocalDataSource = new LocalDataSource([]);
  
  public recordLength = 0;

  isLive = true;

  constructor() {}

  ngOnInit(): void {
    this.settings = {
      ...this.settings,
      hideHeader: this.hideHeader,
      actions: {
        ...this.#baseSettings.actions,
        edit: this.showEdit,
        add: this.showAdd,
      },
      pager: {
        perPage: this.pageLength,
      },
    };
    this.source
      .onChanged()
      .pipe(takeWhile(() => this.isLive))
      .subscribe( async (event) => {
        this.recordLength = (await this.source.getFilteredAndSorted()).length || 0;
        switch (event.action) {
          case 'page':
          case 'filter':
            this.requestMoreData(event);
            break;
        }
      });

    
  }

  async requestMoreData(event: any) {
    const filteredElements = await this.source.getFilteredAndSorted();
    const nosOfPages =
      Math.floor(filteredElements.length / event.paging.perPage) + 1;
    const nosOfRecords = filteredElements.length;

    // If navigated to either of the last 2 pages, request more data
    const shouldRequest = nosOfPages - event.paging.page < 2;
    if (shouldRequest) {
      event.paging.nosOfPages = nosOfPages;
      event.paging.nosOfRecords = nosOfRecords;
      event.filter = (event.filter.filters as any[]).filter(
        (d) => d.search !== ''
      );
      this.requestData.emit({ ...DataRequestTransformer(event) });
    }
  }

  onEdit(event: any) {
    this.optionsSelected.emit(event);
  }

  onAdd() {
    this.addClicked.emit();
  }

  onRowClicked(event: any) {
    this.rowCLicked.emit(event);
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
