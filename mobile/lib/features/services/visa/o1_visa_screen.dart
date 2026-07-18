import 'package:flutter/material.dart';
import 'package:study_abroad/core/theme.dart';
import 'package:study_abroad/core/utils/responsive.dart';
import 'package:study_abroad/widgets/responsive_hero_image.dart';
import 'package:study_abroad/widgets/service_hero_card.dart';
import 'package:study_abroad/widgets/service_feature_grid.dart';
import 'package:study_abroad/widgets/service_faq_section.dart';

class O1VisaScreen extends StatelessWidget {
  const O1VisaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundAlt,
      appBar: AppBar(
        title: const Text('O-1 Visa Node', style: TextStyle(color: AppTheme.darkBrown)),
        backgroundColor: AppTheme.backgroundAlt,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppTheme.darkBrown),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: MediaQuery.sizeOf(context).height,
            ),
            child: Column(
          children: [
            ServiceHeroCard(
              tag: 'EXTRAORDINARY PROTOCOL',
              title: 'APPLY FOR AN ',
              highlightTitle: 'O-1 VISA NODE',
              subtitle: 'The Elite Non-Immigrant work visa in the US, architected for individuals with extraordinary global acclaim in their field.',
              ctaText: 'Access Service',
              onCtaPressed: () {},
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.bolt, color: AppTheme.gold, size: 28),
                        SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'H-1B ALTERNATIVE ACTIVATED',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 1,
                                  color: AppTheme.gold,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                'Bypass the lottery constraints of H-1B with an uncapped, infinitely renewable merit-based visa.',
                                style: TextStyle(fontSize: 12, color: AppTheme.textMuted, fontStyle: FontStyle.italic),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),
                  
                  const Center(
                    child: Text(
                      'WHY CHOOSE US FOR O-1',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.darkBrown,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildWhyBox(Icons.search, 'Free Eligibility Check', 'Deep portfolio audit to verify extraordinary ability benchmarks.'),
                  _buildWhyBox(Icons.school, 'Build Your Profile', 'Strategic development to hit high-conquest USCIS definitions.'),
                  _buildWhyBox(Icons.star, 'Success Rates Over 90%', 'Elite-tier approval vectors for validated qualified candidacy.'),
                  
                  const SizedBox(height: 40),
                  
                  const Center(
                    child: Text(
                      'SERVICE ROADMAP',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.darkBrown,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildRoadmapPhase('01', 'Profile Building', 'Advanced profile synthesis to meet Extraordinary benchmarks.', '3-6 Months'),
                  _buildRoadmapPhase('02', 'Petitioning Node', 'Architecture of an unbreakable petition narrative.', '1-2 Months'),
                  _buildRoadmapPhase('03', 'I-129 Filing Node', 'Direct filing protocol with USCIS authorities.', '1-2 Months'),
                  _buildRoadmapPhasePremium('04', 'Decision Node', 'Receive your official approval notice.', '15 Days', '2-4 Months'),

                  const SizedBox(height: 40),

                  const Center(
                    child: Text(
                      'SUCCESS ANALYTICS',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.darkBrown,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      children: [
                        _buildStatBar('O-1A Science Node', 0.85, '85%'),
                        _buildStatBar('O-1A Business Node', 0.79, '79%'),
                        _buildStatBar('O-1B Arts Node', 0.88, '88%'),
                        _buildStatBar('Premium Processed', 0.95, '95%'),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),
                  const Center(
                    child: Text(
                      'ALTERNATE NODES',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.darkBrown,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildAlternateNode('US', 'USA (EB-1 Visa)', 'Immigrant Green Card Node.'),
                  _buildAlternateNode('GB', 'UK (Global Talent)', 'Direct Global PR.'),
                  _buildAlternateNode('AU', 'Australia (National Innovation)', 'Priority Access Node.'),

                  const SizedBox(height: 40),
                  
                  const Text(
                    'O-1 CLASS ELIGIBILITY',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.darkBrown,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Proof of one major Node award or 3 out of 8 Criteria.',
                    style: TextStyle(fontSize: 13, color: AppTheme.textMuted, fontStyle: FontStyle.italic),
                  ),
                  const SizedBox(height: 24),
                  _buildCriteria('01', 'Evidence of receipt of nationally or internationally recognized prizes or awards for excellence.'),
                  _buildCriteria('02', 'Evidence of membership in associations requiring outstanding achievements.'),
                  _buildCriteria('03', 'Evidence of published material in professional/major trade publications about you.'),
                  _buildCriteria('04', 'Evidence of participation on a panel, or individually, as a judge of others\' work.'),
                  _buildCriteria('05', 'Evidence of original scientific, scholarly, or business-related contributions of major significance.'),
                  _buildCriteria('06', 'Evidence of authorship of scholarly articles in professional journals.'),
                  _buildCriteria('07', 'Evidence of employment in a critical or essential capacity for distinguished organizations.'),
                  _buildCriteria('08', 'Evidence of commanding a high salary or other significant remuneration.'),
                  
                  const SizedBox(height: 40),

                  const Center(
                    child: Text(
                      'O-1 CATEGORIES',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.darkBrown,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildCategoryCard('O-1A Visa', 'For individuals with extraordinary abilities in science, education, business, or athletics.', ['Requires US Employer/Agent', 'Sustained National/International Acclaim'], true),
                  _buildCategoryCard('O-1B Visa', 'For individuals with extraordinary ability in the arts or extraordinary achievement in film/TV.', ['Requires US Employer/Agent', 'Distinction in the Field'], false),
                  _buildCategoryCard('O-2 Visa', 'For individuals who will accompany an O-1 artist or athlete to assist in a specific event.', ['Must Accompany O-1 Holder', 'Critical Skills & Experience'], false),

                  const SizedBox(height: 40),

                  const Center(
                    child: Text(
                      'STRATEGIC ADVANTAGES',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.darkBrown,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildAdvantageItem('Uncapped Quotas', 'Unlike H-1B, there is no annual limit or lottery for O-1 visas.'),
                  _buildAdvantageItem('Infinite Renewals', 'Can be renewed indefinitely in 1-year increments.'),
                  _buildAdvantageItem('J-1 Waiver Bypass', 'Can be obtained even if subject to the 2-year home residency requirement.'),
                  _buildAdvantageItem('Dual Intent Flexibility', 'A clear pathway remains open to adjust status to EB-1 or EB-2 NIW.'),

                  const SizedBox(height: 32),
                  const ServiceFaqSection(
                    faqs: [
                      ServiceFaq(
                        question: 'Who qualifies for an O-1 Visa?',
                        answer: 'Individuals who can demonstrate extraordinary ability by sustained national or international acclaim in sciences, arts, education, business, or athletics.',
                      ),
                      ServiceFaq(
                        question: 'Do I need a job offer for O-1?',
                        answer: 'Yes. The O-1 is an employer-sponsored visa, meaning you must have a US employer or agent to petition on your behalf.',
                      ),
                      ServiceFaq(
                        question: 'What is the processing time for O-1?',
                        answer: 'With premium processing, USCIS will process the petition within 15 calendar days.',
                      ),
                      ServiceFaq(
                        question: 'Is there a limit on how long I can stay?',
                        answer: 'The initial period of stay can be up to 3 years. After that, it can be extended indefinitely in 1-year increments as long as the work continues.',
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
            ),
          ),
        ),
      );
  }

  Widget _buildWhyBox(IconData icon, String title, String desc) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.backgroundAlt,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
            ),
            child: Icon(icon, color: AppTheme.gold, size: 24),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: AppTheme.darkBrown, letterSpacing: 1),
          ),
          const SizedBox(height: 8),
          Text(
            desc,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 12, color: AppTheme.textMuted, fontStyle: FontStyle.italic),
          ),
        ],
      ),
    );
  }

  Widget _buildCriteria(String num, String text) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.backgroundAlt,
        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.1)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            num,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppTheme.gold, fontStyle: FontStyle.italic),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 12, color: AppTheme.darkBrown, fontStyle: FontStyle.italic),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRoadmapPhase(String step, String title, String desc, String time) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.gold,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              'PHASE $step',
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 1),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppTheme.darkBrown, fontStyle: FontStyle.italic),
          ),
          const SizedBox(height: 8),
          Text(
            desc,
            style: const TextStyle(fontSize: 13, color: AppTheme.textMuted, fontStyle: FontStyle.italic),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              'CYCLE: $time',
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted, letterSpacing: 1),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRoadmapPhasePremium(String step, String title, String desc, String premiumTime, String standardTime) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.gold,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              'PHASE $step',
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 1),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppTheme.darkBrown, fontStyle: FontStyle.italic),
          ),
          const SizedBox(height: 8),
          Text(
            desc,
            style: const TextStyle(fontSize: 13, color: AppTheme.textMuted, fontStyle: FontStyle.italic),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.backgroundAlt,
              border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('PREMIUM NODE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.gold, letterSpacing: 1)),
                Text(premiumTime, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: AppTheme.gold.withValues(alpha: 0.1)),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('STANDARD NODE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted, letterSpacing: 1)),
                Text(standardTime, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatBar(String label, double percent, String count) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label.toUpperCase(),
                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted, fontStyle: FontStyle.italic, letterSpacing: 1),
              ),
              Text(count, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.gold)),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            height: 8,
            decoration: BoxDecoration(
              color: AppTheme.backgroundAlt,
              borderRadius: BorderRadius.circular(4),
              border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: percent,
              child: Container(
                decoration: BoxDecoration(
                  color: AppTheme.gold,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAlternateNode(String flag, String title, String desc) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
        borderRadius: BorderRadius.circular(40),
      ),
      child: Row(
        children: [
          Text(flag, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textMuted, letterSpacing: 2)),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title.toUpperCase(),
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.darkBrown, fontStyle: FontStyle.italic),
                ),
                const SizedBox(height: 4),
                Text(
                  desc.toUpperCase(),
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted, fontStyle: FontStyle.italic, letterSpacing: 1),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: AppTheme.textMuted),
        ],
      ),
    );
  }

  Widget _buildCategoryCard(String title, String desc, List<String> highlights, bool isPopular) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: isPopular ? AppTheme.gold.withValues(alpha: 0.05) : Colors.white,
        border: Border.all(color: isPopular ? AppTheme.gold.withValues(alpha: 0.4) : AppTheme.gold.withValues(alpha: 0.1)),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (isPopular)
            Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: AppTheme.gold,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                'POPULAR NODE',
                style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 1),
              ),
            ),
          Text(
            title.toUpperCase(),
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppTheme.darkBrown, fontStyle: FontStyle.italic),
          ),
          const SizedBox(height: 8),
          Text(
            desc.toUpperCase(),
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.textMuted, fontStyle: FontStyle.italic),
          ),
          const SizedBox(height: 24),
          ...highlights.map((h) => Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  children: [
                    Container(
                      width: 4,
                      height: 4,
                      decoration: const BoxDecoration(
                        color: AppTheme.gold,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        h.toUpperCase(),
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted, letterSpacing: 1),
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  Widget _buildAdvantageItem(String title, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24.0, left: 16),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            left: -16,
            top: 0,
            bottom: 0,
            child: Container(width: 2, color: AppTheme.gold.withValues(alpha: 0.2)),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title.toUpperCase(),
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.darkBrown, fontStyle: FontStyle.italic),
              ),
              const SizedBox(height: 4),
              Text(
                desc,
                style: const TextStyle(fontSize: 12, color: AppTheme.textMuted, fontStyle: FontStyle.italic),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
