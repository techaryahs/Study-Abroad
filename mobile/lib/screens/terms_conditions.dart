// lib/screens/terms_conditions_screen.dart
import 'package:flutter/material.dart';

class AppColors {
  static const cream = Color(0xFFFCFBF8);
  static const brown = Color(0xFF3E2C1C);
  static const brownSoft = Color(0xFF4A3522);
  static const gold = Color(0xFFC9A24A);
  static const goldSoft = Color(0xFFE8D9B0);
  static const ink = Color(0xFF221812);
  static const muted = Color(0xFF7A6A58);
  static const cardBorder = Color(0xFFEFE7D6);
}

class TermsConditionsScreen extends StatelessWidget {
  const TermsConditionsScreen({super.key});

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
          'Terms & Conditions',
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
            _AcceptanceCard(),
            _TermSection(
              title: '1. Acceptance of Terms',
              body:
                  'By accessing or using our study abroad services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of the terms, please discontinue use of our platform and services.',
            ),
            _TermSection(
              title: '2. Eligibility',
              bullets: [
                'You must be at least 17 years of age, or have parental consent.',
                'You agree to provide accurate, complete academic and personal information.',
                'You are responsible for maintaining the confidentiality of your account.',
              ],
            ),
            _TermSection(
              title: '3. Services Offered',
              body:
                  'We provide counselling, university shortlisting, application assistance, visa guidance, and pre-departure support. Final admission and visa decisions rest solely with the respective universities and consulates.',
            ),
            _TermSection(
              title: '4. Fees & Payments',
              bullets: [
                'Service fees are disclosed before you sign up for any package.',
                'All payments are processed via secure third-party gateways.',
                'Fees are non-transferable between students or programs.',
                'Refunds are governed by our separate Refund Policy.',
              ],
            ),
            _TermSection(
              title: '5. Student Responsibilities',
              bullets: [
                'Provide authentic documents, transcripts, and test scores.',
                'Respond to counsellor requests within stated timelines.',
                'Comply with university and visa authority requirements.',
                'Inform us promptly of any changes in plans or details.',
              ],
            ),
            _TermSection(
              title: '6. Intellectual Property',
              body:
                  'All content, branding, study materials, and software on this platform are the property of the company and protected by applicable copyright and trademark laws. You may not reproduce or redistribute without written consent.',
            ),
            _TermSection(
              title: '7. Limitation of Liability',
              body:
                  'We are not liable for university rejections, visa denials, changes in immigration policy, or any indirect losses arising from the use of our services. Our maximum liability is limited to the fees paid for the specific service in question.',
            ),
            _TermSection(
              title: '8. Termination',
              body:
                  'We reserve the right to suspend or terminate accounts that violate these terms, submit fraudulent information, or misuse our services, without prior notice and without refund.',
            ),
            _TermSection(
              title: '9. Governing Law',
              body:
                  'These terms are governed by the laws of the jurisdiction in which the company is registered. Any disputes shall be resolved through arbitration or the competent courts of that jurisdiction.',
            ),
            _TermSection(
              title: '10. Contact Us',
              body:
                  'For questions regarding these Terms & Conditions, contact us at support@yourdomain.com. We aim to respond within 48 business hours.',
            ),
            SizedBox(height: 18),
            _AgreeButton(),
            SizedBox(height: 14),
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
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: AppColors.gold.withOpacity(0.18),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.gold.withOpacity(0.5)),
            ),
            child: const Text(
              'LEGAL',
              style: TextStyle(
                color: AppColors.gold,
                fontSize: 11,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.2,
              ),
            ),
          ),
          const SizedBox(height: 14),
          const Text(
            'Terms &\nConditions',
            style: TextStyle(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.w800,
              height: 1.15,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Please read carefully before using our services.',
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
              padding:
                  const EdgeInsets.symmetric(horizontal: 22, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(14),
              ),
              textStyle: const TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 14,
              ),
            ),
            child: const Text('Read Full Terms'),
          ),
        ],
      ),
    );
  }
}

class _AcceptanceCard extends StatelessWidget {
  const _AcceptanceCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 4),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.goldSoft.withOpacity(0.35),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.gold.withOpacity(0.4)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Icon(Icons.info_outline, color: AppColors.brown, size: 20),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              'By continuing to use our platform, you confirm that you have read, understood, and agreed to these Terms & Conditions.',
              style: TextStyle(
                color: AppColors.ink,
                fontSize: 13,
                height: 1.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TermSection extends StatelessWidget {
  final String title;
  final String? body;
  final List<String>? bullets;

  const _TermSection({required this.title, this.body, this.bullets});

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

class _AgreeButton extends StatelessWidget {
  const _AgreeButton();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () {},
        icon: const Icon(Icons.check_circle_outline, size: 18),
        label: const Text('I Agree & Continue'),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.brown,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: const TextStyle(
            fontWeight: FontWeight.w700,
            fontSize: 15,
          ),
        ),
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
