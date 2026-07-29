import type { UserEntityRaw } from '@fae/core';
import type { UserDocument } from './types.js';

/** Map a MongoDB document to the shared {@link UserEntityRaw} contract */
export function documentToUserEntityRaw(doc: UserDocument): UserEntityRaw {
  return {
    id: String(doc.id),
    user_name: doc.user_name,
    email_address: doc.email_address,
  };
}

/** Map {@link UserEntityRaw} into the collection document shape */
export function userEntityRawToDocument(raw: UserEntityRaw): UserDocument {
  return {
    id: raw.id,
    user_name: raw.user_name,
    email_address: raw.email_address,
  };
}
