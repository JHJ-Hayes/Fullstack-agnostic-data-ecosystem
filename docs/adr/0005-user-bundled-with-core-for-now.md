# User stays bundled with core until a second Entity

User remains the bootstrap example Entity alongside generic core primitives. Split into a dedicated package only when a second first-party Entity would otherwise bloat core.

**Considered options**: (1) keep User in core for now; (2) extract User immediately. Chose (1) to finish Entity-first frontend adapter parity before a packaging migration.
