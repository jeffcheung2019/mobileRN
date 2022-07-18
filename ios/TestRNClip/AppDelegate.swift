//
//  AppDelegate.swift
//  TestRNClip
//
//  Created by Jeff Cheung on 6/4/2022.
//

import UIKit
import AppsFlyerLib

@main
class AppDelegate: UIResponder, UIApplicationDelegate {



    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
      // Get AppsFlyer preferences from .plist file
      guard let propertiesPath = Bundle.main.path(forResource: "afdevkey_donotpush", ofType: "plist"),
          let properties = NSDictionary(contentsOfFile: propertiesPath) as? [String:String] else {
              fatalError("Cannot find `afdevkey_donotpush`")
      }
      guard let appsFlyerDevKey = properties["appsFlyerDevKey"],
                 let appleAppID = properties["appleAppID"] else {
          fatalError("Cannot find `appsFlyerDevKey` or `appleAppID` key")
      }
      // 2 - Replace 'appsFlyerDevKey', `appleAppID` with your DevKey, Apple App ID
      AppsFlyerLib.shared().appsFlyerDevKey = appsFlyerDevKey
      AppsFlyerLib.shared().appleAppID = appleAppID
      // Set delegate for OneLink Callbacks
      AppsFlyerLib.shared().delegate = self
      //  Set isDebug to true to see AppsFlyer debug logs
      AppsFlyerLib.shared().isDebug = true
      
      guard let sharedUserDefaults = UserDefaults(suiteName: "group.dragon.dapp") else {
          return true
      }
      
      if sharedUserDefaults.string(forKey: "referral_code") == nil {
          sharedUserDefaults.set("test2233", forKey: "referral_code")
      }
        return true
    }

    // MARK: UISceneSession Lifecycle

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }


}

extension AppDelegate: AppsFlyerLibDelegate {
     
    // Handle Organic/Non-organic installation
    func onConversionDataSuccess(_ data: [AnyHashable: Any]) {
        
        print("onConversionDataSuccess data:")
        for (key, value) in data {
            print(key, ":", value)
        }
    }
    
    func onConversionDataFail(_ error: Error) {
        print("\(error)")
    }
     
    // Handle Deeplink
    func onAppOpenAttribution(_ attributionData: [AnyHashable: Any]) {
        //Handle Deep Link Data
        print("onAppOpenAttribution data:")
        for (key, value) in attributionData {
            print(key, ":",value)
        }
      
        guard let sharedUserDefaults = UserDefaults(suiteName: "group.dragon.dapp") else {
          print("UserDefaults failed")
          return
        }
                               
        if let referralCode = attributionData["referral_code"] as? String {
            sharedUserDefaults.set(referralCode, forKey: "referral_code")
        } else {
            print("Could find fruit_name in OneLink data")
        }
    }
    
    func onAppOpenAttributionFailure(_ error: Error) {
        print("\(error)")
    }
}
