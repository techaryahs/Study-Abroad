import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/auth_provider.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/register_screen.dart';
import '../features/home/home_screen.dart';
import '../features/dashboard/dashboard_screen.dart';
import '../features/cart/cart_screen.dart';
import '../features/countries/countries_screen.dart';
import '../features/universities/university_list_screen.dart';
import '../features/services/services_screen.dart';
import '../features/blogs/blogs_screen.dart';
import '../features/about/about_screen.dart';
import '../features/dashboard/edit_profile_screen.dart';
import '../features/contact/contact_screen.dart';
import '../features/success_stories/success_stories_screen.dart';
import '../features/ai_services/ai_services_screen.dart';
import '../features/ai_services/screens/sop_generator_screen.dart';
import '../features/ai_services/screens/mock_interview_screen.dart';
import '../features/ai_services/screens/plagiarism_remover_screen.dart';
import '../features/resources/resources_screen.dart';
import '../features/consultant/consultant_dashboard_screen.dart';
import '../features/admin/admin_dashboard_screen.dart';
import '../widgets/app_scaffold.dart';

class AppRouter {
  static GoRouter create(AuthProvider auth) {
    return GoRouter(
      initialLocation: '/',
      refreshListenable: auth,
      redirect: (context, state) async {
        final isLoggedIn = auth.isLoggedIn;
        final isAuthRoute = state.uri.path == '/login' || state.uri.path == '/register';

        if (!isLoggedIn && !isAuthRoute) return '/login';
        if (isLoggedIn && isAuthRoute) return _homeForRole(auth.role);
        return null;
      },
      routes: [
        // ── AUTH ──────────────────────────────────────────────
        GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
        GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),

        // ── SHELL (bottom nav) ────────────────────────────────
        ShellRoute(
          builder: (context, state, child) => AppScaffold(child: child),
          routes: [
            GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
            GoRoute(path: '/countries', builder: (_, __) => const CountriesScreen()),
            GoRoute(
              path: '/universities/:country',
              builder: (_, state) => UniversityListScreen(
                country: state.pathParameters['country'] ?? 'USA',
              ),
            ),
            GoRoute(path: '/services', builder: (_, __) => const ServicesScreen()),
            GoRoute(path: '/dashboard', builder: (_, __) => const DashboardScreen()),
            GoRoute(path: '/cart', builder: (_, __) => const CartScreen()),
            GoRoute(path: '/blogs', builder: (_, __) => const BlogsScreen()),
            GoRoute(path: '/about', builder: (_, __) => const AboutScreen()),
            GoRoute(path: '/contact', builder: (_, __) => const ContactScreen()),
            GoRoute(path: '/success-stories', builder: (_, __) => const SuccessStoriesScreen()),
            
            // AI SERVICES
            GoRoute(path: '/ai-services', builder: (_, __) => const AiServicesScreen()),
            GoRoute(path: '/ai-services/sop-generator', builder: (_, __) => const SopGeneratorScreen()),
            GoRoute(path: '/ai-services/mock-interview', builder: (_, __) => const MockInterviewScreen()),
            GoRoute(path: '/ai-services/plagiarism-remover', builder: (_, __) => const PlagiarismRemoverScreen()),
            
            GoRoute(path: '/resources', builder: (_, __) => const ResourcesScreen()),
            GoRoute(
              path: '/dashboard/edit',
              builder: (context, state) => EditProfileScreen(
                userData: state.extra as Map<String, dynamic>,
              ),
            ),
            GoRoute(
              path: '/consultant-dashboard',
              builder: (_, __) => const ConsultantDashboardScreen(),
            ),
            GoRoute(
              path: '/admin-dashboard',
              builder: (_, __) => const AdminDashboardScreen(),
            ),
          ],
        ),
      ],
    );
  }

  static String _homeForRole(String? role) {
    switch (role) {
      case 'admin':
        return '/admin-dashboard';
      case 'consultant':
        return '/consultant-dashboard';
      default:
        return '/';
    }
  }
}
