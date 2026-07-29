import type { RowDataPacket } from 'mysql2/promise';
import type { UserDataProvider, UserRepository } from '@fae/core';

export type { UserRepository } from '@fae/core';

/** MySQL connection settings — use {@link mysqlConfigFromEnv} for consistent env vars */
export interface MysqlAdapterConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  /** Table name; defaults to `users` */
  table?: string;
}

/** Raw row shape returned by mysql2 for the `users` table */
export interface UserRow extends RowDataPacket {
  id: string;
  user_name: string;
  email_address: string;
}

/** Resource handle returned by factory functions */
export interface MysqlAdapterHandle {
  repository: UserRepository;
  provider: UserDataProvider;
  disconnect(): Promise<void>;
}

const ENV_KEYS = {
  host: 'MYSQL_HOST',
  port: 'MYSQL_PORT',
  user: 'MYSQL_USER',
  password: 'MYSQL_PASSWORD',
  database: 'MYSQL_DATABASE',
  table: 'MYSQL_TABLE',
} as const;

/** Build config from standard FAE MySQL environment variables */
export function mysqlConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): MysqlAdapterConfig {
  const host = env[ENV_KEYS.host] ?? 'localhost';
  const port = Number(env[ENV_KEYS.port] ?? 3306);
  const user = env[ENV_KEYS.user] ?? 'root';
  const password = env[ENV_KEYS.password] ?? '';
  const database = env[ENV_KEYS.database] ?? 'fae';

  if (!Number.isFinite(port)) {
    throw new Error(`Invalid ${ENV_KEYS.port}: must be a number`);
  }

  return {
    host,
    port,
    user,
    password,
    database,
    table: env[ENV_KEYS.table] ?? 'users',
  };
}

export { ENV_KEYS as MYSQL_ENV_KEYS };
