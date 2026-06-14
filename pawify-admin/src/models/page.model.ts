export interface IPage<T> {
  content: T[];
  first: boolean;
  last: boolean;
  number: number; // page number
  total_pages: number;
}

export interface IPageCursor<T> {
  content: T[];
  has_next: boolean;
  cursor: string;
}
