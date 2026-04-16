import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';
import 'auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey      = GlobalKey<FormState>();
  final _emailCtrl    = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _showPassword  = false;
  bool _isLoading     = false;
  String? _error;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _isLoading = true; _error = null; });

    try {
      final auth = context.read<AuthProvider>();
      final user = await auth.login(
        _emailCtrl.text.trim(),
        _passwordCtrl.text.trim(),
      );
      if (!mounted) return;

      final role = user['role'] as String? ?? 'student';
      if (role == 'admin')           context.go('/admin-dashboard');
      else if (role == 'consultant') context.go('/consultant-dashboard');
      else                            context.go('/');
    } catch (e) {
      // extractErrorMessage reads the actual JSON `error` field from the server
      setState(() => _error = extractErrorMessage(e));
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
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── BRAND ─────────────────────────────────────────────
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkBrown,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Icon(Icons.school_rounded, color: AppTheme.gold, size: 32),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.2),

              const SizedBox(height: 24),

              Text(
                'Welcome\nBack',
                style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                  fontSize: 40, height: 1.1, fontStyle: FontStyle.italic,
                ),
              ).animate().fadeIn(delay: 100.ms, duration: 400.ms),

              const SizedBox(height: 6),

              const Text(
                'SIGN IN TO YOUR ACCOUNT',
                style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800,
                    letterSpacing: 2, color: AppTheme.gold),
              ).animate().fadeIn(delay: 150.ms),

              const SizedBox(height: 40),

              // ── FORM ──────────────────────────────────────────────
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    _buildField(
                      controller: _emailCtrl,
                      label: 'Email Address',
                      hint: 'name@email.com',
                      icon: Icons.mail_outline_rounded,
                      keyboardType: TextInputType.emailAddress,
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) return 'Enter your email';
                        if (!v.contains('@')) return 'Enter a valid email';
                        return null;
                      },
                    ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.1),

                    const SizedBox(height: 16),

                    _buildField(
                      controller: _passwordCtrl,
                      label: 'Password',
                      hint: '••••••••',
                      icon: Icons.lock_outline_rounded,
                      obscure: !_showPassword,
                      suffix: IconButton(
                        icon: Icon(
                          _showPassword ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                          color: AppTheme.textSecondary, size: 20,
                        ),
                        onPressed: () => setState(() => _showPassword = !_showPassword),
                      ),
                      validator: (v) => (v == null || v.isEmpty) ? 'Enter your password' : null,
                    ).animate().fadeIn(delay: 250.ms).slideX(begin: -0.1),

                    const SizedBox(height: 12),

                    // ── Forgot Password ──────────────────────────
                    Align(
                      alignment: Alignment.centerRight,
                      child: GestureDetector(
                        onTap: () => context.go('/forgot-password'),
                        child: const Text(
                          'Forgot Password?',
                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.gold),
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // ── ERROR BOX ────────────────────────────────
                    if (_error != null) ...[
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.red.shade50,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: Colors.red.shade100),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.error_outline_rounded, color: Colors.red.shade600, size: 18),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                _error!,
                                style: TextStyle(color: Colors.red.shade700, fontSize: 12, fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                      ).animate().shake(),
                      const SizedBox(height: 16),
                    ],

                    // ── SIGN IN BUTTON ───────────────────────────
                    SizedBox(
                      width: double.infinity, height: 56,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.darkBrown,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        child: _isLoading
                            ? const SizedBox(width: 22, height: 22,
                                child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.gold))
                            : const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text('SIGN IN', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, letterSpacing: 2)),
                                  SizedBox(width: 10),
                                  Icon(Icons.arrow_forward_rounded, size: 18),
                                ],
                              ),
                      ),
                    ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.2),

                    const SizedBox(height: 32),

                    // ── DIVIDER ──────────────────────────────────
                    Row(children: [
                      const Expanded(child: Divider(color: AppTheme.borderLight)),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text('OR',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700,
                              color: AppTheme.textSecondary.withValues(alpha: 0.4), letterSpacing: 2)),
                      ),
                      const Expanded(child: Divider(color: AppTheme.borderLight)),
                    ]),

                    const SizedBox(height: 24),

                    // ── CREATE ACCOUNT ───────────────────────────
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text("Don't have an account? ",
                            style: TextStyle(fontSize: 12, color: AppTheme.textSecondary, fontWeight: FontWeight.w500)),
                        GestureDetector(
                          onTap: () => context.go('/register'),
                          child: const Text('Register Now',
                              style: TextStyle(fontSize: 12, color: AppTheme.gold, fontWeight: FontWeight.w800)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
    bool obscure = false,
    Widget? suffix,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(),
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w800,
                letterSpacing: 1.5, color: AppTheme.textSecondary)),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          obscureText: obscure,
          keyboardType: keyboardType,
          validator: validator,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: Icon(icon, size: 18, color: AppTheme.textSecondary.withValues(alpha: 0.5)),
            suffixIcon: suffix,
            hintStyle: TextStyle(color: AppTheme.textSecondary.withValues(alpha: 0.3), fontSize: 13),
          ),
        ),
      ],
    );
  }
}
