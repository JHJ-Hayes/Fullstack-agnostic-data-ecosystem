# TypeScript SDK first; portable contracts for other languages

FAE ships as a TypeScript monorepo SDK. Non-TypeScript backends align via portable contracts (JSON Schema / OpenAPI), not first-class Java / Python / .NET runtime adapters in the near term.

**Considered options**: (1) TS SDK + portable contracts; (2) first-class multi-language runtime adapters. Chose (1) to keep the publishable surface honest and shippable before investing in polyglot bindings.
