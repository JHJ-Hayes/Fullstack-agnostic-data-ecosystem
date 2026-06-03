import type { UserEntityRaw } from '@fae/core';
import type { UserRow } from './types.js';

/** Map a MySQL row to the shared {@link UserEntityRaw} DTO */
export function rowToUserEntityRaw(row: UserRow): UserEntityRaw {
  return {
    id: String(row.id),
    user_name: row.user_name,
    email_address: row.email_address,
  };
}
