// Member E owns shared colors; app_theme.dart applies them to Material components.
import 'package:flutter/material.dart';

// Central palette for screens that need explicit colors beyond the Material scheme.
abstract final class AppColors {
  static const teal = Color(0xFF006B5E);
  static const ink = Color(0xFF192E2A);
  static const canvas = Color(0xFFF7FAF8);
}
