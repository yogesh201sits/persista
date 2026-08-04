export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: ResponseMeta;
}

export interface ResponseMeta {
  requestId?: string;
  timestamp: string;
}