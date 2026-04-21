import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class AiServicesScreen extends StatelessWidget {
  const AiServicesScreen({super.key});

  final List<Map<String, dynamic>> _tools = const [
    {
      'id': 'mock-interview',
      'title': 'US Visa Mock Interview AI',
      'icon': Icons.videocam_rounded,
      'description': 'Practice your visa interview with our AI interviewer.',
    },
    {
      'id': 'plagiarism-remover',
      'title': 'AI & Plagiarism Remover Tool',
      'icon': Icons.auto_fix_high_rounded,
      'description': 'Clean and humanize AI-generated content instantly.',
    },
    {
      'id': 'sop-generator',
      'title': 'AI SOP Generator',
      'icon': Icons.edit_note_rounded,
      'description': 'Generate a personalized Statement of Purpose in minutes.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: const Text('AI SERVICES', 
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, letterSpacing: 2, color: AppTheme.textPrimary, fontFamily: 'Playfair Display')),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: AppTheme.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // HERO SECTION
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                   Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(100),
                      border: Border.all(color: AppTheme.gold.withOpacity(0.25)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(width: 6, height: 6, decoration: const BoxDecoration(color: AppTheme.gold, shape: BoxShape.circle)),
                        const SizedBox(width: 8),
                        const Text('AI RESEARCH PROTOCOLS', 
                            style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: AppTheme.gold, letterSpacing: 1.5)),
                      ],
                    ),
                  ).animate().fadeIn(duration: 500.ms),
                  const SizedBox(height: 16),
                  const Text('AI-FORGED\nFUTURE', 
                      style: TextStyle(fontSize: 42, fontWeight: FontWeight.w900, height: 1.0, color: AppTheme.textPrimary, fontFamily: 'Playfair Display', fontStyle: FontStyle.italic)),
                  const SizedBox(height: 20),
                  const Text('Experience the next generation of admissions intelligence. Our research-driven protocols ensure you stay ahead of the curve.', 
                      style: TextStyle(fontSize: 13, color: AppTheme.textSecondary, height: 1.6, fontWeight: FontWeight.w500)),
                ],
              ),
            ),

            const SizedBox(height: 10),

            // LIST OF SERVICES (exactly like the dropdown)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 24),
              decoration: BoxDecoration(
                color: AppTheme.darkBrown,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 20, offset: const Offset(0, 10)),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Padding(
                    padding: const EdgeInsets.fromLTRB(24, 24, 24, 12),
                    child: Row(
                      children: [
                        Text('AI RESEARCH PROTOCOLS', 
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.gold, letterSpacing: 1)),
                      ],
                    ),
                  ),
                  ...List.generate(_tools.length, (index) {
                    final tool = _tools[index];
                    return _buildToolItem(context, tool, index);
                  }),
                  
                  // Bottom Link
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: InkWell(
                      onTap: () => context.push('/ai-services/mock-interview'),
                      child: Row(
                        children: [
                          Text('Begin AI Simulation', 
                              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.gold)),
                          const SizedBox(width: 8),
                          Icon(Icons.arrow_forward_ios_rounded, color: AppTheme.gold, size: 10),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),

            // ✅ FAQ BUTTON
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: InkWell(
                onTap: () => context.push('/faq'),
                borderRadius: BorderRadius.circular(20),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
                  decoration: BoxDecoration(
                    color: AppTheme.gold.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.help_outline_rounded, color: AppTheme.gold, size: 22),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Text(
                          'Frequently Asked Questions',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            color: AppTheme.gold,
                          ),
                        ),
                      ),
                     Icon(Icons.arrow_forward_ios_rounded, color: AppTheme.gold, size: 12),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildToolItem(BuildContext context, Map<String, dynamic> tool, int index) {
    return InkWell(
      onTap: () {
        if (tool['id'] == 'sop-generator') {
          context.push('/ai-services/sop-generator');
        } else if (tool['id'] == 'mock-interview') {
          context.push('/ai-services/mock-interview');
        } else if (tool['id'] == 'plagiarism-remover') {
          context.push('/ai-services/plagiarism-remover');
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
        decoration: BoxDecoration(
          border: Border(bottom: BorderSide(color: Colors.white.withOpacity(0.05), width: 0.5)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(tool['icon'] as IconData, color: AppTheme.gold, size: 24),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(tool['title'], 
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Colors.white)),
                  const SizedBox(height: 4),
                  Text(tool['description'], 
                      style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.5), height: 1.4)),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Icon(Icons.arrow_forward_ios_rounded, color: Colors.white.withOpacity(0.2), size: 12),
          ],
        ),
      ),
    );
  }
}
