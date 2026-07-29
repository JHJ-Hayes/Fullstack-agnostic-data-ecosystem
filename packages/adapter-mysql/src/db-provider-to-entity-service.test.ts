import { createUserEntityService } from '@fae/core';
import { describe, expect, it } from 'vitest';
import {
  createMysqlUserProvider,
  createMysqlUserRepository,
} from './repository.js';
import { createFakeMysqlPool } from './testing/fake-pool.js';

const config = {
  host: 'localhost',
  port: 3306,
  user: 'test',
  password: '',
  database: 'fae',
  table: 'users',
} as const;

describe('MySQL Data Provider → User Entity Service', () => {
  it('fetch returns mapped Entity for a seeded Raw User', async () => {
    const pool = createFakeMysqlPool();
    const repository = createMysqlUserRepository(config, { pool });
    await repository.create({
      id: '1',
      user_name: 'Alice Chen',
      email_address: 'alice@example.com',
    });

    const provider = createMysqlUserProvider(config, { pool });
    const users = createUserEntityService({ provider });

    const user = await users.fetch('1');

    expect(user).toEqual({
      id: '1',
      name: 'Alice Chen',
      email: 'alice@example.com',
    });
    expect(user).not.toHaveProperty('user_name');

    await repository.disconnect();
  });

  it('fetch rejects with normalized error when id is missing', async () => {
    const pool = createFakeMysqlPool();
    const provider = createMysqlUserProvider(config, { pool });
    const users = createUserEntityService({ provider });

    await expect(users.fetch('missing')).rejects.toMatchObject({
      code: 'USER_NOT_FOUND',
      message: 'User "missing" not found',
    });

    await createMysqlUserRepository(config, { pool }).disconnect();
  });
});
