# AGENTS.md

Guidance for coding agents working in this repository.

## Agent skills

### Issue tracker

Issues and specs are GitHub Issues in this repo (via `gh`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default triage vocabulary: `needs-triage`, `needs-info`, `ready-to-implement` (maps from skill role `ready-for-agent`), `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.

## Workflow

Preferred engineering chain for non-trivial work:

```text
grill-with-docs → to-spec → to-tickets → tdd / implement
```

Read `CONTEXT.md` and relevant ADRs before changing architecture or public APIs.

## Testing

- Runner: **Vitest** via root `npm test` (`vitest run`).
- Put tests next to source as `packages/<pkg>/src/**/*.test.ts`.
- Test only at agreed seams (see spec #1): Entity Service (primary), UserRepository (secondary).
- Assert external behavior only — no private helpers or SQL/driver internals.
