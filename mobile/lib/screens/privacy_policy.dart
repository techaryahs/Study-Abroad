// lib/screens/privacy_policy_screen.dart
import 'package:flutter/material.dart';

class AppColors {
  static const cream = Color(0xFFFCFBF8);
  static const brown = Color(0xFF3E2C1C);     // dark brown hero
  static const brownSoft = Color(0xFF4A3522);
  static const gold = Color(0xFFC9A24A);      // CTA / accents
  static const goldSoft = Color(0xFFE8D9B0);
  static const ink = Color(0xFF221812);       // primary text
  static const muted = Color(0xFF7A6A58);     // secondary text
  static const cardBorder = Color(0xFFEFE7D6);
}

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.cream,
      appBar: AppBar(
        backgroundColor: AppColors.cream,
        elevation: 0,
        scrolledUnderElevation: 0,
        iconTheme: const IconThemeData(color: AppColors.ink),
        title: const Text(
          'Privacy & Policy',
          style: TextStyle(
            color: AppColors.ink,
            fontWeight: FontWeight.w700,
            fontSize: 18,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart_outlined, color: AppColors.ink),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: const [
            _HeroBanner(),
            SizedBox(height: 20),
            _PolicySection(
              title: '1. Introduction',
              body:
                  'Welcome to our study abroad platform. We value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our counselling, application, and advisory services.',
            ),
            _PolicySection(
              title: '2. Information We Collect',
              bullets: [
                'Personal details: name, email, phone, date of birth, nationality.',
                'Academic records: transcripts, test scores (IELTS, TOEFL, GRE, GMAT).',
                'Application data: country, university, and program preferences.',
                'Payment details processed via secure third-party gateways.',
              ],
            ),
            _PolicySection(
              title: '3. How We Use Your Information',
              bullets: [
                'To provide counselling and university shortlisting.',
                'To process applications, visas, and documentation.',
                'To send updates, reminders, and service notifications.',
                'To improve our services and student experience.',
              ],
            ),
            _PolicySection(
              title: '4. Sharing of Information',
              body:
                  'We share your information only with partner universities, visa authorities, and trusted service providers strictly to facilitate your study abroad journey. We never sell your personal data.',
            ),
            _PolicySection(
              title: '5. Data Security',
              body:
                  'Your data is stored on secure servers with industry-standard encryption. Access is restricted to authorised counsellors and staff bound by confidentiality agreements.',
            ),
            _PolicySection(
              title: '6. Your Rights',
              bullets: [
                'Access, update, or delete your personal data at any time.',
                'Withdraw consent for marketing communications.',
                'Request a copy of the data we hold about you.',
              ],
            ),
            _PolicySection(
              title: '7. Cookies',
              body:
                  'We use cookies to personalise content, analyse traffic, and enhance your browsing experience. You can manage cookie preferences in your browser settings.',
            ),
            _PolicySection(
              title: '8. Contact Us',
              body:
                  'For any questions about this Privacy Policy, reach us at support@yourdomain.com. We respond within 48 business hours.',
            ),
            SizedBox(height: 16),
            _LastUpdated(),
          ],
        ),
      ),
    );
  }
}

class _HeroBanner extends StatelessWidget {
  const _HeroBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(22, 24, 22, 26),
      decoration: BoxDecoration(
        color: AppColors.brown,
        borderRadius: BorderRadius.circular(22),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Privacy &\nPolicy',
            style: TextStyle(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.w800,
              height: 1.15,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Your data. Your trust. Our priority.',
            style: TextStyle(
              color: Colors.white.withOpacity(0.75),
              fontSize: 13,
            ),
          ),
          const SizedBox(height: 18),
          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.gold,
              foregroundColor: AppColors.brown,
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
              textStyle: const TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 14,
              ),
            ),
            child: const Text('Read Full Policy'),
          ),
        ],
      ),
    );
  }
}

class _PolicySection extends StatelessWidget {
  final String title;
  final String? body;
  final List<String>? bullets;

  const _PolicySection({
    required this.title,
    this.body,
    this.bullets,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 14),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.cardBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 6,
                height: 22,
                decoration: BoxDecoration(
                  color: AppColors.gold,
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    color: AppColors.ink,
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          if (body != null)
            Text(
              body!,
              style: const TextStyle(
                color: AppColors.muted,
                fontSize: 13.5,
                height: 1.55,
              ),
            ),
          if (bullets != null)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: bullets!
                  .map((b) => Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Padding(
                              padding: EdgeInsets.only(top: 6),
                              child: Icon(Icons.check_circle,
                                  size: 14, color: AppColors.gold),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                b,
                                style: const TextStyle(
                                  color: AppColors.ink,
                                  fontSize: 13.5,
                                  height: 1.5,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ))
                  .toList(),
            ),
        ],
      ),
    );
  }
}

class _LastUpdated extends StatelessWidget {
  const _LastUpdated();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        'Last updated: April 2026',
        style: TextStyle(
          color: AppColors.muted.withOpacity(0.9),
          fontSize: 12,
          fontStyle: FontStyle.italic,
        ),
      ),
    );
  }
}
