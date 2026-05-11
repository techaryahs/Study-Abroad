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
  /// Live Render backend
  // static const String baseUrl = 'https://study-abroad-backend-pfjq.onrender.com';
  
  /// Local Backend (Uncomment for local testing)
  // static const String baseUrl = 'http://10.0.2.2:5001'; // For Android Emulator
  // static const String baseUrl = 'http://localhost:5001'; // For iOS/Web
  static const String baseUrl = 'http://192.168.1.12:5001'; // For Physical Device

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
