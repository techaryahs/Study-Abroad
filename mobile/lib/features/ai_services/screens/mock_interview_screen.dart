import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme.dart';
import '../../../models/checkout_item.dart';
import '../../../widgets/checkout_sheet.dart';

class MockInterviewScreen extends StatefulWidget {
  const MockInterviewScreen({super.key});

  @override
  State<MockInterviewScreen> createState() => _MockInterviewScreenState();
}

class _MockInterviewScreenState extends State<MockInterviewScreen> {
  int? openFaq = 0;
  String selectedCurrency = 'INR';

  final List<Map<String, String>> faqs = [
    {
      'q': 'How does the US Visa Mock Interview AI work?',
      'a':
          'Our AI model is inspired by real-life visa interviews and follows the same pattern, tonality, and style. It has been trained from more than 1000 real-life interview scripts and can provide real-time insights into preparing yourself for the actual interview.',
    },
    {
      'q': 'What types of questions can I expect?',
      'a':
          'You can expect questions about your study plans, financial capability, ties to your home country, and future plans — all closely mirroring actual US visa officer questioning patterns.',
    },
    {
      'q': 'How realistic is the feedback provided?',
      'a':
          'Our AI provides feedback with 97.6% accuracy, mirroring real visa officer decision-making. It evaluates your answers on clarity, confidence, and factual consistency.',
    },
    {
      'q': 'Will this improve my chances of approval?',
      'a':
          'Yes. Our data shows that candidates who complete 5+ rounds see a 270% boost in success rates. Practice builds confidence and refines your answers significantly.',
    },
  ];

  final List<Map<String, dynamic>> plans = [
    {
      'rounds': '1 Round',
      'price': 499,
      'original': 999,
      'features': [
        '1 Mock Interview Round',
        'Realtime Feedback',
        'Confidence Score'
      ],
      'highlight': false,
      'label': null,
    },
    {
      'rounds': '5 Rounds',
      'price': 1999,
      'original': 4999,
      'features': [
        '5 Mock Interview Rounds',
        '270% Success Boost',
        'Progress Tracking'
      ],
      'highlight': true,
      'label': 'RECOMMENDED',
    },
    {
      'rounds': '10 Rounds',
      'price': 3499,
      'original': 9999,
      'features': [
        '10 Mock Interview Rounds',
        'Priority AI Engine',
        'Full Performance Audit'
      ],
      'highlight': false,
      'label': null,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFDFBF7),
      appBar: AppBar(
        backgroundColor: const Color(0xFFFDFBF7),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new,
              size: 18, color: AppTheme.textPrimary),
          onPressed: () =>
              context.canPop() ? context.pop() : context.go('/ai-services'),
        ),
        title: const Text(
          'US VISA MOCK INTERVIEW',
          style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.5,
              color: AppTheme.textPrimary),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeroSection(),
            _buildCapabilitiesSection(),
            _buildStatsSection(),
            _buildPricingSection(),
            _buildFaqSection(),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  // ── HERO SECTION ──────────────────────────────────────────────────────────
  Widget _buildHeroSection() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0x14C5A059), Color(0x00C5A059)],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(100),
              border: Border.all(color: const Color(0x4DC5A059)),
            ),
            child: const Text(
              'INSTITUTIONAL GRADE AI',
              style: TextStyle(
                  color: Color(0xFFC5A059),
                  fontWeight: FontWeight.w800,
                  fontSize: 14,
                  letterSpacing: 2),
            ),
          ).animate().fadeIn(duration: 600.ms),

          const SizedBox(height: 20),

          // Title
          const Text(
            'Master Your',
            style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.w700,
                fontFamily: 'Playfair Display',
                height: 1.1,
                color: Color(0xFF2D2926)),
          ).animate().fadeIn(delay: 100.ms).slideX(begin: -0.1),

          ShaderMask(
            shaderCallback: (bounds) => const LinearGradient(
              colors: [Color(0xFFC5A059), Color(0xFFE6D5B8), Color(0xFFD4AF37)],
            ).createShader(bounds),
            child: const Text(
              'Visa Interview',
              style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.w700,
                  fontFamily: 'Playfair Display',
                  color: Colors.white,
                  height: 1.1),
            ),
          ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.1),

          const SizedBox(height: 16),

          const Text(
            '"Precision-engineered AI simulations that replicate the exact psychological and technical protocols of US Visa Officers."',
            style: TextStyle(
                fontSize: 13,
                color: Color(0xFF6B5E51),
                height: 1.6,
                fontStyle: FontStyle.italic,
                fontWeight: FontWeight.w500),
          ).animate().fadeIn(delay: 300.ms),

          const SizedBox(height: 20),

          // Chat Preview Card
          _buildChatPreviewCard()
              .animate()
              .fadeIn(delay: 400.ms)
              .scale(begin: const Offset(0.95, 0.95)),
        ],
      ),
    );
  }

  Widget _buildChatPreviewCard() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white, width: 2),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.15),
              blurRadius: 40,
              offset: const Offset(0, 20)),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(26),
        child: Column(
          children: [
            // Title bar
            Container(
              color: const Color(0xFF3A3530),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Row(
                children: [
                  _dot(const Color(0xFFEF4444)),
                  const SizedBox(width: 6),
                  _dot(const Color(0xFFEAB308)),
                  const SizedBox(width: 6),
                  _dot(const Color(0xFF22C55E)),
                  const Spacer(),
                  const Text('Encryption Active',
                      style: TextStyle(
                          color: Colors.white38,
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 2)),
                ],
              ),
            ),

            // Chat content
            Container(
              color: const Color(0xFF2D2926),
              padding: const EdgeInsets.all(12),
              child: Column(
                children: [
                  // VO message
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                            color: const Color(0xFFC5A059),
                            borderRadius: BorderRadius.circular(8)),
                        alignment: Alignment.center,
                        child: const Text('VO',
                            style: TextStyle(
                                color: Color(0xFF2D2926),
                                fontWeight: FontWeight.w900,
                                fontSize: 13)),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.07),
                            borderRadius: const BorderRadius.only(
                              topRight: Radius.circular(16),
                              bottomLeft: Radius.circular(16),
                              bottomRight: Radius.circular(16),
                            ),
                          ),
                          child: const Text(
                            '"Welcome. I see you\'re applying for an F-1 visa. Why did you choose this specific university?"',
                            style: TextStyle(
                                color: Colors.white70,
                                fontSize: 13,
                                height: 1.5),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  // YOU message
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: const BoxDecoration(
                            color: Color(0xFFC5A059),
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(16),
                              bottomLeft: Radius.circular(16),
                              bottomRight: Radius.circular(16),
                            ),
                          ),
                          child: const Text(
                            '"I chose UC because of their advanced research in Neural Networks and the specific faculty mentorship program..."',
                            style: TextStyle(
                                color: Color(0xFF2D2926),
                                fontSize: 13,
                                height: 1.5,
                                fontWeight: FontWeight.w600),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8)),
                        alignment: Alignment.center,
                        child: const Text('YOU',
                            style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w900,
                                fontSize: 13)),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Feedback
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      border: Border(
                          top: BorderSide(
                              color: Colors.white.withOpacity(0.08))),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.bolt_rounded,
                                color: Color(0xFFC5A059), size: 14),
                            const SizedBox(width: 6),
                            const Text('LIVE FEEDBACK ENGINE',
                                style: TextStyle(
                                    color: Color(0xFFC5A059),
                                    fontSize: 13,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 2)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          '"Strong answer. Recommendation: Mention one specific professor\'s work to boost credibility."',
                          style: TextStyle(
                              color: Colors.white38,
                              fontSize: 13,
                              fontStyle: FontStyle.italic,
                              height: 1.5),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _dot(Color color) => Container(
      width: 10,
      height: 10,
      decoration: BoxDecoration(color: color, shape: BoxShape.circle));

  // ── CORE CAPABILITIES ─────────────────────────────────────────────────────
  Widget _buildCapabilitiesSection() {
    final items = [
      {
        'icon': Icons.videocam_rounded,
        'title': 'Video Simulation',
        'desc':
            'Face an AI-driven officer with real-time facial analysis and stress level monitoring.'
      },
      {
        'icon': Icons.bolt_rounded,
        'title': 'Instant Diagnostics',
        'desc':
            'Get immediate scoring on your confidence, grammar, and factual consistency.'
      },
      {
        'icon': Icons.verified_user_rounded,
        'title': 'Approval Predictor',
        'desc':
            'Our neural network predicts your approval percentage based on historical visa trends.'
      },
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 40, 24, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Core Capabilities',
              style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w700,
                  fontFamily: 'Playfair Display',
                  color: Color(0xFF2D2926))),
          const SizedBox(height: 24),
          ...items.asMap().entries.map((entry) {
            final i = entry.key;
            final item = entry.value;
            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0x1AC5A059)),
                boxShadow: [
                  BoxShadow(
                      color: Colors.black.withOpacity(0.03), blurRadius: 20)
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                        color: const Color(0xFFF8F5F0),
                        borderRadius: BorderRadius.circular(16)),
                    child: Icon(item['icon'] as IconData,
                        color: const Color(0xFFC5A059), size: 22),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item['title'] as String,
                            style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF2D2926))),
                        const SizedBox(height: 4),
                        Text(item['desc'] as String,
                            style: const TextStyle(
                                fontSize: 14,
                                color: Color(0xFF6B5E51),
                                height: 1.5)),
                      ],
                    ),
                  ),
                ],
              ),
            )
                .animate()
                .fadeIn(delay: Duration(milliseconds: 100 * i))
                .slideY(begin: 0.1);
          }),
        ],
      ),
    );
  }

  // ── STATS SECTION ─────────────────────────────────────────────────────────
  Widget _buildStatsSection() {
    final stats = [
      {'label': 'AI Accuracy', 'val': '97.6%'},
      {'label': 'Processed Cases', 'val': '50k+'},
      {'label': 'Success Boost', 'val': '270%'},
      {'label': 'Review Latency', 'val': '<1s'},
    ];

    return Container(
      color: const Color(0xFF2D2926),
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
      child: Column(
        children: [
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            childAspectRatio: 2.2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            children: stats
                .map((stat) => Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        ShaderMask(
                          shaderCallback: (bounds) => const LinearGradient(
                            colors: [
                              Color(0xFFC5A059),
                              Color(0xFFE6D5B8),
                              Color(0xFFD4AF37)
                            ],
                          ).createShader(bounds),
                          child: Text(
                            stat['val']!,
                            style: const TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.w900,
                                fontFamily: 'Playfair Display',
                                color: Colors.white),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          stat['label']!.toUpperCase(),
                          style: const TextStyle(
                              color: Colors.white38,
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 2),
                        ),
                      ],
                    ))
                .toList(),
          ),
        ],
      ),
    );
  }

  // ── PRICING SECTION ───────────────────────────────────────────────────────
  Widget _buildPricingSection() {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 48, 24, 48),
      color: Colors.white,
      child: Column(
        children: [
          const Text(
            'LIMITED TIME ENROLLMENT',
            style: TextStyle(
                color: Color(0xFFC5A059),
                fontSize: 14,
                fontWeight: FontWeight.w800,
                letterSpacing: 3),
          ),
          const SizedBox(height: 12),
          RichText(
            textAlign: TextAlign.center,
            text: const TextSpan(
              children: [
                TextSpan(
                    text: 'Elite ',
                    style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.w700,
                        fontFamily: 'Playfair Display',
                        color: Color(0xFF2D2926))),
                TextSpan(
                    text: 'Access Protocols',
                    style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.w700,
                        fontFamily: 'Playfair Display',
                        color: Color(0xFFC5A059))),
              ],
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            '"Secure your visa first attempt. Avoid the \$185 re-application fee and months of delay."',
            textAlign: TextAlign.center,
            style: TextStyle(
                color: Color(0xFF6B5E51),
                fontSize: 13,
                fontStyle: FontStyle.italic,
                height: 1.6),
          ),
          const SizedBox(height: 24),

          // Currency Toggle
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: ['USD', 'INR', 'GBP', 'EUR']
                .map((c) => GestureDetector(
                      onTap: () => setState(() => selectedCurrency = c),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: selectedCurrency == c
                              ? const Color(0xFF2D2926)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(100),
                          border: Border.all(
                            color: selectedCurrency == c
                                ? const Color(0xFF2D2926)
                                : const Color(0xFFE8E2DD),
                          ),
                        ),
                        child: Text(
                          c,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: selectedCurrency == c
                                ? Colors.white
                                : const Color(0xFF6B5E51),
                          ),
                        ),
                      ),
                    ))
                .toList(),
          ),

          const SizedBox(height: 32),

          // Pricing Cards
          ...plans.map((plan) {
            final isHighlight = plan['highlight'] as bool;
            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                color: isHighlight ? const Color(0xFF2D2926) : Colors.white,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(
                    color: isHighlight
                        ? const Color(0xFF2D2926)
                        : const Color(0x26C5A059)),
                boxShadow: isHighlight
                    ? [
                        BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 30,
                            offset: const Offset(0, 15))
                      ]
                    : [],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        plan['rounds'] as String,
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          fontFamily: 'Playfair Display',
                          color: isHighlight
                              ? Colors.white
                              : const Color(0xFF2D2926),
                        ),
                      ),
                      if (plan['label'] != null)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                              color: const Color(0xFFC5A059),
                              borderRadius: BorderRadius.circular(8)),
                          child: Text(
                            plan['label'] as String,
                            style: const TextStyle(
                                color: Color(0xFF2D2926),
                                fontSize: 13,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1.5),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        '$selectedCurrency ${(plan['original'] as int).toString()}  ',
                        style: TextStyle(
                          color: isHighlight
                              ? Colors.white38
                              : const Color(0xFF6B5E51),
                          fontSize: 13,
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                      Text(
                        '$selectedCurrency ${(plan['price'] as int).toString()}',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          color: isHighlight
                              ? const Color(0xFFC5A059)
                              : const Color(0xFF2D2926),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  ...(plan['features'] as List<String>).map((f) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          children: [
                            const Icon(Icons.check_circle_rounded,
                                color: Color(0xFFC5A059), size: 16),
                            const SizedBox(width: 10),
                            Text(
                              f,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                color: isHighlight
                                    ? Colors.white60
                                    : const Color(0xFF6B5E51),
                              ),
                            ),
                          ],
                        ),
                      )),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () {
                        CheckoutSheet.show(
                          context,
                          title: 'Interview Package',
                          items: [
                            CheckoutItem(
                              id: 'mock-interview-${plan['rounds'].toString().toLowerCase().replaceAll(' ', '-')}',
                              title: 'Mock Interview: ${plan['rounds']}',
                              icon: '🎙️',
                              price: plan['price'] as int,
                              actualPrice: plan['original'] as int,
                              currency: selectedCurrency,
                              description:
                                  'Professional AI-driven US Visa Mock Interview rounds with feedback.',
                            )
                          ],
                          onPaymentSuccess: () {
                            // Payment success logic
                          },
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isHighlight
                            ? const Color(0xFFC5A059)
                            : const Color(0xFF2D2926),
                        foregroundColor: isHighlight
                            ? const Color(0xFF2D2926)
                            : Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16)),
                        elevation: 0,
                      ),
                      child: const Text('CONSULT INTERVIEW EXPERT',
                          style: TextStyle(
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.5,
                              fontSize: 13)),
                    ),
                  ),
                ],
              ),
            ).animate().fadeIn().slideY(begin: 0.05);
          }),
        ],
      ),
    );
  }

  // ── FAQ SECTION ───────────────────────────────────────────────────────────
  Widget _buildFaqSection() {
    return Container(
      padding: const EdgeInsets.fromLTRB(24, 48, 24, 48),
      color: const Color(0xFFF8F5F0),
      child: Column(
        children: [
          RichText(
            textAlign: TextAlign.center,
            text: const TextSpan(
              children: [
                TextSpan(
                    text: 'Protocol ',
                    style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w700,
                        fontFamily: 'Playfair Display',
                        color: Color(0xFF2D2926))),
                TextSpan(
                    text: 'Inquiries',
                    style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w700,
                        fontFamily: 'Playfair Display',
                        color: Color(0xFFC5A059))),
              ],
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Everything you need to know about our institutional AI',
            textAlign: TextAlign.center,
            style: TextStyle(
                color: Color(0xFF6B5E51),
                fontSize: 13,
                fontStyle: FontStyle.italic),
          ),
          const SizedBox(height: 32),
          ...faqs.asMap().entries.map((entry) {
            final i = entry.key;
            final faq = entry.value;
            final isOpen = openFaq == i;
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFF1EDEA)),
              ),
              child: Column(
                children: [
                  InkWell(
                    onTap: () => setState(() => openFaq = isOpen ? null : i),
                    borderRadius: BorderRadius.circular(20),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              faq['q']!,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: isOpen
                                    ? const Color(0xFFC5A059)
                                    : const Color(0xFF2D2926),
                                letterSpacing: 0.2,
                                height: 1.4,
                              ),
                            ),
                          ),
                          AnimatedRotation(
                            turns: isOpen ? 0.5 : 0,
                            duration: const Duration(milliseconds: 250),
                            child: const Icon(Icons.keyboard_arrow_down_rounded,
                                color: Color(0xFFC5A059)),
                          ),
                        ],
                      ),
                    ),
                  ),
                  AnimatedSize(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                    child: isOpen
                        ? Padding(
                            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                            child: Text(
                              '"${faq['a']}"',
                              style: const TextStyle(
                                fontSize: 13,
                                color: Color(0xFF6B5E51),
                                height: 1.6,
                                fontStyle: FontStyle.italic,
                              ),
                            ),
                          )
                        : const SizedBox.shrink(),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
