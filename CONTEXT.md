# FAE

Fullstack-Agnostic Data Ecosystem — a publishable monorepo SDK of shared data contracts and stack adapters.

## Language

**FAE**:
A publishable TypeScript monorepo SDK that centralizes data contracts and lets consumers bridge them to frontend, backend, and database stacks via adapters. Not an application that runs business workflows.
_Avoid_: Demo app, reference-only architecture, platform, framework

**Portable Contract**:
A language-neutral schema of an FAE entity that non-TypeScript stacks can implement against without consuming the TypeScript SDK. Out of the first publishable milestone; the first backend-related priority after that milestone.
_Avoid_: Cross-language runtime, native binding, polyglot SDK

**Adapter**:
A package that bridges FAE core contracts to one concrete stack — typically a frontend framework or a database.
_Avoid_: Connector, plugin, driver (as the public product name)

**Frontend Adapter**:
An Adapter that bridges Entity Service Subscribe into one UI framework's primitives. Parity means the same semantics (inject service, generic entity bridge, User example, AsyncState) — not identical export names.
_Avoid_: Framework SDK, UI kit

**Service Provider** (UI):
The framework entry that injects the default User-oriented service into the component tree. Custom Entities are passed explicitly into the generic entity bridge — not registered in a multi-entity registry for the first milestone.
_Avoid_: Entity registry, service locator, global store

**Core Data Service**:
A User-oriented compatibility facade over Entity Service. Kept for existing call sites; not the primary public concept in docs going forward.
_Avoid_: treating it as the core product API name

**Mock Provider**:
The built-in in-memory Data Provider used when none is injected, so frontend adapters can run without a database. Documented as simulation, not production persistence.
_Avoid_: real backend, default database

**Entity**:
The consumer-facing domain model for one resource type, expressed in the core contract shape (typically camelCase).
_Avoid_: DTO, model, resource, record

**Raw Entity**:
The persistence or transport shape of an Entity before core transformation (often snake_case). The shared boundary between Database Adapters and Entity Service — never skipped per database.
_Avoid_: Backend DTO, row, document (as the public product name)

**Database Adapter**:
An Adapter that persists and loads Raw Entities for a concrete database. Exposes both a Repository (writes/queries) and a Data Provider (Entity Service reads). The first publishable milestone requires both MySQL and MongoDB. In that milestone, backend integration means using these adapters inside the consumer's own API — not a separate backend-adapter package.
_Avoid_: ORM wrapper, driver package (as the product name), Backend Adapter (as a required first-milestone package)

**Entity Service**:
The framework-agnostic core API for one Entity type — read and one-shot subscribe by id only; the primary unit consumers and frontend adapters bind to. Lists and filtered queries are not part of this API.
_Avoid_: CoreDataService (legacy User facade), data client, store, CRUD service, live query layer, list service

**Subscribe**:
A one-shot async load bridged through callbacks (`loading` → `success` | `error`), used to connect Entity Service to UI primitives. Not a continuous feed of updates.
_Avoid_: Live query, observable stream, cache subscription, realtime sync

**Repository**:
The persistence-facing API for an Entity's Raw Entity, including writes and queries beyond single-id fetch.
_Avoid_: Entity Service, data provider (as the write surface)

**Data Provider**:
The injectable read source an Entity Service uses to load one Raw Entity by id.
_Avoid_: Repository, client, fetcher

**User**:
The first official example Entity shipped with FAE; not the only Entity the SDK is designed around. Remains bundled with core primitives until a second first-party Entity forces a package split.
_Avoid_: Account, profile (unless defined as separate Entities later)
