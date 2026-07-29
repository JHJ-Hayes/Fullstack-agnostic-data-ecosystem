# Subscribe means one-shot async load, not live data

Entity Service `subscribe` bridges a single fetch into loading/success/error callbacks for UI adapters. Shared cache, invalidation, and push updates are out of scope for this API; if needed later they become a separate capability.

**Considered options**: (1) one-shot subscribe bridge matching current code; (2) near-term live/cached data layer. Chose (1) to keep the contract honest and avoid silent scope creep under a familiar name.
