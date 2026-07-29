import type { Provider } from '@angular/core';
import { CoreDataService } from '@fae/core';
import { FAE_SERVICE } from './tokens.js';

export interface ProvideFaeOptions {
  /** Custom service instance (e.g. with MySQL provider). Defaults to mock CoreDataService. */
  service?: CoreDataService;
}

/** Register a shared {@link CoreDataService} for the Angular injector tree. */
export function provideFae(options: ProvideFaeOptions = {}): Provider {
  return {
    provide: FAE_SERVICE,
    useValue: options.service ?? new CoreDataService(),
  };
}
