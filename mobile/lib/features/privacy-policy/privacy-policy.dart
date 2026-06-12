import 'package:flutter/material.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F4F1),
      appBar: AppBar(
        elevation: 0,
        centerTitle: true,
        backgroundColor: const Color(0xFFF7F4F1),
        title: const Text(
          "Privacy Policy",
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
          children: [
            // Hero Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFF4A2C22),
                    Color(0xFF2E1B17),
                  ],
                ),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.privacy_tip_rounded,
                    color: Color(0xFFC79A63),
                    size: 42,
                  ),
                  SizedBox(height: 16),
                  Text(
                    "Privacy Policy",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 10),
                  Text(
                    "Your personal information is protected and handled with transparency, security, and care.",
                    style: TextStyle(
                      color: Colors.white70,
                      height: 1.6,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            _policyCard(
              Icons.person_outline_rounded,
              "Information We Collect",
              "We may collect your name, email address, phone number, academic details, study preferences, and consultation information when you use our services.",
            ),

            _policyCard(
              Icons.settings_outlined,
              "How We Use Your Information",
              "Your information is used to provide educational counseling, university recommendations, application assistance, customer support, and service improvements.",
            ),

            _policyCard(
              Icons.security_outlined,
              "Data Security",
              "We implement industry-standard security measures to protect your information against unauthorized access, disclosure, or misuse.",
            ),

            _policyCard(
              Icons.cookie_outlined,
              "Cookies & Analytics",
              "We may use cookies and analytics tools to improve website functionality, user experience, and service performance.",
            ),

            _policyCard(
              Icons.public_outlined,
              "Third-Party Services",
              "Our services may integrate with universities, payment gateways, analytics providers, and other trusted partners necessary to deliver our services.",
            ),

            _policyCard(
              Icons.verified_user_outlined,
              "Your Rights",
              "You may request access, correction, or deletion of your personal data subject to applicable legal requirements.",
            ),

            _policyCard(
              Icons.update_outlined,
              "Policy Updates",
              "We may update this Privacy Policy periodically. Any changes will be reflected on this page and become effective immediately upon publication.",
            ),

            _policyCard(
              Icons.contact_support_outlined,
              "Contact Us",
              "If you have any questions regarding this Privacy Policy, please contact our support team for assistance.",
            ),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _policyCard(
      IconData icon,
      String title,
      String content,
      ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(.04),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: const Color(0xFFC79A63).withOpacity(.15),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(
              icon,
              color: const Color(0xFFC79A63),
            ),
          ),

          const SizedBox(width: 16),

          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Color(0xFF3B2A24),
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  content,
                  style: const TextStyle(
                    color: Colors.black87,
                    height: 1.6,
                    fontSize: 14,
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