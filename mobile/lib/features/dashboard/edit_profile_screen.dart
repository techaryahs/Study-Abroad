import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';

class EditProfileScreen extends StatefulWidget {
  final Map<String, dynamic> userData;
  const EditProfileScreen({super.key, required this.userData});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late TextEditingController _nameController;
  late TextEditingController _countryController;
  late TextEditingController _bioController;
  late TextEditingController _linkedinController;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.userData['name']);
    _countryController = TextEditingController(text: widget.userData['country']);
    _bioController = TextEditingController(text: widget.userData['profile']?['bio']);
    _linkedinController = TextEditingController(text: widget.userData['profile']?['linkedin']);
  }

  Future<void> _save() async {
    setState(() => _saving = true);
    try {
      await ApiClient.instance.put('/api/user/profile/${widget.userData['_id']}', data: {
        'name': _nameController.text,
        'country': _countryController.text,
        'bio': _bioController.text,
        'linkedin': _linkedinController.text,
      });
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('EDIT PROFILE', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 2)),
        backgroundColor: Colors.white,
        foregroundColor: AppTheme.textPrimary,
        elevation: 0.5,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _inputLabel('FULL NAME'),
            _textField(_nameController, 'Enter your name'),
            const SizedBox(height: 24),
            _inputLabel('COUNTRY'),
            _textField(_countryController, 'e.g. India'),
            const SizedBox(height: 24),
            _inputLabel('BIO / TAGLINE'),
            _textField(_bioController, 'Tell us your aspirations...', maxLines: 4),
            const SizedBox(height: 24),
            _inputLabel('LINKEDIN URL'),
            _textField(_linkedinController, 'https://linkedin.com/in/username'),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _saving ? null : _save,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.gold,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: _saving 
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('SAVE CHANGES', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _inputLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(label, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1.5)),
    );
  }

  Widget _textField(TextEditingController controller, String hint, {int maxLines = 1}) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      decoration: InputDecoration(
        hintText: hint,
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.borderLight)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.borderLight)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.gold)),
      ),
    );
  }
}
