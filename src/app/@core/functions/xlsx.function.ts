import { XlsxTemplateEnum } from '../enums/xlsx-template.enum';
import { WebWorkerModel } from '../models/web-worker.model';
import { XlsxWorkerDataModel } from '../models/xlsx-worker-data.model';

export function ProcessReport(parser: any, input: WebWorkerModel<XlsxTemplateEnum, XlsxWorkerDataModel>) {
    let response
    switch (input.method) {
        case XlsxTemplateEnum.BasicReport:
            response = GenerateBasicReport(parser, input.data);
            break;
        case XlsxTemplateEnum.AuditReport:
            response = GenerateAuditReport(parser, input.data);
            break;
        case XlsxTemplateEnum.LoadPointReport:
            response = GenerateLoadPointReport(parser, input.data);
            break;
        case XlsxTemplateEnum.LoadPointsSummaryReport:
            response = GenerateLoadPointsSummaryReport(parser, input.data);
            break;
        case XlsxTemplateEnum.GeneratingUnitsSummaryReport:
            response = GenerateGeneratingUnitSummaryReport(parser, input.data);
            break;
        case XlsxTemplateEnum.GeneratingUnitReport:
            response = GenerateGeneratingUnitReport(parser, input.data);
            break;
        case XlsxTemplateEnum.PowerStationsSummaryReport:
            response = GeneratePowerStationsSummaryReport(parser, input.data);
            break;
        case XlsxTemplateEnum.PowerStationsReport:
            response = GeneratePowerStationsReport(parser, input.data);
            break;
        default:
            response = GenerateBasicReport(parser, input.data);
            break;
    }
    return response;
}

async function GenerateBasicReport(parser: any, data: XlsxWorkerDataModel): Promise<Blob> {
    const workbook = await parser.fromDataAsync(data.workbookTemplate);
    workbook.sheet(0).active(true).cell("A4").value(data.data);
    return await workbook.outputAsync({ password: data.encryptPassword }) as Blob;
}

async function GenerateAuditReport(parser: any, data: XlsxWorkerDataModel): Promise<Blob> {
    const workbook = await parser.fromDataAsync(data.workbookTemplate);
    // date range
    workbook.sheet(0).active(true).cell("C2").value(data.data.date);
    // Audit Body
    workbook.sheet(0).active(true).cell("B5").value(data.data?.body?.length ? data.data?.body : [['No Data Found']]);
    return await workbook.outputAsync({ password: data.encryptPassword }) as Blob;
}

async function GenerateLoadPointsSummaryReport(parser: any, data: XlsxWorkerDataModel): Promise<Blob> {
    const workbook = await parser.fromDataAsync(data.workbookTemplate);
    // date range
    workbook.sheet(0).active(true).cell("C2").value(data.data.date);
    // Load Point Body
    workbook.sheet(0).active(true).cell("B5").value(data.data?.body?.length ? data.data?.body : [['No Data Found']]);
    return await workbook.outputAsync({ password: data.encryptPassword }) as Blob;
}
async function GenerateLoadPointReport(parser: any, data: XlsxWorkerDataModel): Promise<Blob> {
    const workbook = await parser.fromDataAsync(data.workbookTemplate);
    // date range
    workbook.sheet(0).active(true).cell("C2").value(data.data.date);
    // Location Name
    workbook.sheet(0).active(true).cell("C3").value(data.data.name);
    // Power Summary
    workbook.sheet(0).active(true).cell("C6").value(data.data.powerSummary);
    // Energy Summary
    workbook.sheet(0).active(true).cell("G6").value(data.data.energySummary);
    // Breakdown
    workbook.sheet(0).active(true).cell("B11").value(data.data?.breakdown?.length ? data.data?.breakdown : [['No Data Found']]);
    return await workbook.outputAsync({ password: data.encryptPassword }) as Blob;
}

async function GenerateGeneratingUnitSummaryReport(parser: any, data: XlsxWorkerDataModel): Promise<Blob> {
    const workbook = await parser.fromDataAsync(data.workbookTemplate);
    // date range
    workbook.sheet(0).active(true).cell("C2").value(data.data.date);
    // Generating Unit Body
    workbook.sheet(0).active(true).cell("B5").value(data.data?.body?.length ? data.data?.body : [['No Data Found']]);
    return await workbook.outputAsync({ password: data.encryptPassword }) as Blob;
}

async function GenerateGeneratingUnitReport(parser: any, data: XlsxWorkerDataModel): Promise<Blob> {
    const workbook = await parser.fromDataAsync(data.workbookTemplate);
    // date range
    workbook.sheet(0).active(true).cell("C2").value(data.data.date);
    // Location Name
    workbook.sheet(0).active(true).cell("C3").value(data.data.name);
    // Power Summary
    workbook.sheet(0).active(true).cell("C6").value(data.data.powerSummary);
    // Energy Summary
    workbook.sheet(0).active(true).cell("G6").value(data.data.energySummary);
    // Breakdown
    workbook.sheet(0).active(true).cell("B11").value(data.data?.breakdown?.length ? data.data?.breakdown : [['No Data Found']]);
    return await workbook.outputAsync({ password: data.encryptPassword }) as Blob;
}

async function GeneratePowerStationsSummaryReport(parser: any, data: XlsxWorkerDataModel): Promise<Blob> {
    const workbook = await parser.fromDataAsync(data.workbookTemplate);
    // date range
    workbook.sheet(0).active(true).cell("C2").value(data.data.date);
    // Generating Unit Body
    workbook.sheet(0).active(true).cell("B5").value(data.data?.body?.length ? data.data?.body : [['No Data Found']]);
    return await workbook.outputAsync({ password: data.encryptPassword }) as Blob;
}
async function GeneratePowerStationsReport(parser: any, data: XlsxWorkerDataModel): Promise<Blob> {
    const workbook = await parser.fromDataAsync(data.workbookTemplate);
    //Sheet 1
    // date range
    workbook.sheet(0).active(true).cell("C2").value(data.data.date);
    // Location Name
    workbook.sheet(0).active(true).cell("C3").value(data.data.name);
    // Demand Summary
    workbook.sheet(0).active(true).cell("C6").value(data.data.demandSummary);
    // Supply Summary
    workbook.sheet(0).active(true).cell("F6").value(data.data.supplySummary);
    //Sheet 2
    // date range
    workbook.sheet(1).active(true).cell("C2").value(data.data.date);
    // Location Name
    workbook.sheet(1).active(true).cell("C3").value(data.data.name);
    // Attached Load Points
    workbook.sheet(1).active(true).cell("B7").value(data.data?.attachedLoadPoints?.length ? data.data?.attachedLoadPoints : [['No Data Found']]);
    //Sheet 3
    // date range
    workbook.sheet(2).active(true).cell("C2").value(data.data.date);
    // Location Name
    workbook.sheet(2).active(true).cell("C3").value(data.data.name);
    // Attached Load Points
    workbook.sheet(2).active(true).cell("B7").value(data.data?.attachedGenSets?.length ? data.data?.attachedGenSets : [['No Data Found']]);
    return await workbook.outputAsync({ password: data.encryptPassword }) as Blob;
}