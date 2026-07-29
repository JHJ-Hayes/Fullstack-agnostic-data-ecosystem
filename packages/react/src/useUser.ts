import { useContext } from 'react';
import {
  CoreDataService,
  defaultUserEntityService,
  type AsyncState,
  type EntityService,
  type UserEntity,
} from '@fae/core';
import { FaeContext } from './context.js';
import { useFaeEntity } from './useFaeEntity.js';

export interface UseUserOptions {
  /** Override the service from {@link FaeProvider} or the built-in mock. */
  service?: CoreDataService;
  /** Pass a User {@link EntityService} directly (e.g. from {@link createUserEntityService}). */
  entityService?: EntityService<UserEntity>;
}

/**
 * Subscribe to a user's async state — thin wrapper over {@link useFaeEntity}.
 *
 * @param id - User id; pass `null` or `undefined` to reset to `idle`.
 */
export function useUser(
  id: string | null | undefined,
  options?: UseUserOptions,
): AsyncState<UserEntity> {
  const contextService = useContext(FaeContext);
  const entityService =
    options?.entityService ??
    options?.service?.user ??
    contextService?.user ??
    defaultUserEntityService;

  return useFaeEntity(entityService, id);
}
