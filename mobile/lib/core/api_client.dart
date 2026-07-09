import 'package:dio/dio.dart';
import 'package:dio/io.dart';
import 'package:flutter/foundation.dart';
import 'dart:io';
import 'dart:async';
import 'dart:convert';
import 'storage.dart';

/// Converts any Dio / network exception into a readable message string.
String extractErrorMessage(Object e) {
  if (e is DioException) {
    final response = e.response;
    var data = response?.data;
    final requestPath = '${e.requestOptions.baseUrl}${e.requestOptions.path}';

    // If the error response is a String (e.g. from reverse proxy or undecoded body), try to parse as JSON
    if (data is String) {
      try {
        data = jsonDecode(data);
      } catch (_) {}
    }

    // Log Dio Exception Details
    debugPrint("========== DIO EXCEPTION ==========");
    debugPrint("Request URL: $requestPath");
    debugPrint("Type: ${e.type}");
    debugPrint("Message: ${e.message}");
    debugPrint("Error: ${e.error}");
    if (response != null) {
      debugPrint("Status Code: ${response.statusCode}");
      debugPrint("Response Data: $data");
    }

    if (e.type == DioExceptionType.badResponse) {
      if (data is Map) {
        final serverError = data['error'] ?? data['message'] ?? data['msg'] ?? data['errorMessage'];
        if (serverError != null) return serverError.toString();
        return 'Bad response from server (${response?.statusCode})';
      }
      return 'Bad response from server (${response?.statusCode}): ${data?.toString() ?? e.message}';
    }

    final isLocal = e.requestOptions.uri.host.contains('127.0.0.1') ||
                    e.requestOptions.uri.host.contains('localhost') ||
                    e.requestOptions.uri.host.startsWith('172.') ||
                    e.requestOptions.uri.host.startsWith('192.168.');

    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.sendTimeout) {
      var msg = 'TimeoutException: Connection timed out (${e.type}) when calling $requestPath. Details: ${e.message}';
      if (isLocal) {
        msg += '\n\n💡 Dev Tip: Local server is unreachable. Ensure the Node.js backend is running. Note: iOS Personal Hotspot can block routing to tethered clients — try connecting to a shared Wi-Fi network, or use a tunnel (e.g. localhost.run or ngrok).';
      }
      return msg;
    }

    if (e.type == DioExceptionType.connectionError) {
      final innerError = e.error;
      var msg = '';
      if (innerError is SocketException) {
        msg = 'SocketException: Cannot reach server at $requestPath (OS Error: ${innerError.message})';
      } else {
        msg = 'ConnectionException: Cannot reach server at $requestPath. Please check your network connection.';
      }
      if (isLocal) {
        msg += '\n\n💡 Dev Tip: Local server unreachable. Ensure Express is listening on 0.0.0.0, your firewall is off, or use a tunnel.';
      }
      return msg;
    }

    final innerError = e.error;
    if (innerError != null) {
      if (innerError is SocketException) {
        return 'SocketException: ${innerError.message} (OS Error: ${innerError.osError})';
      }
      if (innerError is HandshakeException) {
        return 'HandshakeException: SSL Handshake failed for $requestPath. Details: ${innerError.message}';
      }
      return 'DioError (Inner: ${innerError.runtimeType}): $innerError';
    }

    return 'DioError (${e.type}): ${e.message ?? 'Unknown error'}';
  } else if (e is SocketException) {
    debugPrint("========== SOCKET EXCEPTION ==========");
    debugPrint(e.toString());
    return 'SocketException: ${e.message} (Address: ${e.address}, Port: ${e.port})';
  } else if (e is TimeoutException) {
    debugPrint("========== TIMEOUT EXCEPTION ==========");
    debugPrint(e.toString());
    return 'TimeoutException: ${e.message ?? 'The operation timed out'}';
  } else if (e is HandshakeException) {
    debugPrint("========== HANDSHAKE EXCEPTION ==========");
    debugPrint(e.toString());
    return 'HandshakeException: SSL Handshake failed. Details: ${e.message}';
  } else if (e is FormatException) {
    debugPrint("========== FORMAT EXCEPTION ==========");
    debugPrint(e.toString());
    return 'FormatException: Invalid response format. Details: ${e.message}';
  }

  debugPrint("========== UNKNOWN EXCEPTION ==========");
  debugPrint(e.toString());
  return 'Unknown Error (${e.runtimeType}): $e';
}

class ApiClient {
  // ── PRODUCTION SERVER ──
  static const String baseUrl = 'https://api.eduleaderglobal.com';

  // ── LOCAL NODE.JS DEVELOPMENT BACKEND (PORT 5011) ──
  // Toggle the active environment below by commenting/uncommenting:
  
  // 1. iOS Simulator / Web / Local Desktop
  // static const String baseUrl = 'http://localhost:5011';
  // static const String baseUrl = 'http://127.0.0.1:5011';
  
  // 2. Android Emulator (translates to localhost of your development machine)
  // static const String baseUrl = 'http://10.0.2.2:5011';
  
  // 3. Physical Device (using host machine's Wi-Fi IP 192.168.1.10)
  // static const String baseUrl = 'http://192.168.1.10:5011';

  static Dio? _dio;

  /// Callback fired by the 401 interceptor when a non-auth endpoint
  /// returns 401 — wired to AuthProvider.forceLogout() after init().
  static Future<void> Function()? onAuthError;

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

    // Custom adapter to capture and log bad certificate events
    dio.httpClientAdapter = IOHttpClientAdapter(
      createHttpClient: () {
        final client = HttpClient();
        client.badCertificateCallback = (X509Certificate cert, String host, int port) {
          debugPrint("========== SSL CERTIFICATE WARNING ==========");
          debugPrint("SSL verification failed for host: $host:$port");
          debugPrint("Certificate Subject: ${cert.subject}");
          debugPrint("Certificate Issuer: ${cert.issuer}");
          debugPrint("Certificate Start Date: ${cert.startValidity}");
          debugPrint("Certificate End Date: ${cert.endValidity}");
          
          final isLocal = host.contains('127.0.0.1') ||
                          host.contains('localhost') ||
                          host.startsWith('172.') ||
                          host.startsWith('192.168.');
          if (isLocal) {
            debugPrint("✅ Local development: Trusting self-signed certificate for host $host");
            return true;
          }
          // Return false to reject untrusted certificates (secure production default).
          return false;
        };
        return client;
      },
    );

    // ── JWT Interceptor ──────────────────────────────────────────────
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final fullUrl = '${options.baseUrl}${options.path}';
          debugPrint('🚀 Requesting: ${options.method} $fullUrl');
          if (options.data != null) {
            debugPrint('📦 Payload: ${options.data}');
          }
          final token = await AppStorage.getToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onResponse: (response, handler) => handler.next(response),
        onError: (DioException err, handler) {
          // ── Auto-logout on 401 from non-auth endpoints ────────
          if (err.response?.statusCode == 401) {
            final path = err.requestOptions.path;
            // Don't auto-logout on auth endpoints (login returns 401
            // for wrong password — that's not a stale session).
            if (!path.startsWith('/api/auth/')) {
              onAuthError?.call();
            }
          }
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
