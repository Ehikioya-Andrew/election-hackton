import { PdfTemplateEnum } from '../enums/pdf-template.enum';
import { PdfWorkerDataModel } from '../models/pdf-worker-data.model';
import { WebWorkerModel } from '../models/web-worker.model';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

export function ProcessReport(input: WebWorkerModel<PdfTemplateEnum, PdfWorkerDataModel>) {
    let response
    switch (input.method) {

        case PdfTemplateEnum.LoadPointReport:
            response = GenerateLoadPointReport(input.data);
            break;
        case PdfTemplateEnum.PowerSourceReport:
            response = GeneratePowerSourceReport(input.data);
            break;
        // case PdfTemplateEnum.AuditReport:
        default:
            response = GenerateBasicReport(input.data);
            break;
    }
    return response;
}

async function GenerateBasicReport(data: PdfWorkerDataModel): Promise<jsPDF> {
    const doc = new jsPDF();
    // Title
    setLetterHead(doc);
    doc.setFontSize(18)
    doc.setTextColor(70)
    doc.text(`${data.data.title}`, 10, 10);

    doc.setFontSize(11)
    doc.setTextColor(100)
    autoTable(doc, {
        head: data.data.header,
        body: data.data.body,
        margin: { top: 20 },
        headStyles: { fillColor: [51, 102, 255] },
    });
    setPageCount(doc, data);

    return doc;
}

async function GenerateLoadPointReport(data: PdfWorkerDataModel): Promise<jsPDF> {
    const doc = new jsPDF();
    // Title
    setLetterHead(doc);
    doc.setFontSize(11);
    doc.setTextColor(100);


    autoTable(doc, {
        body: data.data.powerSummary,
        startY: 50,
        showHead: 'firstPage',
        styles: { overflow: 'hidden' },
        margin: { right: 107 },
    });

    autoTable(doc, {
        body: data.data.energySummary,
        startY: 50,
        showHead: 'firstPage',
        styles: { overflow: 'hidden' },
        margin: { left: 107 },
    });

    autoTable(doc, {
        head: data.data.header,
        body: data.data.breakdown,
        margin: { top: 30 },
        headStyles: { fillColor: [51, 102, 255] },
    })
    setPageCount(doc, data);

    return doc;
}

async function GeneratePowerSourceReport(data: PdfWorkerDataModel): Promise<jsPDF> {
    const doc = new jsPDF();
    // Title
    setLetterHead(doc);
    doc.setFontSize(11);
    doc.setTextColor(100);

    autoTable(doc, {
        body: data.data.demandSummary,
        startY: 55,
        showHead: 'firstPage',
        styles: { overflow: 'hidden' },
        margin: { right: 107 },
        didDrawPage: function () {
            doc.text('Summary', 15, 50);
        }
    });

    autoTable(doc, {
        body: data.data.supplySummary,
        startY: 55,
        showHead: 'firstPage',
        styles: { overflow: 'hidden' },
        margin: { left: 107 },
    });

    doc.text('Attached Load Points', 15, (doc as any).lastAutoTable.finalY + 20)
    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 25,
        head: data.data.loadPointHeader,
        body: data.data.attachedLoadPoints,
        headStyles: { fillColor: [51, 102, 255] },
    })
    doc.text('Attached Generating Units', 15, (doc as any).lastAutoTable.finalY + 15)
    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: data.data.GenSetHeader,
        body: data.data.attachedGenSets,
        headStyles: { fillColor: [196, 157, 39] },
    });
    setPageCount(doc, data);

    return doc;
}
function setPageCount(doc: jsPDF, data: PdfWorkerDataModel) {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        const footer = `Page ${i} of ${pageCount}`;
        doc.setFontSize(11);
        doc.setTextColor(100)
        doc.text(`${data.data.title}`, 15, i === 1 ? 40 : 15)
        doc.text(footer, pageWidth / 2 - (doc.getTextWidth(footer) / 2), pageHeight - 5, { baseline: 'bottom' });

    }
}

function setLetterHead(doc: jsPDF) {
    doc.addImage('assets/images/LASG-logo-blur.png', 'PNG', 5, 40, 200, 200);
    doc.setFont('Open Sans', 'bold');
    doc.setFontSize(18)
    doc.setTextColor(70)
    doc.addImage('assets/images/LSG-lagos-logo.png', 'PNG', 15, 10, 20, 20);
    doc.text('Lagos State Ministry of Energy', 65, 20);
    doc.setFontSize(14);
    doc.setTextColor(50);
    doc.text('Live Monitoring Solution', 80, 28);
}