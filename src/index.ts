import { registerPlugin } from '@capacitor/core';

import type { MapboxPluginPlugin } from './definitions';

const MapboxPlugin = registerPlugin<MapboxPluginPlugin>('MapboxPlugin', {
  web: () => import('./web').then((m) => new m.MapboxPluginWeb()),
});

export * from './definitions';
export { MapboxPlugin };
