import 'package:flutter/foundation.dart';

enum LogLevel {
  debug,
  info,
  warning,
  error,
  none,
}

/// Reusable logger for production-ready console logging.
/// Log output is controlled by [level].
class AppLogger {
  static LogLevel level = kReleaseMode ? LogLevel.warning : LogLevel.debug;

  static void debug(String message) {
    if (level.index <= LogLevel.debug.index) {
      debugPrint('[DEBUG] $message');
    }
  }

  static void info(String message) {
    if (level.index <= LogLevel.info.index) {
      debugPrint('[INFO] $message');
    }
  }

  static void warning(String message) {
    if (level.index <= LogLevel.warning.index) {
      debugPrint('[WARN] $message');
    }
  }

  static void error(String message, [Object? error, StackTrace? stackTrace]) {
    if (level.index <= LogLevel.error.index) {
      debugPrint('[ERROR] $message${error != null ? ': $error' : ''}');
      if (stackTrace != null) {
        debugPrint(stackTrace.toString());
      }
    }
  }

  /// Utility to mask email address (e.g. sahilnaikwade23@gmail.com -> sa***23@gmail.com)
  static String maskEmail(String? email) {
    if (email == null || email.isEmpty) return '';
    final parts = email.split('@');
    if (parts.length != 2) return '[masked email]';
    final name = parts[0];
    final domain = parts[1];
    if (name.length <= 4) {
      return '${name.substring(0, 1)}***@$domain';
    }
    return '${name.substring(0, 2)}***${name.substring(name.length - 2)}@$domain';
  }

  /// Utility to mask sensitive token
  static String maskToken(String? token) {
    if (token == null || token.isEmpty) return '';
    return 'JWT=[hidden]';
  }

  /// Utility to mask OTP
  static String maskOtp(String? otp) {
    if (otp == null || otp.isEmpty) return '';
    return 'OTP=[hidden]';
  }
}
