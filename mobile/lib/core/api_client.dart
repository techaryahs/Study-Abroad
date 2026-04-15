import 'package:dio/dio.dart';
import 'storage.dart';

/// Converts any Dio / network exception into a readable message string.
String extractErrorMessage(Object e) {
  if (e is DioException) {
    final data = e.response?.data;

    if (data is Map) {
      return (data['error'] ?? data['message'] ?? 'Server error').toString();
    }

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
  static const String baseUrl =
      'https://study-abroad-backend-pfjq.onrender.com';

  static const String frontendUrl =
      'https://study-abroad-frontend-rho.vercel.app';

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

    // ✅ JWT Interceptor (AUTO TOKEN ATTACH)
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
        onError: (DioException err, handler) => handler.next(err),
      ),
    );

    return dio;
  }

  /// ✅ FORCE REFRESH AFTER LOGIN (IMPORTANT)
  static void refresh() {
    _dio = null;
  }

  static void reset() {
    _dio = null;
  }
}