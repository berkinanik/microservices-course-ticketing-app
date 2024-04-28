import request from 'supertest';
import { app } from '../../app';
import { signup } from '../../test/utils';

describe('current-user', () => {
  const apiRoute = '/api/users/current-user';

  const requestAgent = request.agent(app);

  it.skip('returns a 400 if not authenticated', async () => {
    return requestAgent.get(apiRoute).send().expect(401);
  });

  it('returns a 200 with current user as null if not authenticated', async () => {
    const response = await requestAgent.get(apiRoute).send().expect(200);

    expect(response.body).toHaveProperty('currentUser', null);
  });

  it('returns a 200 and removes cookie', async () => {
    await signup(requestAgent);

    const response = await requestAgent.get(apiRoute).send().expect(200);

    expect(response.body).toHaveProperty(
      'currentUser',
      expect.objectContaining({
        email: 'user@test.com',
      }),
    );
  });
});
