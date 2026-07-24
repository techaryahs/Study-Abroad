import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../../core/storage.dart';
import '../../core/api_client.dart';
import '../../core/app_logger.dart';

class AuthProvider extends ChangeNotifier {
  bool _isLoggedIn = false;
  Map<String, dynamic>? _user;
  String? _token;

  bool get isLoggedIn => _isLoggedIn;
  Map<String, dynamic>? get user => _user;
  String? get token => _token;
  String? get role => _user?['role'] as String?;
  String? get userId => _user?['_id'] as String? ?? _user?['id'] as String?;

  // ─── INITIALIZATION ─────────────────────────────────────────────

  /// Called on app start — restores session from secure storage
  /// and validates the token against the production server.
  ///
  /// If the token is stale (user deleted, wrong environment, expired),
  /// the session is cleared and the user is sent to the login screen.
  /// If the server is unreachable (offline), the cached session is
  /// kept so the user isn't forced to re-login without internet.
  Future<void> init() async {
    _token = await AppStorage.getToken();
    _user  = await AppStorage.getUser();

    if (_token == null || _user == null) {
      await _clearSession();
      _registerAuthCallback();
      notifyListeners();
      return;
    }

    // Validate the stored token by calling GET /api/auth/me.
    // This catches stale tokens from local dev, deleted accounts, etc.
    try {
      final response = await ApiClient.instance.get('/api/auth/me');
      if (response.statusCode == 200 && response.data?['success'] == true) {
        final serverUser = response.data['user'];
        if (serverUser is Map<String, dynamic>) {
          // Preserve the system role from the original login response.
          // getMe returns raw DB docs — for consultants, doc.role is the
          // job title (e.g. "Career Counselor"), not the system role.
          final preservedRole = _user?['role'];
          _user = Map<String, dynamic>.from(serverUser);
          if (preservedRole != null) {
            _user!['role'] = preservedRole;
          }
          await AppStorage.setUser(_user!);
        }
        _isLoggedIn = true;
        AppLogger.info('Token validated — session restored');
      } else {
        AppLogger.warning('Token validation returned non-success — logging out');
        await _clearSession();
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 401 || e.response?.statusCode == 404) {
        // 401 = expired/invalid token, 404 = user deleted from DB
        AppLogger.warning('Stale token detected (${e.response?.statusCode}) — logging out');
        await _clearSession();
      } else {
        // Network error / server down — keep cached session (offline-friendly)
        AppLogger.warning('Cannot reach server — keeping cached session');
        _isLoggedIn = true;
      }
    } catch (e) {
      AppLogger.warning('Token validation error: $e — keeping cached session');
      _isLoggedIn = true;
    }

    // Register the 401 auto-logout callback AFTER init() completes,
    // so that init()'s own /api/auth/me call doesn't trigger it.
    _registerAuthCallback();
    notifyListeners();
  }

  // ─── SESSION MANAGEMENT ─────────────────────────────────────────

  /// Register the 401 auto-logout callback with ApiClient.
  void _registerAuthCallback() {
    ApiClient.onAuthError = forceLogout;
  }

  /// Silently clears all stored session data (internal helper).
  Future<void> _clearSession() async {
    await AppStorage.clearAll();
    ApiClient.reset();
    _token = null;
    _user = null;
    _isLoggedIn = false;
  }

  /// Force logout — called by the Dio 401 interceptor when a non-auth
  /// endpoint returns 401 (meaning the token is no longer valid).
  Future<void> forceLogout() async {
    if (!_isLoggedIn) return; // Already logged out, avoid redundant work
    AppLogger.warning('Force logout — invalid session detected');
    await _clearSession();
    notifyListeners();
  }

  /// Manual logout — called by the user from the UI.
  Future<void> logout() async {
    AppLogger.info('User logged out');
    await _clearSession();
    notifyListeners();
  }

  // ─── EMAIL + PASSWORD LOGIN ─────────────────────────────────────

  /// Logs in with email/password and returns the user map.
  /// Throws on failure — catch with extractErrorMessage().
  Future<Map<String, dynamic>> login(String email, String password) async {
    final body = {
      'email': email.toLowerCase().trim(),
      'password': password.trim(),
    };

    AppLogger.info('Attempting login...');

    try {
      final response = await ApiClient.instance.post(
        '/api/auth/login',
        data: body,
      );

      AppLogger.info('Login successful');

      final data = response.data as Map<String, dynamic>;
      final token = data['token'] as String;
      final user  = data['user']  as Map<String, dynamic>;

      await AppStorage.setToken(token);
      await AppStorage.setUser(user);

      _token      = token;
      _user       = user;
      _isLoggedIn = true;
      notifyListeners();

      return user;
    } catch (e, stackTrace) {
      AppLogger.error('Login failed', e, stackTrace);
      rethrow;
    }
  }

  // ─── PHONE OTP LOGIN ───────────────────────────────────────────

  /// Sends a login OTP to the given mobile number.
  Future<void> sendLoginOtp(String mobile) async {
    await ApiClient.instance.post('/api/auth/send-login-otp',
        data: {'mobile': mobile.trim()});
  }

  /// Verifies the login OTP and completes authentication.
  /// Returns the user map on success.
  Future<Map<String, dynamic>> loginWithOtp(String mobile, String otp) async {
    final response = await ApiClient.instance.post(
      '/api/auth/verify-login-otp',
      data: {
        'mobile': mobile.trim(),
        'otp': otp.trim(),
      },
    );

    final data = response.data as Map<String, dynamic>;
    final token = data['token'] as String;
    final user  = data['user']  as Map<String, dynamic>;

    await AppStorage.setToken(token);
    await AppStorage.setUser(user);

    _token      = token;
    _user       = user;
    _isLoggedIn = true;
    notifyListeners();

    return user;
  }

  // ─── REGISTRATION ──────────────────────────────────────────────

  /// Sends OTP to email before signup
  Future<void> sendEmailOtp(String email) async {
    await ApiClient.instance.post('/api/auth/send-otp-signup',
        data: {'email': email.toLowerCase().trim()});
  }

  /// Verifies email OTP
  Future<void> verifyEmailOtp(String email, String otp) async {
    await ApiClient.instance.post('/api/auth/verify-otp-signup',
        data: {'email': email.toLowerCase().trim(), 'otp': otp.trim()});
  }

  /// Sends OTP to mobile
  Future<void> sendMobileOtp(String mobile) async {
    await ApiClient.instance.post('/api/auth/send-otp-mobile',
        data: {'mobile': mobile.trim()});
  }

  /// Verifies mobile OTP
  Future<void> verifyMobileOtp(String mobile, String otp) async {
    await ApiClient.instance.post('/api/auth/verify-otp-mobile',
        data: {'mobile': mobile.trim(), 'otp': otp.trim()});
  }

  /// Registers a student (email + mobile must be verified first)
  Future<void> register(Map<String, dynamic> formData) async {
    await ApiClient.instance.post('/api/auth/register', data: formData);
  }

  // ─── ACCOUNT MANAGEMENT ────────────────────────────────────────

  /// Permanently deletes the account on the server, then clears the local
  /// session. Navigation to Login is owned exclusively by GoRouter's
  /// `refreshListenable` redirect when [isLoggedIn] becomes false.
  ///
  /// Callers must NOT pop routes or call context.go/replace after this —
  /// that races the redirect and crashes the navigator.
  Future<void> deleteAccount() async {
    AppLogger.info('Deleting account…');
    // Only clear the session after the server confirms deletion with HTTP 2xx.
    // If the request fails, the user stays logged in and the dialog shows the error.
    await ApiClient.instance.delete('/api/user/delete-account');
    AppLogger.info('Account deleted on server — clearing local session');
    await logout();
  }
}
