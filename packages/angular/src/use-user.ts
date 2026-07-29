import { inject, type Signal } from '@angular/core';
import {
  CoreDataService,
  defaultUserEntityService,
  type AsyncState,
  type EntityService,
  type UserEntity,
} from '@fae/core';
import { FAE_SERVICE } from './tokens.js';
import { useFaeEntity, type FaeEntityIdSource } from './use-fae-entity.js';

export interface UseUserOptions {
  /** Override the service from {@link provideFae} or the built-in mock. */
  service?: CoreDataService;
  /** Pass a User {@link EntityService} directly. */
  entityService?: EntityService<UserEntity>;
}

/**
 * Subscribe to a user's async state — thin wrapper over {@link useFaeEntity}.
 *
 * @param id - User id or Signal of id; `null` / `undefined` resets to `idle`.
 */
export function useUser(
  id: FaeEntityIdSource,
  options?: UseUserOptions,
): Signal<AsyncState<UserEntity>> {
  const contextService = inject(FAE_SERVICE, { optional: true });
  const entityService =
    options?.entityService ??
    options?.service?.user ??
    contextService?.user ??
    defaultUserEntityService;

  return useFaeEntity(entityService, id);
}
