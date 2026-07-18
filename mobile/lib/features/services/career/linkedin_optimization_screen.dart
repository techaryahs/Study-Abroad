import 'package:flutter/material.dart';
import 'package:study_abroad/core/theme.dart';
import 'package:study_abroad/core/utils/responsive.dart';
import 'package:study_abroad/widgets/responsive_hero_image.dart';
import 'package:study_abroad/widgets/service_hero_card.dart';
import 'package:study_abroad/widgets/service_feature_grid.dart';
import 'package:study_abroad/widgets/service_faq_section.dart';
import 'package:study_abroad/widgets/book_counselling_sheet.dart';

class LinkedinOptimizationScreen extends StatelessWidget {
  const LinkedinOptimizationScreen({super.key});

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
                title: 'ARCHITECT YOUR ',
                highlightTitle: 'LINKEDIN PRESENCE',
                tag: 'PROFESSIONAL IDENTITY PROTOCOL',
                subtitle: '"Transition your digital persona from a static resume to a high-influence professional ecosystem designed for Tier-1 opportunities."',
                ctaText: 'BEGIN OPTIMIZATION',
                onCtaPressed: () => showBookCounsellingSheet(context),
              ),
            ),
            
            Padding(
              padding: EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    width: double.infinity,
                    height: MediaQuery.sizeOf(context).height * 0.3,
                    child: Stack(
                      children: [
                        const Positioned.fill(
                          child: ResponsiveHeroImage(
                            imagePath: 'assets/images/linkedin-hero.png',
                            aspectRatio: null,
                          ),
                        ),
                        Positioned.fill(
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(32),
                              gradient: LinearGradient(
                                begin: Alignment.bottomCenter,
                                end: Alignment.topCenter,
                                colors: [
                                  AppTheme.darkBrown.withValues(alpha: 0.6),
                                  Colors.transparent,
                                ],
                              ),
                            ),
                            padding: EdgeInsets.all(AppSpacing.md),
                            alignment: Alignment.bottomLeft,
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                              ),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.shield_outlined, color: AppTheme.gold, size: 20),
                                      const SizedBox(width: 8),
                                      Text(
                                        'ELITE AUDIT NODE',
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white.withValues(alpha: 0.9),
                                          letterSpacing: 2,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    '"Your LinkedIn is your 24/7 recruiter. We make it speak the language of success."',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.white,
                                      fontStyle: FontStyle.italic,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  const Text(
                    'THE VISION',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.gold,
                      letterSpacing: 4,
                    ),
                  ),
                  const SizedBox(height: 8),
                  RichText(
                    text: const TextSpan(
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.darkBrown,
                        height: 1.1,
                      ),
                      children: [
                        TextSpan(text: 'Strategic\n'),
                        TextSpan(
                          text: 'Personal Branding',
                          style: TextStyle(color: AppTheme.gold),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Our LinkedIn Profile Boosting service is a clinical transformation of your professional narrative. We don\'t just "fix" sections; we architect a coherent ecosystem that resonates with hiring committees and high-level recruiters.',
                    style: TextStyle(fontSize: 16, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'From keyword optimization for search algorithms to merit-based positioning in your summary, we ensure your profile reflects the caliber of institution you are applying to.',
                    style: TextStyle(fontSize: 16, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                  ),
                ],
              ),
            ),
            
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
              child: ServiceFeatureGrid(
                overline: 'PROFILE FEATURES',
                title1: 'The LinkedIn',
                title2: 'Ecosystem',
                features: const [
                  ServiceFeatureItem(
                    title: 'Visual Identity',
                    desc: 'Premium profile picture selection and bespoke background cover architecting.',
                    icon: Icons.image_outlined,
                  ),
                  ServiceFeatureItem(
                    title: 'Narrative Strategy',
                    desc: 'Crafting the perfect headline and executive summary for high-end resonance.',
                    icon: Icons.edit_outlined,
                  ),
                  ServiceFeatureItem(
                    title: 'Experience Optimization',
                    desc: 'In-depth positioning of career milestones, internships, and leadership roles.',
                    icon: Icons.trending_up,
                  ),
                  ServiceFeatureItem(
                    title: 'Skills Analytics',
                    desc: 'Clinical selection of skills and strategic endorsements node setup.',
                    icon: Icons.analytics_outlined,
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            const ServiceFaqSection(
              faqs: [
                ServiceFaq(
                  question: 'Do admission committees check LinkedIn?',
                  answer: 'Absolutely. It is the most accessible professional touchpoint to verify your background and gauge your online persona.',
                ),
                ServiceFaq(
                  question: 'How does optimization help with jobs?',
                  answer: 'Recruiters use LinkedIn Recruiter tools that search for specific keywords. Without them, your profile will never appear in their search results.',
                ),
                ServiceFaq(
                  question: 'Will you create content for me?',
                  answer: 'While we set up your profile and narrative strategy, ongoing content creation (posting) is something you will execute based on our advice.',
                ),
                ServiceFaq(
                  question: 'Do I need LinkedIn Premium?',
                  answer: 'No, optimization works universally on free accounts, though Premium offers additional analytics features.',
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
