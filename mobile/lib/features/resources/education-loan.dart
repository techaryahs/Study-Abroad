import 'package:flutter/material.dart';
import '../../core/theme.dart';
import 'package:google_fonts/google_fonts.dart';

class EducationLoanPage extends StatelessWidget {
  const EducationLoanPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200.0,
            floating: false,
            pinned: true,
            backgroundColor: AppTheme.darkBrown,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                'Education Loan',
                style: GoogleFonts.outfit(
                  color: Colors.white,
                  fontWeight: FontWeight.w800,
                  fontSize: 18,
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Container(color: AppTheme.darkBrown),
                  Positioned(
                    right: -20,
                    bottom: -20,
                    child: Icon(
                      Icons.account_balance_rounded,
                      size: 200,
                      color: Colors.white.withOpacity(0.05),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.gold,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            'FINANCIAL SUPPORT',
                            style: GoogleFonts.outfit(
                              color: AppTheme.darkBrown,
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Empowering Your\nGlobal Education',
                          style: GoogleFonts.outfit(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.w800,
                            height: 1.2,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitle('Overview'),
                  const SizedBox(height: 12),
                  Text(
                    'We offer comprehensive guidance on financing your international education. From comparing interest rates to identifying the right lending institution, we ensure you get the best terms for your future.',
                    style: GoogleFonts.outfit(
                      color: AppTheme.textSecondary,
                      fontSize: 15,
                      height: 1.6,
                    ),
                  ),
                  const SizedBox(height: 32),
                  _buildSectionTitle('Key Benefits'),
                  const SizedBox(height: 16),
                  _buildBenefitItem(Icons.percent_rounded, 'Competitive Interest Rates', 'Access the lowest market rates through our partner networks.'),
                  _buildBenefitItem(Icons.speed_rounded, 'Fast Processing', 'Dedicated support to get your loan sanctioned within 7-10 working days.'),
                  _buildBenefitItem(Icons.security_rounded, 'No-Collateral Options', 'Information on unsecured loans up to 60 Lakhs for top global universities.'),
                  _buildBenefitItem(Icons.description_outlined, 'Paperwork Assistance', 'Complete help with documentation and university-specific requirements.'),
                  const SizedBox(height: 40),
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBrown,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      children: [
                        Text(
                          'Ready to fund your dreams?',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.outfit(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Schedule a free consultation with our financial experts today.',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.outfit(
                            color: Colors.white.withOpacity(0.6),
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(height: 24),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.gold,
                              foregroundColor: AppTheme.darkBrown,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                            child: const Text('GET FREE ADVICE'),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 60),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title.toUpperCase(),
      style: GoogleFonts.outfit(
        color: AppTheme.gold,
        fontWeight: FontWeight.w900,
        fontSize: 12,
        letterSpacing: 1.5,
      ),
    );
  }

  Widget _buildBenefitItem(IconData icon, String title, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppTheme.gold.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: AppTheme.gold, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    color: AppTheme.textPrimary,
                    fontWeight: FontWeight.w700,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  desc,
                  style: GoogleFonts.outfit(
                    color: AppTheme.textSecondary,
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
