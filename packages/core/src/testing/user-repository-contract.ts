import { describe, expect, it } from 'vitest';
import type { UserEntityRaw, UserRepository } from '../types.js';

type RepoFactory = () => UserRepository | Promise<UserRepository>;

/**
 * Shared UserRepository seam contract — used by in-memory and Database Adapter tests.
 * Asserts Raw Entity boundary behavior only.
 */
export function describeUserRepositoryContract(label: string, createRepository: RepoFactory) {
  describe(`UserRepository contract (${label})`, () => {
    it('create then findById returns Raw Entity fields', async () => {
      const repo = await createRepository();
      const raw: UserEntityRaw = {
        id: 'u-1',
        user_name: 'Ada Lovelace',
        email_address: 'ada@example.com',
      };

      await repo.create(raw);
      const found = await repo.findById('u-1');

      expect(found).toEqual(raw);
      expect(found).toHaveProperty('user_name', 'Ada Lovelace');
      expect(found).toHaveProperty('email_address', 'ada@example.com');
      expect(found).not.toHaveProperty('name');
      expect(found).not.toHaveProperty('email');

      await repo.disconnect();
    });

    it('findById returns null when missing', async () => {
      const repo = await createRepository();
      expect(await repo.findById('nope')).toBeNull();
      await repo.disconnect();
    });

    it('findAll returns Raw Entities ordered by id', async () => {
      const repo = await createRepository();
      await repo.create({
        id: 'u-2',
        user_name: 'Bob',
        email_address: 'bob@example.com',
      });
      await repo.create({
        id: 'u-1',
        user_name: 'Ann',
        email_address: 'ann@example.com',
      });

      const all = await repo.findAll();

      expect(all.map((u) => u.id)).toEqual(['u-1', 'u-2']);
      expect(all[0]).toMatchObject({
        user_name: 'Ann',
        email_address: 'ann@example.com',
      });

      await repo.disconnect();
    });

    it('update changes Raw Entity fields', async () => {
      const repo = await createRepository();
      await repo.create({
        id: 'u-3',
        user_name: 'Cara',
        email_address: 'cara@example.com',
      });

      const updated = await repo.update('u-3', { user_name: 'Cara Updated' });

      expect(updated).toEqual({
        id: 'u-3',
        user_name: 'Cara Updated',
        email_address: 'cara@example.com',
      });
      expect(await repo.findById('u-3')).toEqual(updated);

      await repo.disconnect();
    });

    it('update returns null when id is missing', async () => {
      const repo = await createRepository();
      expect(await repo.update('missing', { user_name: 'X' })).toBeNull();
      await repo.disconnect();
    });

    it('delete removes a Raw Entity and reports whether it existed', async () => {
      const repo = await createRepository();
      await repo.create({
        id: 'u-4',
        user_name: 'Dan',
        email_address: 'dan@example.com',
      });

      expect(await repo.delete('u-4')).toBe(true);
      expect(await repo.findById('u-4')).toBeNull();
      expect(await repo.delete('u-4')).toBe(false);

      await repo.disconnect();
    });

    it('disconnect completes without throwing', async () => {
      const repo = await createRepository();
      await expect(repo.disconnect()).resolves.toBeUndefined();
    });
  });
}
