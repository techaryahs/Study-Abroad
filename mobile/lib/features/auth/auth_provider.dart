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

  Future<void> init() async {
    _token = await AppStorage.getToken();
    _user = await AppStorage.getUser();
    _isLoggedIn = _token != null && _user != null;
    notifyListeners();
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await ApiClient.instance.post(
      '/api/auth/login',
      data: {'email': email.trim(), 'password': password.trim()},
    );
    final data = response.data as Map<String, dynamic>;
    final token = data['token'] as String;
    final user = data['user'] as Map<String, dynamic>;

    await AppStorage.setToken(token);
    await AppStorage.setUser(user);

    _token = token;
    _user = user;
    _isLoggedIn = true;
    notifyListeners();

    return user;
  }

  Future<void> register(Map<String, dynamic> formData) async {
    await ApiClient.instance.post('/api/auth/register', data: formData);
  }

  Future<void> logout() async {
    await AppStorage.clearAll();
    ApiClient.reset();
    _token = null;
    _user = null;
    _isLoggedIn = false;
    notifyListeners();
  }
}
