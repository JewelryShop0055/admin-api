interface paginationItemOptions<T> {
  data: T[];
  totalItemCount: number;
  currentPage: number;
  limit: number;
}

export class paginationItems<T> {
  readonly data: T[];
  readonly maxPage: number;
  readonly currentPage: number;

  constructor({
    data,
    totalItemCount,
    limit,
    currentPage,
  }: paginationItemOptions<T>) {
    this.data = data;
    this.currentPage = currentPage;
    const maxPage = Math.ceil(totalItemCount / limit);
    this.maxPage = maxPage < 1 ? 1 : maxPage;
  }
}
