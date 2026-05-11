import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class FAQScreen extends StatelessWidget {
  const FAQScreen({super.key});

  final List<Map<String, String>> faqs = const [
    {
      "q": "Do you only help for applications to the US? What about other countries?",
      "a": "At IEC, we support applications to most countries including but not limited to the USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore."
    },
    {
      "q": "Does the price include GST/Taxes?",
      "a": "All charges for IEC services are inclusive of applicable GST/Taxes."
    },
    {
      "q": "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
      "a": "At the International Eduleader Council (IEC), we have worked with clients from over 55 countries. We believe the most important part of any service is support. A dedicated support representative is provided to you on WhatsApp for both calls and texts. You can also use our live chat feature, and your IEC dashboard will be your single point of access for all real-time status updates."
    },
    {
      "q": "What is the best time for me to enroll in the services?",
      "a": "For the best support, we advise enrolling in advance. You can avail of the IEC service you purchase anytime within 1 year. Hence, many students enroll with us as early as a year in advance to enjoy our support in profile building and applications."
    },
    {
      "q": "Can I divide the charges between my co-author(s) and I?",
      "a": "Yes, for our research and publication protocols, you can divide the charges between you and your co-authors. Please contact our support team for more information."
    },
    {
      "q": "Are the timelines mentioned on the website followed religiously?",
      "a": "Our current record shows that 98.3% of IEC's deadlines have been met precisely as mentioned on the platform. These timelines begin from the date of your input submission. In extremely rare cases, the average timeline may be slightly exceeded, but our team ensures prompt delivery."
    },
    {
      "q": "Are there any ongoing discount offers?",
      "a": "Please keep an eye out for any active promo codes or seasonal discounts available directly on the IEC website or our official social media properties."
    },
    {
      "q": "Are the publishing charges covered?",
      "a": "Yes, for our research services, publishing charges are covered as part of our comprehensive IEC package."
    },
    {
      "q": "Does IEC provide assistance with scholarships and financial aid?",
      "a": "Absolutely. Our expert counsellors help you identify and apply for various merit-based and need-based scholarships globally, including profile-specific fee waivers and honors awards."
    },
    {
      "q": "How does the AI SOP Generator work?",
      "a": "Our AI SOP Generator uses advanced algorithms trained on successful Ivy League essays to help you draft a highly personalized, compelling Statement of Purpose that highlights your unique strengths to admission committees."
    },
    {
      "q": "Do you help with visa applications and interviews?",
      "a": "Yes! We offer end-to-end visa guidance and conduct AI-driven Mock Interviews to ensure you are fully prepared, confident, and familiar with the questions asked by visa officers."
    },
    {
      "q": "What if my GPA is low? Can I still get into a top university?",
      "a": "Yes, a holistic profile involves much more than just a GPA. Our expert advisors help you highlight your strengths, work experience, research papers, and extra-curriculars to significantly improve your chances at top global universities."
    },
    {
      "q": "How do I communicate with my assigned counsellor?",
      "a": "Once enrolled, you can directly chat with your counsellor through the IEC app, schedule 1-on-1 video meetings via our integrated platform, and track your application progress in real-time on your dashboard."
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppTheme.textPrimary),
          onPressed: () => context.canPop() ? context.pop() : context.go('/'),
        ),
        title: const Text(
          "FAQ",
          style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.w800),
        ),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 900),
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 30),
            children: [
              // 🔥 TITLE
              Center(
                child: RichText(
                  textAlign: TextAlign.center,
                  text: const TextSpan(
                    children: [
                      TextSpan(
                        text: "FREQUENTLY ASKED ",
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      TextSpan(
                        text: "QUESTIONS!",
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.gold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 40),

              // 🔥 FAQ LIST
              ...faqs.map((faq) => _FAQItem(faq: faq)),
            ],
          ),
        ),
      ),
    );
  }
}

class _FAQItem extends StatefulWidget {
  final Map<String, String> faq;
  const _FAQItem({required this.faq});

  @override
  State<_FAQItem> createState() => _FAQItemState();
}

class _FAQItemState extends State<_FAQItem> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _isExpanded ? AppTheme.gold.withOpacity(0.5) : AppTheme.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          )
        ],
      ),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          tilePadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          childrenPadding: const EdgeInsets.only(left: 24, right: 24, bottom: 24),
          iconColor: AppTheme.gold,
          collapsedIconColor: AppTheme.textSecondary,
          title: Text(
            widget.faq["q"]!,
            style: TextStyle(
              fontSize: 15,
              fontWeight: _isExpanded ? FontWeight.w900 : FontWeight.w700,
              color: _isExpanded ? AppTheme.gold : AppTheme.textPrimary,
            ),
          ),
          trailing: AnimatedRotation(
            turns: _isExpanded ? 0.5 : 0,
            duration: const Duration(milliseconds: 300),
            child: Icon(
              _isExpanded ? Icons.remove_circle_outline_rounded : Icons.add_circle_outline_rounded,
              color: _isExpanded ? AppTheme.gold : AppTheme.textSecondary,
              size: 26,
            ),
          ),
          onExpansionChanged: (expanded) {
            setState(() {
              _isExpanded = expanded;
            });
          },
          children: [
            Text(
              widget.faq["a"] ?? "",
              style: const TextStyle(
                fontSize: 14,
                height: 1.6,
                fontWeight: FontWeight.w500,
                color: AppTheme.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}