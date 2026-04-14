import 'dart:io';
import 'package:dio/dio.dart';
import 'storage.dart';

class ApiClient {
  static const String _localBaseUrl = 'http://10.0.2.2:5001'; // Android emulator
  static const String _localIosUrl = 'http://localhost:5001';  // iOS simulator

  static String get baseUrl {
    if (Platform.isAndroid) return _localBaseUrl;
    return _localIosUrl;
  }

  static Dio? _instance;

  static Dio get instance {
    _instance ??= _createDio();
    return _instance!;
  }

  static Dio _createDio() {
    final dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ));

    // JWT Interceptor
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await AppStorage.getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        return handler.next(error);
      },
    ));

    return dio;
  }

  static void reset() {
    _instance = null;
  }
}
