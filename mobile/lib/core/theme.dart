import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // ── Brand Colors (Matching React Website Design System) ──────
  // Obsidian & Deep Navy Palette
  static const Color navyDark = Color(0xFF0F243B); // --color-dark-950
  static const Color navy = Color(0xFF10324A);     // Website primary navy
  static const Color navyDeep = Color(0xFF123449); // --color-dark-900
  static const Color navyMid = Color(0xFF17425B);  // --color-dark-800
  static const Color navyHeader = Color(0xFF16364F);

  // Warm Gold Palette
  static const Color gold = Color(0xFFD2A14A);     // Website primary gold (--color-gold-500)
  static const Color goldLight = Color(0xFFECD8B1);
  static const Color goldDark = Color(0xFFB8832D);  // --color-gold-600
  static const Color goldAccent = Color(0xFFD4A54A);
  static const Color goldDeep = Color(0xFF8A5F16);

  // Subtle Teal Palette
  static const Color teal = Color(0xFF2CA59D);     // Primary teal accent
  static const Color tealDark = Color(0xFF0F4C5C); // Deep teal
  static const Color tealLight = Color(0xFFE6F6F5); // Subtle background tint
  static const Color tealSurface = Color(0x262CA59D);

  // Backgrounds and Surfaces
  static const Color background = Color(0xFFF8F6F1); // Light warm neutral scaffold
  static const Color backgroundAlt = Color(0xFFFCFBF7);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceMuted = Color(0xFFF8FCFE); // Soft cool tint surface
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color cream = Color(0xFFF8F4EA);

  // Text Colors
  static const Color textPrimary = Color(0xFF10324A); // Deep navy for readability
  static const Color textSecondary = Color(0xFF4B5B6A); // Muted blue-grey
  static const Color textMuted = Color(0xFF8FA2B5);
  static const Color textWhite = Color(0xFFFFFFFF);

  // Border and Shadow Colors
  static const Color borderLight = Color(0x1A10324A); // 10% navy
  static const Color borderSubtle = Color(0xFFE8EEF2);
  static const Color borderGold = Color(0x40D2A14A); // 25% gold

  // ── Backward-Compatibility Aliases ──────────────────────────
  static const Color darkBrown = navy;
  static const Color darkBrownAlt = navyHeader;

  // ── Shadows ────────────────────────────────────────────────
  static List<BoxShadow> get cardShadow => [
        BoxShadow(
          color: navy.withValues(alpha: 0.06),
          blurRadius: 24,
          offset: const Offset(0, 8),
        ),
      ];

  static List<BoxShadow> get goldGlow => [
        BoxShadow(
          color: gold.withValues(alpha: 0.28),
          blurRadius: 20,
          offset: const Offset(0, 6),
        ),
      ];

  static List<BoxShadow> get navyShadow => [
        BoxShadow(
          color: navyDark.withValues(alpha: 0.18),
          blurRadius: 30,
          offset: const Offset(0, 12),
        ),
      ];

  static ThemeData light() {
    final baseInter = GoogleFonts.interTextTheme();
    const serifFont = GoogleFonts.playfairDisplay;

    return ThemeData(
      useMaterial3: true,
      fontFamily: GoogleFonts.inter().fontFamily,
      fontFamilyFallback: const [
        'NotoSans',
        'Segoe UI Emoji',
        'Apple Color Emoji',
        'Noto Color Emoji',
      ],
      scaffoldBackgroundColor: background,
      colorScheme: const ColorScheme.light(
        primary: gold,
        onPrimary: navy,
        secondary: navy,
        onSecondary: Colors.white,
        surface: surface,
        onSurface: textPrimary,
        outline: borderLight,
      ),
      textTheme: baseInter.copyWith(
        headlineLarge: serifFont(
          fontWeight: FontWeight.w900,
          color: textPrimary,
          fontSize: 32,
          letterSpacing: -0.5,
          height: 1.1,
        ),
        headlineMedium: serifFont(
          fontWeight: FontWeight.w800,
          color: textPrimary,
          fontSize: 26,
          letterSpacing: -0.3,
          height: 1.15,
        ),
        headlineSmall: serifFont(
          fontWeight: FontWeight.w700,
          color: textPrimary,
          fontSize: 22,
          height: 1.2,
        ),
        titleLarge: GoogleFonts.inter(
          fontWeight: FontWeight.w800,
          color: textPrimary,
          fontSize: 18,
          letterSpacing: -0.2,
        ),
        titleMedium: GoogleFonts.inter(
          fontWeight: FontWeight.w700,
          color: textPrimary,
          fontSize: 16,
        ),
        titleSmall: GoogleFonts.inter(
          fontWeight: FontWeight.w600,
          color: textPrimary,
          fontSize: 14,
        ),
        bodyLarge: GoogleFonts.inter(
          color: textSecondary,
          fontSize: 15,
          height: 1.5,
        ),
        bodyMedium: GoogleFonts.inter(
          color: textSecondary,
          fontSize: 13,
          height: 1.45,
        ),
        labelSmall: GoogleFonts.inter(
          fontWeight: FontWeight.w800,
          letterSpacing: 2.0,
          fontSize: 10,
          color: tealDark,
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: surface,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        iconTheme: const IconThemeData(color: textPrimary),
        titleTextStyle: GoogleFonts.inter(
          color: textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.2,
        ),
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: borderLight),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: gold, width: 1.5),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: gold,
          foregroundColor: navy,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          textStyle: GoogleFonts.inter(
            fontWeight: FontWeight.w800,
            fontSize: 13,
            letterSpacing: 1.5,
          ),
        ),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: surface,
        selectedItemColor: gold,
        unselectedItemColor: textSecondary.withValues(alpha: 0.6),
        type: BottomNavigationBarType.fixed,
        selectedLabelStyle: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.5,
        ),
        unselectedLabelStyle: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        elevation: 0,
      ),
    );
  }
}

class AppSpacing {
  static const double xs = 8.0;
  static const double sm = 16.0;
  static const double md = 24.0;
  static const double lg = 32.0;
  static const double xl = 40.0;
  static const double xxl = 48.0;
}
