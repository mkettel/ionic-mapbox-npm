import { registerPlugin } from '@capacitor/core';
import type { MapboxPlugin } from './definitions';
import { MapboxPluginWeb } from './web';

export * from './definitions';

const Mapbox = registerPlugin<MapboxPlugin>('Mapbox', {
    web: () => new MapboxPluginWeb(),
    ios: undefined,
    android: undefined,
});

export { Mapbox };
export default Mapbox;