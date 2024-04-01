import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from './routes';
import { errorHandlerMiddleware, currentUserMiddleware } from './middlewares';
import { NotFoundError } from './errors';

const app = express();

// Trust incoming traffic coming from proxy
app.set('trust proxy', true);

// 3rd party middlewares
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  }),
);

// Middlewares run before route handlers
app.use(currentUserMiddleware);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

// Middlewares after route handlers
app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandlerMiddleware);

export { app };
