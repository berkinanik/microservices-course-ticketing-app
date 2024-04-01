import request from 'supertest';
import { app } from '../../app';

describe('current-user', () => {
  const apiRoute = '/api/users/current-user';

  const requestAgent = request.agent(app);

  it('returns a 400 if not authenticated', async () => {
    return requestAgent.get(apiRoute).send().expect(401);
  });

  it('returns a 200 and removes cookie', async () => {
    await requestAgent
      .post('/api/users/signup')
      .send({
        email: 'user@test.com',
        password: 'password',
      })
      .expect(201);

    const response = await requestAgent.get(apiRoute).send().expect(200);

    expect(response.body).toHaveProperty(
      'currentUser',
      expect.objectContaining({
        email: 'user@test.com',
      }),
    );
  });
});
