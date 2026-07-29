import { InjectionToken } from '@angular/core';
import type { CoreDataService } from '@fae/core';

export const FAE_SERVICE = new InjectionToken<CoreDataService>('FAE_SERVICE');
