import 'package:flutter/foundation.dart';
import '../../../core/api_client.dart';
import 'package:dio/dio.dart';

class ResumeProvider extends ChangeNotifier {
  bool _isLoading = false;
  String? _error;
  String? _resumeMarkdown;

  bool get isLoading => _isLoading;
  String? get error => _error;
  String? get resumeMarkdown => _resumeMarkdown;

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void clearResume() {
    _resumeMarkdown = null;
    _error = null;
    notifyListeners();
  }

  Future<bool> generateResume({
    required String name,
    required String email,
    required String phone,
    required String education,
    required String skills,
    required String experience,
    required String projects,
    required String summary,
  }) async {
    _isLoading = true;
    _error = null;
    _resumeMarkdown = null;
    notifyListeners();

    try {
      final response = await ApiClient.instance.post(
        '/api/careers/generate-resume',
        data: {
          'name': name,
          'email': email,
          'phone': phone,
          'education': education,
          'skills': skills,
          'experience': experience,
          'projects': projects,
          'summary': summary,
        },
      );
      
      _resumeMarkdown = response.data['resume'];
      _isLoading = false;
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _error = extractErrorMessage(e);
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _error = 'An unexpected error occurred: $e';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
