import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../widgets/book_counselling_sheet.dart';

class RateMyChancesScreen extends StatelessWidget {
  const RateMyChancesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverAppBar(
            pinned: true,
            backgroundColor: AppTheme.background,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: AppTheme.textPrimary),
              onPressed: () => context.canPop() ? context.pop() : context.go('/universities'),
            ),
            title: const Text(
              'RATEMYCHANCES',
              style: TextStyle(
                color: AppTheme.gold,
                fontSize: 14,
                fontWeight: FontWeight.w900,
                letterSpacing: 3,
                fontFamily: 'Cormorant Garamond',
              ),
            ),
          ),
          
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Text(
                    'Elite',
                    style: TextStyle(fontFamily: 'Cormorant Garamond', fontSize: 32, fontWeight: FontWeight.w300, color: AppTheme.textPrimary),
                  ),
                  const Text(
                    'Evaluations',
                    style: TextStyle(fontFamily: 'Cormorant Garamond', fontSize: 48, fontWeight: FontWeight.w900, height: 0.9, color: AppTheme.gold),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'POWERED BY INTERNATIONAL EDULEADER COUNCIL',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 2, color: AppTheme.textSecondary),
                  ),
                  
                  const SizedBox(height: 48),
                  
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.02),
                          blurRadius: 30,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: const Text(
                      "Rate My Chances evaluates GPA, research, work experience, GRE/GMAT scores, and acceptance rates, providing accurate admission probabilities and profile improvement guidance.",
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.8),
                    ),
                  ).animate().fadeIn(duration: 800.ms).slideY(begin: 0.2, end: 0),
                  
                  const SizedBox(height: 64),
                  
                  const Text(
                    'WHY GO PREMIUM?',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppTheme.textPrimary),
                  ),
                  const SizedBox(height: 8),
                  Container(height: 3, width: 40, color: AppTheme.gold),
                  
                  const SizedBox(height: 40),
                  
                  _premiumGrid(),
                  
                  const SizedBox(height: 120),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.fromLTRB(24, 0, 24, 40),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppTheme.background.withOpacity(0),
              AppTheme.background,
            ],
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: () => context.push('/universities/unipredict/calculator'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.darkBrown,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('START EVALUATION', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                    SizedBox(width: 8),
                    Icon(LucideIcons.sparkles, size: 16),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: OutlinedButton(
                onPressed: () => showBookCounsellingSheet(context),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppTheme.gold),
                  foregroundColor: AppTheme.gold,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: const Text('TALK TO AN EXPERT', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _premiumGrid() {
    final features = [
      {'icon': LucideIcons.calculator, 'title': 'Rate Your Chances', 'desc': 'Advanced algorithms find your ideal university!'},
      {'icon': LucideIcons.checkCircle2, 'title': 'Profile Check', 'desc': 'In-depth analysis for the complete picture!'},
      {'icon': LucideIcons.fileText, 'title': 'Improvements', 'desc': 'Expert-level profile-building guidance.'},
      {'icon': LucideIcons.clock, 'title': 'Quick Feedback', 'desc': 'Instant feedback and rapid results.'},
      {'icon': LucideIcons.globe, 'title': '24/7 Access', 'desc': 'Access your dashboard anywhere, anytime.'},
      {'icon': LucideIcons.trendingUp, 'title': 'Math Modelling', 'desc': 'Complex systems distilled into results.'},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 32,
        childAspectRatio: 0.85,
      ),
      itemCount: features.length,
      itemBuilder: (context, index) {
        final f = features[index];
        return Column(
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
              ),
              child: Icon(f['icon'] as IconData, color: AppTheme.gold, size: 24),
            ),
            const SizedBox(height: 16),
            Text(
              f['title'] as String,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: AppTheme.textPrimary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              f['desc'] as String,
              style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary, height: 1.4),
              textAlign: TextAlign.center,
            ),
          ],
        );
      },
    );
  }
}
