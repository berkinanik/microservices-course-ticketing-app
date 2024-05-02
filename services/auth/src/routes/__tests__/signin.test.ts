import request from 'supertest';
import { app } from '../../app';
import { signout, signup } from '../../test/utils';

describe('signin', () => {
  const apiRoute = '/api/users/signin';

  const requestAgent = request.agent(app);

  beforeEach(async () => {
    await signup(requestAgent);

    await signout(requestAgent, 200);
  });

  afterEach(async () => {
    await signout(requestAgent);
  });

  it('returns a 200 on successful signin', async () => {
    return requestAgent
      .post(apiRoute)
      .send({
        email: 'user@test.com',
        password: 'password',
      })
      .expect(200);
  });

  it('fails when an incorrect password is supplied', async () => {
    return requestAgent
      .post(apiRoute)
      .send({
        email: 'user@test.com',
        password: 'wrongPassword',
      })
      .expect(400);
  });

  it('returns a 400 with an invalid email and/or password', async () => {
    await requestAgent
      .post(apiRoute)
      .send({
        email: 'user@test',
        password: 'password',
      })
      .expect(400);

    await requestAgent
      .post(apiRoute)
      .send({
        email: 'user@test.com',
        password: 'p',
      })
      .expect(400);

    await requestAgent
      .post(apiRoute)
      .send({
        email: '',
        password: '',
      })
      .expect(400);

    return requestAgent.post(apiRoute).send().expect(400);
  });

  it('sets a cookie after successful signin', async () => {
    const response = await requestAgent
      .post(apiRoute)
      .send({
        email: 'user@test.com',
        password: 'password',
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
