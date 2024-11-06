// import { registerPlugin } from '@capacitor/core';

// import type { MapboxPluginPlugin } from './definitions';

// const MapboxPlugin = registerPlugin<MapboxPluginPlugin>('MapboxPlugin', {
//   web: () => import('./web').then((m) => new m.MapboxPluginWeb()),
// });

// export * from './definitions';
// export { MapboxPlugin };

import { registerPlugin } from '@capacitor/core';

export interface MapboxInitOptions {
  accessToken: string;
  style: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

export interface OfflineRegionOptions {
  bounds: {
    ne: { lat: number; lng: number };
    sw: { lat: number; lng: number };
  };
  minZoom: number;
  maxZoom: number;
  styleUrl: string;
}
// testing some stuff

export interface MarkerOptions {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  snippet?: string;
}

export interface MapboxPlugin {
  initialize(options: MapboxInitOptions): Promise<void>;
  addMarker(options: MarkerOptions): Promise<void>;
  removeMarker(options: { id: string }): Promise<void>;
  downloadOfflineRegion(options: OfflineRegionOptions): Promise<void>;
  deleteOfflineRegion(options: { id: string }): Promise<void>;
  enableLocationTracking(): Promise<void>;
  disableLocationTracking(): Promise<void>;
  setCenter(options: { lat: number; lng: number }): Promise<void>;
  setZoom(options: { zoom: number }): Promise<void>;
}

const Mapbox = registerPlugin<MapboxPlugin>('Mapbox');

export default Mapbox;