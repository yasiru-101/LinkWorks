// Shared Android build repositories and build-output configuration.
// Feature behavior belongs in Dart member packages, not this Gradle file.
// Change repositories or output paths here only when build configuration requires it.

// Explains: Apply the following repository settings across Android projects.
allprojects {
    // Explains: List repositories Gradle may use to resolve Android dependencies.
    repositories {
        // Explains: Resolve Android and Firebase artifacts from Google Maven.
        google()
        // Explains: Resolve general JVM dependencies from Maven Central.
        mavenCentral()
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    }
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Place generated Android build artifacts under the root Flutter build directory.
val newBuildDir: Directory =
    // Explains: Place generated Android build artifacts under the root Flutter build directory.
    rootProject.layout.buildDirectory
        // Explains: Place generated Android build artifacts under the root Flutter build directory.
        .dir("../../build")
        // Explains: Resolve the Gradle directory provider to its configured directory value.
        .get()
// Explains: Place generated Android build artifacts under the root Flutter build directory.
rootProject.layout.buildDirectory.value(newBuildDir)

// Explains: Apply the following configuration to each Android subproject.
subprojects {
    // Explains: Place generated Android build artifacts under the root Flutter build directory.
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    // Explains: Place generated Android build artifacts under the root Flutter build directory.
    project.layout.buildDirectory.value(newSubprojectBuildDir)
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Apply the following configuration to each Android subproject.
subprojects {
    // Explains: Evaluate the app module before the dependent subproject configuration.
    project.evaluationDependsOn(":app")
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Register the clean task that removes generated build output, not application source.
tasks.register<Delete>("clean") {
    // Explains: Delete only the configured build directory when the Gradle clean task runs.
    delete(rootProject.layout.buildDirectory)
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
