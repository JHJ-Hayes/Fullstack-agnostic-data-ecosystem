import type { AsyncState } from '@fae/core';

export function idleState<T>(): AsyncState<T> {
  return { status: 'idle', data: null, error: null };
}

export function loadingState<T>(): AsyncState<T> {
  return { status: 'loading', data: null, error: null };
}
