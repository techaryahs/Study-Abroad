import 'package:flutter/material.dart';
import 'package:study_abroad/core/theme.dart';
import 'package:study_abroad/core/utils/responsive.dart';
import 'package:study_abroad/widgets/responsive_hero_image.dart';
import 'package:study_abroad/widgets/service_hero_card.dart';
import 'package:study_abroad/widgets/service_feature_grid.dart';
import 'package:study_abroad/widgets/service_faq_section.dart';
import 'package:study_abroad/widgets/book_counselling_sheet.dart';
import 'package:study_abroad/widgets/service_workflow_section.dart';

class CoverLetterScreen extends StatelessWidget {
  const CoverLetterScreen({super.key});

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
                highlightTitle: 'COVER LETTER',
                tag: 'STRATEGIC CAREER BRIEFING',
                subtitle: '"Beyond a summary—your cover letter is a strategic asset designed to bridge your experience with institutional vision."',
                ctaText: 'BEGIN DRAFTING SESSION',
                onCtaPressed: () => showBookCounsellingSheet(context),
              ),
            ),
            
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
              child: Container(
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
                        const Icon(Icons.description_outlined, color: AppTheme.gold, size: 28),
                        const SizedBox(width: 16),
                        const Expanded(
                          child: Text(
                            'Drafting Laboratory',
                            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.darkBrown),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Container(
                      padding: EdgeInsets.all(AppSpacing.md),
                      decoration: BoxDecoration(
                        color: AppTheme.darkBrown,
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'THE FOCAL POINT',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: Colors.white.withValues(alpha: 0.6),
                              letterSpacing: 2,
                            ),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            '"We spotlight why you are the perfect fit, transforming a standard application into a narrative of inevitability."',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white,
                              fontStyle: FontStyle.italic,
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'VERIFIED AUTHENTICITY',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.gold, letterSpacing: 2),
                        ),
                        const Text(
                          'PLAGIARISM-FREE',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.gold, letterSpacing: 2),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: ServiceFeatureGrid(
                overline: 'SERVICE ARCHITECTURE',
                title1: 'Elite Drafting',
                title2: 'Protocol',
                features: const [
                  ServiceFeatureItem(
                    title: 'Compelling Intro',
                    desc: 'Crafting a high-impact opening that hooks the recruiter instantly.',
                    icon: Icons.check_circle_outline,
                  ),
                  ServiceFeatureItem(
                    title: 'Personalized Narrative',
                    desc: 'Bespoke description of your unique interest and value proposition.',
                    icon: Icons.check_circle_outline,
                  ),
                  ServiceFeatureItem(
                    title: 'Skill Alignment',
                    desc: 'Strategic mapping of top-tier skills relevant to the specific position.',
                    icon: Icons.check_circle_outline,
                  ),
                  ServiceFeatureItem(
                    title: 'Strategic Context',
                    desc: 'Expert explanation of industry switches or career pivots if required.',
                    icon: Icons.check_circle_outline,
                  ),
                  ServiceFeatureItem(
                    title: 'Goal Synchronization',
                    desc: 'Aligning your professional trajectory with organizational visions.',
                    icon: Icons.check_circle_outline,
                  ),
                  ServiceFeatureItem(
                    title: 'Elite Call to Action',
                    desc: 'Professional closing designed to prompt immediate interview response.',
                    icon: Icons.check_circle_outline,
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            const ServiceWorkflowSection(
              overline: 'THE WORKFLOW',
              title1: 'From Input to',
              title2: 'Excellence',
              steps: [
                WorkflowStep(
                  title: 'Strategic Inputs',
                  description: 'Submit your core experiences via our proprietary intelligence form.',
                ),
                WorkflowStep(
                  title: 'Base Architecture',
                  description: 'We craft a foundational draft written from scratch for your primary target role.',
                ),
                WorkflowStep(
                  title: 'Niche Calibration',
                  description: 'Optionally customize your draft for specific secondary job opportunities.',
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            const ServiceFaqSection(
              faqs: [
                ServiceFaq(
                  question: 'Does anyone actually read cover letters anymore?',
                  answer: 'Yes. While ATS systems screen resumes, hiring managers and committees read cover letters to decide between top candidates.',
                ),
                ServiceFaq(
                  question: 'Will this pass AI detectors?',
                  answer: 'Yes. Every cover letter is written from scratch by human consultants and verified through advanced plagiarism software.',
                ),
                ServiceFaq(
                  question: 'Can I use one cover letter for multiple jobs?',
                  answer: 'No. The base architecture can remain the same, but the Niche Calibration step ensures each letter is targeted to the specific role.',
                ),
                ServiceFaq(
                  question: 'What if I am changing industries?',
                  answer: 'That is exactly why you need a cover letter. It provides the Strategic Context to explain your pivot which a resume cannot.',
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
