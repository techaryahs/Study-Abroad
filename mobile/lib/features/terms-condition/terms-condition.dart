import 'package:flutter/material.dart';

class TermsConditionScreen extends StatelessWidget {
  const TermsConditionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F4F1),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: const Color(0xFFF7F4F1),
        centerTitle: true,
        title: const Text(
          "Terms & Conditions",
          style: TextStyle(
            color: Color(0xFF3B2A24),
            fontWeight: FontWeight.bold,
          ),
        ),
        iconTheme: const IconThemeData(
          color: Color(0xFF3B2A24),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _section(
              "1. Acceptance of Terms",
              "By accessing and using International EduLeader Council services, you agree to comply with these Terms and Conditions.",
            ),
            _section(
              "2. Educational Guidance",
              "Our platform provides educational counseling, university guidance, application assistance, visa support, and related services. Admission decisions remain solely with the respective institutions.",
            ),
            _section(
              "3. User Responsibilities",
              "Users must provide accurate information during registration and consultation processes. Any false information may result in suspension of services.",
            ),
            _section(
              "4. Payments & Fees",
              "Certain services may require payment. All fees are clearly communicated before purchase and are subject to applicable taxes.",
            ),
            _section(
              "5. Intellectual Property",
              "All content, branding, logos, designs, and materials available on this platform are the intellectual property of International EduLeader Council.",
            ),
            _section(
              "6. Limitation of Liability",
              "We are not responsible for university admission decisions, visa approvals, scholarship outcomes, or external third-party actions.",
            ),
            _section(
              "7. Privacy",
              "Use of this platform is also governed by our Privacy Policy regarding collection, storage, and processing of user information.",
            ),
            _section(
              "8. Changes to Terms",
              "We reserve the right to update these Terms & Conditions at any time. Continued use of the platform indicates acceptance of revised terms.",
            ),
            _section(
              "9. Contact Information",
              "For questions regarding these Terms & Conditions, please contact our support team.",
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _section(String title, String content) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.bold,
              color: Color(0xFF3B2A24),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            content,
            style: const TextStyle(
              fontSize: 14,
              height: 1.6,
              color: Colors.black87,
            ),
          ),
        ],
      ),
    );
  }
}