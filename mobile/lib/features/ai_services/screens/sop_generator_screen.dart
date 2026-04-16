import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme.dart';
import '../../../models/checkout_item.dart';
import '../../../widgets/checkout_sheet.dart';

class SopGeneratorScreen extends StatefulWidget {
  const SopGeneratorScreen({super.key});

  @override
  State<SopGeneratorScreen> createState() => _SopGeneratorScreenState();
}

class _SopGeneratorScreenState extends State<SopGeneratorScreen> {

  final List<Map<String, String>> _universities = [
    {'name': 'Stanford', 'domain': 'stanford.edu'},
    {'name': 'Harvard', 'domain': 'harvard.edu'},
    {'name': 'NYU', 'domain': 'nyu.edu'},
    {'name': 'Duke', 'domain': 'duke.edu'},
    {'name': 'Columbia', 'domain': 'columbia.edu'},
  ];

  final List<Map<String, String>> _faqItems = [
    {
      'q': 'Can I use the same SOP for multiple applications?',
      'a': 'While you can, we recommend slight modifications to tailor each SOP to specific universities for better acceptance chances.',
    },
    {
      'q': 'How long does it take to generate my SOP?',
      'a': 'Your fully customized SOP, perfectly bypassed and polished, will be generated within 15-20 minutes after completing the input details.',
    },
    {
      'q': 'Is the SOP plagiarism-free and AI-safe?',
      'a': 'Absolutely. Our advanced AI-Removal engine refines the language so it retains the human touch, making it undetectable by standard AI detectors.',
    },
    {
      'q': 'Will my SOP be unique even if I generate it multiple times?',
      'a': 'Yes, each output is distinctively crafted around your specific background data, ensuring no two generated SOPs are ever identical.',
    },
  ];

  void _showCheckoutSheet(CheckoutItem plan) {
    CheckoutSheet.show(
      context,
      items: [plan],
      currency: plan.currency,
      onCheckout: () {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${plan.title} checkout initiated!')),
        );
      },
      title: 'Checkout Plan',
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: AppTheme.textPrimary),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'AI SOP GENERATOR',
          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 1.5, color: AppTheme.textPrimary),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('AI SOP Generator —', style: TextStyle(fontSize: 32, fontWeight: FontWeight.w700, fontFamily: 'Playfair Display', height: 1.2)),
                  const SizedBox(height: 8),
                  ShaderMask(
                    shaderCallback: (bounds) => const LinearGradient(
                      colors: [AppTheme.goldDark, AppTheme.gold],
                    ).createShader(bounds),
                    child: const Text(
                      'Original Writing Crafted to Bypass AI Detectors',
                      style: TextStyle(fontSize: 32, fontWeight: FontWeight.w700, fontFamily: 'Playfair Display', color: Colors.white, height: 1.2),
                    ),
                  ),
                  const SizedBox(height: 18),
                  const Text(
                    'Get a plagiarism-free Statement of Purpose (SOP) in minutes - designed to reflect your story and meet top university standards for admissions and scholarships.',
                    style: TextStyle(fontSize: 15, color: AppTheme.textMuted, height: 1.6, fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 28),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {},
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppTheme.goldDark, width: 1.5),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Text('Buy Now', style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.w700, fontSize: 14)),
                              SizedBox(width: 8),
                              Icon(Icons.arrow_right_alt, size: 20, color: AppTheme.textPrimary),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () => _showCheckoutSheet(
                            CheckoutItem(
                              id: 'sop-1',
                              title: '1 SOP',
                              icon: '✍️',
                              price: 3999,
                              actualPrice: 5000,
                              currency: 'INR',
                              description: 'Single SOP generation with AI-assisted editing and human review.',
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.darkBrown,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            elevation: 4,
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Icon(Icons.auto_awesome_rounded, size: 18, color: AppTheme.gold),
                              SizedBox(width: 10),
                              Text('Build Your SOP Today', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: AppTheme.gold.withValues(alpha: 38),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(Icons.star, color: AppTheme.gold, size: 20),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Text(
                          'Trusted by Students from 20+ Countries',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textMuted),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 24),
              clipBehavior: Clip.hardEdge,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: Colors.white, width: 4),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 31),
                    blurRadius: 30,
                    offset: const Offset(0, 18),
                  )
                ],
              ),
              child: AspectRatio(
                aspectRatio: 16 / 10,
                child: Image.network(
                  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
                  fit: BoxFit.cover,
                ),
              ),
            ).animate().fadeIn(duration: 700.ms).scale(duration: 700.ms),
            const SizedBox(height: 40),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Text(
                'Admissions Secured At Top Universities',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.5,
                  color: AppTheme.textMuted.withValues(alpha: 179),
                ),
              ),
            ),
            const SizedBox(height: 18),
            SizedBox(
              height: 70,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                scrollDirection: Axis.horizontal,
                itemBuilder: (_, index) {
                  final uni = _universities[index];
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 38)),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: 10), blurRadius: 12, offset: const Offset(0, 4)),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: AppTheme.backgroundAlt,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Center(
                            child: Text(uni['name']!.substring(0, 1), style: const TextStyle(color: AppTheme.darkBrown, fontWeight: FontWeight.w900)),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(uni['name']!, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppTheme.darkBrown)),
                      ],
                    ),
                  );
                },
                separatorBuilder: (_, __) => const SizedBox(width: 16),
                itemCount: _universities.length,
              ),
            ),
            const SizedBox(height: 40),
            _buildSectionHeading('Key Features', 'Your AI partner for original, plagiarism-free, and polished statements.'),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  _buildFeatureCard(
                    title: 'AI-Powered Content Generation',
                    description: 'Create a customized and impactful SOP that stands out without sounding generic.',
                    backgroundColor: const Color(0xFF596E92),
                    icon: Icons.auto_stories,
                    iconBackground: AppTheme.goldDark.withValues(alpha: 38),
                    isDark: true,
                  ),
                  const SizedBox(height: 16),
                  _buildFeatureCard(
                    title: 'Authenticity Assured',
                    description: 'Receive plagiarism-free, unique content tailored to your profile and aspirations.',
                    backgroundColor: const Color(0xFF233A40),
                    icon: Icons.shield,
                    iconBackground: AppTheme.goldDark.withValues(alpha: 38),
                    isDark: true,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
            _buildSectionHeading('How It Works', 'Turn your input into impact, effortlessly!'),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  _buildStepCard(
                    step: 'Step 1',
                    title: 'Input Details',
                    description: 'Provide your background and goals by filling out a simple form. It takes just 15-20 minutes.',
                    color: AppTheme.darkBrown,
                    isDark: true,
                    icon: Icons.edit_document,
                  ),
                  const SizedBox(height: 16),
                  _buildStepCard(
                    step: 'Step 2',
                    title: 'AI Magic',
                    description: 'Our AI analyzes your inputs and crafts a high-quality, professional SOP.',
                    color: Colors.white,
                    isDark: false,
                    icon: Icons.auto_awesome,
                  ),
                  const SizedBox(height: 16),
                  _buildStepCard(
                    step: 'Step 3',
                    title: 'Get Your SOP',
                    description: 'Get your curated Statement of Purpose instantly without any deviation from your provided input.',
                    color: AppTheme.darkBrown,
                    isDark: true,
                    icon: Icons.download,
                  ),
                  const SizedBox(height: 16),
                  _buildStepCard(
                    step: 'Step 4',
                    title: 'AI & Plagiarism Removal',
                    description: 'Our AI remover ensures your SOP passes detection checks while remaining authentic.',
                    color: Colors.white,
                    isDark: false,
                    icon: Icons.verified_user,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Container(
                decoration: BoxDecoration(
                  color: AppTheme.backgroundAlt,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: Column(
                  children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
                      child: Image.network(
                        'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80',
                        fit: BoxFit.cover,
                        width: double.infinity,
                        height: 220,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Go AI-Safe', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
                          const SizedBox(height: 12),
                          const Text('Instantly create a flawless SOP that is affordable and AI-proof!', style: TextStyle(fontSize: 15, color: AppTheme.textMuted, height: 1.6)),
                          const SizedBox(height: 20),
                          _buildCheckRow('AI Detection & Removal'),
                          _buildCheckRow('Plagiarism-Free'),
                          _buildCheckRow('Customized for You'),
                          const SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: () => _showCheckoutSheet(
                                CheckoutItem(
                                  id: 'sop-1',
                                  title: '1 SOP',
                                  icon: '✍️',
                                  price: 3999,
                                  actualPrice: 5000,
                                  currency: 'INR',
                                  description: 'Single SOP generation with AI-assisted editing and human review.',
                                ),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.darkBrown,
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                                minimumSize: const Size.fromHeight(52),
                              ),
                              child: const Text('Build Your SOP →', style: TextStyle(fontWeight: FontWeight.w900)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 40),
            _buildSectionHeading('Why Our AI Beats Generic AI Like ChatGPT', 'Our model is built for university success.'),
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  _buildComparisonCard(
                    title: 'ChatGPT',
                    tag: 'Generic AI Model',
                    tagColor: const Color(0xFF10A37F),
                    bullets: [
                      'ChatGPT generates general content without specialized training.',
                      'Often provides depthless, template-like outputs.',
                      'Easily detectable as AI-generated.',
                      'May produce unchecked output that triggers plagiarism flags.',
                      'Not specialized for university applications.',
                    ],
                    backgroundColor: Colors.white,
                    iconBackground: const Color(0xFF74AA9C),
                  ),
                  const SizedBox(height: 16),
                  _buildComparisonCard(
                    title: 'Global Counsellor',
                    tag: 'University-Focused AI',
                    tagColor: AppTheme.goldDark,
                    bullets: [
                      'Our AI is trained on SOPs from students admitted to top universities.',
                      'Generates personalized SOPs based on your inputs.',
                      'Comes with AI remover to ensure originality and AI-proofing.',
                      'Ensures a unique, high-quality SOP that passes plagiarism checks.',
                      'Built specifically for university admission standards.',
                    ],
                    backgroundColor: Colors.white,
                    iconBackground: AppTheme.darkBrown,
                    isAccent: true,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
            _buildSectionHeading('Small Investment → Great Impact', '1 in 3 students face rejections due to a subpar SOP. Every submission matters.'),
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: [
                  _buildPricingCard(
                    title: '1 SOP',
                    price: '3,999',
                    original: '5,000',
                    note: '1 SOP for INR 3,999',
                    bullets: [
                      'Generate 1 SOP',
                      'AI and Plagiarism Removal',
                      'Fully Customized',
                      'Perfect for a single high-stakes application',
                    ],
                    onTap: () => _showCheckoutSheet(
                      CheckoutItem(
                        id: 'sop-1',
                        title: '1 SOP',
                        icon: '✍️',
                        price: 3999,
                        actualPrice: 5000,
                        currency: 'INR',
                        description: 'Single SOP generation with AI-assisted editing and human review.',
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildPricingCard(
                    title: '5 SOPs',
                    price: '14,999',
                    original: '25,000',
                    note: '1 SOP for INR 2,999',
                    bullets: [
                      'Generate 5 SOPs',
                      '5x AI and Plagiarism Removal',
                      'Fully Customized',
                      'Ideal for multiple top school applications',
                    ],
                    onTap: () => _showCheckoutSheet(
                      CheckoutItem(
                        id: 'sop-5',
                        title: '5 SOPs',
                        icon: '✍️',
                        price: 14999,
                        actualPrice: 25000,
                        currency: 'INR',
                        description: 'Five SOPs for multiple application submissions.',
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildPricingCard(
                    title: '10 SOPs',
                    price: '24,999',
                    original: '40,000',
                    note: '1 SOP for INR 2,499',
                    bullets: [
                      'Generate 10 SOPs',
                      '10x AI and Plagiarism Removal',
                      'Fully Customized',
                      'Great for applying across universities or diverse programs',
                    ],
                    isHighlighted: true,
                    onTap: () => _showCheckoutSheet(
                      CheckoutItem(
                        id: 'sop-10',
                        title: '10 SOPs',
                        icon: '✍️',
                        price: 24999,
                        actualPrice: 40000,
                        currency: 'INR',
                        description: 'Ten SOPs with maximum coverage for diverse applications.',
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: const Text('Frequently Asked Questions!', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, fontFamily: 'Playfair Display')),
            ),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                children: _faqItems
                    .map((faq) => Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Theme(
                            data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                            child: ExpansionTile(
                              tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              childrenPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                              collapsedShape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                              backgroundColor: Colors.white,
                              collapsedBackgroundColor: Colors.white,
                              title: Text(
                                faq['q']!,
                                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
                              ),
                              children: [
                                Text(faq['a']!, style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.6)),
                              ],
                            ),
                          ),
                        ))
                    .toList(),
              ),
            ),
            const SizedBox(height: 60),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeading(String title, String subtitle) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppTheme.textPrimary, fontFamily: 'Playfair Display')),
          const SizedBox(height: 10),
          Text(subtitle, style: const TextStyle(fontSize: 15, color: AppTheme.textMuted, height: 1.6)),
        ],
      ),
    );
  }

  Widget _buildFeatureCard({
    required String title,
    required String description,
    required Color backgroundColor,
    required IconData icon,
    required Color iconBackground,
    required bool isDark,
  }) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 20), blurRadius: 24, offset: const Offset(0, 12)),
        ],
      ),
      padding: const EdgeInsets.all(22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: iconBackground,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: isDark ? Colors.white : AppTheme.darkBrown, size: 26),
          ),
          const SizedBox(height: 18),
          Text(title, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: isDark ? Colors.white : AppTheme.textPrimary, fontFamily: 'Playfair Display')),
          const SizedBox(height: 12),
          Text(description, style: TextStyle(fontSize: 15, color: isDark ? Colors.white70 : AppTheme.textMuted, height: 1.6)),
        ],
      ),
    );
  }

  Widget _buildStepCard({
    required String step,
    required String title,
    required String description,
    required Color color,
    required bool isDark,
    required IconData icon,
  }) {
    final titleColor = isDark ? Colors.white : AppTheme.textPrimary;
    final bodyColor = isDark ? Colors.white70 : AppTheme.textMuted;

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 13), blurRadius: 20, offset: const Offset(0, 10)),
        ],
      ),
      padding: const EdgeInsets.all(22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: isDark ? AppTheme.gold.withValues(alpha: 46) : AppTheme.goldDark.withValues(alpha: 31),
              borderRadius: BorderRadius.circular(999),
            ),
            child: Text(step, style: TextStyle(color: isDark ? AppTheme.gold : AppTheme.goldDark, fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 0.8)),
          ),
          const SizedBox(height: 18),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: isDark ? Colors.white24 : AppTheme.backgroundAlt,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, size: 24, color: isDark ? Colors.white : AppTheme.darkBrown),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: titleColor, fontFamily: 'Playfair Display')),
                    const SizedBox(height: 10),
                    Text(description, style: TextStyle(fontSize: 15, color: bodyColor, height: 1.6)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCheckRow(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppTheme.goldDark,
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(Icons.check, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppTheme.textPrimary, height: 1.5))),
        ],
      ),
    );
  }

  Widget _buildComparisonCard({
    required String title,
    required String tag,
    required Color tagColor,
    required List<String> bullets,
    required Color backgroundColor,
    required Color iconBackground,
    bool isAccent = false,
  }) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(24),
        border: isAccent ? Border.all(color: AppTheme.goldDark, width: 1.5) : Border.all(color: AppTheme.borderLight),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 13), blurRadius: 20, offset: const Offset(0, 10)),
        ],
      ),
      padding: const EdgeInsets.all(22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: iconBackground,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Center(
                  child: Text(title[0], style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900)),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: tagColor.withValues(alpha: 38),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(tag, style: TextStyle(color: tagColor, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Column(
            children: bullets
                .map((bullet) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 18,
                            height: 18,
                            decoration: BoxDecoration(
                              color: isAccent ? AppTheme.goldDark : AppTheme.backgroundAlt,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Center(
                              child: Icon(Icons.check, size: 12, color: isAccent ? Colors.white : AppTheme.darkBrown),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(child: Text(bullet, style: const TextStyle(fontSize: 14, color: AppTheme.textPrimary, height: 1.6))),
                        ],
                      ),
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildPricingCard({
    required String title,
    required String price,
    required String original,
    required String note,
    required List<String> bullets,
    required VoidCallback onTap,
    bool isHighlighted = false,
  }) {
    final cardColor = isHighlighted ? AppTheme.darkBrown : Colors.white;
    final titleColor = isHighlighted ? Colors.white : AppTheme.textPrimary;
    final noteColor = isHighlighted ? Colors.white60 : AppTheme.textSecondary;

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: isHighlighted ? AppTheme.goldDark : AppTheme.borderLight),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 13), blurRadius: 20, offset: const Offset(0, 10)),
        ],
      ),
      padding: const EdgeInsets.all(22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Price: INR $original', style: TextStyle(color: noteColor, fontSize: 13)),
          const SizedBox(height: 14),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('INR', style: TextStyle(color: titleColor, fontSize: 16, fontWeight: FontWeight.w700)),
              const SizedBox(width: 8),
              Text(price, style: TextStyle(color: titleColor, fontSize: 34, fontWeight: FontWeight.w900)),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: isHighlighted ? Colors.white10 : AppTheme.backgroundAlt,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Text(note, style: TextStyle(color: noteColor, fontSize: 13, fontWeight: FontWeight.w600)),
          ),
          const SizedBox(height: 18),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: bullets
                .map((bullet) => Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 18,
                            height: 18,
                            decoration: BoxDecoration(
                              color: AppTheme.goldDark,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Icon(Icons.check, size: 12, color: Colors.white),
                          ),
                          const SizedBox(width: 12),
                          Expanded(child: Text(bullet, style: TextStyle(color: titleColor, fontSize: 14, height: 1.6))),
                        ],
                      ),
                    ))
                .toList(),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: onTap,
              style: ElevatedButton.styleFrom(
                backgroundColor: isHighlighted ? AppTheme.gold : AppTheme.background,
                foregroundColor: AppTheme.darkBrown,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Upgrade Now', style: TextStyle(fontWeight: FontWeight.w900)),
            ),
          ),
        ],
      ),
    );
  }
}
