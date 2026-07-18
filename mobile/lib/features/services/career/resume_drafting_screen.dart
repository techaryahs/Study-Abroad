import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme.dart';
import '../../../widgets/book_counselling_sheet.dart';
import '../../../widgets/service_hero_card.dart';
import '../../../widgets/service_feature_grid.dart';

class ResumeDraftingScreen extends StatelessWidget {
  const ResumeDraftingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Resume Drafting'),
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
              tag: 'Professional Identity Forge',
              title: 'Bespoke\n',
              highlightTitle: 'Resume Drafting',
              subtitle: '"Recruiters look at a resume for less than 10 seconds. We architect your professional profile to bridge the gap between application and interview."',
              ctaText: 'Begin Draft Consultation',
              onCtaPressed: () => showBookCounsellingSheet(context),
              extraContent: SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => context.push('/services/resume_drafting/form'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.gold,
                    side: const BorderSide(color: AppTheme.gold),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: const Text('Generate Resume with AI'),
                ),
              ),
            ),
            
            ServiceFeatureGrid(
              overline: 'Elite Protocols',
              title1: 'Strategic',
              title2: 'Drafting Pillars',
              features: [
                ServiceFeatureItem(
                  title: 'Concise Architecture',
                  desc: 'Scientific one-page formatting optimized for the 10-second recruiter audit.',
                  icon: Icons.architecture,
                ),
                ServiceFeatureItem(
                  title: 'ATS Optimization',
                  desc: 'Strategic keyword integration to bypass automated screening filters.',
                  icon: Icons.shield_outlined,
                ),
                ServiceFeatureItem(
                  title: 'Impact Quantification',
                  desc: 'Transforming job duties into measurable achievements to demonstrate value.',
                  icon: Icons.trending_up,
                ),
                ServiceFeatureItem(
                  title: 'International Standards',
                  desc: 'Formatting protocols tailored for US, UK, EU, and Australian institutions.',
                  icon: Icons.business_center_outlined,
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
