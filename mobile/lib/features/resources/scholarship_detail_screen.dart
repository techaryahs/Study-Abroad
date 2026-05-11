import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme.dart';
import '../../data/scholarship_repository.dart';

class ScholarshipDetailScreen extends StatefulWidget {
  final String slug;
  const ScholarshipDetailScreen({super.key, required this.slug});

  @override
  State<ScholarshipDetailScreen> createState() =>
      _ScholarshipDetailScreenState();
}

class _ScholarshipDetailScreenState extends State<ScholarshipDetailScreen> {
  late Future<ScholarshipItem?> _scholarshipFuture;

  @override
  void initState() {
    super.initState();
    _scholarshipFuture =
        ScholarshipRepository.getScholarshipBySlug(widget.slug);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<ScholarshipItem?>(
      future: _scholarshipFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
              body: Center(
                  child: CircularProgressIndicator(color: AppTheme.gold)));
        }

        final s = snapshot.data;
        if (s == null) {
          return Scaffold(
            appBar: AppBar(
              leading: IconButton(
                icon: const Icon(LucideIcons.arrowLeft),
                onPressed: () => context.canPop()
                    ? context.pop()
                    : context.go('/resources/scholarships'),
              ),
            ),
            body: const Center(child: Text('Scholarship not found')),
          );
        }

        return Scaffold(
          backgroundColor: AppTheme.background,
          body: CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              SliverAppBar(
                expandedHeight: 0,
                pinned: true,
                backgroundColor: AppTheme.background,
                elevation: 0,
                title: const Text('SCHOLARSHIP PROFILE',
                    style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 2,
                        color: AppTheme.gold)),
                iconTheme: const IconThemeData(color: AppTheme.textPrimary),
                leading: IconButton(
                  icon: const Icon(LucideIcons.arrowLeft,
                      color: AppTheme.textPrimary),
                  onPressed: () => context.canPop()
                      ? context.pop()
                      : context.go('/resources/scholarships'),
                ),
              ),
              SliverToBoxAdapter(
                child: Column(
                  children: [
                    // Top Elite CTA Section (Light Theme)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            AppTheme.gold.withOpacity(0.05),
                            AppTheme.background,
                          ],
                        ),
                        borderRadius: const BorderRadius.only(
                          bottomLeft: Radius.circular(40),
                          bottomRight: Radius.circular(40),
                        ),
                      ),
                      child: Column(
                        children: [
                          Container(
                            width: 120,
                            height: 120,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                              border: Border.all(
                                  color: AppTheme.gold.withOpacity(0.2)),
                              boxShadow: [
                                BoxShadow(
                                  color: AppTheme.gold.withOpacity(0.1),
                                  blurRadius: 30,
                                  offset: const Offset(0, 10),
                                ),
                              ],
                            ),
                            child: const Center(
                              child: Icon(LucideIcons.graduationCap,
                                  size: 60, color: AppTheme.gold),
                            ),
                          ),
                          const SizedBox(height: 24),
                          const Text(
                            'Ready to Apply?',
                            style: TextStyle(
                                fontFamily: 'Cormorant Garamond',
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.textPrimary),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'Transition to the official portal to complete your institutional application.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                color: AppTheme.textSecondary,
                                fontSize: 13,
                                height: 1.6),
                          ),
                          const SizedBox(height: 32),
                          SizedBox(
                            width: double.infinity,
                            height: 56,
                            child: ElevatedButton(
                              onPressed: () => _launchURL(s.applyLink),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.darkBrown,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16)),
                                elevation: 0,
                              ),
                              child: const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text('INITIALIZE APPLICATION',
                                      style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w900,
                                          letterSpacing: 1)),
                                  SizedBox(width: 8),
                                  Icon(LucideIcons.externalLink, size: 16),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s.sponsor,
                              style: const TextStyle(
                                  color: AppTheme.gold,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 2)),
                          const SizedBox(height: 12),
                          Text(
                            s.name,
                            style: const TextStyle(
                                fontFamily: 'Cormorant Garamond',
                                fontSize: 40,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.textPrimary,
                                height: 1.1),
                          ),
                          const SizedBox(height: 40),

                          // Info Grid
                          GridView.count(
                            crossAxisCount: 2,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            mainAxisSpacing: 16,
                            crossAxisSpacing: 16,
                            childAspectRatio: 1.5,
                            children: [
                              _infoCard('DEADLINE', s.deadline,
                                  LucideIcons.calendar, Colors.red[400]!),
                              _infoCard(
                                  'VALUE',
                                  s.amount,
                                  LucideIcons.dollarSign,
                                  const Color(0xFF10B981)),
                              _infoCard(
                                  'AWARDED',
                                  s.id.contains('1') ? 'Multiple' : 'Variable',
                                  LucideIcons.award,
                                  AppTheme.gold),
                              _infoCard('LOCATION', s.hostCountry,
                                  LucideIcons.mapPin, const Color(0xFF60A5FA)),
                            ],
                          ),

                          const SizedBox(height: 48),

                          // Narrative
                          const Text('SCOPE & PURPOSE',
                              style: TextStyle(
                                  color: AppTheme.gold,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 2)),
                          const SizedBox(height: 20),
                          Text(
                            s.description,
                            style: const TextStyle(
                                fontSize: 16,
                                color: AppTheme.textSecondary,
                                height: 1.8),
                          ),

                          const SizedBox(height: 48),

                          // Perks Box
                          Container(
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: AppTheme.gold.withOpacity(0.05),
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(
                                  color: AppTheme.gold.withOpacity(0.1)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('VALUE PROPOSITION',
                                    style: TextStyle(
                                        color: AppTheme.gold,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 1)),
                                const SizedBox(height: 16),
                                Text(
                                  '"${s.perks}"',
                                  style: const TextStyle(
                                      fontSize: 16,
                                      fontStyle: FontStyle.italic,
                                      color: AppTheme.textPrimary,
                                      height: 1.6),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 48),

                          // Contact Details (Light Theme)
                          _contactSection(s),

                          const SizedBox(height: 100),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _infoCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 18, color: color),
          const SizedBox(height: 12),
          Text(label,
              style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.textSecondary,
                  letterSpacing: 1)),
          const SizedBox(height: 4),
          Text(value,
              style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary),
              overflow: TextOverflow.ellipsis),
        ],
      ),
    );
  }

  Widget _contactSection(ScholarshipItem s) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: AppTheme.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 30,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('LIAISON INFORMATION',
              style: TextStyle(
                  color: AppTheme.gold,
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.5)),
          const SizedBox(height: 32),
          _contactItem(LucideIcons.mapPin, 'Provider HQ',
              s.id.contains('1') ? 'Brooklyn, NY' : 'Global'),
          const SizedBox(height: 24),
          _contactItem(
              LucideIcons.mail,
              'Inquiries',
              s.id.contains('1')
                  ? 'tandon.admissions@nyu.edu'
                  : 'info@scholarships.com'),
        ],
      ),
    );
  }

  Widget _contactItem(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppTheme.gold),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label,
                  style: const TextStyle(
                      color: AppTheme.textSecondary,
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1)),
              const SizedBox(height: 2),
              Text(value,
                  style: const TextStyle(
                      color: AppTheme.textPrimary,
                      fontSize: 13,
                      fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _launchURL(String url) async {
    final sanitizedUrl = url.trim();
    final uri = Uri.parse(sanitizedUrl);
    try {
      // Try launching directly first as canLaunchUrl is sometimes unreliable on specific Android builds
      final success =
          await launchUrl(uri, mode: LaunchMode.externalApplication);
      if (!success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(
                  'Could not open portal. Please check your internet connection.')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }
}
