import 'package:flutter/material.dart';

// ─── Data ────────────────────────────────────────────────────────────────────

const _faqs = [
  _FAQ(
    question: 'What is an AAO Case Study?',
    answer:
        'An AAO case study is a published decision by the Administrative Appeals Office (AAO) of USCIS in which it reviews and rules on a previously denied or queried petition. These rulings clarify how immigration law and policy are applied and serve as precedents for similar cases.',
  ),
  _FAQ(
    question: 'Do I not need legal assistance at all?',
    answer:
        'While our DIY kit is comprehensive and has helped 200+ applicants succeed without attorneys, some complex cases may still benefit from legal review. Our kit equips you to confidently handle the process yourself, but you can always consult an attorney for added peace of mind.',
  ),
  _FAQ(
    question: 'Is RFE the end to my application?',
    answer:
        'Absolutely not. An RFE (Request for Evidence) is simply USCIS asking for more information. Our kit includes a real RFE sample and guidance on how to respond effectively to address any evidence gaps.',
  ),
  _FAQ(
    question: 'Should I choose the DIY kit or the full EB-1 visa service?',
    answer:
        'Choose the DIY kit if you\'re comfortable managing the process yourself and want to save on legal fees. Choose the full EB-1 service if you prefer hands-on expert guidance throughout your entire petition journey.',
  ),
  _FAQ(
    question: 'How do I use Overleaf?',
    answer:
        'Our kit includes a step-by-step Overleaf integration guide. Overleaf is a free online LaTeX editor — we provide your petition template pre-formatted so you can simply fill in your details and export a professional PDF.',
  ),
];

const _kitItems = [
  _KitItem(icon: '📄', title: 'Sample I-140 & I-907 Forms', desc: 'Real examples to guide your petition and premium processing request.'),
  _KitItem(icon: '⚖️', title: 'USCIS Officer Decisions + AAO Reviews', desc: 'Insights from actual USCIS decisions and Administrative Appeals Office (AAO) reviews.'),
  _KitItem(icon: '📋', title: 'Request for Evidence (RFE) Sample', desc: 'A real RFE document to help you understand what USCIS asks for and how to respond.'),
  _KitItem(icon: '✏️', title: 'Editable Petition (PDF, Word, LaTeX)', desc: 'Professionally written, editable petition used by successful candidates.', highlight: true),
  _KitItem(icon: '⬇️', title: 'Fresh I-140 Form', desc: 'Latest downloadable version to process your immigrant petition.', highlight: true),
  _KitItem(icon: '🎬', title: 'Step-by-Step Guide: How to Use the Kit', desc: 'Walkthrough to make the most of your kit, from start to submission.'),
  _KitItem(icon: '📝', title: 'Fresh I-907', desc: 'Latest downloadable form to apply for the premium processing.'),
  _KitItem(icon: '🍃', title: 'Overleaf Integration', desc: 'Step-by-step Overleaf guide with your LaTeX kit.'),
];

const _whyItems = [
  _WhyItem(emoji: '👤', title: 'Clear Instructions', desc: 'Step-by-step videos and sample petitions to help you file confidently.'),
  _WhyItem(emoji: '🛡️', title: 'Avoid RFEs', desc: 'AAO case studies show what USCIS looks for, so you can fill evidence gaps smartly.'),
  _WhyItem(emoji: '⚙️', title: 'Expert-Level Content', desc: 'Professional petition template designed to maximize your approval success.'),
];

const _videoFeatures = [
  _VideoFeature(icon: '🎬', title: 'Assistive videos for every form'),
  _VideoFeature(icon: '⚠️', title: 'Learn how to avoid common mistakes'),
  _VideoFeature(icon: '👤', title: 'Easy, self-paced format — no legal jargon'),
];

const _pricingFeatures = [
  'Full Petition Kit (used in 200+ approvals)',
  'Step-by-Step Video Guide',
  'Templates, Forms & Writing Frameworks',
  'Lifetime Access',
];

// ─── Theme colors ─────────────────────────────────────────────────────────────

const _bg = Color(0xFFF5F0E8);
const _dark = Color(0xFF1A1A1A);
const _brown = Color(0xFF8B7355);
const _tan = Color(0xFFD4C4A8);
const _yellow = Color(0xFFF4B400);
const _lightText = Color(0xFF4A4A4A);
const _mutedText = Color(0xFF6A6A6A);

// ─── Entry point ─────────────────────────────────────────────────────────────

class EB1AToolkitPage extends StatelessWidget {
  const EB1AToolkitPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: const [
              _BackNav(),
              _HeroSection(),
              _Divider(),
              _WhatsInsideSection(),
              _Divider(),
              _DIYSection(),
              _Divider(),
              _WhyChooseSection(),
              _Built200Section(),
              _VideoGuideSection(),
              _PricingSection(),
              _FAQSection(),
              SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

// ─── Back nav ─────────────────────────────────────────────────────────────────

class _BackNav extends StatelessWidget {
  const _BackNav();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
      child: Row(
        children: [
          const Icon(Icons.chevron_left, color: _brown, size: 18),
          const SizedBox(width: 4),
          Text(
            'BACK TO SERVICES',
            style: TextStyle(
              color: _brown,
              fontSize: 13,
              letterSpacing: 2,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

class _HeroSection extends StatelessWidget {
  const _HeroSection();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'DIY Toolkit for EB-1A',
            style: TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.w800,
              color: _dark,
              height: 1.1,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'EB-1A DIY Template — 200+ Approvals, No Attorneys Needed. Petition Yourself with Ease.',
            style: TextStyle(fontSize: 14, color: _lightText, height: 1.6),
          ),
          const SizedBox(height: 24),
          _YellowButton(label: 'Get the Kit Now →', onTap: () {}),
          const SizedBox(height: 16),
          Row(
            children: const [
              Icon(Icons.check_circle, color: Colors.green, size: 16),
              SizedBox(width: 6),
              Text.rich(
                TextSpan(
                  text: 'Based on ',
                  style: TextStyle(fontSize: 13, color: _lightText),
                  children: [
                    TextSpan(text: '200+', style: TextStyle(fontWeight: FontWeight.bold)),
                    TextSpan(text: ' EB-1A approvals'),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Image grid (stacked on mobile)
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Container(
              height: 200,
              color: _tan.withOpacity(0.4),
              child: const Center(
                child: Text('📄', style: TextStyle(fontSize: 60)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── What's Inside ────────────────────────────────────────────────────────────

class _WhatsInsideSection extends StatelessWidget {
  const _WhatsInsideSection();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
      child: Column(
        children: [
          _SectionHeader(
            title: "What's Inside the Kit?",
            subtitle: 'Relevant sample documents along with insider guides',
          ),
          const SizedBox(height: 24),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _kitItems.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 0.85,
            ),
            itemBuilder: (_, i) => _KitCard(item: _kitItems[i]),
          ),
        ],
      ),
    );
  }
}

class _KitCard extends StatelessWidget {
  final _KitItem item;
  const _KitCard({required this.item});

  @override
  Widget build(BuildContext context) {
    final bg = item.highlight ? _dark : Colors.white.withOpacity(0.5);
    final borderColor = item.highlight ? _dark : _tan;
    final titleColor = item.highlight ? _bg : _dark;
    final descColor = item.highlight ? _tan : _mutedText;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: bg,
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: item.highlight ? _brown.withOpacity(0.1) : _bg,
              border: Border.all(color: item.highlight ? _brown.withOpacity(0.4) : _tan),
            ),
            child: Center(child: Text(item.icon, style: const TextStyle(fontSize: 16))),
          ),
          const SizedBox(height: 10),
          Text(
            item.title,
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: titleColor),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 6),
          Expanded(
            child: Text(
              item.desc,
              style: TextStyle(fontSize: 14, color: descColor, height: 1.4),
              overflow: TextOverflow.ellipsis,
              maxLines: 4,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── DIY Section ──────────────────────────────────────────────────────────────

class _DIYSection extends StatelessWidget {
  const _DIYSection();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          RichText(
            text: const TextSpan(
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: _dark, height: 1.2),
              children: [
                TextSpan(text: 'DIY Winning Petition,\n'),
                TextSpan(text: 'No Attorney Required', style: TextStyle(color: _brown)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'You know your profile better than anyone else. Leverage that to exude your achievements in line with EB-1A criteria. Save on legal fees and take full control of your success.',
            style: TextStyle(fontSize: 13, color: _lightText, height: 1.6),
          ),
          const SizedBox(height: 24),
          _YellowButton(label: 'Get the Kit Now', onTap: () {}),
          const SizedBox(height: 24),
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Container(
              height: 180,
              color: _tan.withOpacity(0.4),
              child: const Center(child: Text('💻', style: TextStyle(fontSize: 60))),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Why Choose ───────────────────────────────────────────────────────────────

class _WhyChooseSection extends StatelessWidget {
  const _WhyChooseSection();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
      child: Column(
        children: [
          _SectionHeader(
            title: 'Why Choose Our DIY Kit?',
            subtitle: "Master your EB-1A petition affordably with YMGRad's all-in-one toolkit. Cut legal costs and preempt RFEs.",
          ),
          const SizedBox(height: 28),
          ...List.generate(_whyItems.length, (i) => _WhyCard(item: _whyItems[i])),
        ],
      ),
    );
  }
}

class _WhyCard extends StatelessWidget {
  final _WhyItem item;
  const _WhyCard({required this.item});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        children: [
          Container(
            width: 140,
            height: 100,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFEEEEEE)),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8)],
            ),
            child: Stack(
              children: [
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(height: 8, width: 60, decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(4))),
                      const SizedBox(height: 6),
                      Container(height: 8, width: 80, decoration: BoxDecoration(color: Colors.grey[200], borderRadius: BorderRadius.circular(4))),
                      const SizedBox(height: 6),
                      Container(height: 8, width: 70, decoration: BoxDecoration(color: Colors.grey[200], borderRadius: BorderRadius.circular(4))),
                    ],
                  ),
                ),
                Positioned(
                  bottom: 10,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: Container(height: 10, width: 50, decoration: BoxDecoration(color: _yellow, borderRadius: BorderRadius.circular(4))),
                  ),
                ),
                Positioned(
                  top: -6,
                  right: 10,
                  child: Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(color: _yellow, borderRadius: BorderRadius.circular(6)),
                    child: Center(child: Text(item.emoji, style: const TextStyle(fontSize: 13))),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Text(item.title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: _dark)),
          const SizedBox(height: 6),
          Text(item.desc, textAlign: TextAlign.center, style: const TextStyle(fontSize: 14, color: _mutedText, height: 1.5)),
        ],
      ),
    );
  }
}

// ─── Built on 200+ ────────────────────────────────────────────────────────────

class _Built200Section extends StatelessWidget {
  const _Built200Section();

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: _dark,
      padding: const EdgeInsets.all(28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Container(
              height: 160,
              color: _brown.withOpacity(0.3),
              child: const Center(child: Text('📋', style: TextStyle(fontSize: 60))),
            ),
          ),
          const SizedBox(height: 24),
          RichText(
            text: const TextSpan(
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: _bg, height: 1.2),
              children: [
                TextSpan(text: 'Built on '),
                TextSpan(text: '200+ Approved\n', style: TextStyle(color: _brown)),
                TextSpan(text: 'EB-1A Petitions'),
              ],
            ),
          ),
          const SizedBox(height: 14),
          const Text(
            "It's based on over 200+ real, successful petition approvals analyzed, reverse-engineered, and converted into clear, editable templates you can use for your own application.",
            style: TextStyle(fontSize: 13, color: _tan, height: 1.6),
          ),
          const SizedBox(height: 24),
          GestureDetector(
            onTap: () {},
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
              color: _brown,
              child: const Text(
                'GET THE KIT NOW',
                style: TextStyle(color: _bg, fontSize: 13, letterSpacing: 2, fontWeight: FontWeight.w600),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Video Guide ──────────────────────────────────────────────────────────────

class _VideoGuideSection extends StatelessWidget {
  const _VideoGuideSection();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
      child: Column(
        children: [
          _SectionHeader(
            title: 'Step-by-Step Video Guide',
            subtitle: 'We walk you through every part of the EB-1A petition — from choosing the right evidence to structuring your case.',
          ),
          const SizedBox(height: 24),
          ..._videoFeatures.map((f) => _VideoFeatureCard(feature: f)).toList(),
        ],
      ),
    );
  }
}

class _VideoFeatureCard extends StatelessWidget {
  final _VideoFeature feature;
  const _VideoFeatureCard({required this.feature});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.3),
        border: Border.all(color: _tan),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: _brown.withOpacity(0.1),
              border: Border.all(color: _tan),
            ),
            child: Center(child: Text(feature.icon, style: const TextStyle(fontSize: 20))),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(feature.title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: _dark)),
          ),
        ],
      ),
    );
  }
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

class _PricingSection extends StatelessWidget {
  const _PricingSection();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: _dark,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 48),
      child: Column(
        children: [
          RichText(
            textAlign: TextAlign.center,
            text: const TextSpan(
              style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800, color: _bg, height: 1.2),
              children: [
                TextSpan(text: 'The Only EB-1A Toolkit\n'),
                TextSpan(text: "You'll Ever Need", style: TextStyle(color: _brown)),
              ],
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'START YOUR EB-1A JOURNEY THE RIGHT WAY',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 14, color: _tan, letterSpacing: 2),
          ),
          const SizedBox(height: 32),
          // Price card
          Container(
            decoration: BoxDecoration(border: Border.all(color: _brown.withOpacity(0.3))),
            child: Column(
              children: [
                // Price panel
                Container(
                  color: _bg,
                  padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 20),
                  child: Column(
                    children: [
                      const Text('BUY AT', style: TextStyle(fontSize: 14, color: _brown, letterSpacing: 2)),
                      const SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Padding(
                            padding: EdgeInsets.only(top: 6),
                            child: Text('USD', style: TextStyle(fontSize: 14, color: _dark)),
                          ),
                          SizedBox(width: 4),
                          Text('200', style: TextStyle(fontSize: 52, fontWeight: FontWeight.w800, color: _dark)),
                        ],
                      ),
                      const Text('billed just once', style: TextStyle(fontSize: 13, color: _brown, letterSpacing: 1)),
                      const SizedBox(height: 20),
                      GestureDetector(
                        onTap: () {},
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          color: _brown,
                          child: const Text(
                            'BUY NOW',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: _bg, fontSize: 13, letterSpacing: 2, fontWeight: FontWeight.w600),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                // Features panel
                Container(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Just everything you need to create a winning EB-1A petition in one place.',
                        style: TextStyle(fontSize: 14, color: _tan),
                      ),
                      const SizedBox(height: 16),
                      ..._pricingFeatures.map(
                        (f) => Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: Row(
                            children: [
                              const Text('✓', style: TextStyle(color: _brown, fontSize: 14)),
                              const SizedBox(width: 10),
                              Expanded(child: Text(f, style: const TextStyle(fontSize: 14, color: _tan))),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 16,
                        runSpacing: 8,
                        children: const [
                          Text('◎ Cost-effective kit', style: TextStyle(fontSize: 13, color: _brown)),
                          Text('◎ 100% assisted', style: TextStyle(fontSize: 13, color: _brown)),
                          Text('◎ Customizable', style: TextStyle(fontSize: 13, color: _brown)),
                        ],
                      ),
                    ],
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

// ─── FAQ ─────────────────────────────────────────────────────────────────────

class _FAQSection extends StatefulWidget {
  const _FAQSection();

  @override
  State<_FAQSection> createState() => _FAQSectionState();
}

class _FAQSectionState extends State<_FAQSection> {
  int? _open = 0;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
      child: Column(
        children: [
          _SectionHeader(
            title: 'Frequently Asked Questions',
            subtitle: 'Helping you understand every step of the way',
          ),
          const SizedBox(height: 24),
          ...List.generate(_faqs.length, (i) {
            final isOpen = _open == i;
            return GestureDetector(
              onTap: () => setState(() => _open = isOpen ? null : i),
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.4),
                  border: Border.all(color: _tan),
                ),
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              _faqs[i].question,
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: _dark),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Container(
                            width: 28,
                            height: 28,
                            decoration: BoxDecoration(
                              color: isOpen ? _brown : Colors.transparent,
                              border: Border.all(color: isOpen ? _brown : _tan),
                            ),
                            child: Center(
                              child: Text(
                                isOpen ? '−' : '+',
                                style: TextStyle(color: isOpen ? Colors.white : _brown, fontSize: 18, height: 1),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (isOpen)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                        decoration: BoxDecoration(border: Border(top: BorderSide(color: _tan))),
                        child: Padding(
                          padding: const EdgeInsets.only(top: 12),
                          child: Text(
                            _faqs[i].answer,
                            style: const TextStyle(fontSize: 13, color: _lightText, height: 1.6),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}

// ─── Shared widgets ───────────────────────────────────────────────────────────

class _SectionHeader extends StatelessWidget {
  final String title;
  final String subtitle;
  const _SectionHeader({required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(title, textAlign: TextAlign.center, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: _dark)),
        const SizedBox(height: 8),
        Text(subtitle, textAlign: TextAlign.center, style: const TextStyle(fontSize: 14, color: _mutedText, height: 1.5)),
      ],
    );
  }
}

class _YellowButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  const _YellowButton({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
        decoration: BoxDecoration(color: _yellow, borderRadius: BorderRadius.circular(6)),
        child: Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: _dark)),
      ),
    );
  }
}

class _Divider extends StatelessWidget {
  const _Divider();

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      height: 1,
      color: _tan,
    );
  }
}

// ─── Data models ─────────────────────────────────────────────────────────────

class _FAQ {
  final String question;
  final String answer;
  const _FAQ({required this.question, required this.answer});
}

class _KitItem {
  final String icon;
  final String title;
  final String desc;
  final bool highlight;
  const _KitItem({required this.icon, required this.title, required this.desc, this.highlight = false});
}

class _WhyItem {
  final String emoji;
  final String title;
  final String desc;
  const _WhyItem({required this.emoji, required this.title, required this.desc});
}

class _VideoFeature {
  final String icon;
  final String title;
  const _VideoFeature({required this.icon, required this.title});
}
