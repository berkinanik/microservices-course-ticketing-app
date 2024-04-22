import { type AxiosInstance } from 'axios';

import { handleRequest } from './handleRequest';
import { type RequestHandler } from './types';

export const getRequestHandlers = (client: AxiosInstance) => {
  const get: RequestHandler = (url, data, config) =>
    handleRequest(client, url, data, { ...config, method: 'GET' });

  const post: RequestHandler = (url, data, config) =>
    handleRequest(client, url, data, { ...config, method: 'POST' });

  return {
    get,
    post,
  };
};
