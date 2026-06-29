import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/book_counselling_sheet.dart';

// ─── Theme Colors ─────────────────────────────────────────────────────────────

const _bg = Color(0xFFFDFBF7);
const _dark = Color(0xFF2D2926);
const _gold = Color(0xFFC5A059);
const _muted = Color(0xFF6B5E51);
const _border = Color(0xFFF1EDEA);
const _lightGold = Color(0xFFE6D5B8);
const _white = Colors.white;
const _darkBg = Color(0xFF1C1917);
const _subtleText = Color(0xFFA8A29E);

// ─── Data Models ──────────────────────────────────────────────────────────────

class _RoadmapStep {
  final int id;
  final String title;
  final String description;
  final IconData icon;
  final bool active;
  const _RoadmapStep({required this.id, required this.title, required this.description, required this.icon, this.active = false});
}

class _LenderColumn {
  final String category;
  final IconData icon;
  final Color iconColor;
  final String maxAmount;
  final String interestRate;
  final String collateral;
  final String tenure;
  final String processingFee;
  const _LenderColumn({required this.category, required this.icon, required this.iconColor, required this.maxAmount, required this.interestRate, required this.collateral, required this.tenure, required this.processingFee});
}

class _PartnerHighlight {
  final String bank;
  final String type;
  final String maxLoan;
  final String interestRate;
  final String processingTime;
  final String processingFee;
  final String loanType;
  const _PartnerHighlight({required this.bank, required this.type, required this.maxLoan, required this.interestRate, required this.processingTime, required this.processingFee, required this.loanType});
}

class _Benefit {
  final String title;
  final String desc;
  const _Benefit({required this.title, required this.desc});
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const _roadmapSteps = [
  _RoadmapStep(id: 1, title: 'Kickstart Your Journey', description: 'Submit your basic academic and financial profile to begin the assessment.', icon: Icons.explore_outlined),
  _RoadmapStep(id: 2, title: 'Connect with a Counselor', description: 'Expert consultation to understand your specific funding needs and eligibility.', icon: Icons.phone_outlined),
  _RoadmapStep(id: 3, title: 'Get Personalized Lender Choices', description: 'Get matched with trusted lenders, curated by our professionals for your profile.', icon: Icons.verified_user_outlined, active: true),
  _RoadmapStep(id: 4, title: 'Mark the Milestone', description: 'Smooth documentation support and final disbursement to your university.', icon: Icons.flag_outlined),
];

const _lenders = [
  _LenderColumn(category: 'PSB', icon: Icons.account_balance, iconColor: _dark, maxAmount: 'Up to ₹2 Crore', interestRate: '9.25% - 11.30%', collateral: 'No (Up to 50 Lakh)', tenure: '15 years', processingFee: '₹10,000'),
  _LenderColumn(category: 'Private Banks', icon: Icons.account_balance, iconColor: Color(0xFF2563EB), maxAmount: 'Up to ₹2 Crore', interestRate: '9.50% - 13.50%', collateral: 'No (Up to 1 Crore)', tenure: '15 years', processingFee: '0.50% - 1%'),
  _LenderColumn(category: 'NBFCs', icon: Icons.monetization_on, iconColor: Color(0xFFF97316), maxAmount: 'Up to ₹1.5 Crore', interestRate: '10% - 14%', collateral: 'No (Up to 75 Lakh)', tenure: '15 years', processingFee: '1% - 2%'),
  _LenderColumn(category: 'International', icon: Icons.language, iconColor: Color(0xFF16A34A), maxAmount: 'Up to \$200,000', interestRate: '10.5% - 14%', collateral: 'No', tenure: '15 years', processingFee: '1% - 5%'),
];

const _partners = [
  _PartnerHighlight(bank: 'SBI', type: 'PSB', maxLoan: 'Up to ₹3 Cr', interestRate: '9.15% - 10.15%', processingTime: '15 - 20 Days', processingFee: '₹10,000', loanType: 'Collateral & Non-Collateral'),
  _PartnerHighlight(bank: 'Union Bank', type: 'PSB', maxLoan: 'Up to ₹1.5 Cr', interestRate: '9.20% - 10.50%', processingTime: '12 - 18 Days', processingFee: 'Up to ₹20,000', loanType: 'Collateral'),
];

const _benefits = [
  _Benefit(title: 'We Advocate for You', desc: 'We work for you, not the banks, helping you choose from lenders that truly fit your background and goals.'),
  _Benefit(title: 'Smart Interest Rates', desc: 'Access exclusive student offers and negotiated rates that you won\'t find on public lender pages.'),
  _Benefit(title: 'Transparent Process', desc: 'From start to finish, we make it easy, with no consultation fees, no jargon, just straightforward guidance.'),
];

const _bankLogos = ['AXIS BANK', 'Credila', 'pnb', 'IDFC FIRST', 'Prodigy Finance'];

// ─── Entry Point ──────────────────────────────────────────────────────────────

class EducationLoanPage extends StatefulWidget {
  const EducationLoanPage({super.key});

  @override
  State<EducationLoanPage> createState() => _EducationLoanPageState();
}

class _EducationLoanPageState extends State<EducationLoanPage> {
  void _openBooking() => showBookCounsellingSheet(context);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      body: Stack(
        children: [
          SafeArea(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _RoadmapSection(onBooking: _openBooking),
                  _ComparisonSection(),
                  _PartnerLogosStrip(),
                  _PartnersSection(onExplore: () {}),
                  _WhyChooseSection(onBooking: _openBooking),
                  _CTABanner(onBooking: _openBooking),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Roadmap Section ─────────────────────────────────────────────────────────

class _RoadmapSection extends StatelessWidget {
  final VoidCallback onBooking;
  const _RoadmapSection({required this.onBooking});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: _bg,
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Heading
          const Text(
            'From Application to Approval –',
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: _dark, height: 1.2),
          ),
          const SizedBox(height: 4),
          _GoldShimmerText('Your Roadmap to Success', fontSize: 26),
          const SizedBox(height: 12),
          const Text(
            'A step-by-step guide to how we help you get the best education loan for studying abroad.',
            style: TextStyle(fontSize: 14, color: _muted, height: 1.5),
          ),
          const SizedBox(height: 28),

          // Roadmap steps
          _RoadmapStepsList(),

          const SizedBox(height: 28),

          // Loan preview card
          _LoanPreviewCard(),

          const SizedBox(height: 28),

          // CTA
          _DarkGoldButton(label: 'Check loan eligibility  →', onTap: onBooking),
        ],
      ),
    );
  }
}

class _RoadmapStepsList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Vertical connector line
        Positioned(
          left: 11,
          top: 20,
          bottom: 20,
          child: Container(width: 2, color: const Color(0xFFE0E0E0)),
        ),
        Column(
          children: _roadmapSteps
              .map((step) => _RoadmapStepRow(step: step))
              .toList(),
        ),
      ],
    );
  }
}

class _RoadmapStepRow extends StatelessWidget {
  final _RoadmapStep step;
  const _RoadmapStepRow({required this.step});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Dot
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: step.active ? _gold : _white,
              border: step.active ? null : Border.all(color: const Color(0xFFE0E0E0), width: 2),
              boxShadow: step.active ? [BoxShadow(color: _gold.withOpacity(0.3), blurRadius: 8)] : null,
            ),
            child: step.active ? const Icon(Icons.check_circle, color: _white, size: 16) : null,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: step.active ? _bg : Colors.transparent,
                border: step.active ? Border.all(color: _gold.withOpacity(0.3)) : null,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(step.icon, color: step.active ? _gold : _muted, size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(step.title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: _dark)),
                        if (step.active) ...[
                          const SizedBox(height: 4),
                          Text(step.description, style: const TextStyle(fontSize: 14, color: _gold, height: 1.4)),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LoanPreviewCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFE0F2F1),
        borderRadius: BorderRadius.circular(24),
      ),
      padding: const EdgeInsets.all(20),
      child: Container(
        decoration: BoxDecoration(
          color: _white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 20)],
          border: Border.all(color: _gold.withOpacity(0.1)),
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(color: Colors.red[700], borderRadius: BorderRadius.circular(8)),
                      child: const Center(child: Text('AXIS', style: TextStyle(color: _white, fontSize: 14, fontWeight: FontWeight.w900))),
                    ),
                    const SizedBox(width: 8),
                    const Text('AXIS BANK', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: _dark)),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: const [
                    Text('TENURE', style: TextStyle(fontSize: 14, color: _subtleText, fontWeight: FontWeight.w700, letterSpacing: 1)),
                    Text('14 Years ▾', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: _gold)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            _LoanRow(label: 'Max. Loan Amount', value: 'Up to 7.5 lakhs'),
            const Divider(color: _border, height: 1),
            _LoanRow(label: 'Interest Rate (%)', value: '11.50% - 12.25%'),
            const Divider(color: _border, height: 1),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text('Monthly EMI', style: TextStyle(fontSize: 13, color: _muted)),
                  Text('₹1,73,969', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: _dark)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LoanRow extends StatelessWidget {
  final String label;
  final String value;
  const _LoanRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13, color: _muted)),
          Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: _dark)),
        ],
      ),
    );
  }
}

// ─── Comparison Section ───────────────────────────────────────────────────────

class _ComparisonSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: _white,
      padding: const EdgeInsets.symmetric(vertical: 36, horizontal: 20),
      child: Column(
        children: [
          const Text(
            'Discover Funding Options, and',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: _dark, height: 1.2),
          ),
          const SizedBox(height: 4),
          _GoldShimmerText('Begin Your Journey with Ease', fontSize: 24, center: true),
          const SizedBox(height: 28),
          // Horizontally scrollable comparison cards
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _lenders.map((l) => _LenderCard(lender: l)).toList(),
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            '*Actual loan terms may vary based on individual profile and lender assessment.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 14, color: _subtleText, fontStyle: FontStyle.italic),
          ),
        ],
      ),
    );
  }
}

class _LenderCard extends StatelessWidget {
  final _LenderColumn lender;
  const _LenderCard({required this.lender});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      margin: const EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        color: _bg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _gold.withOpacity(0.12)),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(shape: BoxShape.circle, color: _white, boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 6)]),
            child: Icon(lender.icon, color: lender.iconColor, size: 20),
          ),
          const SizedBox(height: 10),
          Text(lender.category, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: _dark)),
          const SizedBox(height: 16),
          _CompRow(label: 'Max Loan', value: lender.maxAmount),
          _CompRow(label: 'Interest', value: lender.interestRate),
          _CompRow(label: 'Collateral', value: lender.collateral, highlight: true),
          _CompRow(label: 'Tenure', value: lender.tenure),
          _CompRow(label: 'Processing', value: lender.processingFee, highlight: true),
        ],
      ),
    );
  }
}

class _CompRow extends StatelessWidget {
  final String label;
  final String value;
  final bool highlight;
  const _CompRow({required this.label, required this.value, this.highlight = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: highlight ? _gold.withOpacity(0.06) : Colors.transparent,
        border: const Border(bottom: BorderSide(color: _border)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 14, color: _subtleText, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
          const SizedBox(height: 2),
          Text(value, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: highlight ? _gold : _dark)),
        ],
      ),
    );
  }
}

// ─── Partner Logos Strip ──────────────────────────────────────────────────────

class _PartnerLogosStrip extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: _bg,
      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 20),
      child: Wrap(
        alignment: WrapAlignment.center,
        spacing: 24,
        runSpacing: 16,
        children: _bankLogos
            .map((name) => Opacity(
                  opacity: 0.6,
                  child: Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: _dark, letterSpacing: -0.5)),
                ))
            .toList(),
      ),
    );
  }
}

// ─── Partners Section ─────────────────────────────────────────────────────────

class _PartnersSection extends StatelessWidget {
  final VoidCallback onExplore;
  const _PartnersSection({required this.onExplore});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: _darkBg,
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Our', style: TextStyle(fontSize: 40, fontWeight: FontWeight.w800, color: _white, height: 1.1)),
          _GoldShimmerText('Partners', fontSize: 40),
          const SizedBox(height: 12),
          const Text(
            'Explore our curated network of trusted global lenders offering exclusive terms for our students.',
            style: TextStyle(fontSize: 14, color: Color(0x80FFFFFF), height: 1.5),
          ),
          const SizedBox(height: 24),
          // Horizontally scrollable partner cards
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _partners.map((p) => _PartnerCard(partner: p)).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class _PartnerCard extends StatelessWidget {
  final _PartnerHighlight partner;
  const _PartnerCard({required this.partner});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 280,
      margin: const EdgeInsets.only(right: 16, bottom: 8),
      decoration: BoxDecoration(
        color: _white,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 24)],
      ),
      child: Stack(
        children: [
          Positioned(
            top: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: _gold.withOpacity(0.1),
                borderRadius: const BorderRadius.only(topRight: Radius.circular(28), bottomLeft: Radius.circular(20)),
              ),
              child: Text(partner.type, style: const TextStyle(fontSize: 14, color: _gold, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(22),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(color: _bg, borderRadius: BorderRadius.circular(12), border: Border.all(color: _gold.withOpacity(0.1))),
                      child: Center(
                        child: Text(partner.bank[0], style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: _gold)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(partner.bank, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: _dark)),
                  ],
                ),
                const SizedBox(height: 20),
                _PartnerRow(label: 'Maximum Loan', value: partner.maxLoan),
                _PartnerRow(label: 'Interest Rate', value: partner.interestRate),
                _PartnerRow(label: 'Processing Time', value: partner.processingTime),
                _PartnerRow(label: 'Processing Fee', value: partner.processingFee),
                const SizedBox(height: 12),
                const Divider(color: _border),
                const SizedBox(height: 10),
                const Text('LOAN TYPE', style: TextStyle(fontSize: 14, color: _subtleText, fontWeight: FontWeight.w700, letterSpacing: 1.5)),
                const SizedBox(height: 4),
                Text(partner.loanType, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: _dark)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _PartnerRow extends StatelessWidget {
  final String label;
  final String value;
  const _PartnerRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label.toUpperCase(), style: const TextStyle(fontSize: 14, color: _subtleText, fontWeight: FontWeight.w700, letterSpacing: 1)),
          const SizedBox(height: 2),
          Text(value, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: _dark)),
        ],
      ),
    );
  }
}

// ─── Why Choose Section ───────────────────────────────────────────────────────

class _WhyChooseSection extends StatelessWidget {
  final VoidCallback onBooking;
  const _WhyChooseSection({required this.onBooking});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: _white,
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Heading
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              const Text('Why choose ', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: _dark)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(color: _dark, borderRadius: BorderRadius.circular(12)),
                child: const Text('EduLeaderGlobal', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: _gold)),
              ),
              const Text('?', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: _dark)),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'At our core, we prioritize financial inclusivity by offering unbiased guidance so every student can get access to world-class education.',
            style: TextStyle(fontSize: 14, color: _muted, height: 1.6),
          ),
          const SizedBox(height: 28),

          // Benefits
          ..._benefits.map((b) => _BenefitRow(benefit: b)),

          const SizedBox(height: 28),
          _DarkGoldButton(label: 'Get loan options →', onTap: onBooking),
        ],
      ),
    );
  }
}

class _BenefitRow extends StatelessWidget {
  final _Benefit benefit;
  const _BenefitRow({required this.benefit});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(shape: BoxShape.circle, color: _gold.withOpacity(0.1)),
            child: const Icon(Icons.check_circle, color: _gold, size: 16),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${benefit.title}:', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: _dark)),
                const SizedBox(height: 4),
                Text(benefit.desc, style: const TextStyle(fontSize: 13, color: _muted, height: 1.5)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

class _CTABanner extends StatelessWidget {
  final VoidCallback onBooking;
  const _CTABanner({required this.onBooking});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Container(
        decoration: BoxDecoration(
          color: _dark,
          borderRadius: BorderRadius.circular(32),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.25), blurRadius: 40, offset: const Offset(0, 20))],
          border: Border.all(color: _white.withOpacity(0.05)),
        ),
        padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
        child: Column(
          children: [
            const Text(
              'Ready to fund your',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 30, fontWeight: FontWeight.w800, color: _white, height: 1.2),
            ),
            const SizedBox(height: 4),
            _GoldShimmerText('study abroad dream?', fontSize: 28, center: true, italic: true),
            const SizedBox(height: 16),
            const Text(
              'Our expert advisors are standing by to architect your financial roadmap to global success.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: Color(0x80FFFFFF), height: 1.6),
            ),
            const SizedBox(height: 32),
            _GoldButton(label: 'Book Premium Consultation  →', onTap: onBooking),
            const SizedBox(height: 14),
            GestureDetector(
              onTap: () => context.go('/services'),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  border: Border.all(color: _white.withOpacity(0.15)),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Text(
                  'LEARN MORE',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: _white, fontSize: 13, fontWeight: FontWeight.w900, letterSpacing: 2),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Booking Sheet (modal replacement) ───────────────────────────────────────

// Removed local _BookingSheet in favor of global widget

// Removed local _BookingField in favor of global widget

// ─── Shared Widgets ───────────────────────────────────────────────────────────

class _GoldShimmerText extends StatelessWidget {
  final String text;
  final double fontSize;
  final bool center;
  final bool italic;
  const _GoldShimmerText(this.text, {required this.fontSize, this.center = false, this.italic = false});

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      shaderCallback: (bounds) => const LinearGradient(
        colors: [Color(0xFFC5A059), Color(0xFFE6D5B8), Color(0xFFD4AF37), Color(0xFFC5A059)],
      ).createShader(bounds),
      child: Text(
        text,
        textAlign: center ? TextAlign.center : TextAlign.start,
        style: TextStyle(
          fontSize: fontSize,
          fontWeight: FontWeight.w800,
          color: _white,
          fontStyle: italic ? FontStyle.italic : FontStyle.normal,
          height: 1.2,
        ),
      ),
    );
  }
}

class _DarkGoldButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  const _DarkGoldButton({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
        decoration: BoxDecoration(color: _dark, borderRadius: BorderRadius.circular(14)),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(label, style: const TextStyle(color: _gold, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
          ],
        ),
      ),
    );
  }
}

class _GoldButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  const _GoldButton({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(color: _gold, borderRadius: BorderRadius.circular(14)),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: const TextStyle(color: _dark, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1.5),
        ),
      ),
    );
  }
}
