import { useContext, useEffect, useState } from 'react';
import {
  CoreDataService,
  type AsyncState,
  type UserEntity,
} from '@fae/core';
import { FaeContext } from './context.js';

const defaultService = new CoreDataService();

function idleState(): AsyncState<UserEntity> {
  return { status: 'idle', data: null, error: null };
}

function loadingState(): AsyncState<UserEntity> {
  return { status: 'loading', data: null, error: null };
}

export interface UseUserOptions {
  /** Override the service from {@link FaeProvider} or the built-in mock. */
  service?: CoreDataService;
}

/**
 * Subscribe to a user's async state — bridges {@link CoreDataService.subscribeUser}
 * to React state (`loading` → `success` | `error`).
 *
 * @param id - User id; pass `null` or `undefined` to reset to `idle`.
 */
export function useUser(
  id: string | null | undefined,
  options?: UseUserOptions,
): AsyncState<UserEntity> {
  const contextService = useContext(FaeContext);
  const service = options?.service ?? contextService ?? defaultService;

  const [state, setState] = useState<AsyncState<UserEntity>>(() =>
    id ? loadingState() : idleState(),
  );

  useEffect(() => {
    if (!id) {
      setState(idleState());
      return;
    }

    setState(loadingState());
    return service.subscribeUser(id, setState);
  }, [id, service]);

  return state;
}
