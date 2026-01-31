export interface PaginatedItems<T> {
    totalRecords: number;
    items: T[];
    skipToken?: string | null;
}