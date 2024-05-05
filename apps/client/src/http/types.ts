import { type AxiosRequestConfig } from 'axios';

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
  errors: CommonError[];
};

export type CommonError = {
  message: string;
  field?: string;
};

export type CommonResponse<T> = CommonSuccessResponse<T> | CommonErrorResponse;

export type RequestHandler = <T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>,
) => Promise<CommonResponse<T>>;
