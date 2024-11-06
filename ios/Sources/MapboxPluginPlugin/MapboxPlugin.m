#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(MapboxPlugin, "Mapbox",
    CAP_PLUGIN_METHOD(initialize, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(addMarker, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(removeMarker, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(downloadOfflineRegion, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(deleteOfflineRegion, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(enableLocationTracking, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(disableLocationTracking, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(setCenter, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(setZoom, CAPPluginReturnPromise);
)