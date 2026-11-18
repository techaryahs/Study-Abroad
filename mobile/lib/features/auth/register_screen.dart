import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';
import 'auth_provider.dart';
import '../../widgets/brand_logo_card.dart';

/// Multi-step registration matching React Website Spec:
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
  final _nameCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _countryCtrl = TextEditingController(text: 'India');
  String _selectedGender = 'Male';
  bool _showPassword = false;

  bool _isLoading = false;
  String? _error;

  @override
  void dispose() {
    for (final c in [
      _emailCtrl,
      _emailOtpCtrl,
      _mobileCtrl,
      _mobileOtpCtrl,
      _nameCtrl,
      _passwordCtrl,
      _countryCtrl
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  void _setError(Object e) => setState(() => _error = extractErrorMessage(e));

  // ── STEP ACTIONS (Existing Business Logic Preserved) ───────────────

  Future<void> _sendEmailOtp() async {
    final email = _emailCtrl.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      setState(() => _error = 'Enter a valid email address');
      return;
    }
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      await context.read<AuthProvider>().sendEmailOtp(email);
      setState(() => _step = 2);
    } catch (e) {
      _setError(e);
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _verifyEmailOtp() async {
    final otp = _emailOtpCtrl.text.trim();
    if (otp.length != 6) {
      setState(() => _error = 'Enter the 6-digit OTP code');
      return;
    }
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      await context
          .read<AuthProvider>()
          .verifyEmailOtp(_emailCtrl.text.trim(), otp);
      setState(() => _step = 3);
    } catch (e) {
      _setError(e);
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _sendMobileOtp() async {
    final mobile = _mobileCtrl.text.trim();
    if (mobile.length < 10) {
      setState(() => _error = 'Enter a valid 10-digit mobile number');
      return;
    }
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      await context.read<AuthProvider>().sendMobileOtp(mobile);
      setState(() => _step = 4);
    } catch (e) {
      _setError(e);
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _verifyMobileOtp() async {
    final otp = _mobileOtpCtrl.text.trim();
    if (otp.length != 6) {
      setState(() => _error = 'Enter the 6-digit OTP code');
      return;
    }
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      await context
          .read<AuthProvider>()
          .verifyMobileOtp(_mobileCtrl.text.trim(), otp);
      setState(() => _step = 5);
    } catch (e) {
      _setError(e);
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _register() async {
    if (_nameCtrl.text.trim().isEmpty) {
      setState(() => _error = 'Enter your full name');
      return;
    }
    if (_passwordCtrl.text.trim().length < 6) {
      setState(() => _error = 'Password must be at least 6 characters');
      return;
    }
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      await context.read<AuthProvider>().register({
        'name': _nameCtrl.text.trim(),
        'email': _emailCtrl.text.trim().toLowerCase(),
        'mobile': _mobileCtrl.text.trim(),
        'password': _passwordCtrl.text.trim(),
        'gender': _selectedGender,
        'country': _countryCtrl.text.trim(),
        'dob': '2000-01-01',
      });
      if (!mounted) return;
      _showSuccessDialog();
    } catch (e) {
      _setError(e);
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => Dialog(
        backgroundColor: AppTheme.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: AppTheme.teal.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                  border: Border.all(color: AppTheme.teal.withValues(alpha: 0.3)),
                ),
                child: const Icon(LucideIcons.checkCheck,
                    color: AppTheme.teal, size: 32),
              ),
              const SizedBox(height: 20),
              Text(
                'ACCOUNT SYNCHRONIZED!',
                textAlign: TextAlign.center,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                  fontStyle: FontStyle.italic,
                  color: AppTheme.navy,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Your EduLeader Global student profile has been initialized. Please sign in to access your dashboard.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color: AppTheme.textSecondary,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    context.go('/login');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.navyDark,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Text(
                    'PROCEED TO SIGN IN',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.8,
                      color: AppTheme.gold,
                    ),
                  ),
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
    return PopScope(
      canPop: _step == 1,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop && _step > 1) {
          setState(() {
            _step--;
            _error = null;
          });
        }
      },
      child: Scaffold(
        backgroundColor: AppTheme.background,
        body: Stack(
          children: [
            // Ambient website background glow
            Positioned(
              top: -60,
              left: -60,
              child: Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppTheme.gold.withValues(alpha: 0.08),
                ),
              ),
            ),
            Positioned(
              bottom: -40,
              right: -40,
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppTheme.teal.withValues(alpha: 0.08),
                ),
              ),
            ),

            SafeArea(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Column(
                  children: [
                    _buildHeaderBanner(),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
                      child: _buildFormCard(),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── BRAND HEADER BANNER ───────────────────────────────────────────
  Widget _buildHeaderBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(24, 20, 24, 28),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.navyDark,
            AppTheme.navy,
            AppTheme.navyDeep,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(36),
          bottomRight: Radius.circular(36),
        ),
        boxShadow: AppTheme.navyShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const BrandLogoCard(size: 46),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextButton(
                    onPressed: () => context.go('/login'),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      backgroundColor: Colors.white.withValues(alpha: 0.12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: BorderSide(
                          color: AppTheme.gold.withValues(alpha: 0.5),
                          width: 1.2,
                        ),
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'SIGN IN',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.2,
                            color: AppTheme.gold,
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(
                          Icons.login_rounded,
                          size: 14,
                          color: AppTheme.gold,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 6),
                  IconButton(
                    onPressed: () {
                      if (_step > 1) {
                        setState(() {
                          _step--;
                          _error = null;
                        });
                      } else if (context.canPop()) {
                        context.pop();
                      } else {
                        context.go('/login');
                      }
                    },
                    icon: const Icon(
                      Icons.arrow_back_ios_new_rounded,
                      size: 18,
                      color: Colors.white,
                    ),
                    tooltip: 'Back',
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 18),

          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppTheme.gold.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: AppTheme.gold.withValues(alpha: 0.35),
                width: 1.2,
              ),
            ),
            child: const Icon(
              LucideIcons.sparkles,
              color: AppTheme.gold,
              size: 20,
            ),
          ),

          const SizedBox(height: 14),

          Text.rich(
            TextSpan(
              style: GoogleFonts.playfairDisplay(
                fontSize: 26,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                height: 1.15,
                letterSpacing: 0.5,
              ),
              children: const [
                TextSpan(text: 'INITIALIZE YOUR\n'),
                TextSpan(
                  text: 'GLOBAL ',
                  style: TextStyle(
                    color: AppTheme.gold,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                TextSpan(text: 'PROFILE.'),
              ],
            ),
          ),

          const SizedBox(height: 12),

          Container(
            padding: const EdgeInsets.only(left: 12),
            decoration: const BoxDecoration(
              border: Border(
                left: BorderSide(color: AppTheme.gold, width: 2.5),
              ),
            ),
            child: Text(
              'ELITE ACADEMIC ONBOARDING FOR ASPIRING GLOBAL SCHOLARS.',
              style: GoogleFonts.inter(
                fontSize: 10.5,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.2,
                color: Colors.white.withValues(alpha: 0.75),
                height: 1.45,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── FORM CARD (Multi-Step Wizard) ─────────────────────────────────
  Widget _buildFormCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: AppTheme.borderLight),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Step Progress Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'STEP $_step OF 5',
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.5,
                  color: AppTheme.goldDark,
                ),
              ),
              Flexible(
                child: Text(
                  _stepSubtitle(),
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: _step / 5,
              backgroundColor: AppTheme.surfaceMuted,
              color: AppTheme.gold,
              minHeight: 6,
            ),
          ),

          const SizedBox(height: 24),

          // Step Switcher
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 250),
            child: KeyedSubtree(
              key: ValueKey(_step),
              child: _buildCurrentStep(),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.05);
  }

  String _stepSubtitle() {
    switch (_step) {
      case 1:
        return 'Email Setup';
      case 2:
        return 'Email Verification';
      case 3:
        return 'Mobile Contact';
      case 4:
        return 'SMS Verification';
      case 5:
        return 'Final Details';
      default:
        return '';
    }
  }

  Widget _buildCurrentStep() {
    switch (_step) {
      case 1:
        return _stepEmailEntry();
      case 2:
        return _stepEmailOtp();
      case 3:
        return _stepMobileEntry();
      case 4:
        return _stepMobileOtp();
      case 5:
        return _stepPersonalDetails();
      default:
        return const SizedBox.shrink();
    }
  }

  // ── STEP 1: EMAIL ENTRY ───────────────────────────────────────────
  Widget _stepEmailEntry() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _stepHeading(
          'Student Email Verification',
          'Enter your academic or personal email to receive a 6-digit confirmation code.',
        ),
        const SizedBox(height: 22),
        _fieldLabel('EMAIL ADDRESS'),
        const SizedBox(height: 8),
        _inputField(
          controller: _emailCtrl,
          hint: 'name@university.com',
          icon: LucideIcons.mail,
          keyboardType: TextInputType.emailAddress,
        ),
        ..._errorAndSubmit('SEND VERIFICATION CODE', _sendEmailOtp),
        const SizedBox(height: 24),
        Center(
          child: GestureDetector(
            onTap: () => context.go('/login'),
            child: Text.rich(
              TextSpan(
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.textSecondary,
                ),
                children: const [
                  TextSpan(text: 'Already have an account? '),
                  TextSpan(
                    text: 'Sign In',
                    style: TextStyle(
                      color: AppTheme.goldDark,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ── STEP 2: EMAIL OTP ─────────────────────────────────────────────
  Widget _stepEmailOtp() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _stepHeading(
          'Confirm Email Code',
          'Enter the 6-digit verification code delivered to ${_emailCtrl.text.trim()}.',
        ),
        const SizedBox(height: 22),
        _fieldLabel('6-DIGIT OTP CODE'),
        const SizedBox(height: 8),
        _inputField(
          controller: _emailOtpCtrl,
          hint: '000000',
          icon: LucideIcons.key,
          keyboardType: TextInputType.number,
          textAlign: TextAlign.center,
          letterSpacing: 6.0,
        ),
        ..._errorAndSubmit('VERIFY EMAIL', _verifyEmailOtp),
        const SizedBox(height: 14),
        Center(
          child: TextButton(
            onPressed: _isLoading ? null : _sendEmailOtp,
            child: Text(
              'RESEND CODE',
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.2,
                color: AppTheme.goldDark,
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ── STEP 3: MOBILE ENTRY ──────────────────────────────────────────
  Widget _stepMobileEntry() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _stepHeading(
          'Mobile Contact',
          'Add your phone number for admissions updates and counselor WhatsApp coordination.',
        ),
        const SizedBox(height: 22),
        _fieldLabel('MOBILE NUMBER (WITH COUNTRY CODE)'),
        const SizedBox(height: 8),
        _inputField(
          controller: _mobileCtrl,
          hint: '+91 9999999999',
          icon: LucideIcons.phone,
          keyboardType: TextInputType.phone,
        ),
        ..._errorAndSubmit('SEND SMS CODE', _sendMobileOtp),
      ],
    );
  }

  // ── STEP 4: MOBILE OTP ────────────────────────────────────────────
  Widget _stepMobileOtp() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _stepHeading(
          'Verify Mobile Number',
          'Enter the 6-digit SMS code delivered to ${_mobileCtrl.text.trim()}.',
        ),
        const SizedBox(height: 22),
        _fieldLabel('6-DIGIT SMS CODE'),
        const SizedBox(height: 8),
        _inputField(
          controller: _mobileOtpCtrl,
          hint: '000000',
          icon: LucideIcons.key,
          keyboardType: TextInputType.number,
          textAlign: TextAlign.center,
          letterSpacing: 6.0,
        ),
        ..._errorAndSubmit('VERIFY MOBILE', _verifyMobileOtp),
        const SizedBox(height: 14),
        Center(
          child: TextButton(
            onPressed: _isLoading ? null : _sendMobileOtp,
            child: Text(
              'RESEND SMS CODE',
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.2,
                color: AppTheme.goldDark,
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ── STEP 5: PERSONAL DETAILS ──────────────────────────────────────
  Widget _stepPersonalDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _stepHeading(
          'Create Your Profile',
          'Fill in your legal details to complete registration and enter the student portal.',
        ),
        const SizedBox(height: 22),

        // Full Name
        _fieldLabel('FULL NAME'),
        const SizedBox(height: 8),
        _inputField(
          controller: _nameCtrl,
          hint: 'Your official name',
          icon: LucideIcons.user,
        ),
        const SizedBox(height: 16),

        // Password
        _fieldLabel('PASSWORD (MIN 6 CHARACTERS)'),
        const SizedBox(height: 8),
        _inputField(
          controller: _passwordCtrl,
          hint: '••••••••',
          icon: LucideIcons.lock,
          obscureText: !_showPassword,
          suffixIcon: GestureDetector(
            onTap: () => setState(() => _showPassword = !_showPassword),
            child: Icon(
              _showPassword ? LucideIcons.eyeOff : LucideIcons.eye,
              size: 18,
              color: AppTheme.gold,
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Country
        _fieldLabel('COUNTRY OF RESIDENCE'),
        const SizedBox(height: 8),
        _inputField(
          controller: _countryCtrl,
          hint: 'e.g. India',
          icon: LucideIcons.globe,
        ),
        const SizedBox(height: 16),

        // Gender Dropdown
        _fieldLabel('GENDER'),
        const SizedBox(height: 8),
        Container(
          height: 52,
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            color: AppTheme.surfaceMuted,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.borderLight, width: 1.2),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: _selectedGender,
              dropdownColor: AppTheme.surface,
              style: GoogleFonts.inter(
                fontSize: 13.5,
                fontWeight: FontWeight.w700,
                color: AppTheme.navy,
              ),
              items: ['Male', 'Female', 'Other']
                  .map((g) => DropdownMenuItem(value: g, child: Text(g)))
                  .toList(),
              onChanged: (v) {
                if (v != null) setState(() => _selectedGender = v);
              },
            ),
          ),
        ),

        ..._errorAndSubmit('CREATE ACCOUNT', _register),
      ],
    );
  }

  // ── PRESENTATION HELPERS ──────────────────────────────────────────

  Widget _stepHeading(String title, String subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.playfairDisplay(
            fontSize: 20,
            fontWeight: FontWeight.w900,
            fontStyle: FontStyle.italic,
            color: AppTheme.navy,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          subtitle,
          style: GoogleFonts.inter(
            fontSize: 12.5,
            color: AppTheme.textSecondary,
            height: 1.45,
          ),
        ),
      ],
    );
  }

  Widget _fieldLabel(String label) {
    return Text(
      label,
      style: GoogleFonts.inter(
        fontSize: 10.5,
        fontWeight: FontWeight.w900,
        letterSpacing: 1.5,
        color: AppTheme.navy,
      ),
    );
  }

  Widget _inputField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
    bool obscureText = false,
    Widget? suffixIcon,
    TextAlign textAlign = TextAlign.start,
    double? letterSpacing,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      textAlign: textAlign,
      style: GoogleFonts.inter(
        fontSize: 13.5,
        fontWeight: FontWeight.w700,
        color: AppTheme.navy,
        letterSpacing: letterSpacing,
      ),
      cursorColor: AppTheme.gold,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w500,
          color: AppTheme.textSecondary.withValues(alpha: 0.6),
          letterSpacing: 0,
        ),
        filled: true,
        fillColor: AppTheme.surfaceMuted,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        prefixIcon: Padding(
          padding: const EdgeInsets.only(left: 14, right: 10),
          child: Icon(icon, size: 18, color: AppTheme.gold),
        ),
        prefixIconConstraints: const BoxConstraints(minWidth: 0, minHeight: 0),
        suffixIcon: suffixIcon != null
            ? Padding(
                padding: const EdgeInsets.only(right: 14),
                child: suffixIcon,
              )
            : null,
        suffixIconConstraints: const BoxConstraints(minWidth: 0, minHeight: 0),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppTheme.borderLight, width: 1.2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppTheme.gold, width: 1.8),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.red.shade300, width: 1.2),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.red.shade400, width: 1.8),
        ),
      ),
    );
  }

  List<Widget> _errorAndSubmit(String btnLabel, VoidCallback onPressed) {
    return [
      const SizedBox(height: 20),
      if (_error != null) ...[
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF5F5),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: const Color(0xFFFED7D7)),
          ),
          child: Row(
            children: [
              Icon(Icons.error_outline_rounded,
                  color: Colors.red.shade600, size: 16),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  _error!,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: Colors.red.shade700,
                  ),
                ),
              ),
            ],
          ),
        ).animate().shake(),
        const SizedBox(height: 16),
      ],
      Container(
        width: double.infinity,
        height: 52,
        decoration: BoxDecoration(
          color: AppTheme.navyDark,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: AppTheme.navyDark.withValues(alpha: 0.35),
              blurRadius: 14,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ElevatedButton(
          onPressed: _isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            shadowColor: Colors.transparent,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          child: _isLoading
              ? const SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.2,
                    color: AppTheme.gold,
                  ),
                )
              : FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        btnLabel,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.2,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward_rounded,
                          size: 16, color: AppTheme.gold),
                    ],
                  ),
                ),
        ),
      ),
    ];
  }
}
