import 'package:flutter/material.dart';
import 'package:study_abroad/core/theme.dart';
import 'package:study_abroad/core/utils/responsive.dart';
import 'package:study_abroad/widgets/responsive_hero_image.dart';
import 'package:study_abroad/widgets/service_hero_card.dart';
import 'package:study_abroad/widgets/service_feature_grid.dart';
import 'package:study_abroad/widgets/service_faq_section.dart';
import 'package:study_abroad/widgets/book_counselling_sheet.dart';

class LorDraftingScreen extends StatelessWidget {
  const LorDraftingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundAlt,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: EdgeInsets.symmetric(horizontal: AppSpacing.sm),
              child: ServiceHeroCard(
                title: 'THE ART OF LOR ',
                highlightTitle: 'DRAFTING',
                tag: 'SERVICE',
                subtitle: '"Little known is the art of writing exactly what the admissions committee wants to see. A strong LOR can be more impactful than your SOP."',
                ctaText: 'BEGIN LOR STRATEGY',
                onCtaPressed: () => showBookCounsellingSheet(context),
              ),
            ),
            
            Padding(
              padding: EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'NARRATIVE COMMAND',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.gold,
                      letterSpacing: 3,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Why LORs Are Your Most Potent Weapon',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.darkBrown,
                      height: 1.1,
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Letters of Recommendation (LORs) undeniably hold the most importance in your application. However, most LORs are generic, wasting the only chance you had at winning the committee\'s clinical support.',
                    style: TextStyle(fontSize: 16, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Think about it: Would an admissions officer put faith in a random applicant, or rather believe a professor or industry leader they follow? It\'s that simple.',
                    style: TextStyle(fontSize: 16, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: EdgeInsets.all(AppSpacing.md),
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      border: Border(left: BorderSide(color: AppTheme.gold, width: 4)),
                    ),
                    child: const Text(
                      '"Generic LORs are a load of crap. No one cares if you were \'the best student.\' They care about your unique contribution logic."',
                      style: TextStyle(fontSize: 18, fontStyle: FontStyle.italic, color: AppTheme.darkBrown, fontWeight: FontWeight.w600),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'This service includes strategic recommendations on who you should select as your confirmors, tailored specifically to your profile, target degree, and professional network.',
                    style: TextStyle(fontSize: 16, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                  ),
                  
                  const SizedBox(height: 40),
                  ServiceFeatureGrid(
                    overline: 'DRAFTING FRAMEWORK',
                    title1: 'Strategic LOR',
                    title2: 'Pillars',
                    features: [
                      ServiceFeatureItem(
                        title: 'Standard Audit',
                        desc: 'Mapping your LORs against international recommender standards.',
                        icon: Icons.check_circle_outline,
                      ),
                      ServiceFeatureItem(
                        title: 'Strategic Selection',
                        desc: 'Advisory on choosing the optimal mix of academic and professional confirmors.',
                        icon: Icons.group_outlined,
                      ),
                      ServiceFeatureItem(
                        title: 'Dynamic Storytelling',
                        desc: 'Avoiding generic praise to focus on high-impact professional narratives.',
                        icon: Icons.edit_outlined,
                      ),
                      ServiceFeatureItem(
                        title: 'Profile Alignment',
                        desc: 'Ensuring LORs complement your SOP and technical achievements.',
                        icon: Icons.menu_book_outlined,
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 40),
                  
                  // Sidebar items placed at bottom for mobile
                  Container(
                    padding: EdgeInsets.all(AppSpacing.lg),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.15)),
                      borderRadius: BorderRadius.circular(32),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.gold.withValues(alpha: 0.05),
                          blurRadius: 40,
                          offset: const Offset(0, 20),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.security, color: AppTheme.gold, size: 28),
                            const SizedBox(width: 16),
                            const Expanded(
                              child: Text(
                                'Influence Audit',
                                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.darkBrown),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'We analyze your potential recommenders to determine who provides the highest ROI for your specific target universities.',
                          style: TextStyle(fontSize: 14, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.1)),
                      borderRadius: BorderRadius.circular(32),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: AppTheme.gold.withValues(alpha: 0.1),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.chat_bubble_outline, color: AppTheme.gold),
                            ),
                            const SizedBox(width: 16),
                            const Expanded(
                              child: Text(
                                'Confirmor Consult',
                                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.darkBrown),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Not sure who to ask? Connect with our team to map out your recommendation strategy before drafting begins.',
                          style: TextStyle(fontSize: 12, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            const Text(
                              'MESSAGE NOW',
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.gold, letterSpacing: 2),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.arrow_forward, color: AppTheme.gold, size: 14),
                          ],
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  const ServiceFaqSection(
                    faqs: [
                      ServiceFaq(
                        question: 'What is a Letter of Recommendation (LOR)?',
                        answer: 'A document written by a professor or employer highlighting your skills, achievements, and character.',
                      ),
                      ServiceFaq(
                        question: 'Who should write my LOR?',
                        answer: 'People who know you well professionally or academically and can provide specific examples of your capabilities.',
                      ),
                      ServiceFaq(
                        question: 'How many LORs do I need?',
                        answer: 'Most universities require 2-3 LORs. Check specific program requirements.',
                      ),
                      ServiceFaq(
                        question: 'Can you help draft the LOR?',
                        answer: 'Yes, we provide drafting support to ensure your LOR hits the strategic points admissions committees look for.',
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
}
