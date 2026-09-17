// Member E maintains the Material 3 theme; edit colors.dart and spacing.dart for tokens.
import 'package:flutter/material.dart';

import 'colors.dart';
import 'spacing.dart';
export 'colors.dart';
export 'spacing.dart';

// Preserve existing palette aliases while exposing typography and elevation centrally.
abstract final class AppTheme {
  static const teal = AppColors.teal;
  static const ink = AppColors.ink;
  static const canvas = AppColors.canvas;

  // Material's accessible baseline styles inherit the LinkWorks foreground color.
  static ThemeData get light => ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(seedColor: teal),
    scaffoldBackgroundColor: canvas,
    textTheme: Typography.material2021().black.apply(
      bodyColor: ink,
      displayColor: ink,
    ),
    cardTheme: const CardThemeData(elevation: AppElevation.raised),
    appBarTheme: const AppBarTheme(
      centerTitle: false,
      backgroundColor: canvas,
      foregroundColor: ink,
      elevation: AppElevation.flat,
    ),
    inputDecorationTheme: InputDecorationTheme(
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      filled: true,
      fillColor: Colors.white,
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size(48, 52),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(minimumSize: const Size(48, 52)),
    ),
  );
}
