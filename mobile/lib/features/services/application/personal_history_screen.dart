import 'package:flutter/material.dart';
import 'package:study_abroad/core/theme.dart';
import 'package:study_abroad/core/utils/responsive.dart';
import 'package:study_abroad/widgets/responsive_hero_image.dart';
import 'package:study_abroad/widgets/service_hero_card.dart';
import 'package:study_abroad/widgets/service_faq_section.dart';
import 'package:study_abroad/widgets/book_counselling_sheet.dart';

class PersonalHistoryScreen extends StatelessWidget {
  const PersonalHistoryScreen({super.key});

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
                title: 'PERSONAL HISTORY ',
                highlightTitle: 'STATEMENT',
                tag: 'SERVICE',
                subtitle: 'The Personal History Statement (also known as a Diversity Statement) reflects your ability to connect the barriers you have overcome in the past to your current interest in the program.',
                ctaText: 'BEGIN NARRATIVE CONSULT',
                onCtaPressed: () => showBookCounsellingSheet(context),
              ),
            ),
            
            Padding(
              padding: EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'THE DIVERSITY ADVANTAGE',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.gold,
                      letterSpacing: 3,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'About This Service',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.darkBrown,
                      height: 1.1,
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'While a lot of universities are not interested in knowing about your past, a few prestigious institutions like The University of California specifically require a Personal History Statement. Our main aim is to help you stand out by crafting a story that is unique to you and your profile.',
                    style: TextStyle(fontSize: 16, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'It is important to focus on the social, economic, familial, financial and cultural barriers that you faced during your life. We help highlight your ability to overcome challenges and turn them into strengths.',
                    style: TextStyle(fontSize: 16, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: EdgeInsets.all(AppSpacing.lg),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBrown,
                      borderRadius: BorderRadius.circular(24),
                      border: const Border(left: BorderSide(color: AppTheme.gold, width: 8)),
                    ),
                    child: const Text(
                      '"This draft, when done right, has proved to be one of the biggest game-changers, both in fetching admits and securing significant funding."',
                      style: TextStyle(
                        fontSize: 20,
                        fontStyle: FontStyle.italic,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  Container(
                    padding: EdgeInsets.all(AppSpacing.lg),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.1)),
                      borderRadius: BorderRadius.circular(32),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.05),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'CLINICAL PROTOCOL',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.gold,
                            letterSpacing: 2,
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Our narrative experts audit your diversity markers to ensure every challenge is framed as an institutional value.',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: AppTheme.textMuted,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  const ServiceFaqSection(
                    faqs: [
                      ServiceFaq(
                        question: 'What is a Personal History Statement?',
                        answer: 'A Personal History Statement (or Diversity Statement) explains how your background, challenges, and experiences shape your perspective and academic goals.',
                      ),
                      ServiceFaq(
                        question: 'How is it different from a Statement of Purpose?',
                        answer: 'While an SOP focuses on your academic and professional goals, a Personal History Statement focuses on your personal background, barriers overcome, and commitment to diversity.',
                      ),
                      ServiceFaq(
                        question: 'Do all universities require this?',
                        answer: 'No, but many top institutions (like the UC system) require or highly encourage it to understand the diverse perspectives you will bring to their cohort.',
                      ),
                      ServiceFaq(
                        question: 'Can you help me identify what to write about?',
                        answer: 'Yes, our narrative experts will help you identify the most impactful social, economic, or cultural experiences to highlight in your statement.',
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
