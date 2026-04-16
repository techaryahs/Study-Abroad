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
import '../features/services/service_detail_screen.dart';
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
import '../features/university/university_detail_screen.dart';
import '../features/consultant/consultant_dashboard_screen.dart';
import '../features/admin/admin_dashboard_screen.dart';
import '../features/meeting/meeting_screen.dart';
import '../widgets/app_scaffold.dart';

class AppRouter {
  static GoRouter create(AuthProvider auth) {
    return GoRouter(
      initialLocation: '/',
      refreshListenable: auth,
      redirect: (context, state) {
        final isLoggedIn = auth.isLoggedIn;
        final isAuthRoute = state.uri.path == '/login' || state.uri.path == '/register';

        if (!isLoggedIn && !isAuthRoute) return '/login';

        // ✅ Logged in → block auth pages
        if (isLoggedIn && isAuthRoute) {
          return _homeForRole(role);
        }

        // 🔥 keep the home route for logged-in users
        if (isLoggedIn && state.uri.path == '/') {
          return null;
        }

        return null;
      },
      routes: [
        // ── AUTH ──────────────────────────────────────────────
        GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
        GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),

        // ── MEETINGS ──────────────────────────────────────────
        GoRoute(
          path: '/meeting/:id',
          builder: (context, state) => MeetingScreen(
            sessionId: state.pathParameters['id'] ?? '',
            sessionData: state.extra is Map ? Map<String, dynamic>.from(state.extra as Map) : null,
          ),
        ),

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
            GoRoute(
              path: '/services/:slug',
              builder: (context, state) => ServiceDetailScreen(
                slug: state.pathParameters['slug'] ?? '',
              ),
            ),
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
            GoRoute(
              path: '/university/:slug',
              builder: (_, state) => UniversityDetailScreen(
                slug: state.pathParameters['slug'] ?? '',
              ),
            ),
            GoRoute(path: '/resources', builder: (_, __) => const ResourcesScreen()),
            GoRoute(
              path: '/dashboard/edit',
              builder: (context, state) => EditProfileScreen(
                userData: Map<String, dynamic>.from(state.extra as Map),
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
';
      case 'consultant':
        return '/consultant-dashboard';
      case 'parent':
        return '/parent-dashboard'; // only if exists
      default:
        return '/dashboard'; // ✅ FIXED (not '/')
    }
  }
}