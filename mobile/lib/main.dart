import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/payment_service.dart';
import 'core/router.dart';
import 'core/theme.dart';
import 'features/auth/auth_provider.dart';
import 'features/cart/cart_provider.dart';
import 'features/membership/membership_manager.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final authProvider = AuthProvider();
  await authProvider.init();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: authProvider),
        ChangeNotifierProxyProvider<AuthProvider, MembershipManager>(
          create: (_) {
            final m = MembershipManager();
            // Bind once so purchase / restore always refreshes entitlements.
            PaymentService.instance.onMembershipRefresh =
                () => m.refresh(showLoading: false);
            return m;
          },
          update: (_, auth, manager) {
            final m = manager ?? MembershipManager();
            // Keep binding if provider recreated the manager.
            PaymentService.instance.onMembershipRefresh =
                () => m.refresh(showLoading: false);
            // Only students have memberships — consultants, admins, and
            // parents must never call membership endpoints.
            final role = auth.role ?? 'student';
            final isStudent = role == 'student';
            debugPrint('[MembershipManager] update called. isLoggedIn: ${auth.isLoggedIn}, isStudent: $isStudent, role: $role, userMembership: ${m.userMembership}, isLoading: ${m.isLoading}, activePlans.isEmpty: ${m.activePlans.isEmpty}');
            if (auth.isLoggedIn && isStudent && m.userMembership == null && !m.isLoading && m.activePlans.isEmpty) {
              debugPrint('[MembershipManager] calling refresh()');
              Future.microtask(() => m.refresh());
            } else if (!auth.isLoggedIn || !isStudent) {
              if (m.userMembership != null || m.accessSummary != null) {
                Future.microtask(() => m.clear());
              }
            }
            return m;
          },
        ),
        ChangeNotifierProvider(create: (_) {
          final cart = CartProvider();
          if (authProvider.isLoggedIn) cart.fetchCart();
          return cart;
        }),
      ],
      child: const StudyAbroadApp(),
    ),
  );
}

class StudyAbroadApp extends StatelessWidget {
  const StudyAbroadApp({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final router = AppRouter.create(auth);

    return MaterialApp.router(
      title: 'EduLeaderGlobal',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      routerConfig: router,
    );
  }
}
