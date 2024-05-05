import TestAgent from 'supertest/lib/agent';

export const signUp = async (
  agent: TestAgent,
  body = {
    email: 'user@test.com',
    password: 'password',
  },
) => {
  return await agent.post('/api/users/sign-up').send(body).expect(201);
};

export const signOut = async (agent: TestAgent, expect?: number) => {
  return !!expect
    ? await agent.post('/api/users/sign-out').send().expect(expect)
    : await agent.post('/api/users/sign-out').send();
};
