import 'package:flutter/material.dart';
import '../../core/storage.dart';
import '../../core/api_client.dart';

class AuthProvider extends ChangeNotifier {
  bool _isLoggedIn = false;
  Map<String, dynamic>? _user;
  String? _token;

  bool get isLoggedIn => _isLoggedIn;
  Map<String, dynamic>? get user => _user;
  String? get token => _token;
  String? get role => _user?['role'] as String?;
  String? get userId => _user?['_id'] as String? ?? _user?['id'] as String?;

  /// 🔹 INIT
  Future<void> init() async {
    _token = await AppStorage.getToken();
    _user  = await AppStorage.getUser();

    _isLoggedIn = _token != null && _user != null;

    notifyListeners();
  }

  /// 🔹 LOGIN (MATCHES WEBSITE)
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await ApiClient.instance.post(
      '/api/auth/login',
      data: {
        'email': email.toLowerCase().trim(),
        'password': password.trim(),
      },
    );

    final data = response.data as Map<String, dynamic>;

    if (data['token'] == null || data['user'] == null) {
      throw Exception('Invalid server response');
    }

    final token = data['token'] as String;
    final user  = data['user'] as Map<String, dynamic>;

    // ✅ SAVE
    await AppStorage.setToken(token);
    await AppStorage.setUser(user);

    _token = token;
    _user = user;
    _isLoggedIn = true;

    // 🔥 IMPORTANT FIX
    ApiClient.refresh(); // <-- reload Dio so interceptor picks new token

    notifyListeners();

    return data;
  }

  /// 🔹 LOGOUT
  Future<void> logout() async {
    await AppStorage.clearAll();

    ApiClient.reset();

    _token = null;
    _user = null;
    _isLoggedIn = false;

    notifyListeners();
  }

  // ─────────────────────────────────────────────
  // OTP + REGISTER
  // ─────────────────────────────────────────────

  Future<void> sendEmailOtp(String email) async {
    await ApiClient.instance.post(
      '/api/auth/send-otp-signup',
      data: {'email': email.toLowerCase().trim()},
    );
  }

  Future<void> verifyEmailOtp(String email, String otp) async {
    await ApiClient.instance.post(
      '/api/auth/verify-otp-signup',
      data: {'email': email.toLowerCase().trim(), 'otp': otp.trim()},
    );
  }

  Future<void> sendMobileOtp(String mobile) async {
    await ApiClient.instance.post(
      '/api/auth/send-otp-mobile',
      data: {'mobile': mobile.trim()},
    );
  }

  Future<void> verifyMobileOtp(String mobile, String otp) async {
    await ApiClient.instance.post(
      '/api/auth/verify-otp-mobile',
      data: {'mobile': mobile.trim(), 'otp': otp.trim()},
    );
  }

  Future<void> register(Map<String, dynamic> formData) async {
    await ApiClient.instance.post('/api/auth/register', data: formData);
  }
}