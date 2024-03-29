import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { currentUserRouter, signInRouter, signOutRouter, signUpRouter } from './routes';
import { errorHandler } from './middlewares';
import { NotFoundError } from './errors';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
