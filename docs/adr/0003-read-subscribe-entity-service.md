# Entity Service is read/subscribe; writes live on Repository

Entity Service exposes fetch and subscribe for UI and SSR. Create/update/delete and broader queries stay on Repository (or a later command surface), not on Entity Service.

**Considered options**: (1) read/subscribe Entity Service with separate Repository writes; (2) full CRUD on Entity Service. Chose (1) to keep frontend bridges thin and avoid implying every adapter owns mutations.
