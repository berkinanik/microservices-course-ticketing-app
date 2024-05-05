import request from 'supertest';
import { app } from '../../app';
import { signUp } from '../../test/utils';

describe('signOut', () => {
  const apiRoute = '/api/users/sign-out';

  const requestAgent = request.agent(app);

  it('returns a 200 and removes cookie', async () => {
    await signUp(requestAgent);

    const response = await requestAgent.post(apiRoute).send().expect(200);

    expect(response.get('Set-Cookie')).toContain(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
    );
  });
});
