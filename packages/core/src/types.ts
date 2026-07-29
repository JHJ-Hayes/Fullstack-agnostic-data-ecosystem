/**
 * 統一資料模型 — 所有 Adapter（Vue / React / Angular）皆以此為契約。
 */

/** 標準使用者實體（前端與 Adapter 層使用的 camelCase 模型） */
export interface UserEntity {
  id: string;
  name: string;
  email: string;
}

/**
 * 後端原始 DTO（常見 snake_case 欄位）。
 * 核心層負責將此格式轉換為 {@link UserEntity}。
 */
export interface UserEntityRaw {
  id: string;
  user_name: string;
  email_address: string;
}

/** 非同步資源的三態，供各框架 Adapter 對齊 UI 狀態 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: CoreDataError | null;
}

/** 核心層統一錯誤結構 */
export interface CoreDataError {
  code: string;
  message: string;
  cause?: unknown;
}

/**
 * 訂閱者回呼 — Vue ref / React Hook / Angular Signal 等 Adapter
 * 可將此回呼橋接為各框架的響應式 primitive。
 */
export type DataSubscriber<T> = (state: AsyncState<T>) => void;

/** 取消訂閱函式 */
export type Unsubscribe = () => void;

/** 通用原始資料提供者 — 依 id 取得單筆 DTO */
export interface DataProvider<TRaw> {
  fetchRaw(id: string): Promise<TRaw>;
}

/** User 專用 provider — 與 {@link DataProvider} 對齊，供既有 adapter 使用 */
export interface UserDataProvider {
  fetchRawUser(id: string): Promise<UserEntityRaw>;
}

/**
 * Persistence-facing API for User Raw Entities — implemented by Database Adapters.
 * Writes and list queries live here; Entity Service stays single-id read/subscribe.
 */
export interface UserRepository {
  findById(id: string): Promise<UserEntityRaw | null>;
  findAll(): Promise<UserEntityRaw[]>;
  create(data: UserEntityRaw): Promise<UserEntityRaw>;
  update(
    id: string,
    data: Partial<Pick<UserEntityRaw, 'user_name' | 'email_address'>>,
  ): Promise<UserEntityRaw | null>;
  delete(id: string): Promise<boolean>;
  disconnect(): Promise<void>;
}
