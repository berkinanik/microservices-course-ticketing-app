import request from 'supertest';
import { app } from '../../app';

describe('signin', () => {
  const apiRoute = '/api/users/signin';

  beforeEach(async () => {
    await request(app).post('/api/users/signup').send({
      email: 'user@test.com',
      password: 'password',
    });

    await request(app).post('/api/users/signout').send();
  });

  it('returns a 200 on successful signin', async () => {
    return request(app)
      .post(apiRoute)
      .send({
        email: 'user@test.com',
        password: 'password',
      })
      .expect(200);
  });

  it('fails when an incorrect password is supplied', async () => {
    return request(app)
      .post(apiRoute)
      .send({
        email: 'user@test.com',
        password: 'wrongPassword',
      })
      .expect(400);
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

  it('sets a cookie after successful signin', async () => {
    const response = await request(app)
      .post(apiRoute)
      .send({
        email: 'user@test.com',
        password: 'password',
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
