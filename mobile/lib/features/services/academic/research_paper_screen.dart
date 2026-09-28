import 'package:flutter/material.dart';
import '../../../core/theme.dart';
import '../../../widgets/service_hero_card.dart';
import '../../../widgets/service_faq_section.dart';

class ResearchPaperScreen extends StatelessWidget {
  const ResearchPaperScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundAlt,
      appBar: AppBar(
        title: const Text('Research Papers', style: TextStyle(color: AppTheme.darkBrown)),
        backgroundColor: AppTheme.backgroundAlt,
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
          children: [
            ServiceHeroCard(
              tag: 'Research Publication',
              title: 'Research Paper Drafting',
              highlightTitle: ' & Publishing',
              subtitle: 'Publishing credible research papers with your name on them can help boost your profile! Extremely crucial for MS/PhD and O-1/EB-1 visa applicants.',
              ctaText: 'Access Service',
              onCtaPressed: () {},
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'ABOUT SERVICE',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                      color: AppTheme.textMuted,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Advantages of research papers',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.darkBrown,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Unlock a world of opportunities.',
                    style: TextStyle(fontSize: 14, color: AppTheme.textMuted),
                  ),
                  const SizedBox(height: 24),
                  
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 2.5,
                    children: [
                      _buildAdvantageCard('🏛️', 'Admits from some of the top-most universities worldwide!'),
                      _buildAdvantageCard('💰', 'Increased chances of funding and research assistantships.'),
                      _buildAdvantageCard('💼', 'Amazing job offers in R&D with a high pay-grade.'),
                      _buildAdvantageCard('📋', 'One of the most prominent ways to cover gaps on your resume.'),
                      _buildAdvantageCard('🇺🇸', 'Easier pathway to the green card (through the O-1/EB-1 Visa).'),
                      _buildAdvantageCard('✈️', 'Residency fast-track in the UK and Australia via Global Talent Visa.'),
                    ],
                  ),
                  
                  const SizedBox(height: 32),
                  
                  Container(
                    padding: EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'HIGH-IMPACT RESEARCH PUBLICATIONS',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.5,
                            color: AppTheme.darkBrown,
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'The research work under this program is highly valuable and is guaranteed to be published in IEEE, Springer, or Elsevier or Taylor & Francis.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 13, color: AppTheme.textMuted),
                        ),
                        const SizedBox(height: 20),
                        Wrap(
                          spacing: 12,
                          runSpacing: 12,
                          alignment: WrapAlignment.center,
                          children: ['Springer', 'IEEE', 'Elsevier'].map((e) => Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: AppTheme.backgroundAlt,
                              border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              e,
                              style: const TextStyle(fontWeight: FontWeight.w900, color: AppTheme.gold),
                            ),
                          )).toList(),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),
                  
                  const Text(
                    'THE IMPACT OF RESEARCH PAPERS ON YOUR APPLICATION',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.darkBrown,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'The graph below shows a clear distinction between applicants who utilized our research paper service and those who didn\'t.',
                    style: TextStyle(fontSize: 13, color: AppTheme.textMuted, fontStyle: FontStyle.italic),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const Text(
                          'IMPACT OF RESEARCH PAPERS ON ADMISSIONS',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.darkBrown, letterSpacing: 1),
                        ),
                        const SizedBox(height: 8),
                        Container(width: 40, height: 2, color: AppTheme.gold),
                        const SizedBox(height: 24),
                        _buildAdmitRow('Harvard University', 50, 25),
                        _buildAdmitRow('Stanford University', 40, 20),
                        _buildAdmitRow('MIT', 30, 20),
                        _buildAdmitRow('University of Oxford', 25, 20),
                        _buildAdmitRow('University of Cambridge', 10, 5),
                        const SizedBox(height: 24),
                        const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.square, size: 12, color: AppTheme.gold),
                            SizedBox(width: 4),
                            Text('Admits with papers', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
                            SizedBox(width: 16),
                            Icon(Icons.square, size: 12, color: AppTheme.borderLight),
                            SizedBox(width: 4),
                            Text('Admits without papers', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
                          ],
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          '*Statistics based on data points from 2025–2026',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),

                  Container(
                    padding: EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'PATHWAYS FOR WORKING AND SETTLING OVERSEAS',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.darkBrown, letterSpacing: 1),
                        ),
                        const SizedBox(height: 8),
                        Container(width: 40, height: 2, color: AppTheme.gold),
                        const SizedBox(height: 24),
                        _buildPathway('🇺🇸', 'United States (O-1/EB-1 Visa)', 'Your research achievements can qualify you for extraordinary ability visas, providing a pathway to permanent residency.'),
                        _buildPathway('🇬🇧', 'United Kingdom (Global Talent Visa - GTV)', 'Research excellence can make you eligible for high-skilled worker visas and opportunities in academia and industry.'),
                        _buildPathway('🇦🇺', 'Australia (National Innovation Visa - NIV)', 'Demonstrating outstanding research skills can help you secure this fast-track visa for talented professionals.'),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),
                  
                  const Text(
                    'EASIER PATHWAY TO THE GREEN CARD (THROUGH THE O-1/EB-1 VISA)',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.darkBrown,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Success rates for O-1/EB-1 visa applications significantly increase when applicants have published research papers, as shown by recent studies.',
                    style: TextStyle(fontSize: 13, color: AppTheme.textMuted, fontStyle: FontStyle.italic),
                  ),
                  const SizedBox(height: 24),
                  _buildSuccessRateCard('O-1 Visa Success Rate', '🇺🇸', 'Average 20–30 citations per paper (Total 150 to 250 citations)', [
                    _buildStatBar('With 8 Papers', 0.98, '98%'),
                    _buildStatBar('With 7 Papers', 0.93, '93%'),
                    _buildStatBar('With 6 Papers', 0.87, '87%'),
                    _buildStatBar('With 5 Papers', 0.82, '82%'),
                    _buildStatBar('With 4 Papers', 0.71, '71%'),
                  ]),
                  _buildSuccessRateCard('EB-1 Visa Success Rate', '🇺🇸', 'Average 20–30 citations per paper (Total 200 to 300 citations)', [
                    _buildStatBar('With 10 Papers', 0.975, '97.5%'),
                    _buildStatBar('With 9 Papers', 0.93, '93%'),
                    _buildStatBar('With 8 Papers', 0.85, '85%'),
                    _buildStatBar('With 7 Papers', 0.79, '79%'),
                    _buildStatBar('With 6 Papers', 0.70, '70%'),
                  ]),

                  const SizedBox(height: 40),
                  const Text(
                    'PROVEN SUCCESS WITH GLOBAL TALENT VISAS',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      color: AppTheme.darkBrown,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Our expertise ensures high success rates for Global Talent Visas in the UK and Australia, helping applicants achieve their goals with tailored strategies.',
                    style: TextStyle(fontSize: 13, color: AppTheme.textMuted, fontStyle: FontStyle.italic),
                  ),
                  const SizedBox(height: 24),
                  _buildSuccessRateCard('Global Talent Visa Success Rate', '🇬🇧', 'Average 20–30 citations per paper (Total 150 to 250 citations)', [
                    _buildStatBar('With 8 Papers', 0.96, '96%'),
                    _buildStatBar('With 7 Papers', 0.91, '91%'),
                    _buildStatBar('With 6 Papers', 0.85, '85%'),
                    _buildStatBar('With 5 Papers', 0.78, '78%'),
                  ]),
                  _buildSuccessRateCard('NIV Australia Success Rates', '🇦🇺', 'Average 20–30 citations per paper (Total 150 to 250 citations)', [
                    _buildStatBar('With 8 Papers', 0.96, '96%'),
                    _buildStatBar('With 7 Papers', 0.89, '89%'),
                    _buildStatBar('With 6 Papers', 0.80, '80%'),
                    _buildStatBar('With 5 Papers', 0.72, '72%'),
                  ]),

                  const SizedBox(height: 32),
                  const ServiceFaqSection(
                    faqs: [
                      ServiceFaq(
                        question: 'Do you only help for applications to the US? What about other countries?',
                        answer: 'We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore.',
                      ),
                      ServiceFaq(
                        question: 'Does the price include GST/Taxes?',
                        answer: 'Yes, all prices shown are inclusive of applicable taxes unless stated otherwise at checkout.',
                      ),
                      ServiceFaq(
                        question: 'Do you have research partners from all the fields? My field is a bit unique.',
                        answer: 'We work with research partners across a wide range of fields. Reach out to discuss your specific domain and we\'ll match you accordingly.',
                      ),
                      ServiceFaq(
                        question: 'Which journals or conferences are these papers published in?',
                        answer: 'Research is published in IEEE, Springer, Elsevier, or Taylor & Francis — all high-impact, peer-reviewed publications.',
                      ),
                      ServiceFaq(
                        question: 'Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?',
                        answer: 'We use structured Google Meet sessions, dedicated support channels, and encrypted document sharing to replicate the experience of in-person consulting.',
                      ),
                      ServiceFaq(
                        question: 'What is the best time for me to enroll in the services?',
                        answer: 'As early as possible — ideally 6–12 months before your intended application deadline to allow for publication timelines.',
                      ),
                      ServiceFaq(
                        question: 'Can I divide the charges between my co-author(s) and I?',
                        answer: 'Yes, charges can be split among co-authors. Select the number of co-authors in the pricing panel above.',
                      ),
                      ServiceFaq(
                        question: 'Are the timelines mentioned on the website followed religiously?',
                        answer: 'We adhere strictly to our stated 3–4 week timelines and will notify you proactively if any delays are anticipated.',
                      ),
                      ServiceFaq(
                        question: 'Are there any ongoing discount offers?',
                        answer: 'A 20% discount is currently applied. This is a limited-time offer.',
                      ),
                      ServiceFaq(
                        question: 'Are the publishing charges covered?',
                        answer: 'Publishing charges depend on the journal selected. Please discuss during your counselling session for a complete cost breakdown.',
                      ),
                      ServiceFaq(
                        question: 'Does help with applying for the O-1/EB-1 Visa?',
                        answer: 'Yes, we provide end-to-end support for O-1/EB-1 Visa petitions, including research paper strategy and documentation.',
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

  Widget _buildAdmitRow(String label, int withPaper, int withoutPaper) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
          const SizedBox(height: 4),
          Row(
            children: [
              Expanded(
                child: Container(
                  height: 16,
                  decoration: BoxDecoration(
                    color: AppTheme.gold.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: withPaper / 55,
                    child: Container(
                      decoration: BoxDecoration(color: AppTheme.gold, borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              SizedBox(width: 50, child: Text('$withPaper+ admits', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.gold))),
            ],
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              Expanded(
                child: Container(
                  height: 16,
                  decoration: BoxDecoration(
                    color: AppTheme.backgroundAlt,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppTheme.borderLight),
                  ),
                  child: FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: withoutPaper / 55,
                    child: Container(
                      decoration: BoxDecoration(color: AppTheme.textMuted.withValues(alpha: 0.4), borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              SizedBox(width: 50, child: Text('$withoutPaper+ admits', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted))),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPathway(String flag, String title, String desc) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.backgroundAlt,
        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.1)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Text(flag, style: const TextStyle(fontSize: 24)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.darkBrown)),
                const SizedBox(height: 4),
                Text(desc, style: const TextStyle(fontSize: 11, color: AppTheme.textMuted)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuccessRateCard(String title, String flag, String bottomText, List<Widget> bars) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.darkBrown)),
                    const SizedBox(height: 4),
                    const Text('Based on petition outputs of our clients', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
                  ],
                ),
              ),
              Text(flag, style: const TextStyle(fontSize: 24)),
            ],
          ),
          const SizedBox(height: 24),
          ...bars,
          const SizedBox(height: 16),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.only(top: 16),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: AppTheme.gold.withValues(alpha: 0.1))),
            ),
            child: Text(
              bottomText,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.gold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatBar(String label, double percent, String count) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
              Text(count, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.darkBrown)),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            height: 16,
            decoration: BoxDecoration(
              color: AppTheme.gold.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: percent,
              child: Container(
                decoration: BoxDecoration(color: AppTheme.gold, borderRadius: BorderRadius.circular(8)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAdvantageCard(String emoji, String text) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(emoji, style: const TextStyle(fontSize: 24)),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.darkBrown),
            ),
          ),
        ],
      ),
    );
  }
}
