# Entity Service is single-id only; lists stay on Repository

Entity Service and frontend bridges load one Entity by id. Listing, filtering, and pagination stay on Repository (or a later query surface), not on Entity Service, for the first milestone.
