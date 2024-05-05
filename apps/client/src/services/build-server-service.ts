import { cache } from 'react';

import { type headers as headersFn } from 'next/headers';

type ServerService<T> = (headers: typeof headersFn) => Promise<T>;

export const buildServerService = <T>(cb: ServerService<T>): ServerService<T> => {
  if (typeof window !== 'undefined') {
    throw new Error('This function should only be called on the server');
  }

  return cache(cb);
};
