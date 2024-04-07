import { type headers } from 'next/headers';

import { customFetch } from './customFetch';
import { type CustomFetchOptions } from './types';

export const customFetchServer = async <T = unknown>(
  url: string,
  headersFn: typeof headers,
  options?: CustomFetchOptions,
) => {
  const authCookie = headersFn().get('cookie');
  const requestHeaders = new Headers();
  if (authCookie) requestHeaders.set('cookie', authCookie);

  return customFetch<T>(url, {
    ...options,
    headers: requestHeaders,
  });
};
