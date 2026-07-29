import { createUserEntityService } from '@fae/core';
import { describe, expect, it } from 'vitest';
import {
  createMongodbUserProvider,
  createMongodbUserRepository,
} from './repository.js';
import { createFakeMongodbResources } from './testing/fake-resources.js';

const config = {
  uri: 'mongodb://localhost:27017',
  database: 'fae',
  collection: 'users',
} as const;

describe('MongoDB Data Provider → User Entity Service', () => {
  it('fetch returns mapped Entity for a seeded Raw User', async () => {
    const resources = createFakeMongodbResources();
    const repository = createMongodbUserRepository(config, {
      resources: resources as never,
    });
    await repository.create({
      id: '1',
      user_name: 'Bob Lin',
      email_address: 'bob@example.com',
    });

    const provider = createMongodbUserProvider(config, {
      resources: resources as never,
    });
    const users = createUserEntityService({ provider });

    const user = await users.fetch('1');

    expect(user).toEqual({
      id: '1',
      name: 'Bob Lin',
      email: 'bob@example.com',
    });
    expect(user).not.toHaveProperty('user_name');

    await repository.disconnect();
  });

  it('fetch rejects with normalized error when id is missing', async () => {
    const resources = createFakeMongodbResources();
    const provider = createMongodbUserProvider(config, {
      resources: resources as never,
    });
    const users = createUserEntityService({ provider });

    await expect(users.fetch('missing')).rejects.toMatchObject({
      code: 'USER_NOT_FOUND',
      message: 'User "missing" not found',
    });

    await createMongodbUserRepository(config, {
      resources: resources as never,
    }).disconnect();
  });
});
