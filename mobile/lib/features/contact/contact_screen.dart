import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';

class ContactScreen extends StatefulWidget {
  const ContactScreen({super.key});

  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen> {
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _msgCtrl = TextEditingController();

  bool _isLoading = false;
  bool _sent = false;

  bool _isValidEmail(String email) {
    return RegExp(r'^[^@]+@[^@]+\.[^@]+$').hasMatch(email);
  }

  Future<void> _send() async {
    if (_nameCtrl.text.isEmpty ||
        _emailCtrl.text.isEmpty ||
        _msgCtrl.text.isEmpty ||
        !_isValidEmail(_emailCtrl.text)) {
      _showSnack("Please fill all fields correctly");
      return;
    }

    setState(() => _isLoading = true);

    try {
      final res = await ApiClient.instance.post('/api/enquiry', data: {
        'name': _nameCtrl.text.trim(),
        'email': _emailCtrl.text.trim(),
        'message': _msgCtrl.text.trim(),
      });

      if (res.statusCode == 201) {
        setState(() {
          _sent = true;
        });

        _nameCtrl.clear();
        _emailCtrl.clear();
        _msgCtrl.clear();
      } else {
        _showSnack("Failed to send message");
      }
    } catch (e) {
      _showSnack("Something went wrong");
    }

    setState(() => _isLoading = false);
  }

  void _showSnack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isTablet = width > 600;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: AppTheme.background,
        title: const Text("Contact Us"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 800),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(),
                const SizedBox(height: 24),
                _buildContactCards(isTablet),
                const SizedBox(height: 32),
                _sent ? _successBox() : _buildForm(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Get in Touch",
          style: TextStyle(
            fontSize: 26,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          "Have a project or question? We’d love to hear from you.",
          style: TextStyle(color: AppTheme.textSecondary),
        ),
      ],
    ).animate().fadeIn(duration: 400.ms);
  }

  Widget _buildContactCards(bool isTablet) {
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: [
        _contactCard(
          Icons.phone,
          "WhatsApp",
          "+91 8657869659",
          () => launchUrl(Uri.parse('https://wa.me/918657869659')),
        ),
        _contactCard(
          Icons.email,
          "Email",
          "info@aryahsworld.com",
          () => launchUrl(Uri.parse('mailto:info@aryahsworld.com')),
        ),
        _contactCard(
          Icons.location_on,
          "Office",
          "Navi Mumbai, India",
          null,
          full: true,
        ),
      ],
    ).animate().fadeIn(delay: 100.ms);
  }

  Widget _buildForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "SEND MESSAGE",
          style: TextStyle(
            fontSize: 12,
            letterSpacing: 2,
            fontWeight: FontWeight.bold,
            color: AppTheme.gold,
          ),
        ),
        const SizedBox(height: 16),
        _field(_nameCtrl, "Your Name", Icons.person),
        const SizedBox(height: 12),
        _field(_emailCtrl, "Email", Icons.email,
            type: TextInputType.emailAddress),
        const SizedBox(height: 12),
        _messageField(),
        const SizedBox(height: 20),
        _submitButton(),
      ],
    );
  }

  Widget _messageField() {
    return TextField(
      controller: _msgCtrl,
      maxLines: 5,
      decoration: InputDecoration(
        hintText: "How can we help you?",
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: AppTheme.borderLight),
        ),
      ),
    );
  }

  Widget _submitButton() {
    return SizedBox(
      width: double.infinity,
      height: 55,
      child: ElevatedButton(
        onPressed: _isLoading ? null : _send,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.darkBrown,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
        child: _isLoading
            ? const CircularProgressIndicator(color: Colors.white)
            : const Text("SEND MESSAGE"),
      ),
    );
  }

  Widget _successBox() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.green.shade50,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Icon(Icons.check_circle, color: Colors.green.shade600, size: 40),
          const SizedBox(height: 12),
          const Text("Message Sent Successfully!"),
        ],
      ),
    );
  }

  Widget _contactCard(IconData icon, String title, String subtitle,
      VoidCallback? onTap,
      {bool full = false}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: full ? double.infinity : 250,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
            )
          ],
        ),
        child: Row(
          children: [
            Icon(icon, size: 24),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                  Text(subtitle,
                      style:
                          const TextStyle(color: AppTheme.textSecondary)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _field(TextEditingController ctrl, String hint, IconData icon,
      {TextInputType? type}) {
    return TextField(
      controller: ctrl,
      keyboardType: type,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(color: AppTheme.borderLight),
        ),
      ),
    );
  }
}
