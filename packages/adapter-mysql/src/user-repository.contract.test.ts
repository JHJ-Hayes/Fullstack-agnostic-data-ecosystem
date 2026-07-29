import { describeUserRepositoryContract } from '../../core/src/testing/user-repository-contract.js';
import { createMysqlUserRepository } from './repository.js';
import { createFakeMysqlPool } from './testing/fake-pool.js';

const config = {
  host: 'localhost',
  port: 3306,
  user: 'test',
  password: '',
  database: 'fae',
  table: 'users',
} as const;

describeUserRepositoryContract('mysql adapter + fake pool', () =>
  createMysqlUserRepository(config, { pool: createFakeMysqlPool() }),
);
