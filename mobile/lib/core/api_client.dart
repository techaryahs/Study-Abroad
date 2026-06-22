import 'package:dio/dio.dart';
import 'storage.dart';

/// Converts any Dio / network exception into a readable message string.
String extractErrorMessage(Object e) {
  if (e is DioException) {
    // Server returned a JSON body with an `error` or `message` field
    final data = e.response?.data;
    if (data is Map) {
      return (data['error'] ?? data['message'] ?? 'Server error').toString();
    }
    // Network-level errors
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.sendTimeout:
        return 'Connection timed out. Check your internet connection.';
      case DioExceptionType.connectionError:
        return 'Cannot reach server. Please check your internet connection.';
      default:
        return e.message ?? 'Network error. Please try again.';
    }
  }
  return e.toString();
}

class ApiClient {
  // ── PRODUCTION SERVER ──
  static const String baseUrl = 'https://api.studyabarod.aryahsworld.com';

  // ── LOCAL NODE.JS DEVELOPMENT BACKEND (PORT 5011) ──
  // Toggle the active environment below by commenting/uncommenting:
  
  // 1. iOS Simulator / Web / Local Desktop
  // static const String baseUrl = 'http://localhost:5011';
  // static const String baseUrl = 'http://127.0.0.1:5011';
  
  // 2. Android Emulator (translates to localhost of your development machine)
  // static const String baseUrl = 'http://10.0.2.2:5011';
  
  // 3. Physical Device (NOTE: Replace "192.168.1.35" with your actual local machine's IP address if different)
  // static const String baseUrl = 'http://192.168.1.35:5011';

  static Dio? _dio;

  static Dio get instance {
    _dio ??= _createDio();
    return _dio!;
  }

  static Dio _createDio() {
    final dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // ── JWT Interceptor ──────────────────────────────────────────────
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await AppStorage.getToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onResponse: (response, handler) => handler.next(response),
        onError: (DioException err, handler) {
          // Let error propagate — caller uses extractErrorMessage()
          return handler.next(err);
        },
      ),
    );

    return dio;
  }

  static void reset() {
    _dio = null;
  }
}
