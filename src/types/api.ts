// @ts-nocheck
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, any>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
    details?: any;
  };
}

export interface ApiPaginatedMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiSuccessResponse<T[]> {
  meta: ApiPaginatedMeta;
}

export const successResponse = <T>(data: T, meta?: Record<string, any>): ApiSuccessResponse<T> => {
  return { success: true, data, ...(meta ? { meta } : {}) };
};

export const errorResponse = (code: string, message: string, requestId?: string, details?: any): ApiErrorResponse => {
  return {
    success: false,
    error: {
      code,
      message,
      ...(requestId ? { requestId } : {}),
      ...(details ? { details } : {}),
    },
  };
};

export const paginatedResponse = <T>(data: T[], pagination: ApiPaginatedMeta): PaginatedResponse<T> => {
  return {
    success: true,
    data,
    meta: pagination,
  };
};
