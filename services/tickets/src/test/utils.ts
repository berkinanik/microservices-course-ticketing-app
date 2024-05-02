import jwt from 'jsonwebtoken';

export const getCookieHeader = (
  body = {
    id: 'user-id-123',
    email: 'user@test.com',
  },
) => {
  // build a JWT payload { id, email }
  const payload = {
    id: body.id,
    email: body.email,
  };

  // create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object { jwt: MY_JWT }
  const session = { jwt: token };

  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string that's the cookie with the encoded data
  return [`session=${base64}`];
};
