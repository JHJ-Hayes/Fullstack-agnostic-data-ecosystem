import { inject, type MaybeRefOrGetter, type Ref } from 'vue';
import {
  CoreDataService,
  defaultUserEntityService,
  type AsyncState,
  type EntityService,
  type UserEntity,
} from '@fae/core';
import { FaeServiceKey } from './keys.js';
import { useFaeEntity } from './useFaeEntity.js';

export interface UseUserOptions {
  /** Override the service from {@link FaeProvider} or the built-in mock. */
  service?: CoreDataService;
  /** Pass a User {@link EntityService} directly. */
  entityService?: EntityService<UserEntity>;
}

/**
 * Subscribe to a user's async state — thin wrapper over {@link useFaeEntity}.
 *
 * @param id - User id; pass `null` or `undefined` to reset to `idle`.
 */
export function useUser(
  id: MaybeRefOrGetter<string | null | undefined>,
  options?: UseUserOptions,
): Ref<AsyncState<UserEntity>> {
  const contextService = inject(FaeServiceKey, null);
  const entityService =
    options?.entityService ??
    options?.service?.user ??
    contextService?.user ??
    defaultUserEntityService;

  return useFaeEntity(entityService, id);
}
