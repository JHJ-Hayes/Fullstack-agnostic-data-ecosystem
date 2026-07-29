import { inject } from '@angular/core';
import type { CoreDataService } from '@fae/core';
import { FAE_SERVICE } from './tokens.js';

/** Access the {@link CoreDataService} from the Angular injector. */
export function useFaeService(): CoreDataService {
  const service = inject(FAE_SERVICE);
  if (!service) {
    throw new Error('useFaeService requires provideFae() in the application providers');
  }
  return service;
}
