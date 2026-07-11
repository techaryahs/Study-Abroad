import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:study_abroad/features/auth/auth_provider.dart';
import 'package:study_abroad/features/cart/cart_provider.dart';
import 'package:study_abroad/features/membership/membership_manager.dart';
import 'package:study_abroad/main.dart';

void main() {
  testWidgets('app shell renders with required providers', (tester) async {
    final authProvider = AuthProvider();

    tester.view.physicalSize = const Size(1080, 1920);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider<AuthProvider>.value(value: authProvider),
          ChangeNotifierProxyProvider<AuthProvider, MembershipManager>(
            create: (_) => MembershipManager(),
            update: (_, auth, manager) {
              final m = manager ?? MembershipManager();
              if (auth.isLoggedIn && m.userMembership == null && !m.isLoading) {
                Future.microtask(() => m.refresh());
              } else if (!auth.isLoggedIn && m.userMembership != null) {
                Future.microtask(() => m.clear());
              }
              return m;
            },
          ),
          ChangeNotifierProvider<CartProvider>(
            create: (_) {
              final cart = CartProvider();
              if (authProvider.isLoggedIn) cart.fetchCart();
              return cart;
            },
          ),
        ],
        child: const StudyAbroadApp(),
      ),
    );

    await tester.pump();

    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
