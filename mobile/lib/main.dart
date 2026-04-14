import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/router.dart';
import 'core/theme.dart';
import 'features/auth/auth_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final authProvider = AuthProvider();
  await authProvider.init();
  runApp(
    ChangeNotifierProvider.value(
      value: authProvider,
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
      title: 'Study Abroad',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      routerConfig: router,
    );
  }
}
