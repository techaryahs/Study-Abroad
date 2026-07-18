import java.util.Properties
import java.io.FileInputStream

val keystorePropertiesFile = rootProject.file("key.properties")
val keystoreProperties = Properties()

if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {

    namespace = "com.studyabroad.study_abroad"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }

    defaultConfig {
        applicationId = "com.studyabroad.study_abroad"
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    signingConfigs {
        if (keystorePropertiesFile.exists()) {
            create("release") {
                keyAlias = keystoreProperties.getProperty("keyAlias")
                keyPassword = keystoreProperties.getProperty("keyPassword")
                storeFile = keystoreProperties.getProperty("storeFile")?.let { file(it) }
                storePassword = keystoreProperties.getProperty("storePassword")
            }
        }
    }

    buildTypes {
        release {
            signingConfig = if (keystorePropertiesFile.exists()) {
                signingConfigs.getByName("release")
            } else {
                null
            }
            isMinifyEnabled = false
            isShrinkResources = false
        }
    }
}

// Fail loudly if a release build is attempted without signing credentials.
gradle.taskGraph.whenReady {
    if (allTasks.any { it.name.contains("Release") } && !keystorePropertiesFile.exists()) {
        throw GradleException(
            buildString {
                appendLine("ERROR: Release build requires signing credentials.")
                appendLine()
                appendLine("Create the file: android/key.properties")
                appendLine("With the following keys:")
                appendLine("  storePassword=<your keystore password>")
                appendLine("  keyPassword=<your key password>")
                appendLine("  keyAlias=<your key alias>")
                appendLine("  storeFile=../upload-keystore.jks")
            }
        )
    }
}

flutter {
    source = "../.."
}
