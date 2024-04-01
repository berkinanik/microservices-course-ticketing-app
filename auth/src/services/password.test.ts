import { Password } from './password';

describe('Password service', () => {
  const password = 'my-password';
  let hashed: string;

  beforeAll(async () => {
    hashed = await Password.toHash(password);
  });

  it('toHash returns hashed password with salt', async () => {
    const [hashWithoutSalt, salt] = hashed.split('.');
    expect(hashWithoutSalt).toBeTruthy();
    expect(salt).toBeTruthy();
    expect(password).not.toEqual(hashed);
    expect(password).not.toEqual(hashWithoutSalt);
    expect(password).not.toEqual(salt);
  });

  it('compares given password with hash', async () => {
    expect(await Password.compare(hashed, password)).toBeTruthy();
    expect(!(await Password.compare(hashed, 'not-my-password'))).toBeTruthy();
  });
});
