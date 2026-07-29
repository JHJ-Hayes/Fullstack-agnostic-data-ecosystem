export type { FaePluginOptions } from './provider.js';
export { createFaePlugin, FaeProvider, useFaeService } from './provider.js';

export { FaeServiceKey } from './keys.js';

export type { UseUserOptions } from './useUser.js';
export { useUser } from './useUser.js';

export { useFaeEntity } from './useFaeEntity.js';

export type {
  AsyncState,
  AsyncStatus,
  CoreDataError,
  CreateEntityServiceOptions,
  CreateUserEntityServiceOptions,
  DataProvider,
  EntityService,
  UserEntity,
  UserRepository,
} from '@fae/core';

export {
  createEntityService,
  createUserEntityService,
  defaultUserEntityService,
} from '@fae/core';
