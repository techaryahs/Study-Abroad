import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class UniPredictScreen extends StatelessWidget {
  const UniPredictScreen({super.key});

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
              icon: const Icon(LucideIcons.arrowLeft, color: AppTheme.textPrimary),
              onPressed: () => context.pop(),
            ),
            title: Row(
              children: [
                Container(width: 20, height: 2, color: AppTheme.gold),
                const SizedBox(width: 8),
                const Text(
                  'THE EXPERT ALGORITHM',
                  style: TextStyle(
                    color: AppTheme.gold,
                    fontSize: 9,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2,
                  ),
                ),
              ],
            ),
          ),
          
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'UniPredict By',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.textPrimary,
                      height: 1,
                    ),
                  ),
                  ShaderMask(
                    shaderCallback: (bounds) => const LinearGradient(
                      colors: [AppTheme.gold, Color(0xFFE6D5B8), AppTheme.gold],
                    ).createShader(bounds),
                    child: const Text(
                      'GCC',
                      style: TextStyle(
                        fontSize: 64,
                        fontWeight: FontWeight.w900,
                        fontStyle: FontStyle.italic,
                        color: Colors.white,
                        height: 0.9,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.gold.withOpacity(0.05),
                          blurRadius: 30,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: const Text(
                      "We've spent years perfecting an algorithm that helps match you with the right universities—based on the same expertise we offer in our luxury services. While many students waste thousands on applications, we give you expert guidance for free.",
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.textSecondary,
                        height: 1.6,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ).animate().fadeIn(duration: 600.ms).scale(begin: const Offset(0.9, 0.9)),
                  
                  const SizedBox(height: 48),
                  
                  const Text(
                    'DISCOVER YOUR MATCHES',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.textPrimary,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Our proprietary algorithm analyzes your academic background to predict success.',
                    style: TextStyle(fontSize: 14, color: AppTheme.textSecondary),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  _featureItem(LucideIcons.sparkles, "Data-driven accuracy spanning 10 years of admits."),
                  _featureItem(LucideIcons.barChart3, "Detailed breakdown of safe, reach, and dream targets."),
                  _featureItem(LucideIcons.globe, "Global coverage: USA, UK, Europe, Australia & Canada."),
                  
                  const SizedBox(height: 100),
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
        child: SizedBox(
          width: double.infinity,
          height: 64,
          child: ElevatedButton(
            onPressed: () => context.push('/universities/unipredict/calculator'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.gold,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              elevation: 0,
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('START ANALYSIS', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, letterSpacing: 2)),
                SizedBox(width: 8),
                Icon(LucideIcons.chevronRight, size: 18),
              ],
            ),
          ),
        ).animate().slideY(begin: 1, end: 0, duration: 400.ms),
      ),
    );
  }

  Widget _featureItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
            ),
            child: Icon(icon, color: AppTheme.gold, size: 18),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w900,
                color: AppTheme.textSecondary,
                letterSpacing: 0.5,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
