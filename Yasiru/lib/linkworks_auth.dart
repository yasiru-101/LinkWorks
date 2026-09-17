// Member A: public API for this local package.
// Add exports here when another package needs a supported class or function.
// Other packages should import this library instead of files under lib/src/.

/// Public API for linkworks_auth.
// Explains: Declare this file as a Dart library whose exports form the package public API.
library;
// Explains: Expose this implementation through the package public API so other members avoid private imports.
export 'src/auth/presentation/welcome_screen.dart';
// Explains: Expose this implementation through the package public API so other members avoid private imports.
export 'src/onboarding/domain/role_access.dart';
