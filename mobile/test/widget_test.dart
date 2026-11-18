import 'package:flutter_test/flutter_test.dart';
import 'package:study_abroad/core/api_client.dart';
import 'package:study_abroad/core/app_features.dart';

void main() {
  group('ApiClient & Network Tests', () {
    test('Base URL defaults to production domain', () {
      expect(ApiClient.baseUrl, contains('api.eduleaderglobal.com'));
    });

    test('extractErrorMessage handles general exception', () {
      final msg = extractErrorMessage(Exception('Test connection failure'));
      expect(msg, contains('Test connection failure'));
    });
  });

  group('Feature Entitlements Tests', () {
    test('MembershipFeatures contains all essential slugs', () {
      expect(MembershipFeatures.aiSop, equals('ai_sop'));
      expect(MembershipFeatures.aiHumanizer, equals('ai_humanizer'));
      expect(MembershipFeatures.mockInterview, equals('mock_interview'));
      expect(MembershipFeatures.researchGroups, equals('research_groups'));
      expect(MembershipFeatures.eb1, equals('eb1'));
      expect(MembershipFeatures.visaGuidance, equals('visa_guidance'));
      expect(MembershipFeatures.scholarshipSearch, equals('scholarship_search'));
    });
  });
}
