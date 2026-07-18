import 'package:flutter/material.dart';
import 'package:study_abroad/core/theme.dart';
import 'package:study_abroad/core/utils/responsive.dart';
import 'package:study_abroad/widgets/responsive_hero_image.dart';
import 'package:study_abroad/widgets/service_hero_card.dart';
import 'package:study_abroad/widgets/service_feature_grid.dart';
import 'package:study_abroad/widgets/service_faq_section.dart';
import 'package:study_abroad/widgets/book_counselling_sheet.dart';
import 'package:study_abroad/widgets/mentor_benchmark_card.dart';
import 'package:study_abroad/widgets/service_workflow_section.dart';

class GrePrepScreen extends StatelessWidget {
  const GrePrepScreen({super.key});

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
                title: 'BESPOKE ',
                highlightTitle: 'GRE PREP-PLAN',
                tag: 'QUANTITATIVE & VERBAL MASTERY',
                subtitle: '"The secret to a 330+ score is NOT hard work; it\'s clinical strategy. Join the ranks of thousands who decoded the GRE with us."',
                ctaText: 'BEGIN COACHING AUDIT',
                onCtaPressed: () => showBookCounsellingSheet(context),
              ),
            ),
            
            Padding(
              padding: EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const MentorBenchmarkCard(
                    title: 'Mentor Benchmark',
                    subtitle: 'Global Top 1%',
                    scoreLabel: 'Certified Score',
                    score: '329',
                    maxScore: '340',
                    scores: [
                      BenchmarkScore(label: 'Verbal', value: '161'),
                      BenchmarkScore(label: 'Quant', value: '168'),
                      BenchmarkScore(label: 'AWA', value: '4.5'),
                    ],
                    checklistItems: [
                      'Personalized Day-by-Day Schedule',
                      'High-Yield Material Curation',
                      'Weakness-Mapping Protocol',
                      'One-on-One Performance Review',
                    ],
                  ),
                  
                  const SizedBox(height: 40),
                  
                  const Text(
                    'THE INTELLIGENCE BEHIND THE SCORE',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.gold,
                      letterSpacing: 3,
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
                        TextSpan(text: 'Breaking the\n'),
                        TextSpan(
                          text: 'GRE Score Plateau',
                          style: TextStyle(color: AppTheme.gold),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Struggling to cross the 325 threshold? Most students hit a plateau because they follow generic schedules. I decoded the exam with a 329 score and have spent years helping others achieve consistent top-tier results.',
                    style: TextStyle(fontSize: 16, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'During our clinical session, we don\'t just \'study\'; we audit your cognitive approach to problem-solving. We build your personalized preparation architecture right in front of you.',
                    style: TextStyle(fontSize: 16, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                  ),
                ],
              ),
            ),
            
            const ServiceWorkflowSection(
              overline: 'PROCESS OVERVIEW',
              title1: 'Strategic',
              title2: 'Execution',
              steps: [
                WorkflowStep(
                  title: 'Live Screen Share',
                  description: 'Interactive Zoom sessions to evaluate your mock test performance in real-time.',
                ),
                WorkflowStep(
                  title: 'Dynamic Scheduling',
                  description: 'Generation of a day-by-day task protocol customized for your weaker areas.',
                ),
              ],
            ),
            
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
              child: ServiceFeatureGrid(
                overline: 'OPTIMIZATION PILLARS',
                title1: 'The GRE Clinical',
                title2: 'Protocol',
                features: const [
                  ServiceFeatureItem(
                    title: 'Mock Evaluation',
                    desc: 'Diagnostic audit of your current verbal and quantitative proficiency markers.',
                    icon: Icons.search,
                  ),
                  ServiceFeatureItem(
                    title: 'Material Intelligence',
                    desc: 'Curation of high-yield resources specifically selected for your weaknesses.',
                    icon: Icons.menu_book_outlined,
                  ),
                  ServiceFeatureItem(
                    title: 'Strategic Roadmap',
                    desc: 'Creation of a day-by-day protocol to maximize score in minimum time.',
                    icon: Icons.calendar_today,
                  ),
                  ServiceFeatureItem(
                    title: 'Tactical Execution',
                    desc: 'One-on-one deep dives into specific question logic and timing strategy.',
                    icon: Icons.track_changes,
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            const ServiceFaqSection(
              faqs: [
                ServiceFaq(
                  question: 'How long does it take to prepare for the GRE?',
                  answer: 'Preparation time varies depending on your baseline score and target. Most students need 2-3 months of focused preparation.',
                ),
                ServiceFaq(
                  question: 'Do you provide study materials?',
                  answer: 'Yes, we curate high-yield resources tailored to your specific weaknesses and targets.',
                ),
                ServiceFaq(
                  question: 'Is a 330+ score guaranteed?',
                  answer: 'While we provide the optimal strategy and resources, your final score depends on your execution of the day-by-day protocol.',
                ),
                ServiceFaq(
                  question: 'How are the sessions conducted?',
                  answer: 'Sessions are conducted via 1-on-1 Zoom calls with live screen sharing to diagnose your problem-solving approaches.',
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
