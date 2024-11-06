// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "IonicMapbox",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "IonicMapbox",
            targets: ["MapboxPluginPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "MapboxPluginPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/MapboxPluginPlugin"),
        .testTarget(
            name: "MapboxPluginPluginTests",
            dependencies: ["MapboxPluginPlugin"],
            path: "ios/Tests/MapboxPluginPluginTests")
    ]
)