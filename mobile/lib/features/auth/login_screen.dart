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

  // Forgot Password
  bool _showForgotModal = false;
  int _forgotStep = 1;
  final _forgotEmailCtrl = TextEditingController();
  final _forgotOtpCtrl = TextEditingController();
  final _forgotPasswordCtrl = TextEditingController();
  final _forgotConfirmCtrl = TextEditingController();
  bool _forgotLoading = false;
  String _forgotMessage = '';
  bool _forgotMessageIsSuccess = false;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _forgotEmailCtrl.dispose();
    _forgotOtpCtrl.dispose();
    _forgotPasswordCtrl.dispose();
    _forgotConfirmCtrl.dispose();
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
      setState(() => _error = extractErrorMessage(e));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleForgotPasswordStep1() async {
    if (_forgotEmailCtrl.text.trim().isEmpty) {
      setState(() {
        _forgotMessage = 'Please enter your email address';
        _forgotMessageIsSuccess = false;
      });
      return;
    }

    setState(() { _forgotLoading = true; _forgotMessage = ''; });

    try {
      await ApiClient.instance.post(
        '/api/auth/forgot-password',
        data: {'email': _forgotEmailCtrl.text.trim()},
      );

      if (mounted) {
        setState(() {
          _forgotMessage = 'Reset code sent to your email!';
          _forgotMessageIsSuccess = true;
          Future.delayed(const Duration(seconds: 1), () {
            if (mounted) setState(() => _forgotStep = 2);
          });
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _forgotMessage = extractErrorMessage(e);
          _forgotMessageIsSuccess = false;
        });
      }
    } finally {
      if (mounted) setState(() => _forgotLoading = false);
    }
  }

  Future<void> _handleForgotPasswordStep2() async {
    if (_forgotOtpCtrl.text.isEmpty || _forgotPasswordCtrl.text.isEmpty || _forgotConfirmCtrl.text.isEmpty) {
      setState(() {
        _forgotMessage = 'Please fill all fields';
        _forgotMessageIsSuccess = false;
      });
      return;
    }

    if (_forgotPasswordCtrl.text != _forgotConfirmCtrl.text) {
      setState(() {
        _forgotMessage = 'Passwords do not match';
        _forgotMessageIsSuccess = false;
      });
      return;
    }

    // Password validation
    final passwordRegex = RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$');
    if (!passwordRegex.hasMatch(_forgotPasswordCtrl.text)) {
      setState(() {
        _forgotMessage = 'Password must be 8+ chars with uppercase, lowercase & number';
        _forgotMessageIsSuccess = false;
      });
      return;
    }

    setState(() { _forgotLoading = true; _forgotMessage = ''; });

    try {
      // Step 1: Verify OTP (try generic endpoint first)
      bool otpVerified = false;
      try {
        await ApiClient.instance.post(
          '/api/auth/verify-otp',
          data: {
            'email': _forgotEmailCtrl.text.trim(),
            'otp': _forgotOtpCtrl.text.trim(),
          },
        );
        otpVerified = true;
      } catch (e) {
        // If generic fails, try admin endpoint
        try {
          await ApiClient.instance.post(
            '/api/auth/admin/verify-otp',
            data: {
              'email': _forgotEmailCtrl.text.trim(),
              'otp': _forgotOtpCtrl.text.trim(),
            },
          );
          otpVerified = true;
        } catch (e2) {
          throw Exception(extractErrorMessage(e));
        }
      }

      if (!otpVerified) throw Exception('OTP verification failed');

      // Step 2: Reset password (try generic endpoint first)
      try {
        await ApiClient.instance.post(
          '/api/auth/reset-password',
          data: {
            'email': _forgotEmailCtrl.text.trim(),
            'otp': _forgotOtpCtrl.text.trim(),
            'newPassword': _forgotPasswordCtrl.text,
          },
        );
      } catch (e) {
        // If generic fails, try admin endpoint
        await ApiClient.instance.post(
          '/api/auth/admin/reset-password',
          data: {
            'email': _forgotEmailCtrl.text.trim(),
            'otp': _forgotOtpCtrl.text.trim(),
            'newPassword': _forgotPasswordCtrl.text,
          },
        );
      }

      if (mounted) {
        setState(() {
          _forgotMessage = 'Password reset successfully!';
          _forgotMessageIsSuccess = true;
          Future.delayed(const Duration(seconds: 1), () {
            if (mounted) {
              setState(() {
                _showForgotModal = false;
                _forgotStep = 1;
                _forgotEmailCtrl.clear();
                _forgotOtpCtrl.clear();
                _forgotPasswordCtrl.clear();
                _forgotConfirmCtrl.clear();
                _forgotMessage = '';
              });
            }
          });
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _forgotMessage = extractErrorMessage(e);
          _forgotMessageIsSuccess = false;
        });
      }
    } finally {
      if (mounted) setState(() => _forgotLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: Stack(
        children: [
          SafeArea(
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
                            onTap: () => setState(() => _showForgotModal = true),
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

          // Forgot Password Modal Overlay
          if (_showForgotModal)
            GestureDetector(
              onTap: () => setState(() => _showForgotModal = false),
              child: Container(
                color: Colors.black.withOpacity(0.5),
                child: Center(
                  child: GestureDetector(
                    onTap: () {}, // Prevent closing when tapping inside modal
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 24),
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppTheme.gold.withOpacity(0.2)),
                      ),
                      child: SingleChildScrollView(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text('Reset Password', 
                                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: 1, color: AppTheme.textPrimary)),
                                GestureDetector(
                                  onTap: () => setState(() {
                                    _showForgotModal = false;
                                    _forgotStep = 1;
                                    _forgotMessage = '';
                                  }),
                                  child: const Icon(Icons.close_rounded, color: AppTheme.textSecondary),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            const Text('Recover your account access',
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppTheme.textSecondary)),
                            const SizedBox(height: 20),

                            // Error/Success Message
                            if (_forgotMessage.isNotEmpty)
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: _forgotMessageIsSuccess ? Colors.green.shade50 : Colors.red.shade50,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: _forgotMessageIsSuccess ? Colors.green.shade100 : Colors.red.shade100),
                                ),
                                child: Row(
                                  children: [
                                    Icon(
                                      _forgotMessageIsSuccess ? Icons.check_circle_outline : Icons.error_outline,
                                      color: _forgotMessageIsSuccess ? Colors.green : Colors.red,
                                      size: 16,
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        _forgotMessage,
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w600,
                                          color: _forgotMessageIsSuccess ? Colors.green.shade700 : Colors.red.shade700,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                            if (_forgotMessage.isNotEmpty) const SizedBox(height: 16),

                            // Step 1: Email
                            if (_forgotStep == 1) ...[
                              const Text('Email Address', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.5, color: AppTheme.textSecondary)),
                              const SizedBox(height: 8),
                              TextFormField(
                                controller: _forgotEmailCtrl,
                                keyboardType: TextInputType.emailAddress,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
                                decoration: InputDecoration(
                                  hintText: 'name@email.com',
                                  prefixIcon: const Icon(Icons.mail_outline_rounded, size: 18, color: AppTheme.textSecondary),
                                  hintStyle: TextStyle(color: AppTheme.textSecondary.withValues(alpha: 0.3), fontSize: 13),
                                ),
                              ),
                              const SizedBox(height: 20),
                              Row(
                                children: [
                                  Expanded(
                                    child: OutlinedButton(
                                      onPressed: () => setState(() {
                                        _showForgotModal = false;
                                        _forgotStep = 1;
                                        _forgotMessage = '';
                                      }),
                                      style: OutlinedButton.styleFrom(
                                        padding: const EdgeInsets.symmetric(vertical: 12),
                                        side: const BorderSide(color: AppTheme.borderLight),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                      ),
                                      child: const Text('Cancel', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.5, color: AppTheme.textPrimary)),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: ElevatedButton(
                                      onPressed: _forgotLoading ? null : _handleForgotPasswordStep1,
                                      style: ElevatedButton.styleFrom(
                                        padding: const EdgeInsets.symmetric(vertical: 12),
                                        backgroundColor: AppTheme.darkBrown,
                                        foregroundColor: AppTheme.gold,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                      ),
                                      child: _forgotLoading
                                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.gold))
                                        : const Text('Send Code', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.5)),
                                    ),
                                  ),
                                ],
                              ),
                            ],

                            // Step 2: OTP & New Password
                            if (_forgotStep == 2) ...[
                              const Text('Reset Code', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.5, color: AppTheme.textSecondary)),
                              const SizedBox(height: 8),
                              TextFormField(
                                controller: _forgotOtpCtrl,
                                keyboardType: TextInputType.number,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
                                decoration: const InputDecoration(hintText: '000000', prefixIcon: Icon(Icons.confirmation_number_outlined, size: 18, color: AppTheme.textSecondary)),
                              ),
                              const SizedBox(height: 16),
                              const Text('New Password', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.5, color: AppTheme.textSecondary)),
                              const SizedBox(height: 8),
                              TextFormField(
                                controller: _forgotPasswordCtrl,
                                obscureText: true,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
                                decoration: const InputDecoration(hintText: '••••••••', prefixIcon: Icon(Icons.lock_outline_rounded, size: 18, color: AppTheme.textSecondary)),
                              ),
                              const SizedBox(height: 16),
                              const Text('Confirm Password', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.5, color: AppTheme.textSecondary)),
                              const SizedBox(height: 8),
                              TextFormField(
                                controller: _forgotConfirmCtrl,
                                obscureText: true,
                                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
                                decoration: const InputDecoration(hintText: '••••••••', prefixIcon: Icon(Icons.lock_outline_rounded, size: 18, color: AppTheme.textSecondary)),
                              ),
                              const SizedBox(height: 20),
                              Row(
                                children: [
                                  Expanded(
                                    child: OutlinedButton(
                                      onPressed: () => setState(() => _forgotStep = 1),
                                      style: OutlinedButton.styleFrom(
                                        padding: const EdgeInsets.symmetric(vertical: 12),
                                        side: const BorderSide(color: AppTheme.borderLight),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                      ),
                                      child: const Text('Back', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.5, color: AppTheme.textPrimary)),
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: ElevatedButton(
                                      onPressed: _forgotLoading ? null : _handleForgotPasswordStep2,
                                      style: ElevatedButton.styleFrom(
                                        padding: const EdgeInsets.symmetric(vertical: 12),
                                        backgroundColor: AppTheme.darkBrown,
                                        foregroundColor: AppTheme.gold,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                      ),
                                      child: _forgotLoading
                                        ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.gold))
                                        : const Text('Reset Password', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.5)),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
        ],
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
