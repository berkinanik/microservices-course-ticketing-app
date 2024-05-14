import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import {
  NotFoundError,
  currentUserMiddleware,
  errorHandlerMiddleware,
} from '@b.anik/ticketing-common';
import {
  deleteTicketRouter,
  healthRouter,
  newTicketRouter,
  showTicketRouter,
  updateTicketRouter,
} from './routes';

const app = express();

// Trust incoming traffic coming from proxy
app.set('trust proxy', true);

// 3rd party middlewares
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

app.use(healthRouter);

// Middlewares run before route handlers
app.use(currentUserMiddleware);

// Route handlers
app.use(newTicketRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);
app.use(deleteTicketRouter);

// Middlewares after route handlers
app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandlerMiddleware);

export { app };
