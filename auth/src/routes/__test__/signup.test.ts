import request from 'supertest';
import { app } from '../../app';

describe('signup', () => {
  const apiRoute = '/api/users/signup';

  it('returns a 201 on successful signup', async () => {
    return request(app)
      .post(apiRoute)
      .send({
        email: 'user@test.com',
        password: 'password',
      })
      .expect(201);
  });

  it('returns a 400 with an invalid email and/or password', async () => {
    await request(app)
      .post(apiRoute)
      .send({
        email: 'user@test',
        password: 'password',
      })
      .expect(400);

    await request(app)
      .post(apiRoute)
      .send({
        email: 'user@test.com',
        password: 'p',
      })
      .expect(400);

    await request(app)
      .post(apiRoute)
      .send({
        email: '',
        password: '',
      })
      .expect(400);

    return request(app).post(apiRoute).send().expect(400);
  });

  it('disallows duplicate emails', async () => {
    await request(app)
      .post(apiRoute)
      .send({
        email: 'user@test.com',
        password: 'password',
      })
      .expect(201);

    return request(app)
      .post(apiRoute)
      .send({
        email: 'user@test.com',
        password: 'password',
      })
      .expect(400);
  });

  it('sets a cookie after successful signup', async () => {
    const response = await request(app)
      .post(apiRoute)
      .send({
        email: 'user@test.com',
        password: 'password',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
