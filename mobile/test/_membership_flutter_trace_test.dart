import 'dart:io';

import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:study_abroad/core/api_client.dart';
import 'package:study_abroad/features/membership/membership_manager.dart';

class _DirectHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) =>
      super.createHttpClient(context);

  @override
  String findProxyFromEnvironment(Uri url, Map<String, String>? environment) =>
      'DIRECT';
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  const secureStorage =
      MethodChannel('plugins.it_nomads.com/flutter_secure_storage');

  setUp(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(secureStorage, (call) async => null);
    ApiClient.reset();
  });

  tearDown(() {
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(secureStorage, null);
  });

  test('traces live Flutter membership catalog transformation', () async {
    final manager = MembershipManager();
    var notificationCount = 0;
    manager.addListener(() {
      notificationCount += 1;
      // ignore: avoid_print
      print(
        '[MembershipTraceTest] notification=$notificationCount '
        'activePlans=${manager.activePlans.length} '
        'isLoading=${manager.isLoading} error=${manager.error}',
      );
    });

    await HttpOverrides.runWithHttpOverrides(
      () => manager.refresh(),
      _DirectHttpOverrides(),
    );

    // ignore: avoid_print
    print(
      '[MembershipTraceTest] FINAL '
      'activePlans=${manager.activePlans.length} '
      'plans=${manager.activePlans.map((plan) => plan.planId).toList()} '
      'notifications=$notificationCount error=${manager.error}',
    );

    expect(manager.activePlans.length, 4);
  });
}
