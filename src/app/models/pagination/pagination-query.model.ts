export interface PaginationQuery {
    pageNumber: number;
    pageSize: number;
    searchTerm?: string | null;
    skipToken?: string | null;
}