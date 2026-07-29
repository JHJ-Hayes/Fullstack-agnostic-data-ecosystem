import type {
  CoreDataError,
  UserDataProvider,
  UserEntityRaw,
  UserRepository,
} from '@fae/core';
import mysql, { type ResultSetHeader } from 'mysql2/promise';
import { rowToUserEntityRaw } from './row-mapper.js';
import type { MysqlAdapterConfig, MysqlAdapterHandle, UserRow } from './types.js';

function createNotFoundError(id: string): CoreDataError {
  return { code: 'USER_NOT_FOUND', message: `User "${id}" not found` };
}

function createPool(config: MysqlAdapterConfig) {
  return mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

function qualifiedTable(config: MysqlAdapterConfig): string {
  const table = config.table ?? 'users';
  return `\`${table.replace(/`/g, '')}\``;
}

/**
 * Create a MySQL {@link UserRepository} with full CRUD.
 * Schema: see `schema/mysql.sql`.
 */
export function createMysqlUserRepository(config: MysqlAdapterConfig): UserRepository {
  const pool = createPool(config);
  const table = qualifiedTable(config);

  return {
    async findById(id: string): Promise<UserEntityRaw | null> {
      const [rows] = await pool.execute<UserRow[]>(
        `SELECT id, user_name, email_address FROM ${table} WHERE id = ?`,
        [id],
      );
      const row = rows[0];
      return row ? rowToUserEntityRaw(row) : null;
    },

    async findAll(): Promise<UserEntityRaw[]> {
      const [rows] = await pool.execute<UserRow[]>(
        `SELECT id, user_name, email_address FROM ${table} ORDER BY id`,
      );
      return rows.map(rowToUserEntityRaw);
    },

    async create(data: UserEntityRaw): Promise<UserEntityRaw> {
      await pool.execute(
        `INSERT INTO ${table} (id, user_name, email_address) VALUES (?, ?, ?)`,
        [data.id, data.user_name, data.email_address],
      );
      return data;
    },

    async update(
      id: string,
      data: Partial<Pick<UserEntityRaw, 'user_name' | 'email_address'>>,
    ): Promise<UserEntityRaw | null> {
      const sets: string[] = [];
      const values: string[] = [];

      if (data.user_name !== undefined) {
        sets.push('user_name = ?');
        values.push(data.user_name);
      }
      if (data.email_address !== undefined) {
        sets.push('email_address = ?');
        values.push(data.email_address);
      }

      if (sets.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      const [result] = await pool.execute(
        `UPDATE ${table} SET ${sets.join(', ')} WHERE id = ?`,
        values,
      );

      if ((result as ResultSetHeader).affectedRows === 0) {
        return null;
      }

      return this.findById(id);
    },

    async delete(id: string): Promise<boolean> {
      const [result] = await pool.execute(
        `DELETE FROM ${table} WHERE id = ?`,
        [id],
      );
      return (result as ResultSetHeader).affectedRows > 0;
    },

    async disconnect(): Promise<void> {
      await pool.end();
    },
  };
}

/**
 * Create a {@link UserDataProvider} backed by MySQL — plugs directly into {@link CoreDataService}.
 */
export function createMysqlUserProvider(config: MysqlAdapterConfig): UserDataProvider {
  const repository = createMysqlUserRepository(config);

  return {
    async fetchRawUser(id: string): Promise<UserEntityRaw> {
      const raw = await repository.findById(id);
      if (!raw) {
        throw createNotFoundError(id);
      }
      return raw;
    },
  };
}

/**
 * Create both repository and provider; call `disconnect()` when shutting down.
 */
export function createMysqlAdapter(config: MysqlAdapterConfig): MysqlAdapterHandle {
  const repository = createMysqlUserRepository(config);

  const provider: UserDataProvider = {
    async fetchRawUser(id: string): Promise<UserEntityRaw> {
      const raw = await repository.findById(id);
      if (!raw) {
        throw createNotFoundError(id);
      }
      return raw;
    },
  };

  return {
    repository,
    provider,
    disconnect: () => repository.disconnect(),
  };
}
