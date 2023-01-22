import { Injectable } from '@angular/core';
import { XlsxTemplateEnum } from '../enums/xlsx-template.enum';
import { NormalizeCommonJSImport } from '../functions/normalize-common-js-import.funtion';
import { WebWorkerModel } from '../models/web-worker.model';
import { XlsxWorkerDataModel } from '../models/xlsx-worker-data.model';

@Injectable({
  providedIn: 'root'
})
export class XlsxService {

  xlsxPopulate: any;

  constructor() { }

  async getXlsxTemplate(url: XlsxTemplateEnum): Promise<ArrayBuffer> {
    const response = await fetch(url);
    return await response.arrayBuffer();
  }

  async generateReport(reportTemplateUrl: XlsxTemplateEnum, sheetData: any, fileName: string, encryptPassword?: string) {
    // get workbook template
    const workbookTemplate = await this.getXlsxTemplate(reportTemplateUrl);

    const data: WebWorkerModel<XlsxTemplateEnum, XlsxWorkerDataModel> = {
      data: {
        data: sheetData,
        workbookTemplate,
        fileName,
        encryptPassword
      },
      method: reportTemplateUrl,
    }

    this.processReport(data)
  }

  async processReport(data: WebWorkerModel<XlsxTemplateEnum, XlsxWorkerDataModel>) {
    if (typeof (Worker) !== "undefined") {
      // use web worker if supported by browser
      const worker = new Worker('../workers/xlsx.worker', { type: 'module' });
      worker.onmessage = ({ data: response }) => {
        this.downloadReport(response, data.data.fileName);
        worker.terminate();
      };
      worker.postMessage(data);
    } else {
      //not supported
      const parser = await NormalizeCommonJSImport(import('xlsx-populate/browser/xlsx-populate.min'));
      const response = await (await import('../functions/xlsx.function')).ProcessReport(parser, data);
      this.downloadReport(response, data.data.fileName);
    }
  }

  downloadReport(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
