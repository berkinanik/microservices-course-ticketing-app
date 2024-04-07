import { type CommonResponse, type CustomFetchOptions } from './types';

class NotOKResponse extends Error {
  constructor(public res: Response) {
    super();

    Object.setPrototypeOf(this, NotOKResponse.prototype);
  }
}

export const customFetch = async <T = unknown>(
  url: string,
  options: CustomFetchOptions = {
    method: 'GET',
  },
): Promise<CommonResponse<T>> => {
  const requestHeaders = new Headers(options.headers);
  requestHeaders.set('Content-Type', 'application/json');

  const response = await fetch(url, {
    ...options,
    headers: requestHeaders,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
    .then(async (res) => {
      if (res.ok) {
        return Promise.resolve({
          status: res.status,
          ok: true,
          data: (await res.json()) as T,
        });
      }

      return Promise.reject(new NotOKResponse(res));
    })
    .catch(async (err) => {
      if (err instanceof NotOKResponse) {
        return Promise.resolve({
          status: err.res.status,
          ok: false,
          ...((await err.res.json()) as {
            errors: {
              message: string;
              field?: string;
            }[];
          }),
        });
      }

      return Promise.reject(err);
    });

  return response as CommonResponse<T>;
};
