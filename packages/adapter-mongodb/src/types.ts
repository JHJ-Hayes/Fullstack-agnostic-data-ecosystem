import type { UserDataProvider, UserRepository } from '@fae/core';

export type { UserRepository } from '@fae/core';

/** MongoDB connection settings — use {@link mongodbConfigFromEnv} for consistent env vars */
export interface MongodbAdapterConfig {
  uri: string;
  database: string;
  /** Collection name; defaults to `users` */
  collection?: string;
}

/**
 * Document shape stored in MongoDB.
 * Uses the same snake_case fields as {@link import('@fae/core').UserEntityRaw}
 * so the Raw Entity boundary is never skipped.
 */
export interface UserDocument {
  id: string;
  user_name: string;
  email_address: string;
}

/** Resource handle returned by factory functions */
export interface MongodbAdapterHandle {
  repository: UserRepository;
  provider: UserDataProvider;
  disconnect(): Promise<void>;
}

const ENV_KEYS = {
  uri: 'MONGODB_URI',
  database: 'MONGODB_DATABASE',
  collection: 'MONGODB_COLLECTION',
} as const;

/** Build config from standard FAE MongoDB environment variables */
export function mongodbConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): MongodbAdapterConfig {
  return {
    uri: env[ENV_KEYS.uri] ?? 'mongodb://localhost:27017',
    database: env[ENV_KEYS.database] ?? 'fae',
    collection: env[ENV_KEYS.collection] ?? 'users',
  };
}

export { ENV_KEYS as MONGODB_ENV_KEYS };
