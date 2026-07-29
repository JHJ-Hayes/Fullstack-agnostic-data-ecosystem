export type { FaeProviderProps } from './context.js';
export { FaeContext, FaeProvider, useFaeService } from './context.js';

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
