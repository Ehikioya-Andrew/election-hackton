import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbCalendarRange, NbDateService, NbDialogRef } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { finalize, takeWhile } from 'rxjs/operators';
import { TariffService } from 'src/app/@core/data-services/tariff.service';
import {
  AssetTypeEnumBilling,
  AssetTypeNameBilling,
  DownloadTypeNameBilling,
} from 'src/app/@core/enums/asset-type.enum';
import { DateFormatter } from 'src/app/@core/functions/formatter.funtion';
import papaparse from 'papaparse';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss'],
})
export class UploadFormComponent {
  isLoading = false;
  range!: NbCalendarRange<Date>;

  @Input() date!: Date;

  errors: string[] = [];
  messages: string[] = [];

  submitted: boolean = false;

  @Input() assetType!: AssetTypeEnumBilling;

  isLive = true;

  assetTypeName = Array.from(AssetTypeNameBilling);

  get monthStart(): Date {
    return this.dateService.getMonthStart(new Date());
  }

  uploadProgress: number = 0;
  uploadSub!: Subscription;

  columns = {};
  get status() {
    if (this.uploadProgress <= 25) {
      return 'danger';
    } else if (this.uploadProgress <= 50) {
      return 'warning';
    } else if (this.uploadProgress <= 75) {
      return 'info';
    } else {
      return 'success';
    }
  }

  files: File[] = [];
  alerts: any;
  disable: boolean = false;
  showReset: boolean = false;
  isUploaded: boolean = true;
  formData = new FormData();

  isLoadingData = true;
  errorMessage: any;

  // columns: any = [];
  uploadData: any = [];

  constructor(
    public dialogRef: NbDialogRef<UploadFormComponent>,
    private formBuilder: UntypedFormBuilder,
    protected dateService: NbDateService<Date>,
    private tariffService: TariffService,
    protected router: Router
  ) {}


  close(): void {
    this.dialogRef.close(false);
  }

  uploadFile() {
    this.submitted = true;
    this.messages = []
    this.errors = []
    this.isLoading = true;
    this.uploadProgress = 0;
    const filter = {
      date: new DatePipe('en-EU').transform(this.date, 'MM/dd/YYYY') as string,
      assetType: this.assetType,
    };
    //implement the upload feature
    const upload$ = this.tariffService
      .uploadTariffTemplate({ ...filter }, this.formData)
      .pipe(finalize(() => this.reset()));
    this.uploadSub = upload$.subscribe((event) => {
      this.isLoading = false;
      if(event.body && event.body.status){
        this.submitted = false;
        this.messages = ['Billing Uploaded Successfully'];
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 1500);
      }
      else if (event.body && !event.body.status) {
        this.errors = [event.body.message];
      }
      if (event.type == HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round(100 * (event.loaded / event.total));
      }
    });

  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.submitted = false;
    this.uploadProgress = 0;
    this.uploadData = [];
    this.columns = {};
    this.uploadSub.unsubscribe();
  }

  async onSelect(event: any) {
    this.submitted = true;
    this.files.push(...event.addedFiles);
    if (this.files.length == 1) {
      this.disable = true;
      this.showReset = true;
      this.isUploaded = false;
    }
    for (var i = 0; i < this.files.length; i++) {
      this.formData.append('file', this.files[i]);
    }

    this.uploadData = await this.someButtonClicked(this.files[0]);
    if (this.uploadData.length < 1) {
      this.errors = ['Uploaded file does not contain data kindly reupload'];
    } else {
      this.prepareHeader(Object.keys(this.uploadData[0]));
    }

    this.submitted = false;

  }

  someButtonClicked = async (rawFile: File) => {
    const parseFile = (rawFile: any) => {
      return new Promise((resolve) => {
        papaparse.parse(rawFile, {
          header: true,
          complete: (results: any) => {
            resolve(results.data);
          },
        });
      });
    };
    let parsedData = await parseFile(rawFile);
    return parsedData;
  };

  prepareHeader(data: any) {
    if (!data.length) return;
    data.forEach((header: any, index: number) => {
      delete data[1];
      this.columns = Object.assign(this.columns, {
        [data[index]]: {
          title: data[index].replace(/([a-z])([A-Z])/g, '$1 $2'),
          filter: false,
        },
      });
    });
    return this.columns;
  }

  onClose(event: any) {
    this.errors = [];
    this.isUploaded = true;
    this.resetFile()
  }
  resetFile() {
    this.showReset = false;
    this.files = [];
    this.uploadData = [];
    this.columns = {};
    this.disable = false;
    this.isUploaded = true;
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}
