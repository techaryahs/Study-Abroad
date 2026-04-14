import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';

class AppStorage {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  static const _tokenKey = 'sa_jwt_token';
  static const _userKey = 'sa_user_data';

  // ─── TOKEN ───────────────────────────────────────────────
  static Future<void> setToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  static Future<String?> getToken() async {
    return _storage.read(key: _tokenKey);
  }

  static Future<void> removeToken() async {
    await _storage.delete(key: _tokenKey);
  }

  // ─── USER ─────────────────────────────────────────────────
  static Future<void> setUser(Map<String, dynamic> user) async {
    await _storage.write(key: _userKey, value: jsonEncode(user));
  }

  static Future<Map<String, dynamic>?> getUser() async {
    final raw = await _storage.read(key: _userKey);
    if (raw == null) return null;
    try {
      return jsonDecode(raw) as Map<String, dynamic>;
    } catch (_) {
      return null;
    }
  }

  static Future<void> removeUser() async {
    await _storage.delete(key: _userKey);
  }

  // ─── CLEAR ALL ────────────────────────────────────────────
  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
