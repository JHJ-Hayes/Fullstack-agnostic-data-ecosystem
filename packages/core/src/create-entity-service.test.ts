import { describe, expect, it } from 'vitest';
import { createEntityService } from './entity-service.js';
import type { AsyncState, DataProvider } from './types.js';

interface Widget {
  id: string;
  label: string;
}

interface WidgetRaw {
  id: string;
  widget_label: string;
}

function toWidget(raw: WidgetRaw): Widget {
  return { id: raw.id, label: raw.widget_label };
}

describe('createEntityService (custom Entity)', () => {
  it('fetch maps Raw Entity to custom Entity via toEntity', async () => {
    const provider: DataProvider<WidgetRaw> = {
      async fetchRaw(id) {
        return { id, widget_label: 'Gauge' };
      },
    };
    const widgets = createEntityService({ provider, toEntity: toWidget });

    const widget = await widgets.fetch('w-1');

    expect(widget).toEqual({ id: 'w-1', label: 'Gauge' });
    expect(widget).not.toHaveProperty('widget_label');
  });

  it('subscribe emits loading then success for custom Entity', async () => {
    const provider: DataProvider<WidgetRaw> = {
      async fetchRaw(id) {
        return { id, widget_label: 'Dial' };
      },
    };
    const widgets = createEntityService({ provider, toEntity: toWidget });
    const states: AsyncState<Widget>[] = [];

    await new Promise<void>((resolve) => {
      widgets.subscribe('w-2', (state) => {
        states.push(state);
        if (state.status === 'success' || state.status === 'error') resolve();
      });
    });

    expect(states.map((s) => s.status)).toEqual(['loading', 'success']);
    expect(states[1]?.data).toEqual({ id: 'w-2', label: 'Dial' });
  });

  it('fetch surfaces provider failures as normalized Core Data errors', async () => {
    const provider: DataProvider<WidgetRaw> = {
      async fetchRaw() {
        throw new Error('upstream down');
      },
    };
    const widgets = createEntityService({ provider, toEntity: toWidget });

    await expect(widgets.fetch('w-3')).rejects.toMatchObject({
      code: 'UNKNOWN',
      message: 'upstream down',
    });
  });
});
