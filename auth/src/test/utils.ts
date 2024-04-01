import TestAgent from 'supertest/lib/agent';

export const signup = async (
  agent: TestAgent,
  body = {
    email: 'user@test.com',
    password: 'password',
  },
) => {
  return await agent.post('/api/users/signup').send(body).expect(201);
};

export const signout = async (agent: TestAgent, expect?: number) => {
  return !!expect
    ? await agent.post('/api/users/signout').send().expect(expect)
    : await agent.post('/api/users/signout').send();
};
