import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import 'auth_provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  String _selectedGender = 'Male';
  bool _showPassword = false;
  bool _isLoading = false;
  String? _error;

  final List<String> _genders = ['Male', 'Female', 'Other'];

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _phoneCtrl.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _isLoading = true; _error = null; });

    try {
      final auth = context.read<AuthProvider>();
      await auth.register({
        'name': _nameCtrl.text.trim(),
        'email': _emailCtrl.text.trim(),
        'password': _passwordCtrl.text.trim(),
        'phone': _phoneCtrl.text.trim(),
        'gender': _selectedGender,
        'role': 'student',
      });
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Account created! Please login.'),
          backgroundColor: Colors.green.shade600,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
      context.go('/login');
    } catch (e) {
      setState(() => _error = 'Registration failed. Email may already exist.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),

              // Back
              GestureDetector(
                onTap: () => context.go('/login'),
                child: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppTheme.borderLight),
                  ),
                  child: const Icon(Icons.arrow_back_rounded, size: 20, color: AppTheme.textPrimary),
                ),
              ),

              const SizedBox(height: 28),

              Text(
                'Create\nAccount',
                style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                  fontSize: 38,
                  height: 1.1,
                  fontStyle: FontStyle.italic,
                ),
              ).animate().fadeIn(duration: 400.ms),

              const SizedBox(height: 6),
              Text(
                'BEGIN YOUR GLOBAL JOURNEY',
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: AppTheme.gold,
                  fontSize: 10,
                ),
              ),

              const SizedBox(height: 32),

              Form(
                key: _formKey,
                child: Column(
                  children: [
                    _field(_nameCtrl, 'Full Name', 'Your full name', Icons.person_outline_rounded,
                        validator: (v) => v!.isEmpty ? 'Required' : null),
                    const SizedBox(height: 14),

                    _field(_emailCtrl, 'Email', 'name@email.com', Icons.mail_outline_rounded,
                        type: TextInputType.emailAddress,
                        validator: (v) => v!.isEmpty ? 'Required' : null),
                    const SizedBox(height: 14),

                    _field(_phoneCtrl, 'Phone', '+91 9999999999', Icons.phone_outlined,
                        type: TextInputType.phone,
                        validator: (v) => v!.isEmpty ? 'Required' : null),
                    const SizedBox(height: 14),

                    // Gender
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'GENDER',
                          style: TextStyle(
                            fontSize: 10, fontWeight: FontWeight.w800,
                            letterSpacing: 1.5, color: AppTheme.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: _genders.map((g) {
                            final selected = _selectedGender == g;
                            return Expanded(
                              child: GestureDetector(
                                onTap: () => setState(() => _selectedGender = g),
                                child: Container(
                                  margin: const EdgeInsets.only(right: 8),
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                  decoration: BoxDecoration(
                                    color: selected ? AppTheme.darkBrown : Colors.white,
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border.all(
                                      color: selected ? AppTheme.gold : AppTheme.borderLight,
                                    ),
                                  ),
                                  child: Text(
                                    g,
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: selected ? Colors.white : AppTheme.textSecondary,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),

                    const SizedBox(height: 14),

                    // Password
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'PASSWORD',
                          style: TextStyle(
                            fontSize: 10, fontWeight: FontWeight.w800,
                            letterSpacing: 1.5, color: AppTheme.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: _passwordCtrl,
                          obscureText: !_showPassword,
                          validator: (v) => (v?.length ?? 0) < 6 ? 'Min 6 characters' : null,
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                          decoration: InputDecoration(
                            hintText: '••••••••',
                            prefixIcon: const Icon(Icons.lock_outline_rounded, size: 18, color: AppTheme.textSecondary),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _showPassword ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                                color: AppTheme.textSecondary, size: 18,
                              ),
                              onPressed: () => setState(() => _showPassword = !_showPassword),
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    if (_error != null) ...[
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.red.shade50,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.red.shade100),
                        ),
                        child: Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 12)),
                      ),
                      const SizedBox(height: 16),
                    ],

                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _handleRegister,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.gold,
                          foregroundColor: AppTheme.darkBrown,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: _isLoading
                            ? const SizedBox(width: 20, height: 20,
                                child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.darkBrown))
                            : const Text('CREATE ACCOUNT',
                                style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, letterSpacing: 2)),
                      ),
                    ),

                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('Already have an account? ',
                            style: TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
                        GestureDetector(
                          onTap: () => context.go('/login'),
                          child: const Text('Sign In',
                              style: TextStyle(fontSize: 12, color: AppTheme.gold, fontWeight: FontWeight.w800)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _field(TextEditingController ctrl, String label, String hint, IconData icon,
      {TextInputType? type, String? Function(String?)? validator}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(),
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.5, color: AppTheme.textSecondary)),
        const SizedBox(height: 8),
        TextFormField(
          controller: ctrl,
          keyboardType: type,
          validator: validator,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, size: 18, color: AppTheme.textSecondary.withOpacity(0.5)),
          ),
        ),
      ],
    );
  }
}
