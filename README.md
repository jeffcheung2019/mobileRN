# Steps to deploy to firebase app distribution

# 1) build ios (IPA)

```
cd ios
rm Podfile.lock
arch -x86_64 pod install
```

open ios/TestRN.xcworkspace

Select build target `Any iOS Device (arm64)`

Click Product > Archive

# 2) build android (APK), (AAB)

```
cd android
./gradlew clean
```

(APK)

```
./gradlew assembleRelease
```

(AAB)

```
./gradlew bundleRelease
```

Drag & drop the ipa & apk files to firebase app distribution
