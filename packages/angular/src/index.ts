export type { ProvideFaeOptions } from './provide-fae.js';
export { provideFae } from './provide-fae.js';

export { FAE_SERVICE } from './tokens.js';

export type { UseUserOptions } from './use-user.js';
export { useUser } from './use-user.js';

export type { FaeEntityIdSource } from './use-fae-entity.js';
export { useFaeEntity } from './use-fae-entity.js';

export { useFaeService } from './use-fae-service.js';

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
