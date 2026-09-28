import 'package:flutter/material.dart';

class Responsive {
  static bool isSmall(BuildContext context) => MediaQuery.sizeOf(context).width < 360;
  static bool isPhone(BuildContext context) => MediaQuery.sizeOf(context).width >= 360 && MediaQuery.sizeOf(context).width < 600;
  static bool isTablet(BuildContext context) => MediaQuery.sizeOf(context).width >= 600 && MediaQuery.sizeOf(context).width <= 900;
  static bool isLargeTablet(BuildContext context) => MediaQuery.sizeOf(context).width > 900;

  static double title(BuildContext context) {
    double width = MediaQuery.sizeOf(context).width;
    if (width < 360) return 28.0;
    if (width < 600) return 32.0;
    if (width <= 900) return 40.0;
    return 48.0;
  }

  static double body(BuildContext context) {
    double width = MediaQuery.sizeOf(context).width;
    if (width < 360) return 14.0;
    if (width < 600) return 16.0;
    return 18.0;
  }

  static int gridColumns(BuildContext context) {
    double width = MediaQuery.sizeOf(context).width;
    if (width < 600) return 1;
    if (width < 900) return 2;
    return 3;
  }
}
