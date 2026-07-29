import { useEffect, useState } from 'react';
import type { AsyncState, EntityService } from '@fae/core';

function idleState<T>(): AsyncState<T> {
  return { status: 'idle', data: null, error: null };
}

function loadingState<T>(): AsyncState<T> {
  return { status: 'loading', data: null, error: null };
}

/**
 * Generic React bridge — subscribes to any {@link EntityService} and maps to React state.
 *
 * @param id - Entity id; pass `null` or `undefined` to reset to `idle`.
 */
export function useFaeEntity<T>(
  service: EntityService<T>,
  id: string | null | undefined,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>(() =>
    id ? loadingState<T>() : idleState<T>(),
  );

  useEffect(() => {
    if (!id) {
      setState(idleState<T>());
      return;
    }

    setState(loadingState<T>());
    return service.subscribe(id, setState);
  }, [id, service]);

  return state;
}
