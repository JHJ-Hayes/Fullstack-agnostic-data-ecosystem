import { defineComponent, inject, provide, type App, type PropType } from 'vue';
import { CoreDataService } from '@fae/core';
import { FaeServiceKey } from './keys.js';

export interface FaePluginOptions {
  /** Custom service instance (e.g. with MySQL provider). Defaults to mock CoreDataService. */
  service?: CoreDataService;
}

/** Vue plugin — `app.use(createFaePlugin({ service }))` */
export function createFaePlugin(options: FaePluginOptions = {}) {
  const service = options.service ?? new CoreDataService();

  return {
    install(app: App) {
      app.provide(FaeServiceKey, service);
    },
  };
}

/** Component wrapper — `<FaeProvider><App /></FaeProvider>` */
export const FaeProvider = defineComponent({
  name: 'FaeProvider',
  props: {
    service: {
      type: Object as PropType<CoreDataService>,
      required: false,
    },
  },
  setup(props, { slots }) {
    provide(FaeServiceKey, props.service ?? new CoreDataService());
    return () => slots.default?.();
  },
});

/** Access the {@link CoreDataService} from the nearest provider. */
export function useFaeService(): CoreDataService {
  const service = inject(FaeServiceKey);
  if (!service) {
    throw new Error('useFaeService must be used within a FaeProvider or createFaePlugin');
  }
  return service;
}
