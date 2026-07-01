export type PaginatedResult<T> = {
  items: T[];
  total_pages: number;
  current_page: number;
  limit: number;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};
