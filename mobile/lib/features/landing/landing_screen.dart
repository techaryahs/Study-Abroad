import 'package:country_flags/country_flags.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../widgets/book_counselling_sheet.dart';
import '../auth/auth_provider.dart';

// Brand Colors from Stitch Design System
const _cBackground = Color(0xFFFFF8F5);
const _cOnSurface = Color(0xFF231914);
const _cPrimary = Color(0xFF7A5900);
const _cPrimaryContainer = Color(0xFFD4A848);
const _cOnPrimaryContainer = Color(0xFF563E00);
const _cSecondary = Color(0xFF6B5B54);
const _cSurfaceContainerHigh = Color(0xFFF8E4DB);
const _cSurfaceContainerLow = Color(0xFFFFF1EA);
const _cSurfaceContainerLowest = Color(0xFFFFFFFF);
const _cOutlineVariant = Color(0xFFD2C5B1);
const _cOnSurfaceVariant = Color(0xFF4E4637);
const _cPrimaryFixed = Color(0xFFFFDEA1);
const _cOnPrimaryFixed = Color(0xFF261900);

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  static const _services = [
    (Icons.account_balance_rounded, 'Admission Guidance'),
    (Icons.assignment_rounded, 'University Shortlisting'),
    (Icons.edit_note_rounded, 'SOP & LOR Support'),
    (Icons.school_rounded, 'Scholarship Assistance'),
    (Icons.fact_check_rounded, 'Visa Guidance'),
    (Icons.trending_up_rounded, 'Profile Building'),
  ];

  static const _stats = [
    ('15+', 'Countries'),
    ('360+', 'Top Universities'),
    ('1000+', 'Admits Received'),
    ('500+', 'Tier 1 Institutes'),
  ];

  static const _destinations = [
    ('USA', 'US'),
    ('UK', 'GB'),
    ('Germany', 'DE'),
    ('Australia', 'AU'),
    ('Ireland', 'IE'),
    ('Dubai', 'AE'),
    ('Canada', 'CA'),
  ];

  void _openBooking(BuildContext context) {
    final auth = context.read<AuthProvider>();
    if (auth.isLoggedIn) {
      showBookCounsellingSheet(context);
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Create an account to book your consultation.')),
    );
    context.push('/register');
  }

  Future<void> _openWhatsApp() async {
    final uri = Uri.parse('https://wa.me/918657869659');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _cBackground,
      appBar: AppBar(
        backgroundColor: _cBackground,
        elevation: 0,
        titleSpacing: 16,
        scrolledUnderElevation: 2,
        shadowColor: _cOnSurface.withOpacity(0.1),
        title: Row(
          children: [
            const Icon(Icons.account_balance_rounded, color: _cPrimary, size: 24),
            const SizedBox(width: 8),
            const Text(
              'Prestige Academics',
              style: TextStyle(
                fontFamily: 'EB Garamond',
                color: _cPrimary,
                fontSize: 22,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: _openWhatsApp,
            style: TextButton.styleFrom(
              foregroundColor: _cPrimary,
              textStyle: const TextStyle(
                fontFamily: 'Manrope',
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
            child: Container(
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: _cPrimary, width: 2)),
              ),
              child: const Text('Contact Us'),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 32),
            // Hero Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: _cSurfaceContainerHigh,
                      borderRadius: BorderRadius.circular(100),
                    ),
                    child: const Text(
                      'ELITE CONSULTANCY',
                      style: TextStyle(
                        fontFamily: 'Manrope',
                        color: _cPrimary,
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Education Leader Led Path to Ivy League & Top Global Universities',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontFamily: 'EB Garamond',
                      color: _cOnSurface,
                      fontSize: 32,
                      height: 1.15,
                      fontWeight: FontWeight.w600,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Bespoke guidance tailored to your academic profile and career aspirations.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontFamily: 'Manrope',
                      color: _cSecondary,
                      fontSize: 16,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => _openBooking(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _cPrimary,
                        foregroundColor: _cSurfaceContainerLowest,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        elevation: 4,
                      ),
                      child: const Text(
                        'Talk to an Expert',
                        style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: _openWhatsApp,
                      icon: const Icon(Icons.chat_rounded, size: 20),
                      label: const Text(
                        'WhatsApp Us',
                        style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: _cOnSurfaceVariant,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        side: const BorderSide(color: _cOnSurfaceVariant, width: 2),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 48),
                  Container(
                    width: double.infinity,
                    height: 200,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white, width: 4),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                      image: const DecorationImage(
                        image: AssetImage('assets/images/sir2.jpeg'),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 48),

            // Academic Progress Tracker
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: _cSurfaceContainerLowest,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _cSurfaceContainerHigh),
                  boxShadow: [
                    BoxShadow(
                      color: _cSecondary.withOpacity(0.04),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'YOUR ADMISSION JOURNEY',
                          style: TextStyle(fontFamily: 'Manrope', fontSize: 10, fontWeight: FontWeight.w700, color: _cOnSurfaceVariant, letterSpacing: 1.0),
                        ),
                        Text(
                          '45% COMPLETE',
                          style: TextStyle(fontFamily: 'Manrope', fontSize: 10, fontWeight: FontWeight.w700, color: _cPrimary, letterSpacing: 1.0),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(100),
                      child: const LinearProgressIndicator(
                        value: 0.45,
                        minHeight: 8,
                        backgroundColor: _cSurfaceContainerHigh,
                        valueColor: AlwaysStoppedAnimation<Color>(_cPrimary),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 48),

            // Services Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Our Expertise',
                    style: TextStyle(fontFamily: 'EB Garamond', fontSize: 28, fontWeight: FontWeight.w500, color: _cOnSurface),
                  ),
                  const SizedBox(height: 24),
                  GridView.builder(
                    padding: EdgeInsets.zero,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 1.3,
                    ),
                    itemCount: _services.length,
                    itemBuilder: (context, index) {
                      final s = _services[index];
                      return Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: _cSurfaceContainerLowest,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: _cSurfaceContainerLow),
                          boxShadow: [
                            BoxShadow(color: _cSecondary.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4)),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(s.$1, color: _cPrimary, size: 32),
                            const Spacer(),
                            Text(
                              s.$2,
                              style: const TextStyle(fontFamily: 'Manrope', fontSize: 14, fontWeight: FontWeight.w700, color: _cOnSurface),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 48),

            // Stats Grid
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: GridView.builder(
                padding: EdgeInsets.zero,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 24,
                  mainAxisSpacing: 32,
                  childAspectRatio: 1.8,
                ),
                itemCount: _stats.length,
                itemBuilder: (context, index) {
                  final stat = _stats[index];
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        stat.$1,
                        style: const TextStyle(fontFamily: 'EB Garamond', fontSize: 32, fontWeight: FontWeight.w600, color: _cPrimary),
                      ),
                      Text(
                        stat.$2,
                        style: const TextStyle(fontFamily: 'Manrope', fontSize: 12, fontWeight: FontWeight.w700, color: _cSecondary, letterSpacing: 1.0),
                      ),
                    ],
                  );
                },
              ),
            ),
            const SizedBox(height: 48),

            // Destinations
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Dream Destinations',
                style: TextStyle(fontFamily: 'EB Garamond', fontSize: 28, fontWeight: FontWeight.w500, color: _cOnSurface),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 50,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                itemCount: _destinations.length,
                separatorBuilder: (context, index) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  final dest = _destinations[index];
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: _cSurfaceContainerHigh,
                      borderRadius: BorderRadius.circular(100),
                      border: Border.all(color: _cOutlineVariant),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        ClipOval(child: CountryFlag.fromCountryCode(dest.$2, height: 18, width: 18)),
                        const SizedBox(width: 8),
                        Text(
                          dest.$1,
                          style: const TextStyle(fontFamily: 'Manrope', fontSize: 14, fontWeight: FontWeight.bold, color: _cOnSurface),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 48),

            // Testimonial
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: _cSurfaceContainerLow,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: const [
                    BoxShadow(color: Color(0x0A40332D), blurRadius: 8, offset: Offset(0, 2), blurStyle: BlurStyle.inner),
                  ],
                ),
                child: Column(
                  children: [
                    const Text(
                      '"The personalized attention and strategic profile building sessions were instrumental in my acceptance to Columbia."',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontFamily: 'EB Garamond', fontSize: 22, fontStyle: FontStyle.italic, color: _cOnSurfaceVariant, height: 1.4),
                    ),
                    const SizedBox(height: 24),
                    Container(width: 48, height: 2, color: _cPrimary),
                    const SizedBox(height: 16),
                    const Text(
                      'CLASS OF 2024 ADMIT',
                      style: TextStyle(fontFamily: 'Manrope', fontSize: 10, fontWeight: FontWeight.w700, color: _cPrimary, letterSpacing: 2.0),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 48),

            // Bottom CTA
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: _cOnSurface,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    const Text(
                      'Ready to Start Your Journey?',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontFamily: 'EB Garamond', fontSize: 28, fontWeight: FontWeight.w500, color: _cPrimaryFixed),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'The first step to your global future begins with a single conversation.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontFamily: 'Manrope', fontSize: 14, color: _cSurfaceContainerHigh),
                    ),
                    const SizedBox(height: 32),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () => _openBooking(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _cPrimaryContainer,
                          foregroundColor: _cOnPrimaryFixed,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: const Text(
                          'Book Free Consultation',
                          style: TextStyle(fontFamily: 'Manrope', fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 48),

            // Footer
            Container(
              padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 16),
              color: _cSurfaceContainerHigh,
              child: Column(
                children: [
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.account_balance_rounded, color: _cPrimary, size: 24),
                      SizedBox(width: 8),
                      Text(
                        'Prestige Academics',
                        style: TextStyle(fontFamily: 'EB Garamond', color: _cPrimary, fontSize: 24, fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Wrap(
                    spacing: 24,
                    runSpacing: 16,
                    alignment: WrapAlignment.center,
                    children: [
                      _FooterLink('Admissions'),
                      _FooterLink('Our Services'),
                      _FooterLink('Privacy Policy'),
                      _FooterLink('Terms of Service'),
                    ],
                  ),
                  const SizedBox(height: 32),
                  const Text(
                    '© 2024 Prestige Education Consultancy. All rights reserved.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontFamily: 'Manrope', fontSize: 14, color: _cSecondary),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FooterLink extends StatelessWidget {
  final String text;
  const _FooterLink(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        fontFamily: 'Manrope',
        fontSize: 14,
        color: _cOnSurfaceVariant,
        decoration: TextDecoration.underline,
        decorationColor: _cPrimary,
      ),
    );
  }
}
