import 'package:flutter/material.dart';
import 'package:study_abroad/core/theme.dart';
import 'package:study_abroad/core/utils/responsive.dart';
import 'package:study_abroad/widgets/responsive_hero_image.dart';
import 'package:study_abroad/widgets/service_hero_card.dart';
import 'package:study_abroad/widgets/service_feature_grid.dart';
import 'package:study_abroad/widgets/service_faq_section.dart';
import 'package:study_abroad/widgets/book_counselling_sheet.dart';

class ApplicationReviewScreen extends StatelessWidget {
  const ApplicationReviewScreen({super.key});

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
                title: 'APPLICATION REVIEW ',
                highlightTitle: 'PROTOCOL',
                tag: 'SERVICE',
                subtitle: '"Leverage years of consulting expertise to elevate every document that defines your application journey."',
                ctaText: 'BEGIN EXPERT AUDIT',
                onCtaPressed: () => showBookCounsellingSheet(context),
              ),
            ),
            
            Padding(
              padding: EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Hero badges (Unlimited Edits, Portal Audit, Expert Logic)
                  Wrap(
                    spacing: 16,
                    runSpacing: 16,
                    children: [
                      _buildBadge('UNLIMITED EDITS'),
                      _buildBadge('PORTAL AUDIT'),
                      _buildBadge('EXPERT LOGIC'),
                    ],
                  ),
                  
                  const SizedBox(height: 40),
                  
                  const Text(
                    'THE EXPERT LENS',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.gold,
                      letterSpacing: 3,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'About the Review Service',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.darkBrown,
                      height: 1.1,
                    ),
                  ),
                  const SizedBox(height: 24),
                  RichText(
                    text: const TextSpan(
                      style: TextStyle(fontSize: 16, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                      children: [
                        TextSpan(text: 'While most choose our drafting service, this review protocol is designed for those who have ready material but seek '),
                        TextSpan(text: 'decisive validation', style: TextStyle(color: AppTheme.darkBrown, fontWeight: FontWeight.bold)),
                        TextSpan(text: ' from industry experts. We evaluate your profile, shortlist optimal universities, and provide unlimited feedback on your narratives.'),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  ServiceFeatureGrid(
                    overline: 'AUDIT FRAMEWORK',
                    title1: 'Comprehensive',
                    title2: 'Review',
                    features: [
                      ServiceFeatureItem(
                        title: 'Profile Evaluation',
                        desc: 'Expert assessment of your academic and professional standing.',
                        icon: Icons.search,
                      ),
                      ServiceFeatureItem(
                        title: 'SOP & LOR Audit',
                        desc: 'Unlimited reviews for your Statement of Purpose and Letters of Rec.',
                        icon: Icons.description_outlined,
                      ),
                      ServiceFeatureItem(
                        title: 'Uni Shortlisting',
                        desc: 'Identification of ambitious, target, and safe universities.',
                        icon: Icons.emoji_events_outlined,
                      ),
                      ServiceFeatureItem(
                        title: 'Portal Review',
                        desc: 'Consistency check for your final university application portals.',
                        icon: Icons.menu_book_outlined,
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 40),
                  
                  // Decisive Audit Sidebar Box
                  Container(
                    padding: EdgeInsets.all(AppSpacing.lg),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBrown,
                      borderRadius: BorderRadius.circular(32),
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.gold.withValues(alpha: 0.1),
                          blurRadius: 30,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'DECISIVE AUDIT',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.gold,
                            letterSpacing: 2,
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          '"We identify the consistent factors that lead to rejections and rectify them before you hit submit."',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            fontStyle: FontStyle.italic,
                            color: Colors.white70,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 24),
                        Container(
                          padding: const EdgeInsets.only(top: 24),
                          decoration: BoxDecoration(
                            border: Border(top: BorderSide(color: Colors.white.withValues(alpha: 0.1))),
                          ),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.shield_outlined, color: AppTheme.gold, size: 32),
                              SizedBox(width: 16),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'EXPERT BOARD',
                                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 2),
                                  ),
                                  Text(
                                    'DECISIVE REVIEWS',
                                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.gold, letterSpacing: 2),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  const ServiceFaqSection(
                    faqs: [
                      ServiceFaq(
                        question: 'What is included in the Application Review Service?',
                        answer: 'It includes profile evaluation, unlimited SOP & LOR reviews, university shortlisting, and a final portal consistency check before you submit.',
                      ),
                      ServiceFaq(
                        question: 'How is this different from the Complete Application Help?',
                        answer: 'The review service is for applicants who have already drafted their documents and need expert validation and refinement, rather than end-to-end drafting from scratch.',
                      ),
                      ServiceFaq(
                        question: 'How many universities will you help shortlist?',
                        answer: 'We typically help you categorize your choices into ambitious, target, and safe categories based on your finalized profile.',
                      ),
                      ServiceFaq(
                        question: 'Is there a limit on document revisions?',
                        answer: 'No, we offer unlimited reviews on your SOP and LORs until they meet our high institutional standards.',
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

  Widget _buildBadge(String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 20,
          height: 20,
          decoration: BoxDecoration(
            color: AppTheme.gold.withValues(alpha: 0.2),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.check_circle_outline, color: AppTheme.gold, size: 12),
        ),
        const SizedBox(width: 8),
        Text(
          text,
          style: const TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: AppTheme.textMuted,
            letterSpacing: 2,
          ),
        ),
      ],
    );
  }
}
