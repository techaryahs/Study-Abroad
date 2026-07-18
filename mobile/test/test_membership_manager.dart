import 'package:flutter_test/flutter_test.dart';
import 'package:study_abroad/features/membership/membership_manager.dart';
import 'package:study_abroad/core/api_client.dart';
import 'package:dio/dio.dart';

void main() {
  test('MembershipManager refresh does not throw', () async {
    final m = MembershipManager();
    await m.refresh(showLoading: false);
    print("activePlans: ${m.activePlans.length}");
    print("error: ${m.error}");
  });
}
