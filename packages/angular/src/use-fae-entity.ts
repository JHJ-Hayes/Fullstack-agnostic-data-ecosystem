import { effect, signal, type Signal } from '@angular/core';
import type { AsyncState, EntityService } from '@fae/core';
import { idleState, loadingState } from './async-state.js';

export type FaeEntityIdSource = string | null | undefined | Signal<string | null | undefined>;

function resolveId(id: FaeEntityIdSource): string | null | undefined {
  return typeof id === 'function' ? id() : id;
}

/**
 * Generic Angular bridge — subscribes to any {@link EntityService} and exposes a Signal.
 *
 * Must be called in an injection context (constructor, field initializer, `runInInjectionContext`).
 *
 * @param id - Entity id or a Signal of id; `null` / `undefined` resets to `idle`.
 */
export function useFaeEntity<T>(
  service: EntityService<T>,
  id: FaeEntityIdSource,
): Signal<AsyncState<T>> {
  const state = signal<AsyncState<T>>(
    resolveId(id) ? loadingState<T>() : idleState<T>(),
  );

  effect((onCleanup) => {
    const currentId = resolveId(id);

    if (!currentId) {
      state.set(idleState<T>());
      return;
    }

    state.set(loadingState<T>());
    const unsubscribe = service.subscribe(currentId, (next) => {
      state.set(next);
    });
    onCleanup(() => unsubscribe());
  });

  return state.asReadonly();
}
