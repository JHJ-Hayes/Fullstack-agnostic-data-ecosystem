import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { CoreDataService } from '@fae/core';

export const FaeContext = createContext<CoreDataService | null>(null);

export interface FaeProviderProps {
  /** Custom service instance (e.g. with MySQL provider). Defaults to mock CoreDataService. */
  service?: CoreDataService;
  children: ReactNode;
}

/** Provide a shared {@link CoreDataService} to the React tree. */
export function FaeProvider({ service, children }: FaeProviderProps) {
  const value = useMemo(() => service ?? new CoreDataService(), [service]);

  return <FaeContext.Provider value={value}>{children}</FaeContext.Provider>;
}

/** Access the {@link CoreDataService} from the nearest {@link FaeProvider}. */
export function useFaeService(): CoreDataService {
  const service = useContext(FaeContext);
  if (!service) {
    throw new Error('useFaeService must be used within a FaeProvider');
  }
  return service;
}
