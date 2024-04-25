import request from 'supertest';
import { app } from '../../app';
import { getCookieHeader } from '../../test/utils';

describe('new', () => {
  const apiRoute = '/api/tickets';

  const requestAgent = request.agent(app);

  let cookie: string[];

  beforeAll(() => {
    cookie = getCookieHeader();
  });

  it('should have a route handler listening to /api/tickets for post requests', async () => {
    return requestAgent
      .post(apiRoute)
      .send({})
      .expect((response) => {
        expect(response.status).not.toEqual(404);
      });
  });

  it('should only be accessed if the user is signed in', async () => {
    return requestAgent.post(apiRoute).send({}).expect(401);
  });

  it('should return a status other than 401 if the user is signed in', async () => {
    return requestAgent
      .post(apiRoute)
      .set('Cookie', cookie)
      .send({})
      .expect((response) => {
        expect(response.status).not.toEqual(401);
      });
  });

  it('should return an error if an invalid title is provided', async () => {
    await requestAgent
      .post(apiRoute)
      .set('Cookie', cookie)
      .send({
        title: '',
        price: 30,
      })
      .expect(400);

    await requestAgent
      .post(apiRoute)
      .set('Cookie', cookie)
      .send({
        price: 30,
      })
      .expect(400);
  });

  it('should return an error if an invalid price is provided', async () => {
    await requestAgent
      .post(apiRoute)
      .set('Cookie', cookie)
      .send({
        title: 'asdf',
        price: -10,
      })
      .expect(400);

    await requestAgent
      .post(apiRoute)
      .set('Cookie', cookie)
      .send({
        title: 'asdf',
      })
      .expect(400);
  });

  it('should create a new ticket', async () => {
    return requestAgent
      .post(apiRoute)
      .send({
        title: 'Concert',
        price: '20',
      })
      .expect(201);
  });
});
