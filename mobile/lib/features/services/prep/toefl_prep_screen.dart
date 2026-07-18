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

class ToeflPrepScreen extends StatelessWidget {
  const ToeflPrepScreen({super.key});

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
                highlightTitle: 'TOEFL COACHING',
                tag: 'LINGUISTIC EXCELLENCE PROTOCOL',
                subtitle: '"Gateways to financial aid and assistantships open for those who master the 110+ threshold. Learn from a 119/120 mentor."',
                ctaText: 'BEGIN COACHING',
                onCtaPressed: () => showBookCounsellingSheet(context),
              ),
            ),
            
            Padding(
              padding: EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const MentorBenchmarkCard(
                    title: 'Benchmark Scorecard',
                    hasPulse: true,
                    scoreLabel: 'Mentor Score',
                    score: '119',
                    maxScore: '120',
                    scores: [
                      BenchmarkScore(label: 'Reading', value: '29/30'),
                      BenchmarkScore(label: 'Listening', value: '30/30'),
                      BenchmarkScore(label: 'Speaking', value: '30/30'),
                      BenchmarkScore(label: 'Writing', value: '30/30'),
                    ],
                    insightTitle: 'Strategy Insight',
                    insightText: '"We target high-yield weaknesses through surgical mock evaluation, ensuring 110+ result within 15 days of prep."',
                  ),
                  
                  const SizedBox(height: 40),
                ],
              ),
            ),
            
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: ServiceFeatureGrid(
                overline: 'METHODOLOGY',
                title1: 'Precision',
                title2: 'Prep-Architecture',
                features: const [
                  ServiceFeatureItem(
                    title: 'Rapid Calibration',
                    desc: 'Evaluate your status and deploy a custom 2-to-15 day high-intensity roadmap.',
                    icon: Icons.track_changes,
                  ),
                  ServiceFeatureItem(
                    title: 'Material Intelligence',
                    desc: 'Access the most optimal resources tailored to your specific friction points.',
                    icon: Icons.menu_book_outlined,
                  ),
                  ServiceFeatureItem(
                    title: 'Avoid Ramifications',
                    desc: 'Ensure entry into top-tier programs without the burden of remedial English courses.',
                    icon: Icons.shield_outlined,
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            const ServiceWorkflowSection(
              overline: 'THE WORKFLOW',
              title1: 'Pathway to',
              title2: '110+ Benchmarking',
              steps: [
                WorkflowStep(
                  title: 'Mock Evaluation',
                  description: 'Begin with a comprehensive mock test to establish your baseline protocol.',
                ),
                WorkflowStep(
                  title: 'Deep-Dive Audit',
                  description: 'A precision call with screen share to evaluate specific linguistic friction points.',
                ),
                WorkflowStep(
                  title: 'Dynamic Architecture',
                  description: 'Deployment of a bespoke preparation plan or focused coaching sessions.',
                ),
              ],
            ),
            
            const SizedBox(height: 24),
            
            const ServiceFaqSection(
              faqs: [
                ServiceFaq(
                  question: 'Why aim for 110+?',
                  answer: 'Top-tier universities often use 110 as a cutoff for elite fellowships and Teaching Assistantships.',
                ),
                ServiceFaq(
                  question: 'Can I achieve 110+ in 15 days?',
                  answer: 'Yes, if your baseline English is proficient, 15 days of strategic, targeted prep is usually enough.',
                ),
                ServiceFaq(
                  question: 'What is the most difficult section?',
                  answer: 'Speaking is typically where students lose the most points due to lack of template utilization.',
                ),
                ServiceFaq(
                  question: 'Do you provide templates?',
                  answer: 'Absolutely. We provide battle-tested templates for both Speaking and Writing sections.',
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
