import { describe, expect, it } from 'vitest';
import { createEntityService } from './index.js';

/**
 * Smoke check for ticket #3 — proves the monorepo Vitest harness
 * can load workspace TypeScript and run a suite.
 */
describe('monorepo test harness', () => {
  it('loads @fae/core public API under Vitest', () => {
    expect(typeof createEntityService).toBe('function');
  });
});
