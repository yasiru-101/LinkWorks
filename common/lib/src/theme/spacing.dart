// Member E owns layout tokens; feature-specific arrangements stay in member screens.
// Logical pixels scale through Flutter's device-independent layout system.
abstract final class AppSpacing {
  static const small = 8.0;
  static const medium = 16.0;
  static const large = 24.0;
  static const extraLarge = 32.0;
}

// Shared surface depths keep cards and navigation visually consistent.
abstract final class AppElevation {
  static const flat = 0.0;
  static const raised = 1.0;
}
