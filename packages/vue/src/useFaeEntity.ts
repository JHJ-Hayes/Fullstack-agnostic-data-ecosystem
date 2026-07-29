import { ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue';
import type { AsyncState, EntityService } from '@fae/core';
import { idleState, loadingState } from './async-state.js';

/**
 * Generic Vue composable — subscribes to any {@link EntityService} and maps to a ref.
 *
 * @param id - Entity id; pass `null` or `undefined` to reset to `idle`.
 */
export function useFaeEntity<T>(
  service: EntityService<T>,
  id: MaybeRefOrGetter<string | null | undefined>,
): Ref<AsyncState<T>> {
  const state = ref<AsyncState<T>>(
    toValue(id) ? loadingState<T>() : idleState<T>(),
  ) as Ref<AsyncState<T>>;

  watch(
    () => toValue(id),
    (currentId, _prev, onCleanup) => {
      if (!currentId) {
        state.value = idleState<T>();
        return;
      }

      state.value = loadingState<T>();
      const unsubscribe = service.subscribe(currentId, (next) => {
        state.value = next;
      });
      onCleanup(unsubscribe);
    },
    { immediate: true },
  );

  return state;
}
