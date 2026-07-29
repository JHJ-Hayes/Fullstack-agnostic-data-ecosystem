import type { UserEntityRaw } from '@fae/core';

type FakeRow = {
  id: string;
  user_name: string;
  email_address: string;
};

/** Lightweight mysql2 pool double — stores Raw Entities; no live database. */
export function createFakeMysqlPool() {
  const store = new Map<string, UserEntityRaw>();

  return {
    async execute(sql: string, params: unknown[] = []) {
      const normalized = sql.replace(/`/g, '');

      if (normalized.startsWith('SELECT') && normalized.includes('WHERE')) {
        const id = String(params[0]);
        const raw = store.get(id);
        const rows: FakeRow[] = raw
          ? [{ id: raw.id, user_name: raw.user_name, email_address: raw.email_address }]
          : [];
        return [rows];
      }

      if (normalized.startsWith('SELECT')) {
        const rows: FakeRow[] = [...store.values()]
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((raw) => ({
            id: raw.id,
            user_name: raw.user_name,
            email_address: raw.email_address,
          }));
        return [rows];
      }

      if (normalized.startsWith('INSERT')) {
        const [id, user_name, email_address] = params as string[];
        store.set(id, { id, user_name, email_address });
        return [{ affectedRows: 1 }];
      }

      if (normalized.startsWith('UPDATE')) {
        const id = String(params[params.length - 1]);
        const existing = store.get(id);
        if (!existing) {
          return [{ affectedRows: 0 }];
        }

        let index = 0;
        const next = { ...existing };
        if (normalized.includes('user_name = ?')) {
          next.user_name = String(params[index++]);
        }
        if (normalized.includes('email_address = ?')) {
          next.email_address = String(params[index++]);
        }
        store.set(id, next);
        return [{ affectedRows: 1 }];
      }

      if (normalized.startsWith('DELETE')) {
        const id = String(params[0]);
        const deleted = store.delete(id);
        return [{ affectedRows: deleted ? 1 : 0 }];
      }

      throw new Error(`Fake pool received unexpected SQL: ${sql}`);
    },

    async end() {
      store.clear();
    },
  };
}
