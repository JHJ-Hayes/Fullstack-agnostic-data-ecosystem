import { describeUserRepositoryContract } from '../../core/src/testing/user-repository-contract.js';
import { createMongodbUserRepository } from './repository.js';
import { createFakeMongodbResources } from './testing/fake-resources.js';

const config = {
  uri: 'mongodb://localhost:27017',
  database: 'fae',
  collection: 'users',
} as const;

describeUserRepositoryContract('mongodb adapter + fake resources', () =>
  createMongodbUserRepository(config, {
    resources: createFakeMongodbResources() as never,
  }),
);
