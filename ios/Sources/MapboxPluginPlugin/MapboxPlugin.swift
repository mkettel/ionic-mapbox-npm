import Foundation
import Capacitor
import Mapbox

@objc(MapboxPlugin)
public class MapboxPlugin: CAPPlugin {
    private var mapView: MGLMapView?
    private var locationManager: CLLocationManager?
    
    override public func load() {
        // Initialize location manager
        locationManager = CLLocationManager()
    }
    
    @objc func initialize(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            guard let accessToken = call.getString("accessToken") else {
                call.reject("Access token is required")
                return
            }
            
            MGLAccountManager.accessToken = accessToken
            
            let center = call.getObject("center")
            let lat = center?.getDouble("lat") ?? 0
            let lng = center?.getDouble("lng") ?? 0
            let zoom = call.getFloat("zoom") ?? 15
            let styleString = call.getString("style") ?? "mapbox://styles/mapbox/streets-v11"
            
            // Create map view
            let mapView = MGLMapView(frame: .zero)
            mapView.styleURL = URL(string: styleString)
            mapView.setCenter(CLLocationCoordinate2D(latitude: lat, longitude: lng),
                            zoomLevel: zoom,
                            animated: false)
            
            // Configure map view
            mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            
            // Add map view to the web view's superview
            if let webView = self?.webView,
               let parentView = webView.superview {
                mapView.frame = parentView.bounds
                parentView.insertSubview(mapView, belowSubview: webView)
            }
            
            self?.mapView = mapView
            call.resolve()
        }
    }
    
    @objc func addMarker(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            guard let lat = call.getDouble("lat"),
                  let lng = call.getDouble("lng") else {
                call.reject("Latitude and longitude are required")
                return
            }
            
            let annotation = MGLPointAnnotation()
            annotation.coordinate = CLLocationCoordinate2D(latitude: lat, longitude: lng)
            annotation.title = call.getString("title")
            annotation.subtitle = call.getString("snippet")
            
            self?.mapView?.addAnnotation(annotation)
            call.resolve()
        }
    }
    
    @objc func enableLocationTracking(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            guard let locationManager = self?.locationManager else {
                call.reject("Location manager not initialized")
                return
            }
            
            locationManager.requestWhenInUseAuthorization()
            self?.mapView?.showsUserLocation = true
            
            call.resolve()
        }
    }
    
    @objc func disableLocationTracking(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            self?.mapView?.showsUserLocation = false
            call.resolve()
        }
    }
    
    @objc func setCenter(_ call: CAPPluginCall) {
        guard let lat = call.getDouble("lat"),
              let lng = call.getDouble("lng") else {
            call.reject("Latitude and longitude are required")
            return
        }
        
        DispatchQueue.main.async { [weak self] in
            self?.mapView?.setCenter(
                CLLocationCoordinate2D(latitude: lat, longitude: lng),
                animated: true
            )
            call.resolve()
        }
    }
    
    @objc func setZoom(_ call: CAPPluginCall) {
        guard let zoom = call.getFloat("zoom") else {
            call.reject("Zoom level is required")
            return
        }
        
        DispatchQueue.main.async { [weak self] in
            self?.mapView?.setZoomLevel(zoom, animated: true)
            call.resolve()
        }
    }
}