# Backend integration is Database Adapter + consumer API

For the first milestone there is no separate backend-adapter package (Node/Java/Python/.NET). A TypeScript backend uses Database Adapters (Repository + Data Provider) inside the consumer's own API routes. Frontends reach that API via a consumer-written HTTP Data Provider. Non-TypeScript backends wait on portable contracts, not official runtimes.
