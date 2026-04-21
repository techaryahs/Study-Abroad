import 'package:flutter/material.dart';
import '../../core/theme.dart';

class FAQScreen extends StatelessWidget {
  const FAQScreen({super.key});

  final List<Map<String, String>> faqs = const [
    {
      "q": "Do you only help for applications to the US? What about other countries?",
      "a": "We support applications to most countries including but not limited to USA, Canada, Germany, Ireland, UK, Australia, India, and Singapore."
    },
    {
      "q": "Does the price include GST/Taxes?",
      "a": "All charges on the website are inclusive of the GST/Taxes."
    },
    {
      "q": "Since the services are offered online, how do we ensure the process will be as smooth as an offline consulting service?",
      "a": "Over the years, we have worked with clients from over 55 countries. We believe the most important part of any service is the support. Hence, we go to tremendous lengths to ensure that you are getting the support you need, as quickly as possible. A dedicated support representative is provided to you on WhatsApp for both calls and texts during working hours. In case you are unable to reach your support representative on WhatsApp, we also have a live chat feature on the website where we respond instantly during working hours (and over emails for any queries received outside working hours). Apart from that, your dashboard will be your single point of access for any status updates regarding the services. Most of our clients have rated the experience superior to any offline consulting firm that you repeatedly need to visit for status updates or availing services. We follow strict timelines and are always a message/call away!"
    },
    {
      "q": "What is the best time for me to enroll in the services?",
      "a": "For the best support, we advise enrolling in advance. Please note that you can avail of the service you buy anytime within 1 year of your purchase. Hence, many students enroll with us as early as a year in advance and enjoy our support in your profile building and applications."
    },
    {
      "q": "Can I divide the charges between my co-author(s) and I?",
      "a": "Yes, you can divide the charges between you and your co-authors. Please contact our support team for more information."
    },
    {
      "q": "Are the timelines mentioned on the website followed religiously?",
      "a": "Please note that these begin from the date of your input submission (if required for the service you are going for). The timelines as mentioned on the service purchase bar above are extremely accurate in most cases. Our current record shows that 98.3% of the deadlines have been met as mentioned on the website. However, in extremely rare cases, the average timeline mentioned on the website may be exceeded. This happens with less than 2 cases for every 98 that we deliver on time."
    },
    {
      "q": "Are there any ongoing discount offers?",
      "a": "Please keep an eye out for any active promo codes or seasonal discounts available directly on our website or our social media properties."
    },
    {
      "q": "Are the publishing charges covered?",
      "a": "Yes, the publishing charges are covered as part of our comprehensive service package."
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F6F2),

      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "FAQ",
          style: TextStyle(color: Colors.black),
        ),
      ),

      // ✅ CENTERED BODY (LIKE WEBSITE)
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
                          fontSize: 36,
                          fontWeight: FontWeight.w900,
                          color: Colors.black,
                        ),
                      ),
                      TextSpan(
                        text: "QUESTIONS!",
                        style: TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.gold,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 30),

              // 🔥 FAQ LIST
              ...faqs.map((faq) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 18),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 22),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade300),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
                      )
                    ],
                  ),
                  child: Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text(
      faq["q"]!,
      style: const TextStyle(
        fontSize: 15,
        fontWeight: FontWeight.w600,
      ),
    ),
    const SizedBox(height: 10),
    Text(
      faq["a"] ?? "",
      style: const TextStyle(
        fontSize: 13,
        color: Colors.grey,
      ),
    ),
  ],
),
                );
              }).toList(),
            ],
          ),
        ),
      ),
    );
  }
}