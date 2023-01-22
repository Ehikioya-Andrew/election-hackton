export interface XlsxWorkerDataModel {
    workbookTemplate: ArrayBuffer;
    data: any;
    encryptPassword?: string;
    fileName: string;
}
