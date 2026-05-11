import 'package:flutter/material.dart';
import '../../../../core/theme.dart';

class PersonalInfoSection extends StatelessWidget {
  final TextEditingController nameController;
  final TextEditingController countryController;
  final TextEditingController bioController;
  final TextEditingController linkedinController;

  const PersonalInfoSection({
    super.key,
    required this.nameController,
    required this.countryController,
    required this.bioController,
    required this.linkedinController,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(width: 4, height: 16, color: AppTheme.gold),
            const SizedBox(width: 12),
            const Text('PERSONAL INFORMATION', 
                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: 1.5)),
          ],
        ),
        const SizedBox(height: 24),
        _inputLabel('LEGAL FULL NAME'),
        _textField(nameController, 'Your display name', Icons.person_outline),
        const SizedBox(height: 24),
        _inputLabel('BASE RESIDENCY'),
        _textField(countryController, 'e.g. India', Icons.public_rounded),
        const SizedBox(height: 24),
        _inputLabel('BIO / TAGLINE'),
        _textField(bioController, 'Aspiring Ivy League candidate...', Icons.history_edu_rounded, maxLines: 4),
        const SizedBox(height: 24),
        _inputLabel('LINKEDIN URL'),
        _textField(linkedinController, 'https://linkedin.com/in/username', Icons.link_rounded),
      ],
    );
  }

  Widget _inputLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10, left: 4),
      child: Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1.5)),
    );
  }

  Widget _textField(TextEditingController controller, String hint, IconData icon, {int maxLines = 1}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.01), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: TextField(
        controller: controller,
        maxLines: maxLines,
        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
        decoration: InputDecoration(
          hintText: hint,
          prefixIcon: Icon(icon, color: AppTheme.gold, size: 20),
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppTheme.borderLight)),
          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppTheme.borderLight)),
          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: AppTheme.gold, width: 1.5)),
        ),
      ),
    );
  }
}
