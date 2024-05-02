import { type AxiosResponse, type AxiosInstance, type AxiosRequestConfig, AxiosError } from 'axios';

import { type CommonResponse } from './types';

export const handleRequest = async <T, D>(
  client: AxiosInstance,
  url: string,
  data?: D,
  config?: AxiosRequestConfig<D>,
): Promise<CommonResponse<T>> => {
  try {
    const response = await client.request<T, AxiosResponse<T>, D>({
      url,
      data,
      ...config,
    });

    return Promise.resolve({
      ok: true,
      status: response.status,
      data: response.data,
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      return Promise.resolve({
        ok: false,
        status: err.response?.status ?? 500,
        errors: (
          err.response?.data as {
            errors: {
              message: string;
              field?: string;
            }[];
          }
        ).errors,
      });
    }

    return Promise.reject(err);
  }
};
