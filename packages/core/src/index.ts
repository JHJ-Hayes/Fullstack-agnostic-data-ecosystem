import type {
  AsyncState,
  CoreDataError,
  DataSubscriber,
  Unsubscribe,
  UserDataProvider,
  UserEntity,
  UserEntityRaw,
} from './types.js';
import { toUserEntity } from './utils/transform.js';

export type {
  AsyncState,
  AsyncStatus,
  CoreDataError,
  DataSubscriber,
  Unsubscribe,
  UserDataProvider,
  UserEntity,
  UserEntityRaw,
} from './types.js';

export { toUserEntity } from './utils/transform.js';

/** 模擬後端回傳的 in-memory 資料（snake_case） */
const MOCK_USERS: Record<string, UserEntityRaw> = {
  '1': {
    id: '1',
    user_name: 'Alice Chen',
    email_address: 'alice@example.com',
  },
  '2': {
    id: '2',
    user_name: 'Bob Lin',
    email_address: 'bob@example.com',
  },
};

const defaultProvider: UserDataProvider = {
  async fetchRawUser(id: string): Promise<UserEntityRaw> {
    await delay(120);
    const raw = MOCK_USERS[id];
    if (!raw) {
      throw createError('USER_NOT_FOUND', `User "${id}" not found`);
    }
    return raw;
  },
};

export interface CoreDataServiceOptions {
  provider?: UserDataProvider;
}

/**
 * 核心資料服務 — 純 TS，無框架依賴。
 *
 * - **Promise API**：`fetchUser()`，適合一次性請求或 SSR。
 * - **訂閱 API**：`subscribeUser()`，供 Vue ref / React Hook / Angular Signal 橋接。
 */
export class CoreDataService {
  private readonly provider: UserDataProvider;

  constructor(options: CoreDataServiceOptions = {}) {
    this.provider = options.provider ?? defaultProvider;
  }

  /**
   * 以 Promise 取得並轉換使用者資料。
   * Adapter 可 `await service.fetchUser(id)` 或包成 framework-specific async primitive。
   */
  async fetchUser(id: string): Promise<UserEntity> {
    try {
      const raw = await this.provider.fetchRawUser(id);
      return toUserEntity(raw);
    } catch (err) {
      throw normalizeError(err);
    }
  }

  /**
   * 訂閱使用者資料的非同步狀態流。
   * 每次呼叫會立即推送 `loading`，完成後推送 `success` 或 `error`。
   */
  subscribeUser(id: string, subscriber: DataSubscriber<UserEntity>): Unsubscribe {
    let cancelled = false;

    const emit = (state: AsyncState<UserEntity>) => {
      if (!cancelled) subscriber(state);
    };

    emit({ status: 'loading', data: null, error: null });

    this.fetchUser(id)
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
}

function createError(code: string, message: string, cause?: unknown): CoreDataError {
  return { code, message, cause };
}

function normalizeError(err: unknown): CoreDataError {
  if (isCoreDataError(err)) return err;
  if (err instanceof Error) {
    return createError('UNKNOWN', err.message, err);
  }
  return createError('UNKNOWN', 'An unexpected error occurred', err);
}

function isCoreDataError(err: unknown): err is CoreDataError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'message' in err &&
    typeof (err as CoreDataError).code === 'string' &&
    typeof (err as CoreDataError).message === 'string'
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
