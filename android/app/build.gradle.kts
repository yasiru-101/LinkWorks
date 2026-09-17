// Shared Android app build settings, coordinated by Member E.
// applicationId must match the Firebase Android app; changing it requires Firebase reconfiguration.
// minSdk is 24 as specified in the plan. SDK and plugin upgrades must be validated together.
// Release signing is still the Flutter template debug-key setup; production signing is not configured.

// Explains: Declare the build plugins applied to this Android project.
plugins {
    // Explains: Select the named build plugin/version; apply false makes it available without applying it to this project.
    id("com.android.application")
    // START: FlutterFire Configuration
    // Explains: Select the named build plugin/version; apply false makes it available without applying it to this project.
    id("com.google.gms.google-services")
    // END: FlutterFire Configuration
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    // Explains: Select the named build plugin/version; apply false makes it available without applying it to this project.
    id("dev.flutter.flutter-gradle-plugin")
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Configure Android compilation, app identity, and build variants.
android {
    // Explains: Set the namespace for generated Android resources and native source.
    namespace = "com.linkworks.linkworks"
    // Explains: Use the Android compile SDK selected by this Flutter toolchain.
    // Compile against SDK 37 because permission_handler_android requires it; minSdk remains 24.
    compileSdk = 37
    // Explains: Align native plugin compilation with Flutter selected NDK version.
    ndkVersion = flutter.ndkVersion

    // Explains: Keep Java source and bytecode compatibility aligned with the toolchain.
    compileOptions {
        // Explains: Target Java 17-compatible compilation for the app native source.
        sourceCompatibility = JavaVersion.VERSION_17
        // Explains: Target Java 17-compatible compilation for the app native source.
        targetCompatibility = JavaVersion.VERSION_17
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    }

    // Explains: Set defaults shared by Android debug/release variants.
    defaultConfig {
        // Explains: Set the installed app identifier; it must match Firebase Android registration.
        applicationId = "com.linkworks.linkworks"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        // Explains: Require Android API 24 or newer as specified by the project plan.
        minSdk = 24
        // Explains: Use the Flutter-selected Android target behavior level.
        targetSdk = flutter.targetSdkVersion
        // Uses the version code from pubspec.yaml. When using split APKs, 1000 * ABI_VERSION
        // is added automatically by Flutter. (https://developer.android.com/studio/build/configure-apk-splits#configure-APK-versions)
        // You can force using the value of versionCode by specifying the `-P force-version-code-ignoring-abi=true`
        // flag during build.
        // Explains: Use the app version/build number resolved from root pubspec.yaml.
        versionCode = flutter.versionCode
        // Explains: Use the app version/build number resolved from root pubspec.yaml.
        versionName = flutter.versionName
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    }

    // Explains: Define variant-specific Android build configuration.
    buildTypes {
        // Explains: Configure the release variant; production signing remains unfinished.
        release {
            // TODO: Add your own signing config for the release build.
            // Signing with the debug keys for now, so `flutter run --release` works.
            // Explains: Use template debug signing for now; replace only when release signing is explicitly configured.
            signingConfig = signingConfigs.getByName("debug")
        // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
        }
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    }
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Configure Kotlin compilation for the Android module.
kotlin {
    // Explains: Set compiler options shared by Kotlin compilation tasks.
    compilerOptions {
        // Explains: Target Java 17-compatible compilation for the app native source.
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    }
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Point the Android module at the root Flutter application.
flutter {
    // Explains: Resolve the Flutter root relative to this Android app module.
    source = "../.."
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
