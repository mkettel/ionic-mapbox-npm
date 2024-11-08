import Foundation

@objc(MapboxPlugin)
public class MapboxPlugin: NSObject {
    @objc public func register(with registrar: CAPPluginRegistrar) {
        let channel = CAPPluginCall(pluginId: "MapboxPlugin",
                                  methodName: "initialize",
                                  arguments: [:])
        registrar.register(channel)
    }
}