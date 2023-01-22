import { environment } from "src/environments/environment";

export function GetUniqueArray<T>(newData: any[], oldData: any[], unshift = false, customIdField?: string): T[] {
    const newIds = newData.map((d) => !!customIdField ? d[customIdField] : d.id);
    const filteredOldData = oldData.filter(d => !newIds.includes(!!customIdField ? d[customIdField] : d.id));

    const transformedArray = (unshift ? [...newData, ...filteredOldData] : [...filteredOldData, ...newData]) as T[];
    return transformedArray;
}

export function DataRequestTransformer(data: any): any {
    const { nosOfRecords } = data.paging;
    const columnFilters = (data.filter as any[]).reduce((obj, item) => (obj[item.field] = item.search, obj), {});;
    const page = Math.floor(nosOfRecords / environment.paginationLength) + 1;
    const size = environment.paginationLength;
    return { ...columnFilters, page, size };
}