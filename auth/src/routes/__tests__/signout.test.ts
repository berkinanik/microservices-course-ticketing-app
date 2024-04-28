import request from 'supertest';
import { app } from '../../app';
import { signup } from '../../test/utils';

describe('signout', () => {
  const apiRoute = '/api/users/signout';

  const requestAgent = request.agent(app);

  it('returns a 200 and removes cookie', async () => {
    await signup(requestAgent);

    const response = await requestAgent.post(apiRoute).send().expect(200);

    expect(response.get('Set-Cookie')).toContain(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
    );
  });
});
