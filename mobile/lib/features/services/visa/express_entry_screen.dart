import 'package:flutter/material.dart';
import 'package:study_abroad/core/theme.dart';
import 'package:study_abroad/core/utils/responsive.dart';
import 'package:study_abroad/widgets/responsive_hero_image.dart';
import 'package:study_abroad/widgets/service_hero_card.dart';
import 'package:study_abroad/widgets/service_feature_grid.dart';
import 'package:study_abroad/widgets/book_counselling_sheet.dart';
import 'package:study_abroad/widgets/service_workflow_section.dart';

class ExpressEntryScreen extends StatelessWidget {
  const ExpressEntryScreen({super.key});

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
                title: 'CANADA ',
                highlightTitle: 'EXPRESS ENTRY',
                tag: 'CANADA IMMIGRATION PROTOCOL',
                subtitle: '"The world\'s most efficient point-based migration system. We decode the CRS matrix to secure your ITA."',
                ctaText: 'START ASSESSMENT',
                onCtaPressed: () => showBookCounsellingSheet(context),
              ),
            ),
            
            Padding(
              padding: EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: double.infinity,
                    height: MediaQuery.sizeOf(context).height * 0.3,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(32),
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.15)),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.gold.withValues(alpha: 0.05),
                          blurRadius: 40,
                          offset: const Offset(0, 20),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        Positioned.fill(
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(32),
                            child: Image.asset(
                              'assets/images/Express-Entry.jpg',
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Image.asset(
                                  'assets/images/universityy.png',
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) => Container(
                                    color: AppTheme.darkBrown.withValues(alpha: 0.1),
                                    child: const Icon(
                                      Icons.image_not_supported_outlined,
                                      color: Colors.white54,
                                      size: 48,
                                    ),
                                  ),
                                );
                              },
                            ),
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
                                  AppTheme.darkBrown.withValues(alpha: 0.7),
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
                                      const Icon(Icons.public, color: AppTheme.gold, size: 20),
                                      const SizedBox(width: 8),
                                      Text(
                                        'FEDERAL SKILLED WORKER PROGRAM',
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white.withValues(alpha: 0.9),
                                          letterSpacing: 2,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    '"Navigating the IRCC thresholds with surgical precision."',
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
                    'STRATEGIC MATRIX',
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
                        TextSpan(text: 'What is\n'),
                        TextSpan(
                          text: 'Express Entry?',
                          style: TextStyle(color: AppTheme.gold),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Express Entry is the primary system used by the Canadian government to manage applications for permanent residence for skilled workers. It is not an immigration program itself, but an online system to manage the Federal Skilled Worker, Federal Skilled Trades, and Canadian Experience Class.',
                    style: TextStyle(fontSize: 16, color: AppTheme.textMuted, fontWeight: FontWeight.w500, height: 1.5),
                  ),
                ],
              ),
            ),
            
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
              child: ServiceFeatureGrid(
                overline: 'PROGRAM BENEFITS',
                title1: 'The Canadian',
                title2: 'Advantage',
                features: const [
                  ServiceFeatureItem(
                    title: 'No Job Offer Needed',
                    desc: 'You can apply and be invited without a valid Canadian job offer.',
                    icon: Icons.work_outline,
                  ),
                  ServiceFeatureItem(
                    title: 'Fast-Track Processing',
                    desc: 'Typically processed within 6 months after the official invitation.',
                    icon: Icons.speed,
                  ),
                  ServiceFeatureItem(
                    title: 'Point-Based Selection',
                    desc: 'Selection based on CRS scores — age, education, and language skills.',
                    icon: Icons.checklist,
                  ),
                  ServiceFeatureItem(
                    title: 'Permanent Residency',
                    desc: 'Direct pathway to Canada PR for you and your family.',
                    icon: Icons.home_outlined,
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            const ServiceWorkflowSection(
              overline: 'DEPLOYMENT SEQUENCE',
              title1: 'Application',
              title2: 'Timeline',
              steps: [
                WorkflowStep(
                  title: 'Credential Assessment',
                  description: '(1-2 Months) ECA reports for your education from WES or other designated bodies.',
                ),
                WorkflowStep(
                  title: 'Language Proficiency',
                  description: '(1 Month) Achieving CLB 9 or higher in IELTS/CELPIP for maximum CRS points.',
                ),
                WorkflowStep(
                  title: 'Profile Creation',
                  description: '(Immediate) Entering the Express Entry pool with your calculated CRS score.',
                ),
                WorkflowStep(
                  title: 'ITA & Submission',
                  description: '(6 Months) Receiving Invitation to Apply and submitting final e-APR docs.',
                ),
              ],
            ),
            
            const SizedBox(height: 40),
            
            Padding(
              padding: EdgeInsets.all(AppSpacing.md),
              child: Container(
                width: double.infinity,
                padding: EdgeInsets.all(AppSpacing.md),
                decoration: BoxDecoration(
                  color: AppTheme.darkBrown,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.scale, color: AppTheme.gold, size: 24),
                        const SizedBox(width: 12),
                        Text(
                          'CRS OPTIMIZATION',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.white.withValues(alpha: 0.9),
                            letterSpacing: 2,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      '"A difference of 10 points can mean 10,000 ranks in the Express Entry pool. We ensure every possible point is calculated."',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white,
                        fontStyle: FontStyle.italic,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 40),
          ],
        ),
            ),
          ),
        ),
      );
  }
}
