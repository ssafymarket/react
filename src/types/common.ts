export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
}

export type PaginatedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type ApiError = {
  message: string;
  code?: string;
  status?: number;
}
