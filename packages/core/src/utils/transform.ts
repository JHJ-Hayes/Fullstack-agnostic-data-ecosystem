import type { UserEntity, UserEntityRaw } from '../types.js';

/** 將後端 snake_case DTO 轉為統一 camelCase 實體 */
export function toUserEntity(raw: UserEntityRaw): UserEntity {
  return {
    id: raw.id,
    name: raw.user_name,
    email: raw.email_address,
  };
}
