import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';

/// ─────────────────────────────────────────────────────────────────────────────
/// EDULEADER GLOBAL REUSABLE LOADING SYSTEM
/// Consistent, branded loaders across authentication, data fetching, and forms.
/// ─────────────────────────────────────────────────────────────────────────────

/// 1. AppLoadingIndicator: Branded Circular Spinner
class AppLoadingIndicator extends StatelessWidget {
  final double size;
  final Color? color;
  final double strokeWidth;
  final String? message;
  final TextStyle? messageStyle;

  const AppLoadingIndicator({
    super.key,
    this.size = 24.0,
    this.color,
    this.strokeWidth = 2.4,
    this.message,
    this.messageStyle,
  });

  /// Factory for a small inline spinner (e.g. inside chips or table rows)
  const AppLoadingIndicator.small({
    super.key,
    this.color,
    this.strokeWidth = 2.0,
    this.message,
    this.messageStyle,
  }) : size = 16.0;

  /// Factory for a medium spinner (e.g. inside buttons)
  const AppLoadingIndicator.button({
    super.key,
    this.color = AppTheme.navy,
    this.strokeWidth = 2.2,
    this.message,
    this.messageStyle,
  }) : size = 20.0;

  /// Factory for large page-level spinners
  const AppLoadingIndicator.large({
    super.key,
    this.color = AppTheme.gold,
    this.strokeWidth = 3.0,
    this.message,
    this.messageStyle,
  }) : size = 38.0;

  @override
  Widget build(BuildContext context) {
    final effectiveColor = color ?? AppTheme.gold;
    final spinner = SizedBox(
      width: size,
      height: size,
      child: CircularProgressIndicator(
        strokeWidth: strokeWidth,
        valueColor: AlwaysStoppedAnimation<Color>(effectiveColor),
      ),
    );

    if (message == null || message!.isEmpty) {
      return spinner;
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        spinner,
        const SizedBox(height: 12),
        Text(
          message!,
          textAlign: TextAlign.center,
          style: messageStyle ??
              GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppTheme.textSecondary,
                letterSpacing: 0.3,
              ),
        ),
      ],
    );
  }
}

/// 2. LoadingButton: Primary Action Button with Built-in Loading State
class LoadingButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final String? loadingLabel;
  final Widget? icon;
  final double? width;
  final double height;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final Color? borderColor;
  final bool isOutlined;
  final double borderRadius;
  final EdgeInsetsGeometry padding;

  const LoadingButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    this.loadingLabel,
    this.icon,
    this.width,
    this.height = 48,
    this.backgroundColor,
    this.foregroundColor,
    this.borderColor,
    this.isOutlined = false,
    this.borderRadius = 16,
    this.padding = const EdgeInsets.symmetric(horizontal: 20),
  });

  /// Solid Gold Variant
  factory LoadingButton.gold({
    Key? key,
    required String label,
    required VoidCallback? onPressed,
    bool isLoading = false,
    String? loadingLabel,
    Widget? icon,
    double? width,
    double height = 48,
    double borderRadius = 16,
    EdgeInsetsGeometry padding = const EdgeInsets.symmetric(horizontal: 20),
  }) {
    return LoadingButton(
      key: key,
      label: label,
      onPressed: onPressed,
      isLoading: isLoading,
      loadingLabel: loadingLabel,
      icon: icon,
      width: width,
      height: height,
      backgroundColor: AppTheme.gold,
      foregroundColor: AppTheme.navy,
      borderRadius: borderRadius,
      padding: padding,
    );
  }

  /// Solid Navy Variant
  factory LoadingButton.navy({
    Key? key,
    required String label,
    required VoidCallback? onPressed,
    bool isLoading = false,
    String? loadingLabel,
    Widget? icon,
    double? width,
    double height = 48,
    double borderRadius = 16,
    EdgeInsetsGeometry padding = const EdgeInsets.symmetric(horizontal: 20),
  }) {
    return LoadingButton(
      key: key,
      label: label,
      onPressed: onPressed,
      isLoading: isLoading,
      loadingLabel: loadingLabel,
      icon: icon,
      width: width,
      height: height,
      backgroundColor: AppTheme.navy,
      foregroundColor: Colors.white,
      borderRadius: borderRadius,
      padding: padding,
    );
  }

  /// Outlined Variant
  factory LoadingButton.outlined({
    Key? key,
    required String label,
    required VoidCallback? onPressed,
    bool isLoading = false,
    String? loadingLabel,
    Widget? icon,
    double? width,
    double height = 48,
    Color? borderColor,
    Color? textColor,
    double borderRadius = 16,
    EdgeInsetsGeometry padding = const EdgeInsets.symmetric(horizontal: 20),
  }) {
    return LoadingButton(
      key: key,
      label: label,
      onPressed: onPressed,
      isLoading: isLoading,
      loadingLabel: loadingLabel,
      icon: icon,
      width: width,
      height: height,
      isOutlined: true,
      borderColor: borderColor ?? AppTheme.borderLight,
      foregroundColor: textColor ?? AppTheme.navy,
      borderRadius: borderRadius,
      padding: padding,
    );
  }

  @override
  Widget build(BuildContext context) {
    final effectiveBg = backgroundColor ?? AppTheme.gold;
    final effectiveFg = foregroundColor ?? (isOutlined ? AppTheme.navy : AppTheme.navy);
    final isClickable = !isLoading && onPressed != null;

    final childContent = Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading) ...[
          AppLoadingIndicator(
            size: 18,
            strokeWidth: 2.2,
            color: effectiveFg,
          ),
          if (loadingLabel != null) ...[
            const SizedBox(width: 8),
            Flexible(
              child: Text(
                loadingLabel!.toUpperCase(),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.5,
                  color: effectiveFg,
                ),
              ),
            ),
          ],
        ] else ...[
          if (icon != null) ...[
            icon!,
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Text(
              label.toUpperCase(),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
                color: effectiveFg,
              ),
            ),
          ),
        ],
      ],
    );

    if (isOutlined) {
      return SizedBox(
        width: width,
        height: height,
        child: OutlinedButton(
          onPressed: isClickable ? onPressed : null,
          style: OutlinedButton.styleFrom(
            foregroundColor: effectiveFg,
            disabledForegroundColor: effectiveFg.withValues(alpha: 0.5),
            side: BorderSide(
              color: borderColor ?? AppTheme.borderLight,
              width: 1.2,
            ),
            padding: padding,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(borderRadius),
            ),
          ),
          child: childContent,
        ),
      );
    }

    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: isClickable && effectiveBg == AppTheme.gold
            ? AppTheme.goldGlow
            : null,
      ),
      child: ElevatedButton(
        onPressed: isClickable ? onPressed : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: effectiveBg,
          foregroundColor: effectiveFg,
          disabledBackgroundColor: effectiveBg.withValues(alpha: 0.65),
          disabledForegroundColor: effectiveFg.withValues(alpha: 0.65),
          elevation: 0,
          padding: padding,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(borderRadius),
          ),
        ),
        child: childContent,
      ),
    );
  }
}

/// 3. FullScreenLoader: Full Page Loading Screen
class FullScreenLoader extends StatelessWidget {
  final String? title;
  final String? subtitle;
  final Color? backgroundColor;

  const FullScreenLoader({
    super.key,
    this.title,
    this.subtitle,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor ?? AppTheme.background,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Branded Crest / Spinner
              Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppTheme.surface,
                      border: Border.all(
                        color: AppTheme.gold.withValues(alpha: 0.35),
                        width: 1.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.gold.withValues(alpha: 0.15),
                          blurRadius: 18,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(14),
                    child: Image.asset(
                      'assets/images/logo_edug.png',
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) => const Icon(
                        Icons.school_rounded,
                        color: AppTheme.gold,
                        size: 30,
                      ),
                    ),
                  ),
                  const SizedBox(
                    width: 84,
                    height: 84,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.2,
                      valueColor: AlwaysStoppedAnimation<Color>(AppTheme.gold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Text(
                title ?? 'EDULEADER GLOBAL',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2.0,
                  color: AppTheme.navy,
                ),
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 6),
                Text(
                  subtitle!,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// 4. InlineLoader: Compact In-Section Spinner
class InlineLoader extends StatelessWidget {
  final String? message;
  final double height;
  final Color? color;
  final EdgeInsetsGeometry padding;

  const InlineLoader({
    super.key,
    this.message,
    this.height = 140,
    this.color,
    this.padding = const EdgeInsets.all(16),
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height,
      child: Center(
        child: Padding(
          padding: padding,
          child: AppLoadingIndicator(
            size: 26,
            color: color ?? AppTheme.gold,
            message: message,
          ),
        ),
      ),
    );
  }
}

/// 5. LoadingOverlay: Modal Blocking Overlay with Activity Card
class LoadingOverlay extends StatelessWidget {
  final bool isLoading;
  final Widget child;
  final String? message;

  const LoadingOverlay({
    super.key,
    required this.isLoading,
    required this.child,
    this.message,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Positioned.fill(
            child: AbsorbPointer(
              absorbing: true,
              child: Container(
                color: Colors.black.withValues(alpha: 0.35),
                alignment: Alignment.center,
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 40),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                  decoration: BoxDecoration(
                    color: AppTheme.surface,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppTheme.gold.withValues(alpha: 0.35),
                      width: 1.2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.2),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const AppLoadingIndicator(
                        size: 22,
                        strokeWidth: 2.4,
                        color: AppTheme.gold,
                      ),
                      const SizedBox(width: 16),
                      Flexible(
                        child: Text(
                          message ?? 'Please wait...',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.navy,
                            letterSpacing: 0.3,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
