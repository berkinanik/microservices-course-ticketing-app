import request from 'supertest';
import { app } from '../../app';
import { signUp } from '../../test/utils';

describe('current-user', () => {
  const apiRoute = '/api/users/current-user';

  const requestAgent = request.agent(app);

  it('returns a 200 with current user as null if not authenticated', async () => {
    const response = await requestAgent.get(apiRoute).send().expect(200);

    expect(response.body).toHaveProperty('currentUser', null);
  });

  it('returns a 200 and removes cookie', async () => {
    await signUp(requestAgent);

    const response = await requestAgent.get(apiRoute).send().expect(200);

    expect(response.body).toHaveProperty(
      'currentUser',
      expect.objectContaining({
        email: 'user@test.com',
      }),
    );
  });
});
