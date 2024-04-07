type CommonSuccessResponse<T> = {
  status: number;
  ok: true;
  data: T;
  errors?: never;
};

type CommonErrorResponse = {
  status: number;
  ok: false;
  data?: never;
  errors: {
    message: string;
    field?: string;
  }[];
};

export type CommonResponse<T> = CommonSuccessResponse<T> | CommonErrorResponse;

export type CustomFetchOptions = Omit<RequestInit, 'method' | 'body'> & {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
};
