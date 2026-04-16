import 'package:go_router/go_router.dart';
import '../features/auth/auth_provider.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/register_screen.dart';
import '../features/home/home_screen.dart';
import '../features/dashboard/dashboard_screen.dart';
import '../features/cart/cart_screen.dart';
import '../features/countries/countries_screen.dart';
import '../features/universities/universities_screen.dart';
import '../features/universities/university_countries_screen.dart';
import '../features/universities/university_list_screen.dart';
import '../features/universities/unipredict_screen.dart';
import '../features/universities/unipredict_calculator_screen.dart';
import '../features/universities/rate_my_chances_screen.dart';
import '../features/universities/popular_programs_screen.dart';
import '../features/universities/high_ranked_cheap_universities_screen.dart';
import '../features/universities/top_universities_by_state_screen.dart';
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
import '../features/resources/eb-1a.dart';
import '../features/resources/education-loan.dart';
import '../features/resources/reviews_screen.dart';
import '../features/resources/scholarships_screen.dart';
import '../features/resources/scholarship_detail_screen.dart';
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
        if (isLoggedIn && (isAuthRoute || (state.uri.path == '/' && auth.role != 'student'))) {
          return _homeForRole(auth.role);
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

        // ── DASHBOARDS (No bottom nav) ─────────────────────────
        GoRoute(path: '/admin-dashboard', builder: (_, __) => const AdminDashboardScreen()),
        GoRoute(path: '/consultant-dashboard', builder: (_, __) => const ConsultantDashboardScreen()),

        // ── SHELL (bottom nav) ────────────────────────────────
        ShellRoute(
          builder: (context, state, child) => AppScaffold(child: child),
          routes: [
            GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
            GoRoute(path: '/countries', builder: (_, __) => const CountriesScreen()),
            GoRoute(path: '/universities', builder: (_, __) => const UniversitiesScreen()),
            GoRoute(path: '/universities/countries', builder: (_, __) => const UniversityCountriesScreen()),
            GoRoute(path: '/universities/unipredict', builder: (_, __) => const UniPredictScreen()),
            GoRoute(path: '/universities/unipredict/calculator', builder: (_, __) => const UniPredictCalculatorScreen()),
            GoRoute(path: '/universities/rate-my-chances', builder: (_, __) => const RateMyChancesScreen()),
            GoRoute(path: '/universities/popular-programs', builder: (_, __) => const PopularProgramsScreen()),
            GoRoute(path: '/universities/high-ranked-cheap', builder: (_, __) => const HighRankedCheapUniversitiesScreen()),
            GoRoute(path: '/universities/by-state', builder: (_, __) => const TopUniversitiesByStateScreen()),
            GoRoute(
              path: '/universities/:country',
              builder: (_, state) {
                final country = state.pathParameters['country'] ?? 'USA';
                final stateName = state.uri.queryParameters['state'];
                return UniversityListScreen(country: country, state: stateName);
              },
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
            GoRoute(path: '/resources/eb1a', builder: (_, __) => const EB1AToolkitPage()),
            GoRoute(path: '/resources/education-loan', builder: (_, __) => const EducationLoanPage()),
            GoRoute(path: '/resources/reviews', builder: (_, __) => const ReviewsScreen()),
            GoRoute(path: '/resources/scholarships', builder: (_, __) => const ScholarshipsScreen()),
            GoRoute(
              path: '/resources/scholarships/:slug',
              builder: (_, state) => ScholarshipDetailScreen(
                slug: state.pathParameters['slug'] ?? '',
              ),
            ),
            GoRoute(
              path: '/dashboard/edit',
              builder: (context, state) => EditProfileScreen(
                userData: Map<String, dynamic>.from(state.extra as Map),
              ),
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
      case 'parent':
        return '/dashboard';
      default:
        return '/';
    }
  }
}