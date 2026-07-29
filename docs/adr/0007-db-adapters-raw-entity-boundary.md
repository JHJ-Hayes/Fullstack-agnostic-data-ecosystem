# Database Adapters always expose Repository + Provider over Raw Entity

Every Database Adapter returns a Repository for writes/queries and a Data Provider for Entity Service reads. The external boundary is always Raw Entity; database-native rows or documents stay inside the adapter. MongoDB may not skip Raw Entity just because documents look like Entities.

**Considered options**: (1) uniform Raw Entity boundary; (2) allow some DBs to emit Entity directly. Chose (1) so swapping Database Adapters does not change core or frontend contracts.
