import { Injectable } from '@angular/core';
import { PdfTemplateEnum } from '../enums/pdf-template.enum';
import { PdfWorkerDataModel } from '../models/pdf-worker-data.model';
import { WebWorkerModel } from '../models/web-worker.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }


  async generateReport(reportTemplate: PdfTemplateEnum, sheetData: any, fileName: string, encryptPassword?: string) {

    const data: WebWorkerModel<PdfTemplateEnum, PdfWorkerDataModel> = {
      data: {
        data: sheetData,
        fileName,
        encryptPassword
      },
      method: reportTemplate,
    }

    this.processReport(data)
  }

  async processReport(data: WebWorkerModel<PdfTemplateEnum, PdfWorkerDataModel>) {
    const response = await (await import('../functions/pdf.function')).ProcessReport(data);
    response.save(data.data.fileName);
  }

}
