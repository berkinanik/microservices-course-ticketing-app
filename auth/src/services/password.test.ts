import { describe, it } from 'node:test';
import assert from 'node:assert';

import { Password } from './password';

describe('Password service', async () => {
  const password = 'my-password';
  const hashed = await Password.toHash(password);

  it('toHash returns hashed password with salt', async () => {
    const [hashWithoutSalt, salt] = hashed.split('.');
    assert(hashWithoutSalt);
    assert(salt);
    assert.notEqual(password, hashed);
    assert.notEqual(password, hashWithoutSalt);
    assert.notEqual(password, salt);
  });

  it('compares given password with hash', async () => {
    assert(await Password.compare(hashed, password));
    assert(!(await Password.compare(hashed, 'not-my-password')));
  });
});
