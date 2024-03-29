import express from 'express';
import { json } from 'body-parser';

import { errorHandler } from './middlewares';
import { NotFoundError } from './errors';

const app = express();
app.use(json());


app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
