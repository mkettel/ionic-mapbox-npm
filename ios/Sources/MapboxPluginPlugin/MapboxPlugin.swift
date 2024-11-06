import Foundation
import Capacitor

@objc(MapboxPlugin)
public class MapboxPlugin: CAPPlugin {
    private var mapView: MGLMapView?
    
    @objc func initialize(_ call: CAPPluginCall) {
        guard let accessToken = call.getString("accessToken") else {
            call.reject("Access token is required")
            return
        }
        
        DispatchQueue.main.async { [weak self] in
            MGLAccountManager.accessToken = accessToken
            
            let center = call.getObject("center")
            let lat = center?.getDouble("lat") ?? 0
            let lng = center?.getDouble("lng") ?? 0
            let zoom = call.getDouble("zoom") ?? 15
            let style = call.getString("style") ?? MGLStyle.streetsStyleURL.absoluteString
            
            let mapView = MGLMapView(frame: self?.bridge?.webView?.bounds ?? .zero)
            mapView.styleURL = URL(string: style)
            mapView.setCenter(CLLocationCoordinate2D(latitude: lat, longitude: lng), 
                            zoomLevel: zoom, 
                            animated: false)
            
            self?.bridge?.webView?.superview?.addSubview(mapView)
            self?.mapView = mapView
            
            call.resolve()
        }
    }
    
    @objc func addMarker(_ call: CAPPluginCall) {
        guard let lat = call.getDouble("lat"),
              let lng = call.getDouble("lng") else {
            call.reject("Latitude and longitude are required")
            return
        }
        
        DispatchQueue.main.async { [weak self] in
            let annotation = MGLPointAnnotation()
            annotation.coordinate = CLLocationCoordinate2D(latitude: lat, longitude: lng)
            annotation.title = call.getString("title")
            annotation.subtitle = call.getString("snippet")
            
            self?.mapView?.addAnnotation(annotation)
            call.resolve()
        }
    }
}