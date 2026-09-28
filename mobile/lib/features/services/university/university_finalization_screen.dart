import 'package:flutter/material.dart';
import '../../../widgets/book_counselling_sheet.dart';
import '../../../widgets/service_hero_card.dart';
import '../../../widgets/service_feature_grid.dart';

class UniversityFinalizationScreen extends StatelessWidget {
  const UniversityFinalizationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('University Finalization'),
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
              tag: 'Post-Admission Strategy',
              title: 'The Ultimate\n',
              highlightTitle: 'Decisive Choice',
              subtitle: '"Leverage deep-tier data analytics and years of expertise to finalize the one university that perfectly aligns with your career trajectory."',
              ctaText: 'Finalize My Choice',
              onCtaPressed: () => showBookCounsellingSheet(context),
            ),
            
            ServiceFeatureGrid(
              overline: 'Data Intelligence',
              title1: 'Primary Audit',
              title2: 'Pillars',
              features: [
                ServiceFeatureItem(
                  title: 'Strategic Location',
                  desc: 'Proximity to industry hubs, networking circles, and long-term career prospects.',
                  icon: Icons.location_on_outlined,
                ),
                ServiceFeatureItem(
                  title: 'Financial Logic',
                  desc: 'Detailed ROI analysis factoring in tuition, living costs, and available scholarships.',
                  icon: Icons.attach_money,
                ),
                ServiceFeatureItem(
                  title: 'Career Velocity',
                  desc: 'Evaluation of post-grad job placement rates and corporate reputation.',
                  icon: Icons.work_outline,
                ),
                ServiceFeatureItem(
                  title: 'Research Pillars',
                  desc: 'Audit of lab facilities, faculty expertise, and publication opportunities.',
                  icon: Icons.school_outlined,
                ),
                ServiceFeatureItem(
                  title: 'Lifestyle & Climate',
                  desc: 'Daily living environment, social culture, and regional adaptability.',
                  icon: Icons.wb_sunny_outlined,
                ),
                ServiceFeatureItem(
                  title: 'Visa Framework',
                  desc: 'STEM extension eligibility and jurisdictional visa success probabilities.',
                  icon: Icons.balance_outlined,
                ),
              ],
            ),
          ],
        ),
            ),
          ),
        ),
      );
  }
}
