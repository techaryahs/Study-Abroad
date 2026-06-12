import 'package:country_flags/country_flags.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../widgets/book_counselling_sheet.dart';
import '../../widgets/navigation_overlay.dart';
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
      endDrawer: const NavigationOverlay(),
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(90),
        child: LayoutBuilder(
          builder: (context, constraints) {
            final isSmall = MediaQuery.of(context).size.width < 380;

            return AppBar(
              automaticallyImplyLeading: false,
              backgroundColor: const Color(0xFF241716),
              elevation: 0,
              toolbarHeight: 90,
              titleSpacing: 12,

              title: Row(
                children: [
                  Container(
                    width: isSmall ? 42 : 52,
                    height: isSmall ? 42 : 52,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      image: const DecorationImage(
                        image: AssetImage(
                          "assets/images/logo_iec.png",
                        ),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),

                  SizedBox(width: isSmall ? 10 : 14),

                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          "INTERNATIONAL EDULEADER",
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          "COUNCIL",
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          "GLOBAL ADMISSIONS",
                          style: TextStyle(
                            color: Color(0xFFC79A63),
                            fontSize: 8,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 1.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              actions: [
                Builder(
                  builder: (context) => Padding(
                    padding: const EdgeInsets.only(right: 12),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(20),
                      onTap: () {
                        Scaffold.of(context).openEndDrawer();
                      },
                      child: Container(
                        width: isSmall ? 50 : 58,
                        height: isSmall ? 50 : 58,
                        decoration: BoxDecoration(
                          color: const Color(0xFF2E2220),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.08),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.25),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Icon(
                          Icons.menu_rounded,
                          color: Colors.white,
                          size: isSmall ? 28 : 32,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
      body: Stack(
        children: [
          // University Background Image
          Positioned.fill(
            child: Opacity(
              opacity: 0.15,
              child: ColorFiltered(
                colorFilter: const ColorFilter.mode(
                  Colors.grey,
                  BlendMode.saturation,
                ),
                child: Image.asset(
                  'assets/images/universityy.png',
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),

          // Cream overlay
          Positioned.fill(
            child: Container(
              color: _cBackground.withOpacity(0.75),
            ),
          ),

          // Gold glow
          Positioned(
            right: -100,
            top: 200,
            child: Container(
              width: 400,
              height: 400,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _cPrimaryContainer.withOpacity(0.05),
              ),
            ),
          ),

          // Main Content
          SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 32),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Hero Section
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Column(
                        children: [
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

                        ],
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
                      padding: const EdgeInsets.symmetric(
                        vertical: 48,
                        horizontal: 16,
                      ),
                      color: _cSurfaceContainerHigh,
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 36,
                                height: 36,
                                decoration: const BoxDecoration(
                                  image: DecorationImage(
                                    image: AssetImage(
                                      'assets/images/logo_iec.png',
                                    ),
                                    fit: BoxFit.contain,
                                  ),
                                ),
                              ),

                              const SizedBox(width: 12),

                              const Flexible(
                                child: Text(
                                  'International EduLeader Council',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontFamily: 'EB Garamond',
                                    color: _cPrimary,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                    letterSpacing: 0.3,
                                  ),
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 24),

                          Wrap(
                            spacing: 24,
                            runSpacing: 16,
                            alignment: WrapAlignment.center,
                            children: const [
                              _FooterLink('Admissions'),
                              _FooterLink('Our Services'),
                              _FooterLink('Privacy Policy'),
                              _FooterLink('Terms of Service'),
                            ],
                          ),

                          const SizedBox(height: 32),

                          Container(
                            width: 60,
                            height: 1,
                            color: _cOutlineVariant,
                          ),

                          const SizedBox(height: 24),

                          const Text(
                            '© 2026 International EduLeader Council',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontFamily: 'Manrope',
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: _cSecondary,
                            ),
                          ),

                          const SizedBox(height: 6),

                          const Text(
                            'Powered by ARYAHS WORLD INFOTECH (OPC) PVT. LTD.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontFamily: 'Manrope',
                              fontSize: 12,
                              color: _cOnSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
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
