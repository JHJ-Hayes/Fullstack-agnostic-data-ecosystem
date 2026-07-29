import type { InjectionKey } from 'vue';
import type { CoreDataService } from '@fae/core';

export const FaeServiceKey: InjectionKey<CoreDataService> = Symbol('FaeService');
