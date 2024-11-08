// This will ensure that the types are available to other parts of the application that import the plugin.

export interface MapboxInitOptions {
  accessToken: string;
  style: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

export interface MarkerOptions {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  snippet?: string;
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