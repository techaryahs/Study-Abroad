import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'core/payment_service.dart';
import 'core/router.dart';
import 'core/app_logger.dart';
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
            AppLogger.debug('MembershipManager update: loggedIn=${auth.isLoggedIn}, isStudent=$isStudent');
            if (auth.isLoggedIn && isStudent && m.userMembership == null && !m.isLoading && m.activePlans.isEmpty) {
              AppLogger.debug('Triggering initial membership refresh');
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
      // Pass the same AuthProvider instance so GoRouter is created once and
      // only re-evaluates redirects via refreshListenable — never recreated.
      child: StudyAbroadApp(authProvider: authProvider),
    ),
  );
}

/// Root app. Holds a single [GoRouter] for the process lifetime.
///
/// Creating a new GoRouter on every [AuthProvider] notify (previous behaviour)
/// disposed the entire navigator stack mid-frame. That caused:
/// - "You have popped the last page off of the stack"
/// - NavigatorState.dispose !_debugLocked
/// - in-flight HTTP looking like "Connection closed before full header was received"
/// after logout tore down the tree during delete-account.
class StudyAbroadApp extends StatefulWidget {
  final AuthProvider authProvider;

  const StudyAbroadApp({super.key, required this.authProvider});

  @override
  State<StudyAbroadApp> createState() => _StudyAbroadAppState();
}

class _StudyAbroadAppState extends State<StudyAbroadApp> {
  late final GoRouter _router;

  @override
  void initState() {
    super.initState();
    _router = AppRouter.create(widget.authProvider);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'EduLeaderGlobal',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      routerConfig: _router,
    );
  }
}
