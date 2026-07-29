import { createEntityService, type EntityService } from './entity-service.js';
import { createError } from './errors.js';
import type { UserDataProvider, UserEntity, UserEntityRaw } from './types.js';
import { toUserEntity } from './utils/transform.js';

/** 模擬後端回傳的 in-memory 資料（snake_case） */
const MOCK_USERS: Record<string, UserEntityRaw> = {
  '1': {
    id: '1',
    user_name: 'Alice Chen',
    email_address: 'alice@example.com',
  },
  '2': {
    id: '2',
    user_name: 'Bob Lin',
    email_address: 'bob@example.com',
  },
};

function createDefaultUserProvider(): UserDataProvider {
  return {
    async fetchRawUser(id: string): Promise<UserEntityRaw> {
      await delay(120);
      const raw = MOCK_USERS[id];
      if (!raw) {
        throw createError('USER_NOT_FOUND', `User "${id}" not found`);
      }
      return raw;
    },
  };
}

export interface CreateUserEntityServiceOptions {
  provider?: UserDataProvider;
}

/** Create a User {@link EntityService} — first official example Entity. */
export function createUserEntityService(
  options: CreateUserEntityServiceOptions = {},
): EntityService<UserEntity> {
  const provider = options.provider ?? createDefaultUserProvider();

  return createEntityService({
    toEntity: toUserEntity,
    provider: {
      fetchRaw: (id) => provider.fetchRawUser(id),
    },
  });
}

export const defaultUserEntityService = createUserEntityService();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
