package io.ionic.mapbox;

import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.mapbox.mapboxsdk.Mapbox;
import com.mapbox.mapboxsdk.maps.MapView;
import com.mapbox.mapboxsdk.maps.MapboxMap;
import com.mapbox.mapboxsdk.maps.Style;
import com.mapbox.mapboxsdk.geometry.LatLng;
import com.mapbox.mapboxsdk.camera.CameraPosition;
import com.mapbox.mapboxsdk.annotations.MarkerOptions;
import com.mapbox.mapboxsdk.offline.OfflineManager;
import com.mapbox.mapboxsdk.offline.OfflineRegion;
import com.mapbox.mapboxsdk.offline.OfflineRegionDefinition;
import com.mapbox.mapboxsdk.geometry.LatLngBounds;

import org.json.JSONObject;

@CapacitorPlugin(name = "Mapbox")
public class MapboxPlugin extends Plugin {
    private MapView mapView;
    private MapboxMap mapboxMap;
    private OfflineManager offlineManager;

    @PluginMethod
    public void initialize(final PluginCall call) {
        try {
            String accessToken = call.getString("accessToken");
            if (accessToken == null) {
                call.reject("Access token is required");
                return;
            }

            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        // Initialize Mapbox
                        Mapbox.getInstance(getContext(), accessToken);

                        // Create MapView
                        mapView = new MapView(getContext());
                        
                        // Get parameters
                        JSObject center = call.getObject("center", new JSObject());
                        double lat = center.getDouble("lat", 0.0);
                        double lng = center.getDouble("lng", 0.0);
                        double zoom = call.getDouble("zoom", 15.0);
                        String style = call.getString("style", Style.MAPBOX_STREETS);

                        // Setup layout parameters
                        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT
                        );
                        mapView.setLayoutParams(params);

                        // Add to WebView
                        getBridge().getWebView().getParent().addView(mapView);

                        // Initialize map
                        mapView.getMapAsync(map -> {
                            mapboxMap = map;
                            
                            map.setStyle(style, style1 -> {
                                // Set initial camera position
                                CameraPosition position = new CameraPosition.Builder()
                                    .target(new LatLng(lat, lng))
                                    .zoom(zoom)
                                    .build();
                                
                                map.setCameraPosition(position);
                                call.resolve();
                            });
                        });

                    } catch (Exception e) {
                        call.reject("Failed to initialize Mapbox", e);
                    }
                }
            });

        } catch (Exception e) {
            call.reject("Failed to initialize Mapbox", e);
        }
    }

    @PluginMethod
    public void addMarker(final PluginCall call) {
        if (!call.hasOption("lat") || !call.hasOption("lng")) {
            call.reject("Latitude and longitude are required");
            return;
        }

        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    double lat = call.getDouble("lat");
                    double lng = call.getDouble("lng");
                    String title = call.getString("title", "");
                    String snippet = call.getString("snippet", "");

                    MarkerOptions markerOptions = new MarkerOptions()
                        .position(new LatLng(lat, lng))
                        .title(title)
                        .snippet(snippet);

                    mapboxMap.addMarker(markerOptions);
                    call.resolve();

                } catch (Exception e) {
                    call.reject("Failed to add marker", e);
                }
            }
        });
    }

    @PluginMethod
    public void downloadOfflineRegion(final PluginCall call) {
        try {
            JSObject bounds = call.getObject("bounds", new JSObject());
            JSObject ne = bounds.getJSObject("ne");
            JSObject sw = bounds.getJSObject("sw");
            double minZoom = call.getDouble("minZoom", 10.0);
            double maxZoom = call.getDouble("maxZoom", 15.0);
            String styleUrl = call.getString("styleUrl", Style.MAPBOX_STREETS);

            LatLngBounds latLngBounds = new LatLngBounds.Builder()
                .include(new LatLng(ne.getDouble("lat"), ne.getDouble("lng")))
                .include(new LatLng(sw.getDouble("lat"), sw.getDouble("lng")))
                .build();

            OfflineRegionDefinition definition = new OfflineRegionDefinition(
                styleUrl,
                latLngBounds,
                minZoom,
                maxZoom,
                getContext().getResources().getDisplayMetrics().density
            );

            byte[] metadata = new JSONObject().toString().getBytes();

            offlineManager = OfflineManager.getInstance(getContext());
            offlineManager.createOfflineRegion(
                definition,
                metadata,
                new OfflineManager.CreateOfflineRegionCallback() {
                    @Override
                    public void onCreate(OfflineRegion offlineRegion) {
                        offlineRegion.setDownloadState(OfflineRegion.STATE_ACTIVE);
                        call.resolve();
                    }

                    @Override
                    public void onError(String error) {
                        call.reject("Failed to create offline region: " + error);
                    }
                });

        } catch (Exception e) {
            call.reject("Failed to download offline region", e);
        }
    }

    @PluginMethod
    public void setCenter(final PluginCall call) {
        if (!call.hasOption("lat") || !call.hasOption("lng")) {
            call.reject("Latitude and longitude are required");
            return;
        }

        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    double lat = call.getDouble("lat");
                    double lng = call.getDouble("lng");
                    
                    CameraPosition position = new CameraPosition.Builder()
                        .target(new LatLng(lat, lng))
                        .zoom(mapboxMap.getCameraPosition().zoom)
                        .build();
                    
                    mapboxMap.setCameraPosition(position);
                    call.resolve();

                } catch (Exception e) {
                    call.reject("Failed to set center", e);
                }
            }
        });
    }

    @PluginMethod
    public void enableLocationTracking(final PluginCall call) {
        getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    mapboxMap.setMyLocationEnabled(true);
                    call.resolve();
                } catch (Exception e) {
                    call.reject("Failed to enable location tracking", e);
                }
            }
        });
    }

    @Override
    protected void handleOnResume() {
        super.handleOnResume();
        if (mapView != null) {
            mapView.onResume();
        }
    }

    @Override
    protected void handleOnPause() {
        super.handleOnPause();
        if (mapView != null) {
            mapView.onPause();
        }
    }

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
        if (mapView != null) {
            mapView.onDestroy();
        }
    }
}