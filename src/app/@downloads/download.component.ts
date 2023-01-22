import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NbMenuService } from '@nebular/theme';
import { filter, map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit, OnDestroy {
  @Input()
  isDownloading = false;

  @Output()
  downloadCSVClicked: EventEmitter<any> = new EventEmitter();
  @Output()
  downloadPDFClicked: EventEmitter<any> = new EventEmitter();

  isLive = true;

  items = [
    { title: 'Download Excel', icon: 'close-square-outline' },
    { title: 'Download PDF', icon: 'file' },
  ];

  constructor(
    private nbMenuService: NbMenuService
  ) { }

  ngOnInit(): void {
    this.onUserContextMenuClick()
  }

  async downloadCSV() {
    this.downloadCSVClicked.emit();
  }
  async downloadPDF() {
    this.downloadPDFClicked.emit();
  }

  onUserContextMenuClick() {
    this.nbMenuService.onItemClick()
      .pipe(
        takeWhile(() => this.isLive),
        filter(({ tag }) => tag === 'my-context-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(
        (title) => {
          switch (title) {
            case 'Download Excel':
              this.downloadCSV();
              break;

            case 'Download PDF':
              this.downloadPDF();
              break;

            default:
              break;
          }
        }
      )
  }

  ngOnDestroy() {
    this.isLive = false;
  }

}
