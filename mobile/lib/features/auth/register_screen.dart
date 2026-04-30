import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';
import 'auth_provider.dart';

/// Multi-step registration:
/// Step 1 → Enter email → Send OTP
/// Step 2 → Verify email OTP
/// Step 3 → Enter mobile → Send SMS OTP
/// Step 4 → Verify mobile OTP
/// Step 5 → Fill personal details → Register
class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  int _step = 1; // 1..5

  // Step 1 – Email
  final _emailCtrl = TextEditingController();
  // Step 2 – Email OTP
  final _emailOtpCtrl = TextEditingController();
  // Step 3 – Mobile
  final _mobileCtrl = TextEditingController();
  // Step 4 – Mobile OTP
  final _mobileOtpCtrl = TextEditingController();
  // Step 5 – Personal details
  final _nameCtrl     = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _countryCtrl  = TextEditingController();
  String _selectedGender = 'Male';
  bool _showPassword    = false;

  bool _isLoading = false;
  String? _error;

  @override
  void dispose() {
    for (final c in [_emailCtrl, _emailOtpCtrl, _mobileCtrl, _mobileOtpCtrl,
                     _nameCtrl, _passwordCtrl, _countryCtrl]) {
      c.dispose();
    }
    super.dispose();
  }

  void _setError(Object e) => setState(() => _error = extractErrorMessage(e));

  // ── STEP ACTIONS ────────────────────────────────────────────────

  Future<void> _sendEmailOtp() async {
    final email = _emailCtrl.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      setState(() => _error = 'Enter a valid email address');
      return;
    }
    setState(() { _isLoading = true; _error = null; });
    try {
      await context.read<AuthProvider>().sendEmailOtp(email);
      setState(() => _step = 2);
    } catch (e) { _setError(e); }
    finally { setState(() => _isLoading = false); }
  }

  Future<void> _verifyEmailOtp() async {
    final otp = _emailOtpCtrl.text.trim();
    if (otp.length != 6) { setState(() => _error = 'Enter the 6-digit OTP'); return; }
    setState(() { _isLoading = true; _error = null; });
    try {
      await context.read<AuthProvider>().verifyEmailOtp(_emailCtrl.text.trim(), otp);
      setState(() => _step = 3);
    } catch (e) { _setError(e); }
    finally { setState(() => _isLoading = false); }
  }

  Future<void> _sendMobileOtp() async {
    final mobile = _mobileCtrl.text.trim();
    if (mobile.length < 10) { setState(() => _error = 'Enter a valid 10-digit mobile number'); return; }
    setState(() { _isLoading = true; _error = null; });
    try {
      await context.read<AuthProvider>().sendMobileOtp(mobile);
      setState(() => _step = 4);
    } catch (e) { _setError(e); }
    finally { setState(() => _isLoading = false); }
  }

  Future<void> _verifyMobileOtp() async {
    final otp = _mobileOtpCtrl.text.trim();
    if (otp.length != 6) { setState(() => _error = 'Enter the 6-digit OTP'); return; }
    setState(() { _isLoading = true; _error = null; });
    try {
      await context.read<AuthProvider>().verifyMobileOtp(_mobileCtrl.text.trim(), otp);
      setState(() => _step = 5);
    } catch (e) { _setError(e); }
    finally { setState(() => _isLoading = false); }
  }

  Future<void> _register() async {
    if (_nameCtrl.text.trim().isEmpty) { setState(() => _error = 'Enter your name'); return; }
    if (_passwordCtrl.text.trim().length < 6) { setState(() => _error = 'Password must be at least 6 characters'); return; }
    setState(() { _isLoading = true; _error = null; });
    try {
      await context.read<AuthProvider>().register({
        'name':     _nameCtrl.text.trim(),
        'email':    _emailCtrl.text.trim().toLowerCase(),
        'mobile':   _mobileCtrl.text.trim(),
        'password': _passwordCtrl.text.trim(),
        'gender':   _selectedGender,
        'country':  _countryCtrl.text.trim(),
        'dob':      '2000-01-01',
      });
      if (!mounted) return;
      _showSuccessDialog();
    } catch (e) { _setError(e); }
    finally { if (mounted) setState(() => _isLoading = false); }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(color: Colors.green.shade50, shape: BoxShape.circle),
                child: Icon(Icons.check_rounded, color: Colors.green.shade600, size: 40),
              ),
              const SizedBox(height: 20),
              const Text('Account Created!',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
              const SizedBox(height: 8),
              const Text('You can now sign in to your account.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () { Navigator.pop(context); context.go('/login'); },
                  child: const Text('GO TO LOGIN'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        leading: _step > 1
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_rounded, size: 18, color: AppTheme.textPrimary),
                onPressed: () { setState(() { _step--; _error = null; }); },
              )
            : null,
        title: Text('Step $_step of 5',
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.textSecondary)),
        centerTitle: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Step progress bar ──────────────────────────
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: _step / 5,
                  backgroundColor: AppTheme.borderLight,
                  color: AppTheme.gold,
                  minHeight: 5,
                ),
              ),
              const SizedBox(height: 32),

              // ── Step content ───────────────────────────────
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: KeyedSubtree(
                  key: ValueKey(_step),
                  child: _buildStep(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStep() {
    switch (_step) {
      case 1: return _stepEmailEntry();
      case 2: return _stepEmailOtp();
      case 3: return _stepMobileEntry();
      case 4: return _stepMobileOtp();
      case 5: return _stepPersonalDetails();
      default: return const SizedBox.shrink();
    }
  }

  // ── STEP 1: Email entry ───────────────────────────────────────────
  Widget _stepEmailEntry() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _heading('Enter Your\nEmail Address', 'We\'ll send a 6-digit verification code.'),
        const SizedBox(height: 32),
        _label('Email Address'),
        const SizedBox(height: 8),
        TextField(
          controller: _emailCtrl,
          keyboardType: TextInputType.emailAddress,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          decoration: const InputDecoration(
            hintText: 'name@email.com',
            prefixIcon: Icon(Icons.mail_outline_rounded, size: 18),
          ),
        ),
        ..._errorAndButton('SEND VERIFICATION CODE', _sendEmailOtp),
        const SizedBox(height: 32),
        Center(
          child: GestureDetector(
            onTap: () => context.go('/login'),
            child: const Text('Already have an account? Sign in',
                style: TextStyle(fontSize: 14, color: AppTheme.gold, fontWeight: FontWeight.w700)),
          ),
        ),
      ],
    );
  }

  // ── STEP 2: Email OTP ────────────────────────────────────────────
  Widget _stepEmailOtp() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _heading('Verify Your\nEmail', 'Enter the code sent to ${_emailCtrl.text.trim()}'),
        const SizedBox(height: 32),
        _label('6-Digit Code'),
        const SizedBox(height: 8),
        TextField(
          controller: _emailOtpCtrl,
          keyboardType: TextInputType.number,
          maxLength: 6,
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, letterSpacing: 8),
          textAlign: TextAlign.center,
          decoration: const InputDecoration(hintText: '──────', counterText: ''),
        ),
        ..._errorAndButton('VERIFY EMAIL', _verifyEmailOtp),
        const SizedBox(height: 16),
        Center(
          child: GestureDetector(
            onTap: _sendEmailOtp,
            child: const Text('Resend Code',
                style: TextStyle(fontSize: 14, color: AppTheme.gold, fontWeight: FontWeight.w700)),
          ),
        ),
      ],
    );
  }

  // ── STEP 3: Mobile entry ──────────────────────────────────────────
  Widget _stepMobileEntry() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _heading('Enter Your\nMobile Number', 'We\'ll send an SMS verification code.'),
        const SizedBox(height: 32),
        _label('Mobile Number (with country code)'),
        const SizedBox(height: 8),
        TextField(
          controller: _mobileCtrl,
          keyboardType: TextInputType.phone,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          decoration: const InputDecoration(
            hintText: '+91 9999999999',
            prefixIcon: Icon(Icons.phone_outlined, size: 18),
          ),
        ),
        ..._errorAndButton('SEND SMS CODE', _sendMobileOtp),
      ],
    );
  }

  // ── STEP 4: Mobile OTP ────────────────────────────────────────────
  Widget _stepMobileOtp() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _heading('Verify Your\nMobile', 'Enter the code sent to ${_mobileCtrl.text.trim()}'),
        const SizedBox(height: 32),
        _label('6-Digit SMS Code'),
        const SizedBox(height: 8),
        TextField(
          controller: _mobileOtpCtrl,
          keyboardType: TextInputType.number,
          maxLength: 6,
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, letterSpacing: 8),
          textAlign: TextAlign.center,
          decoration: const InputDecoration(hintText: '──────', counterText: ''),
        ),
        ..._errorAndButton('VERIFY MOBILE', _verifyMobileOtp),
      ],
    );
  }

  // ── STEP 5: Personal details ──────────────────────────────────────
  Widget _stepPersonalDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _heading('Almost Done!\nCreate Profile', 'Fill in your basic details to complete registration.'),
        const SizedBox(height: 32),

        // Name
        _label('Full Name'),
        const SizedBox(height: 8),
        TextField(
          controller: _nameCtrl,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          decoration: const InputDecoration(
            hintText: 'Your full name',
            prefixIcon: Icon(Icons.person_outline_rounded, size: 18),
          ),
        ),
        const SizedBox(height: 16),

        // Password
        _label('Password'),
        const SizedBox(height: 8),
        TextField(
          controller: _passwordCtrl,
          obscureText: !_showPassword,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          decoration: InputDecoration(
            hintText: 'Min 6 characters',
            prefixIcon: const Icon(Icons.lock_outline_rounded, size: 18),
            suffixIcon: IconButton(
              icon: Icon(_showPassword ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                  size: 18, color: AppTheme.textSecondary),
              onPressed: () => setState(() => _showPassword = !_showPassword),
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Country
        _label('Country of Residence'),
        const SizedBox(height: 8),
        TextField(
          controller: _countryCtrl,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          decoration: const InputDecoration(
            hintText: 'India',
            prefixIcon: Icon(Icons.public_rounded, size: 18),
          ),
        ),
        const SizedBox(height: 16),

        // Gender dropdown
        _label('Gender'),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          initialValue: _selectedGender,
          onChanged: (v) => setState(() => _selectedGender = v!),
          items: ['Male', 'Female', 'Other']
              .map((g) => DropdownMenuItem(value: g, child: Text(g)))
              .toList(),
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
          decoration: const InputDecoration(
            prefixIcon: Icon(Icons.wc_rounded, size: 18),
          ),
        ),

        ..._errorAndButton('CREATE ACCOUNT', _register),
      ],
    );
  }

  // ── SHARED HELPERS ────────────────────────────────────────────────

  Widget _heading(String title, String sub) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(title,
        style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900,
            color: AppTheme.textPrimary, height: 1.15)),
      const SizedBox(height: 8),
      Text(sub,
        style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary, height: 1.5)),
    ],
  );

  Widget _label(String text) => Text(text.toUpperCase(),
      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800,
          letterSpacing: 1.5, color: AppTheme.textSecondary));

  List<Widget> _errorAndButton(String btnLabel, VoidCallback onPressed) => [
    const SizedBox(height: 24),
    if (_error != null) ...[
      Container(
        width: double.infinity,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: Colors.red.shade50,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.red.shade100),
        ),
        child: Row(children: [
          Icon(Icons.error_outline_rounded, color: Colors.red.shade600, size: 18),
          const SizedBox(width: 10),
          Expanded(child: Text(_error!,
              style: TextStyle(color: Colors.red.shade700, fontSize: 14, fontWeight: FontWeight.w600))),
        ]),
      ).animate().shake(),
      const SizedBox(height: 16),
    ],
    SizedBox(
      width: double.infinity, height: 56,
      child: ElevatedButton(
        onPressed: _isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.darkBrown,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        child: _isLoading
            ? const SizedBox(width: 22, height: 22,
                child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.gold))
            : Text(btnLabel,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, letterSpacing: 1.5)),
      ),
    ),
  ];
}
