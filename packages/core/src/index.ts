import type { DataSubscriber, Unsubscribe, UserDataProvider, UserEntity } from './types.js';
import type { EntityService } from './entity-service.js';
import { createUserEntityService } from './user-service.js';

export type {
  AsyncState,
  AsyncStatus,
  CoreDataError,
  DataProvider,
  DataSubscriber,
  Unsubscribe,
  UserDataProvider,
  UserEntity,
  UserEntityRaw,
  UserRepository,
} from './types.js';

export type {
  CreateEntityServiceOptions,
  EntityService,
} from './entity-service.js';
export { createEntityService } from './entity-service.js';

export type { CreateUserEntityServiceOptions } from './user-service.js';
export { createUserEntityService, defaultUserEntityService } from './user-service.js';

export { toUserEntity } from './utils/transform.js';

export interface CoreDataServiceOptions {
  provider?: UserDataProvider;
}

/**
 * User-focused facade over {@link EntityService} — kept for backward compatibility.
 *
 * Prefer {@link createUserEntityService} or {@link createEntityService} for new entities.
 */
export class CoreDataService {
  readonly user: EntityService<UserEntity>;

  constructor(options: CoreDataServiceOptions = {}) {
    this.user = createUserEntityService({ provider: options.provider });
  }

  async fetchUser(id: string): Promise<UserEntity> {
    return this.user.fetch(id);
  }

  subscribeUser(id: string, subscriber: DataSubscriber<UserEntity>): Unsubscribe {
    return this.user.subscribe(id, subscriber);
  }
}
