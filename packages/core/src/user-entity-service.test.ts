import { afterEach, describe, expect, it, vi } from 'vitest';
import { createUserEntityService } from './user-service.js';

describe('createUserEntityService (Mock Provider)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetch returns Entity for a known mock User id', async () => {
    const users = createUserEntityService();

    const user = await users.fetch('1');

    expect(user).toEqual({
      id: '1',
      name: 'Alice Chen',
      email: 'alice@example.com',
    });
    expect(user).not.toHaveProperty('user_name');
    expect(user).not.toHaveProperty('email_address');
  });

  it('fetch rejects with normalized error when User is missing', async () => {
    const users = createUserEntityService();

    await expect(users.fetch('missing-id')).rejects.toMatchObject({
      code: 'USER_NOT_FOUND',
      message: 'User "missing-id" not found',
    });
  });

  it('subscribe emits loading then success with Entity', async () => {
    const users = createUserEntityService();
    const states: Array<{ status: string; data: unknown; error: unknown }> = [];

    await new Promise<void>((resolve) => {
      users.subscribe('1', (state) => {
        states.push(state);
        if (state.status === 'success' || state.status === 'error') resolve();
      });
    });

    expect(states.map((s) => s.status)).toEqual(['loading', 'success']);
    expect(states[0]).toEqual({ status: 'loading', data: null, error: null });
    expect(states[1]?.data).toEqual({
      id: '1',
      name: 'Alice Chen',
      email: 'alice@example.com',
    });
    expect(states[1]?.data).not.toHaveProperty('user_name');
  });

  it('subscribe emits loading then normalized error when User is missing', async () => {
    const users = createUserEntityService();
    const states: Array<{ status: string; data: unknown; error: unknown }> = [];

    await new Promise<void>((resolve) => {
      users.subscribe('missing-id', (state) => {
        states.push(state);
        if (state.status === 'success' || state.status === 'error') resolve();
      });
    });

    expect(states.map((s) => s.status)).toEqual(['loading', 'error']);
    expect(states[1]?.data).toBeNull();
    expect(states[1]?.error).toMatchObject({
      code: 'USER_NOT_FOUND',
      message: 'User "missing-id" not found',
    });
  });

  it('subscribe cancellation stops further emissions after loading', async () => {
    vi.useFakeTimers();
    const users = createUserEntityService();
    const states: Array<{ status: string }> = [];

    const unsubscribe = users.subscribe('1', (state) => {
      states.push({ status: state.status });
    });
    unsubscribe();

    await vi.advanceTimersByTimeAsync(500);

    expect(states).toEqual([{ status: 'loading' }]);
  });
});
