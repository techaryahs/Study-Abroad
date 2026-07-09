import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
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
