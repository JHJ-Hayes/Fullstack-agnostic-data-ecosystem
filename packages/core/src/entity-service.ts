import { normalizeError } from './errors.js';
import type { AsyncState, DataProvider, DataSubscriber, Unsubscribe } from './types.js';

/** Framework-agnostic service for fetching and subscribing to a single entity type by id. */
export interface EntityService<T> {
  fetch(id: string): Promise<T>;
  subscribe(id: string, subscriber: DataSubscriber<T>): Unsubscribe;
}

export interface CreateEntityServiceOptions<T, TRaw> {
  toEntity: (raw: TRaw) => T;
  provider: DataProvider<TRaw>;
}

/**
 * Create a reusable entity service for any domain Entity.
 *
 * - **Promise API**: `fetch(id)` for one-off requests or SSR.
 * - **Subscribe API**: `subscribe(id, cb)` for Vue ref / React Hook / Angular Signal bridges.
 */
export function createEntityService<T, TRaw>(
  options: CreateEntityServiceOptions<T, TRaw>,
): EntityService<T> {
  const { toEntity, provider } = options;

  async function fetch(id: string): Promise<T> {
    try {
      const raw = await provider.fetchRaw(id);
      return toEntity(raw);
    } catch (err) {
      throw normalizeError(err);
    }
  }

  function subscribe(id: string, subscriber: DataSubscriber<T>): Unsubscribe {
    let cancelled = false;

    const emit = (state: AsyncState<T>) => {
      if (!cancelled) subscriber(state);
    };

    emit({ status: 'loading', data: null, error: null });

    fetch(id)
      .then((data) => {
        emit({ status: 'success', data, error: null });
      })
      .catch((err: unknown) => {
        emit({
          status: 'error',
          data: null,
          error: normalizeError(err),
        });
      });

    return () => {
      cancelled = true;
    };
  }

  return { fetch, subscribe };
}
