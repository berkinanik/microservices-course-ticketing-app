import { type headers } from 'next/headers';

import axios, { AxiosHeaders } from 'axios';

import { getRequestHandlers } from './getRequestHandlers';

export const buildClientServer = (headersFn: typeof headers) => {
  const requestHeaders = new AxiosHeaders();

  requestHeaders.set('host', 'ticketing.dev');

  const authCookie = headersFn().get('cookie');
  if (authCookie) requestHeaders.set('cookie', authCookie);

  const client = axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers: requestHeaders,
  });

  return getRequestHandlers(client);
};
