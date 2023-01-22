export interface ListDto<T> {
    itemList: T[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    summary: string;
    hasPrevious: boolean;
    hasNext: boolean;
}