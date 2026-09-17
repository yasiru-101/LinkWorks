// Member A: local role eligibility helper for future routing/onboarding.
// Access requires completed onboarding and the selected role flag.
// This helper is not wired into the current preview and is not server-side authorization.
// Coordinate changes with role_access_test.dart and future Firebase access rules.

// Explains: Import shared model contracts, constants, theme, and reusable UI components.
import 'package:linkworks_common/linkworks_common.dart';

// Explains: Return whether completed onboarding and account flags permit the requested UI role.
bool canUseRole(UserModel user, AppRole role) =>
    // Explains: Require completed onboarding, then check the specific client/worker permission flag.
    user.onboardingComplete && switch (role) {
      // Explains: Allow the client view only when the account client role is enabled.
      AppRole.client => user.isClient,
      // Explains: Allow the worker view only when the account worker role is enabled.
      AppRole.worker => user.isWorker,
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    };
