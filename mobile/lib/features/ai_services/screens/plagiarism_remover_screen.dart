import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme.dart';
import '../../../models/checkout_item.dart';
import '../../../widgets/checkout_sheet.dart';

class PlagiarismRemoverScreen extends StatefulWidget {
  const PlagiarismRemoverScreen({super.key});

  @override
  State<PlagiarismRemoverScreen> createState() => _PlagiarismRemoverScreenState();
}

class _PlagiarismRemoverScreenState extends State<PlagiarismRemoverScreen> {
  final TextEditingController _inputController = TextEditingController();
  String _output = "";
  bool _isLoading = false;
  String _intensity = "Max";
  int? _faqOpen;
  String? _selectedPlan;

  final List<Map<String, dynamic>> _detectors = [
    {'name': 'Turnitin', 'icon': Icons.language},
    {'name': 'GPTZero', 'icon': Icons.diamond},
    {'name': 'Originality.ai', 'icon': Icons.description},
    {'name': 'Grammarly', 'icon': Icons.edit},
    {'name': 'Copyleaks', 'icon': Icons.search},
    {'name': 'Quillbot', 'icon': Icons.smart_toy},
  ];

  final List<Map<String, dynamic>> _plans = [
    {
      'name': 'Scholar',
      'price': 999,
      'original': 2000,
      'features': ['20,000 words /mo', 'Light & Medium levels', 'Grammar boost', 'Standard support'],
      'highlight': false,
      'badge': null,
    },
    {
      'name': 'Academic',
      'price': 2999,
      'original': 5000,
      'features': ['100,000 words /mo', 'All humanize levels', 'Plagiarism bypass', 'Priority support'],
      'highlight': true,
      'badge': 'RECOMMENDED',
    },
    {
      'name': 'Researcher',
      'price': 12999,
      'original': 20000,
      'features': ['Unlimited words', 'API Access', 'Team collaboration', 'Dedicated Manager'],
      'highlight': false,
      'badge': null,
    },
  ];

  final List<Map<String, String>> _faqs = [
    {
      'q': 'How does this tool bypass AI detection?',
      'a': 'Our tool rewrites content using advanced high-fidelity paraphrasing that replicates natural human variations in syntax and vocabulary.',
    },
    {
      'q': 'Will the meaning of my text change?',
      'a': 'No. Our system is engineered to preserve semantic integrity - the core meaning and academic rigor of your work remain untouched.',
    },
    {
      'q': 'Is my data safe and confidential?',
      'a': 'Absolutely. We employ zero-retention protocols. Your data is processed in-memory and permanently erased immediately after generation.',
    },
  ];

  void _handleTransform() {
    if (_inputController.text.trim().isEmpty) return;
    setState(() {
      _isLoading = true;
      _output = "";
    });
    Future.delayed(const Duration(milliseconds: 1800), () {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _output = "This is your humanized output. Our advanced rewriting engine has transformed your AI-generated content into natural, human-sounding prose. The meaning and intent remain fully intact while all detectable AI patterns have been removed.";
      });
    });
  }

  void _selectPlan(String name) {
    setState(() {
      _selectedPlan = name;
    });
  }

  void _showPlanSummary() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Our advisors are ready to guide your content refinement. We will contact you shortly.'),
        backgroundColor: Color(0xFF2D2926),
      ),
    );
  }

  Widget _buildBadge() {
    return Center(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(100),
          border: Border.all(color: AppTheme.gold.withAlpha(77)),
        ),
        child: const Text('LINGUISTIC INTEGRITY PROTOCOL',
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.gold, letterSpacing: 1.5)),
      ),
    );
  }

  Widget _buildHero() {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0x14C5A059), Colors.transparent],
        ),
        borderRadius: BorderRadius.circular(32),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          _buildBadge(),
          const SizedBox(height: 24),
          const Text('AI Remover &\nBypass Tool',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 34, fontWeight: FontWeight.w800, fontFamily: 'Playfair Display', height: 1.05)),
          const SizedBox(height: 16),
          const Text('Refine and humanize your academic drafts to ensure maximum credibility and zero detection flagging.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: AppTheme.textSecondary, fontStyle: FontStyle.italic, height: 1.6)),
        ],
      ),
    );
  }

  Widget _buildEditorCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [BoxShadow(color: AppTheme.gold.withAlpha(15), blurRadius: 40, offset: const Offset(0, 20))],
        border: Border.all(color: AppTheme.gold.withAlpha(26)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('SOURCE DRAFT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.gold, letterSpacing: 1)),
          const SizedBox(height: 12),
          TextField(
            controller: _inputController,
            maxLines: 6,
            decoration: InputDecoration(
              hintText: 'Paste your content here to begin humanization...',
              hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
              filled: true,
              fillColor: const Color(0xFFFAFAFA),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide.none),
            ),
          ),
          const SizedBox(height: 24),
          const Text('HUMANIZE INTENSITY', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: 1)),
          const SizedBox(height: 12),
          Row(
            children: ['Light', 'Medium', 'Max'].map((level) {
              final selected = _intensity == level;
              return Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _intensity = level),
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      color: selected ? AppTheme.darkBrown : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: selected ? AppTheme.darkBrown : const Color(0xFFF1EDEA)),
                    ),
                    child: Center(
                      child: Text(level, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: selected ? Colors.white : AppTheme.textSecondary)),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: _handleTransform,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gold,
                foregroundColor: AppTheme.darkBrown,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 0,
              ),
              child: _isLoading
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.darkBrown))
                  : const Text('TRANSFORM', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.5)),
            ),
          ),
          if (_output.isNotEmpty) ...[
            const SizedBox(height: 32),
            const Text('REFINED CONTENT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: 1)),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.backgroundAlt,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.gold.withAlpha(26)),
              ),
              child: Text('"$_output"', style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary, fontStyle: FontStyle.italic, height: 1.6)),
            ).animate().fadeIn(),
          ],
        ],
      ),
    );
  }

  Widget _buildDetectors() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Center(
          child: Text('VERIFICATION PROTOCOLS BYPASSED',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFFA8A29E), letterSpacing: 2)),
        ),
        const SizedBox(height: 24),
        Wrap(
          alignment: WrapAlignment.center,
          spacing: 16,
          runSpacing: 16,
          children: _detectors.map((detector) {
            return Container(
              width: 90,
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFF1EDEA)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(detector['icon'], size: 22, color: AppTheme.gold),
                  const SizedBox(height: 12),
                  Text(detector['name'], textAlign: TextAlign.center, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppTheme.textSecondary)),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildPerformanceStats() {
    final stats = [
      {'label': 'Predictability Reduction', 'value': '99.2%'},
      {'label': 'Semantic Mirroring', 'value': '100.0%'},
      {'label': 'Detection Success Rate', 'value': '98.6%'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Audited for Academic Zero-Detection', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
        const SizedBox(height: 14),
        Text('Our humanizer uses state-of-the-art linguistic modeling to replicate human burstiness and perplexity markers that AI detectors use for classification.',
            style: Theme.of(context).textTheme.bodyMedium),
        const SizedBox(height: 20),
        Column(
          children: stats.map((item) {
            final percentage = double.parse(item['value']!.replaceAll('%', '')) / 100;
            return Padding(
              padding: const EdgeInsets.only(bottom: 18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(item['label']!, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 1)),
                      Text(item['value']!, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      height: 8,
                      width: double.infinity,
                      color: const Color(0xFFF1EDEA),
                      child: FractionallySizedBox(
                        widthFactor: percentage,
                        alignment: Alignment.centerLeft,
                        child: Container(color: AppTheme.gold),
                      ),
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildFeatureGrid() {
    final features = [
      {'icon': Icons.shield, 'title': 'Zero-Log', 'description': 'No data is stored post-generation'},
      {'icon': Icons.memory, 'title': 'Live Engine', 'description': 'Neural networks update every 6 hours'},
      {'icon': Icons.bolt, 'title': 'Instant', 'description': '10k words processed in < 3 seconds'},
      {'icon': Icons.task_alt, 'title': 'Certified', 'description': 'Passes Turnitin & Copyleaks'},
    ];

    return Wrap(
      spacing: 16,
      runSpacing: 16,
      children: features.map((item) {
        return Container(
          width: (MediaQuery.of(context).size.width - 72) / 2,
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFFF1EDEA)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(item['icon'] as IconData, color: AppTheme.gold),
              const SizedBox(height: 14),
              Text(item['title'] as String, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
              const SizedBox(height: 8),
              Text(item['description'] as String, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.5)),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildPricingSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Linguistic Access Tiers', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
        const SizedBox(height: 10),
        Text('Select a protocol that aligns with your research volume', style: Theme.of(context).textTheme.bodyMedium),
        const SizedBox(height: 20),
        Column(
          children: _plans.map((plan) {
            final selected = _selectedPlan == plan['name'];
            return GestureDetector(
              onTap: () => _selectPlan(plan['name'] as String),
              child: Container(
                margin: const EdgeInsets.only(bottom: 16),
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: selected ? AppTheme.darkBrown : Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: selected ? AppTheme.darkBrown : const Color(0xFFF1EDEA)),
                  boxShadow: selected
                      ? [BoxShadow(color: AppTheme.gold.withAlpha(46), blurRadius: 40, offset: const Offset(0, 18))]
                      : null,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (plan['badge'] != null)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(color: AppTheme.gold, borderRadius: BorderRadius.circular(12)),
                        child: Text(plan['badge'] as String, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800)),
                      ),
                    if (plan['badge'] != null) const SizedBox(height: 14),
                    Text(plan['name'] as String, style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: selected ? Colors.white : AppTheme.textPrimary)),
                    const SizedBox(height: 10),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('₹${plan['price'] as int}', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: selected ? Colors.white : AppTheme.textPrimary)),
                        const SizedBox(width: 10),
                        Text('₹${plan['original'] as int}', style: TextStyle(fontSize: 13, color: selected ? Colors.white70 : AppTheme.textSecondary, decoration: TextDecoration.lineThrough)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: (plan['features'] as List<String>).map((feature) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Row(
                          children: [
                            Icon(Icons.check_circle, size: 18, color: selected ? Colors.white : AppTheme.gold),
                            const SizedBox(width: 10),
                            Expanded(child: Text(feature, style: TextStyle(fontSize: 12, color: selected ? Colors.white70 : AppTheme.textSecondary))),
                          ],
                        ),
                      )).toList(),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () => _selectPlan(plan['name'] as String),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: selected ? Colors.white : AppTheme.gold,
                          foregroundColor: selected ? AppTheme.darkBrown : AppTheme.darkBrown,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: Text(selected ? 'Selected' : 'Choose Plan', style: const TextStyle(fontWeight: FontWeight.w900)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 12),
        if (_selectedPlan != null)
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
            onPressed: _showPlanSummary,
            child: const Text('Consult Expert'),
          ),
        ),
      ],
    );
  }

  Widget _buildFaqSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Common Inquiries', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800, fontStyle: FontStyle.italic)),
        const SizedBox(height: 20),
        Column(
          children: _faqs.asMap().entries.map((entry) {
            final index = entry.key;
            final faq = entry.value;
            final open = _faqOpen == index;
            return Column(
              children: [
                GestureDetector(
                  onTap: () => setState(() => _faqOpen = open ? null : index),
                  child: Container(
                    color: Colors.transparent,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(faq['q']!, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppTheme.textPrimary, letterSpacing: 0.2)),
                        ),
                        AnimatedRotation(
                          turns: open ? 0.125 : 0,
                          duration: const Duration(milliseconds: 200),
                          child: const Icon(Icons.add, color: AppTheme.gold, size: 24),
                        ),
                      ],
                    ),
                  ),
                ),
                if (open)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.only(bottom: 18),
                    child: Text('"${faq['a']}"', style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary, height: 1.6, fontStyle: FontStyle.italic)),
                  ),
                const Divider(color: Color(0xFFF1EDEA), height: 1),
              ],
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildCta() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(36),
        border: Border.all(color: const Color(0xFFF1EDEA)),
        boxShadow: [BoxShadow(color: AppTheme.gold.withAlpha(20), blurRadius: 40, offset: const Offset(0, 20))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text('Enhance Your Academic Credibility Today', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800, height: 1.1)),
          const SizedBox(height: 16),
          const Text('Join 50,000+ researchers and students who trust our humanization engine for their most critical submissions.', textAlign: TextAlign.center, style: TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.6)),
          const SizedBox(height: 24),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            alignment: WrapAlignment.center,
            children: [
              ElevatedButton(
                onPressed: _showPlanSummary,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.darkBrown,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                child: const Text('Start Expert Consult'),
              ),
              OutlinedButton(
                onPressed: () {},
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppTheme.borderLight),
                  foregroundColor: AppTheme.darkBrown,
                  padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                child: const Text('View Case Studies'),
              ),
            ],
          ),
        ],
      ),
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
        centerTitle: true,
        title: const Text('AI REMOVER & BYPASS', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 1.5, color: AppTheme.textPrimary)),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHero(),
              const SizedBox(height: 28),
              _buildEditorCard(),
              const SizedBox(height: 32),
              _buildDetectors(),
              const SizedBox(height: 32),
              _buildPerformanceStats(),
              const SizedBox(height: 28),
              _buildFeatureGrid(),
              const SizedBox(height: 32),
              _buildPricingSection(),
              const SizedBox(height: 32),
              _buildFaqSection(),
              const SizedBox(height: 32),
              _buildCta(),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
