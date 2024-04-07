class NotOKResponse extends Error {
  constructor(public res: Response) {
    super();

    Object.setPrototypeOf(this, NotOKResponse.prototype);
  }
}

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

type CommonResponse<T> = CommonSuccessResponse<T> | CommonErrorResponse;

export const customFetch = async <T = unknown>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, unknown>,
): Promise<CommonResponse<T>> => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
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
