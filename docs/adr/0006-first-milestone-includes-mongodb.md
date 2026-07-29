# First publishable milestone includes MongoDB

The first publishable milestone is: generic Entity Service in core, React/Vue/Angular frontend adapters in parity, plus MySQL and MongoDB database adapters. Portable contracts and non-TypeScript runtimes are explicitly out of that milestone.

**Considered options**: (1) frontends + MySQL only; (2) frontends + MySQL + MongoDB; (3) also require portable contracts. Chose (2) so the first release proves DB-adapter swappability across relational and document stores.
