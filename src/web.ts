import { WebPlugin } from '@capacitor/core';
import mapboxgl from 'mapbox-gl';
import type { 
  MapboxPlugin, 
  MapboxInitOptions, 
  MarkerOptions, 
  OfflineRegionOptions 
} from './definitions';

export class MapboxPluginWeb extends WebPlugin implements MapboxPlugin {
  private map: mapboxgl.Map | null = null;
  private markers: Map<string, mapboxgl.Marker> = new Map();
  private locationMarker: mapboxgl.Marker | null = null;
  private watchId: number | null = null;

  async initialize(options: MapboxInitOptions): Promise<void> {
    // Set Mapbox access token
    mapboxgl.accessToken = options.accessToken;

    // Initialize the map
    this.map = new mapboxgl.Map({
      container: 'map',
      style: options.style,
      center: [options.center.lng, options.center.lat],
      zoom: options.zoom
    });

    // Wait for map to load
    return new Promise((resolve, reject) => {
      if (!this.map) {
        reject(new Error('Map failed to initialize'));
        return;
      }

      this.map.on('load', () => {
        resolve();
      });

      this.map.on('error', (e) => {
        reject(e);
      });
    });
  }

  async addMarker(options: MarkerOptions): Promise<void> {
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    // Create popup if title or snippet is provided
    let popup: mapboxgl.Popup | undefined;
    if (options.title || options.snippet) {
      popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <h3>${options.title || ''}</h3>
          <p>${options.snippet || ''}</p>
        `);
    }

    // Create and add marker
    const marker = new mapboxgl.Marker()
      .setLngLat([options.lng, options.lat]);
    
    if (popup) {
      marker.setPopup(popup);
    }

    marker.addTo(this.map);
    this.markers.set(options.id, marker);
  }

  async removeMarker(options: { id: string }): Promise<void> {
    const marker = this.markers.get(options.id);
    if (marker) {
      marker.remove();
      this.markers.delete(options.id);
    }
  }

  async enableLocationTracking(): Promise<void> {
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    // Create location marker if it doesn't exist
    if (!this.locationMarker) {
      this.locationMarker = new mapboxgl.Marker({
        color: '#007AFF'
      }).addTo(this.map);
    }

    // Start watching position
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.locationMarker?.setLngLat([longitude, latitude]);
        this.map?.flyTo({
          center: [longitude, latitude],
          zoom: 15
        });
      },
      (error) => {
        console.error('Location tracking error:', error);
        throw error;
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );
  }

  async disableLocationTracking(): Promise<void> {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.locationMarker) {
      this.locationMarker.remove();
      this.locationMarker = null;
    }
  }

  async setCenter(options: { lat: number; lng: number }): Promise<void> {
    if (!this.map) {
      throw new Error('Map not initialized');
    }
    this.map.setCenter([options.lng, options.lat]);
  }

  async setZoom(options: { zoom: number }): Promise<void> {
    if (!this.map) {
      throw new Error('Map not initialized');
    }
    this.map.setZoom(options.zoom);
  }

  // Offline functionality is not supported in web implementation
  async downloadOfflineRegion(_options: OfflineRegionOptions): Promise<void> {
    throw new Error('Offline regions are not supported in web implementation');
  }

  async deleteOfflineRegion(_options: { id: string }): Promise<void> {
    throw new Error('Offline regions are not supported in web implementation');
  }
}