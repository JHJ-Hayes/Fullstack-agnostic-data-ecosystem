# Entity is the core abstraction; User is the first example

FAE's public core centers on a generic Entity / Entity Service model. User remains the first official example and a thin compatibility facade, not the permanent shape of the product API.

**Considered options**: (1) generic Entity-first with User as example; (2) User-centric product with later generalization. Chose (1) so new domain Entities reuse one service and frontend bridge instead of copying User-specific APIs.
