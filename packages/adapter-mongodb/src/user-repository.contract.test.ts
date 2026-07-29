import { describeUserRepositoryContract } from '../../core/src/testing/user-repository-contract.js';
import { createMongodbUserRepository } from './repository.js';
import type { UserDocument } from './types.js';

/** In-memory Mongo collection/client double — Raw Entity field names, no live MongoDB. */
function createFakeResources() {
  const store = new Map<string, UserDocument>();

  const collection = {
    async findOne(filter: { id: string }) {
      return store.get(filter.id) ?? null;
    },

    find(_query: Record<string, never>) {
      return {
        sort(_sort: { id: number }) {
          return {
            async toArray() {
              return [...store.values()].sort((a, b) => a.id.localeCompare(b.id));
            },
          };
        },
      };
    },

    async insertOne(doc: UserDocument) {
      store.set(doc.id, { ...doc });
      return { acknowledged: true as const };
    },

    async findOneAndUpdate(
      filter: { id: string },
      update: { $set: Partial<Pick<UserDocument, 'user_name' | 'email_address'>> },
      _options: { returnDocument: 'after' },
    ) {
      const existing = store.get(filter.id);
      if (!existing) return null;
      const next = { ...existing, ...update.$set };
      store.set(filter.id, next);
      return next;
    },

    async deleteOne(filter: { id: string }) {
      const deleted = store.delete(filter.id);
      return { deletedCount: deleted ? 1 : 0 };
    },
  };

  const client = {
    async close() {
      store.clear();
    },
  };

  return { client, collection };
}

describeUserRepositoryContract('mongodb adapter + fake resources', () =>
  createMongodbUserRepository(
    {
      uri: 'mongodb://localhost:27017',
      database: 'fae',
      collection: 'users',
    },
    { resources: createFakeResources() as never },
  ),
);
