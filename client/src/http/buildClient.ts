import axios from 'axios';

import { getRequestHandlers } from './getRequestHandlers';

export const buildClient = () => {
  const client = axios.create({
    baseURL: '/',
  });

  return getRequestHandlers(client);
};
