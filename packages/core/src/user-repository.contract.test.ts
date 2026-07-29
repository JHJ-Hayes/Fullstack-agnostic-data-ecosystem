import type { UserEntityRaw, UserRepository } from './types.js';
import { describeUserRepositoryContract } from './testing/user-repository-contract.js';

function createInMemoryUserRepository(): UserRepository {
  const store = new Map<string, UserEntityRaw>();

  return {
    async findById(id) {
      return store.get(id) ?? null;
    },

    async findAll() {
      return [...store.values()].sort((a, b) => a.id.localeCompare(b.id));
    },

    async create(data) {
      store.set(data.id, { ...data });
      return data;
    },

    async update(id, data) {
      const existing = store.get(id);
      if (!existing) return null;
      const next = { ...existing, ...data };
      store.set(id, next);
      return next;
    },

    async delete(id) {
      return store.delete(id);
    },

    async disconnect() {
      /* no-op for in-memory */
    },
  };
}

describeUserRepositoryContract('in-memory', () => createInMemoryUserRepository());
