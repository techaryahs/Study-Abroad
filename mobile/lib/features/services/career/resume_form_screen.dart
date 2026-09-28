import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import '../../../core/theme.dart';
import 'resume_provider.dart';

class ResumeFormScreen extends StatefulWidget {
  const ResumeFormScreen({super.key});

  @override
  State<ResumeFormScreen> createState() => _ResumeFormScreenState();
}

class _ResumeFormScreenState extends State<ResumeFormScreen> {
  final _formKey = GlobalKey<FormState>();
  
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _summaryCtrl = TextEditingController();
  final _educationCtrl = TextEditingController();
  final _skillsCtrl = TextEditingController();
  final _experienceCtrl = TextEditingController();
  final _projectsCtrl = TextEditingController();

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _summaryCtrl.dispose();
    _educationCtrl.dispose();
    _skillsCtrl.dispose();
    _experienceCtrl.dispose();
    _projectsCtrl.dispose();
    super.dispose();
  }

  Future<void> _submitForm(ResumeProvider provider) async {
    if (!_formKey.currentState!.validate()) return;
    
    // Warn user about usage deduction if needed (omitted for brevity, handled by UI context usually)
    final success = await provider.generateResume(
      name: _nameCtrl.text.trim(),
      email: _emailCtrl.text.trim(),
      phone: _phoneCtrl.text.trim(),
      summary: _summaryCtrl.text.trim(),
      education: _educationCtrl.text.trim(),
      skills: _skillsCtrl.text.trim(),
      experience: _experienceCtrl.text.trim(),
      projects: _projectsCtrl.text.trim(),
    );

    if (!success && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(provider.error ?? 'Generation failed.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ResumeProvider(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Generate Resume'),
        ),
        body: Consumer<ResumeProvider>(
          builder: (context, provider, child) {
            if (provider.isLoading) {
              return const Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircularProgressIndicator(color: AppTheme.gold),
                    SizedBox(height: 16),
                    Text('Architecting your professional profile...'),
                  ],
                ),
              );
            }

            if (provider.resumeMarkdown != null) {
              return _buildResultView(provider);
            }

            return _buildFormView(provider);
          },
        ),
      ),
    );
  }

  Widget _buildFormView(ResumeProvider provider) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.gold.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline, color: AppTheme.gold),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Generating a resume will consume 1 credit from your access pass limit.',
                      style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.darkBrown),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            Text('Personal Information', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            _buildField(_nameCtrl, 'Full Name', Icons.person),
            const SizedBox(height: 16),
            _buildField(_emailCtrl, 'Email Address', Icons.email, type: TextInputType.emailAddress),
            const SizedBox(height: 16),
            _buildField(_phoneCtrl, 'Phone Number', Icons.phone, type: TextInputType.phone),
            const SizedBox(height: 32),
            
            Text('Professional Details', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            _buildField(_summaryCtrl, 'Professional Summary', Icons.summarize, maxLines: 3),
            const SizedBox(height: 16),
            _buildField(_educationCtrl, 'Education History', Icons.school, maxLines: 3, hint: 'e.g., B.Tech in CS, XYZ University (2020-2024)'),
            const SizedBox(height: 16),
            _buildField(_skillsCtrl, 'Core Skills', Icons.lightbulb, maxLines: 2, hint: 'e.g., Python, React, Project Management'),
            const SizedBox(height: 16),
            _buildField(_experienceCtrl, 'Work Experience', Icons.work, maxLines: 4, hint: 'Company Name, Role, Responsibilities...'),
            const SizedBox(height: 16),
            _buildField(_projectsCtrl, 'Key Projects', Icons.code, maxLines: 3, hint: 'Project Name, Tech Stack, Impact...'),
            
            const SizedBox(height: 48),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => _submitForm(provider),
                icon: const Icon(Icons.auto_awesome),
                label: const Text('Generate Resume'),
              ),
            ),
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }

  Widget _buildField(TextEditingController controller, String label, IconData icon, {int maxLines = 1, TextInputType? type, String? hint}) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      keyboardType: type,
      validator: (val) => val == null || val.trim().isEmpty ? 'Required' : null,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        prefixIcon: maxLines == 1 ? Icon(icon, color: AppTheme.textMuted) : null,
      ),
    );
  }

  Widget _buildResultView(ResumeProvider provider) {
    return Column(
      children: [
        Expanded(
          child: Markdown(
            data: provider.resumeMarkdown!,
            selectable: true,
          ),
        ),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                offset: const Offset(0, -5),
                blurRadius: 10,
              ),
            ],
          ),
          child: SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () => provider.clearResume(),
              icon: const Icon(Icons.refresh),
              label: const Text('Generate Another'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppTheme.darkBrown,
                padding: const EdgeInsets.symmetric(vertical: 16),
                side: const BorderSide(color: AppTheme.darkBrown),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
