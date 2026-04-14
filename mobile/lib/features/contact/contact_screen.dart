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

  Future<void> _send() async {
    if (_nameCtrl.text.isEmpty || _emailCtrl.text.isEmpty || _msgCtrl.text.isEmpty) return;
    setState(() => _isLoading = true);
    try {
      await ApiClient.instance.post('/api/enquiry', data: {
        'name': _nameCtrl.text.trim(),
        'email': _emailCtrl.text.trim(),
        'message': _msgCtrl.text.trim(),
      });
    } catch (_) {}
    setState(() { _isLoading = false; _sent = true; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(title: const Text('Contact Us'), backgroundColor: AppTheme.background),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Contact cards
          Row(children: [
            _contactCard('📱', 'WhatsApp', '+91 89876 54321',
                () => launchUrl(Uri.parse('https://wa.me/918987654321'))),
            const SizedBox(width: 12),
            _contactCard('✉️', 'Email', 'info@studyabroad.in',
                () => launchUrl(Uri.parse('mailto:info@studyabroad.in'))),
          ]).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: 12),
          _contactCard('📍', 'Office', 'New Delhi, India — Visit Us', null, full: true)
              .animate().fadeIn(delay: 100.ms),

          const SizedBox(height: 24),

          if (_sent) ...[
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.green.shade100),
              ),
              child: Column(
                children: [
                  Icon(Icons.check_circle_rounded, color: Colors.green.shade600, size: 40),
                  const SizedBox(height: 12),
                  const Text("Message Sent!", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
                  const SizedBox(height: 4),
                  const Text("We'll respond within 24 hours.", style: TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
                ],
              ),
            ),
          ] else ...[
            const Text('SEND US A MESSAGE',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 2, color: AppTheme.gold)),
            const SizedBox(height: 16),
            _field(_nameCtrl, 'Your Name', Icons.person_outline_rounded),
            const SizedBox(height: 12),
            _field(_emailCtrl, 'Email Address', Icons.mail_outline_rounded, type: TextInputType.emailAddress),
            const SizedBox(height: 12),
            TextField(
              controller: _msgCtrl,
              maxLines: 5,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
              decoration: const InputDecoration(hintText: 'How can we help you?'),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity, height: 56,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _send,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.darkBrown,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: _isLoading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Text('SEND MESSAGE', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, letterSpacing: 1.5)),
              ),
            ),
          ],
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _contactCard(String emoji, String title, String subtitle, VoidCallback? onTap, {bool full = false}) {
    final card = GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppTheme.borderLight),
        ),
        child: Row(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 24)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.textSecondary, letterSpacing: 0.5)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
                ],
              ),
            ),
            if (onTap != null) const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppTheme.textSecondary),
          ],
        ),
      ),
    );
    return full ? card : Expanded(child: card);
  }

  Widget _field(TextEditingController ctrl, String hint, IconData icon, {TextInputType? type}) {
    return TextField(
      controller: ctrl,
      keyboardType: type,
      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon, size: 18, color: AppTheme.textSecondary.withOpacity(0.5)),
      ),
    );
  }
}
