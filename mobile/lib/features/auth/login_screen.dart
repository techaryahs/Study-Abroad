import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/api_client.dart';
import '../../core/theme.dart';
import 'auth_provider.dart';
import '../cart/cart_provider.dart';
import '../../widgets/brand_logo_card.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _phoneOtpCtrl = TextEditingController();

  bool _showPassword = false;
  bool _isLoading = false;
  String? _error;
  int _tabIndex = 0;
  bool _otpSent = false;
  String _selectedCountryCode = '+91';

  // Forgot Password state
  bool _showForgotModal = false;
  int _forgotStep = 1;
  final _forgotEmailCtrl = TextEditingController();
  final _forgotOtpCtrl = TextEditingController();
  final _forgotPwCtrl = TextEditingController();
  final _forgotCfmCtrl = TextEditingController();
  bool _forgotLoading = false;
  bool _forgotResendLoading = false;
  String _forgotMsg = '';
  bool _forgotMsgOk = false;
  bool _showForgotPw = false;
  bool _showForgotCfm = false;

  late final TabController _tabCtrl;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ));
    _tabCtrl = TabController(length: 2, vsync: this)
      ..addListener(() => setState(() => _tabIndex = _tabCtrl.index));
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    for (final c in [
      _emailCtrl,
      _passwordCtrl,
      _phoneCtrl,
      _phoneOtpCtrl,
      _forgotEmailCtrl,
      _forgotOtpCtrl,
      _forgotPwCtrl,
      _forgotCfmCtrl,
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  // ── Existing Login Business Logic (Untouched) ────────────────────
  Future<void> _handleLogin() async {
    FocusScope.of(context).unfocus();
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final user = await context.read<AuthProvider>().login(
            _emailCtrl.text.trim(),
            _passwordCtrl.text.trim(),
          );
      if (!mounted) return;
      context.read<CartProvider>().fetchCart();
      final role = user['role'] as String? ?? 'student';
      if (role == 'admin') {
        context.go('/admin-dashboard');
      } else if (role == 'consultant') {
        context.go('/consultant-dashboard');
      } else {
        context.go('/');
      }
    } catch (e) {
      setState(() => _error = extractErrorMessage(e));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // ── Existing Phone OTP Login (Untouched) ─────────────────────────
  Future<void> _handleSendLoginOtp() async {
    FocusScope.of(context).unfocus();
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final phone = _phoneCtrl.text.trim();
      final fullNumber = phone.startsWith('+') ? phone : '$_selectedCountryCode$phone';
      await context.read<AuthProvider>().sendLoginOtp(fullNumber);
      if (mounted) setState(() => _otpSent = true);
    } catch (e) {
      if (mounted) setState(() => _error = extractErrorMessage(e));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleVerifyLoginOtp() async {
    FocusScope.of(context).unfocus();
    if (_phoneOtpCtrl.text.trim().isEmpty) {
      setState(() => _error = 'Please enter the OTP');
      return;
    }
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final phone = _phoneCtrl.text.trim();
      final fullNumber = phone.startsWith('+') ? phone : '$_selectedCountryCode$phone';
      final user = await context.read<AuthProvider>().loginWithOtp(
            fullNumber,
            _phoneOtpCtrl.text.trim(),
          );
      if (!mounted) return;
      context.read<CartProvider>().fetchCart();
      final role = user['role'] as String? ?? 'student';
      if (role == 'admin') {
        context.go('/admin-dashboard');
      } else if (role == 'consultant') {
        context.go('/consultant-dashboard');
      } else {
        context.go('/');
      }
    } catch (e) {
      if (mounted) setState(() => _error = extractErrorMessage(e));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  // ── Forgot Password Flow (Student/User Contract) ────────────────
  Future<void> _fStep1() async {
    FocusScope.of(context).unfocus();
    final email = _forgotEmailCtrl.text.trim().toLowerCase();
    if (email.isEmpty) {
      setState(() {
        _forgotMsg = 'Please enter your registered email';
        _forgotMsgOk = false;
      });
      return;
    }
    setState(() {
      _forgotLoading = true;
      _forgotMsg = '';
    });
    try {
      // Contract: POST /api/auth/forgot-password with { email }
      await ApiClient.instance.post(
        '/api/auth/forgot-password',
        data: {'email': email},
      );
      if (mounted) {
        setState(() {
          _forgotMsg = 'Reset code sent to your email! Please check your inbox.';
          _forgotMsgOk = true;
        });
        Future.delayed(const Duration(milliseconds: 1200), () {
          if (mounted) setState(() => _forgotStep = 2);
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _forgotMsg = extractErrorMessage(e);
          _forgotMsgOk = false;
        });
      }
    } finally {
      if (mounted) setState(() => _forgotLoading = false);
    }
  }

  Future<void> _fResendCode() async {
    FocusScope.of(context).unfocus();
    final email = _forgotEmailCtrl.text.trim().toLowerCase();
    if (email.isEmpty) {
      setState(() {
        _forgotMsg = 'Please enter your email';
        _forgotMsgOk = false;
      });
      return;
    }
    setState(() {
      _forgotResendLoading = true;
      _forgotMsg = '';
    });
    try {
      await ApiClient.instance.post(
        '/api/auth/forgot-password',
        data: {'email': email},
      );
      if (mounted) {
        setState(() {
          _forgotMsg = 'A fresh reset code has been sent to your email!';
          _forgotMsgOk = true;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _forgotMsg = extractErrorMessage(e);
          _forgotMsgOk = false;
        });
      }
    } finally {
      if (mounted) setState(() => _forgotResendLoading = false);
    }
  }

  Future<void> _fStep2() async {
    FocusScope.of(context).unfocus();
    final email = _forgotEmailCtrl.text.trim().toLowerCase();
    final otp = _forgotOtpCtrl.text.trim();
    final newPassword = _forgotPwCtrl.text;
    final confirmPassword = _forgotCfmCtrl.text;

    if (otp.isEmpty || newPassword.isEmpty || confirmPassword.isEmpty) {
      setState(() {
        _forgotMsg = 'Please fill in all fields';
        _forgotMsgOk = false;
      });
      return;
    }
    if (newPassword != confirmPassword) {
      setState(() {
        _forgotMsg = 'Passwords do not match';
        _forgotMsgOk = false;
      });
      return;
    }
    final rx = RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$');
    if (!rx.hasMatch(newPassword)) {
      setState(() {
        _forgotMsg = 'Password must be 8+ characters with uppercase, lowercase & numbers';
        _forgotMsgOk = false;
      });
      return;
    }
    setState(() {
      _forgotLoading = true;
      _forgotMsg = '';
    });
    try {
      // Step 2a: Verify OTP against standard student/user verification route
      // Backend Contract: POST /api/auth/verify-otp with { email, otp }
      // Maps to authCtrl.verifyForgotOtp in backend/routes/auth.routes.js
      await ApiClient.instance.post(
        '/api/auth/verify-otp',
        data: {
          'email': email,
          'otp': otp,
        },
      );

      // Step 2b: Reset Password using validated OTP
      // Backend Contract: POST /api/auth/reset-password with { email, otp, newPassword }
      await ApiClient.instance.post(
        '/api/auth/reset-password',
        data: {
          'email': email,
          'otp': otp,
          'newPassword': newPassword,
        },
      );

      if (mounted) {
        setState(() {
          _forgotMsg = 'Password reset successfully! Please sign in.';
          _forgotMsgOk = true;
        });
        Future.delayed(const Duration(milliseconds: 1400), () {
          if (mounted) {
            setState(() {
              _showForgotModal = false;
              _forgotStep = 1;
              for (final c in [
                _forgotEmailCtrl,
                _forgotOtpCtrl,
                _forgotPwCtrl,
                _forgotCfmCtrl,
              ]) {
                c.clear();
              }
              _forgotMsg = '';
            });
          }
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _forgotMsg = extractErrorMessage(e);
          _forgotMsgOk = false;
        });
      }
    } finally {
      if (mounted) setState(() => _forgotLoading = false);
    }
  }

  bool get _isTablet => MediaQuery.of(context).size.shortestSide >= 600;

  @override
  Widget build(BuildContext context) {
    final isLandscape =
        MediaQuery.of(context).orientation == Orientation.landscape;

    return PopScope(
      canPop: !_showForgotModal,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop && _showForgotModal) {
          setState(() {
            _showForgotModal = false;
            _forgotStep = 1;
            _forgotMsg = '';
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
              child: isLandscape ? _buildLandscapeLayout() : _buildPortraitLayout(),
            ),

            // Forgot Password Modal Overlay
            if (_showForgotModal) _buildForgotOverlay(),
          ],
        ),
      ),
    );
  }

  // ── PORTRAIT LAYOUT ───────────────────────────────────────────────
  Widget _buildPortraitLayout() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
      child: Column(
        children: [
          _buildBrandPromiseBanner(isLandscape: false),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
            child: _buildFormCard(),
          ),
        ],
      ),
    );
  }

  // ── LANDSCAPE LAYOUT ──────────────────────────────────────────────
  Widget _buildLandscapeLayout() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Expanded(
          flex: 4,
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: _buildBrandPromiseBanner(isLandscape: true),
          ),
        ),
        Expanded(
          flex: 6,
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: _buildFormCard(),
          ),
        ),
      ],
    );
  }

  // ── BRAND PROMISE BANNER (Compact & Responsive) ───────────────────
  Widget _buildBrandPromiseBanner({required bool isLandscape}) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.fromLTRB(
        20,
        isLandscape ? 16 : 12,
        20,
        isLandscape ? 18 : 14,
      ),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            AppTheme.navyDark,
            AppTheme.navy,
            AppTheme.navyDeep,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(isLandscape ? 0 : 26),
          bottomRight: const Radius.circular(26),
          topRight: Radius.circular(isLandscape ? 26 : 0),
        ),
        boxShadow: AppTheme.navyShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Header Row: Brand Logo + Register pill + Back button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              BrandLogoCard(size: _isTablet ? 42 : 36),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextButton(
                    onPressed: () => context.push('/register'),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
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
                          'REGISTER',
                          style: GoogleFonts.inter(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.2,
                            color: AppTheme.gold,
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(
                          Icons.arrow_forward_rounded,
                          size: 13,
                          color: AppTheme.gold,
                        ),
                      ],
                    ),
                  ),
                  if (Navigator.of(context).canPop()) ...[
                    const SizedBox(width: 4),
                    IconButton(
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () => Navigator.of(context).pop(),
                      icon: const Icon(
                        Icons.arrow_back_ios_new_rounded,
                        size: 16,
                        color: Colors.white,
                      ),
                      tooltip: 'Back',
                    ),
                  ],
                ],
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Headline: BUILD YOUR GLOBAL LEGACY
          Text.rich(
            TextSpan(
              style: GoogleFonts.playfairDisplay(
                fontSize: _isTablet ? 26 : 20,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                height: 1.15,
                letterSpacing: 0.3,
              ),
              children: const [
                TextSpan(text: 'BUILD YOUR '),
                TextSpan(
                  text: 'GLOBAL ',
                  style: TextStyle(
                    color: AppTheme.gold,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                TextSpan(text: 'LEGACY.'),
              ],
            ),
          ).animate().fadeIn(duration: 350.ms).slideY(begin: 0.05),

          const SizedBox(height: 8),

          // Short 2-line Subtitle with Left Gold Accent
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 2.5,
                height: 22,
                color: AppTheme.gold,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Elite academic mentorship for the Ivy League and beyond. Centralized student access.',
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.inter(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.3,
                    color: Colors.white.withValues(alpha: 0.75),
                    height: 1.35,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Compact Standard Protocol Verified Badge
          Row(
            children: [
              Row(
                children: List.generate(3, (i) {
                  return Container(
                    margin: const EdgeInsets.only(right: 3),
                    width: 18,
                    height: 18,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppTheme.navyDark,
                      border: Border.all(
                        color: AppTheme.gold.withValues(alpha: 0.7),
                        width: 1.0,
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      'U${i + 1}',
                      style: GoogleFonts.inter(
                        fontSize: 8,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                      ),
                    ),
                  );
                }),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  'STANDARD PROTOCOL VERIFIED',
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.inter(
                    fontSize: 8.5,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.2,
                    color: AppTheme.goldLight,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ── FORM CARD (Website Presentation Layer) ────────────────────────
  Widget _buildFormCard() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderLight),
        boxShadow: AppTheme.cardShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Section Heading: Welcome Back
          Text(
            'WELCOME BACK',
            style: GoogleFonts.playfairDisplay(
              fontSize: _isTablet ? 24 : 19,
              fontWeight: FontWeight.w900,
              fontStyle: FontStyle.italic,
              color: AppTheme.navy,
            ),
          ),
          const SizedBox(height: 4),
          Container(
            width: 36,
            height: 2.5,
            decoration: BoxDecoration(
              color: AppTheme.gold,
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          const SizedBox(height: 14),

          // Underline Method Switcher (Website Style)
          _buildUnderlineTabBar(),

          const SizedBox(height: 16),

          // Form fields
          Form(
            key: _formKey,
            child: _tabIndex == 0 ? _buildEmailTab() : _buildPhoneTab(),
          ),

          const SizedBox(height: 18),
          const Divider(color: AppTheme.borderLight, height: 1),
          const SizedBox(height: 14),

          // Bottom Account Links
          _buildFooterNavigation(),
        ],
      ),
    ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.04);
  }

  // ── WEBSITE-STYLE UNDERLINE TAB BAR ───────────────────────────────
  Widget _buildUnderlineTabBar() {
    return Container(
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: AppTheme.borderLight, width: 1.2),
        ),
      ),
      child: Row(
        children: [
          _underlineTab('EMAIL & PASSWORD', 0),
          _underlineTab('PHONE OTP LOGIN', 1),
        ],
      ),
    );
  }

  Widget _underlineTab(String label, int index) {
    final active = _tabIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          _tabCtrl.animateTo(index);
          setState(() {
            _tabIndex = index;
            _error = null;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: active ? AppTheme.gold : Colors.transparent,
                width: 2.5,
              ),
            ),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(
              fontSize: _isTablet ? 12 : 11,
              fontWeight: active ? FontWeight.w900 : FontWeight.w700,
              letterSpacing: 0.8,
              color: active ? AppTheme.navy : AppTheme.textSecondary,
            ),
          ),
        ),
      ),
    );
  }

  // ── EMAIL & PASSWORD TAB ──────────────────────────────────────────
  Widget _buildEmailTab() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        _fieldLabel('ENTER YOUR REGISTERED EMAIL'),
        const SizedBox(height: 8),
        _inputField(
          controller: _emailCtrl,
          hint: 'name@university.com',
          icon: LucideIcons.mail,
          keyboardType: TextInputType.emailAddress,
          validator: (v) {
            if (v == null || v.trim().isEmpty) return 'Enter your email';
            if (!v.contains('@')) return 'Enter a valid email address';
            return null;
          },
        ),

        const SizedBox(height: 16),

        _fieldLabel('ENTER PASSWORD'),
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
          validator: (v) =>
              (v == null || v.isEmpty) ? 'Enter your password' : null,
        ),

        const SizedBox(height: 10),

        Align(
          alignment: Alignment.centerRight,
          child: GestureDetector(
            onTap: () => setState(() => _showForgotModal = true),
            child: Text(
              'FORGOT PASSWORD?',
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.2,
                color: AppTheme.goldDark,
              ),
            ),
          ),
        ),

        const SizedBox(height: 18),

        if (_error != null) ...[
          _errorBox(_error!),
          const SizedBox(height: 14),
        ],

        _primarySubmitButton(
          label: 'SIGN IN',
          onTap: _handleLogin,
          icon: Icons.arrow_forward_rounded,
        ),
      ],
    );
  }

  // ── PHONE OTP TAB ─────────────────────────────────────────────────
  Widget _buildPhoneTab() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (!_otpSent) ...[
          _fieldLabel('PHONE NUMBER'),
          const SizedBox(height: 8),
          Row(
            children: [
              // Country Code Selector
              Container(
                height: 52,
                padding: const EdgeInsets.symmetric(horizontal: 10),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceMuted,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderLight),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedCountryCode,
                    dropdownColor: AppTheme.surface,
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.navy,
                    ),
                    items: const [
                      DropdownMenuItem(value: '+91', child: Text('🇮🇳 +91')),
                      DropdownMenuItem(value: '+1', child: Text('🇺🇸 +1')),
                      DropdownMenuItem(value: '+44', child: Text('🇬🇧 +44')),
                      DropdownMenuItem(value: '+61', child: Text('🇦🇺 +61')),
                      DropdownMenuItem(value: '+1C', child: Text('🇨🇦 +1')),
                      DropdownMenuItem(value: '+49', child: Text('🇩🇪 +49')),
                    ],
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedCountryCode = val);
                    },
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _inputField(
                  controller: _phoneCtrl,
                  hint: '98765 43210',
                  icon: LucideIcons.phone,
                  keyboardType: TextInputType.phone,
                  validator: (v) =>
                      (v == null || v.trim().length < 6)
                          ? 'Enter a valid number'
                          : null,
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          if (_error != null) ...[
            _errorBox(_error!),
            const SizedBox(height: 14),
          ],
          _primarySubmitButton(
            label: 'SEND OTP',
            onTap: _handleSendLoginOtp,
            icon: Icons.arrow_forward_rounded,
          ),
        ] else ...[
          // OTP Sent Info Banner
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: AppTheme.surfaceMuted,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderLight),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'OTP SENT TO',
                      style: GoogleFonts.inter(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '$_selectedCountryCode ${_phoneCtrl.text.trim()}',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.navy,
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: () => setState(() {
                    _otpSent = false;
                    _phoneOtpCtrl.clear();
                    _error = null;
                  }),
                  style: TextButton.styleFrom(
                    foregroundColor: AppTheme.goldDark,
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  ),
                  child: Text(
                    'CHANGE',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          _fieldLabel('ENTER 6-DIGIT OTP'),
          const SizedBox(height: 8),
          _inputField(
            controller: _phoneOtpCtrl,
            hint: '000000',
            icon: LucideIcons.key,
            keyboardType: TextInputType.number,
            textAlign: TextAlign.center,
            letterSpacing: 6.0,
          ),

          const SizedBox(height: 8),

          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: _isLoading ? null : _handleSendLoginOtp,
              child: Text(
                'RESEND OTP',
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.2,
                  color: AppTheme.goldDark,
                ),
              ),
            ),
          ),

          const SizedBox(height: 12),
          if (_error != null) ...[
            _errorBox(_error!),
            const SizedBox(height: 14),
          ],
          _primarySubmitButton(
            label: 'VERIFY & LOGIN',
            onTap: _handleVerifyLoginOtp,
            icon: Icons.check_circle_outline_rounded,
          ),
        ],
      ],
    );
  }

  // ── INPUT COMPONENT (Exact Design System) ─────────────────────────
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
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      validator: validator,
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
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
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
        errorStyle: GoogleFonts.inter(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: Colors.red.shade600,
        ),
      ),
    );
  }

  // ── PRIMARY SUBMIT BUTTON (Website Style) ─────────────────────────
  Widget _primarySubmitButton({
    required String label,
    required VoidCallback onTap,
    required IconData icon,
    bool? isLoading,
  }) {
    final loading = isLoading ?? _isLoading;
    return Container(
      width: double.infinity,
      height: 48,
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
        onPressed: loading ? null : onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        child: loading
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
                      label,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Icon(icon, size: 16, color: AppTheme.gold),
                  ],
                ),
              ),
      ),
    );
  }

  // ── ERROR BANNER (Website Soft Rose Card) ─────────────────────────
  Widget _errorBox(String msg) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF5F5),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFFED7D7)),
      ),
      child: Row(
        children: [
          Icon(Icons.error_outline_rounded, color: Colors.red.shade600, size: 16),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              msg,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: Colors.red.shade700,
              ),
            ),
          ),
        ],
      ),
    ).animate().shake();
  }

  // ── FOOTER NAVIGATION ─────────────────────────────────────────────
  Widget _buildFooterNavigation() {
    return Column(
      children: [
        // Prominent Sign Up Card Button
        InkWell(
          onTap: () => context.push('/register'),
          borderRadius: BorderRadius.circular(16),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
            decoration: BoxDecoration(
              color: AppTheme.surfaceMuted,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: AppTheme.gold.withValues(alpha: 0.4),
                width: 1.2,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  LucideIcons.userPlus,
                  size: 16,
                  color: AppTheme.goldDark,
                ),
                const SizedBox(width: 8),
                Flexible(
                  child: Text.rich(
                    TextSpan(
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.navy,
                      ),
                      children: const [
                        TextSpan(text: "Don't have an account? "),
                        TextSpan(
                          text: "Register Now",
                          style: TextStyle(
                            color: AppTheme.goldDark,
                            fontWeight: FontWeight.w900,
                            decoration: TextDecoration.underline,
                            decorationColor: AppTheme.goldDark,
                          ),
                        ),
                      ],
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 14),

        // Website literal link with wide clickable hit target
        InkWell(
          onTap: () => context.push('/register'),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
            child: Text(
              'IF YOU ARE A NEW STUDENT, CLICK HERE TO INITIALIZE YOUR ACCOUNT',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.2,
                color: AppTheme.textSecondary,
              ),
            ),
          ),
        ),

        const SizedBox(height: 8),

        InkWell(
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Please visit our web portal to register as a partner.'),
                backgroundColor: AppTheme.navy,
              ),
            );
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
            child: Text(
              'REGISTER AS PARTNER',
              style: GoogleFonts.inter(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
                color: AppTheme.goldDark,
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ── FORGOT PASSWORD MODAL OVERLAY (Website Equivalent) ────────────
  Widget _buildForgotOverlay() {
    return GestureDetector(
      onTap: () => setState(() => _showForgotModal = false),
      child: Container(
        color: Colors.black.withValues(alpha: 0.6),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: GestureDetector(
                onTap: () {}, // Blocks tap
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                  constraints: const BoxConstraints(maxWidth: 420),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppTheme.surface,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.25),
                        blurRadius: 28,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header Row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'RESET PASSWORD',
                                style: GoogleFonts.playfairDisplay(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w900,
                                  fontStyle: FontStyle.italic,
                                  color: AppTheme.navy,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Container(
                                width: 36,
                                height: 3,
                                color: AppTheme.gold,
                              ),
                            ],
                          ),
                          IconButton(
                            onPressed: () => setState(() {
                              _showForgotModal = false;
                              _forgotStep = 1;
                              _forgotMsg = '';
                            }),
                            icon: const Icon(LucideIcons.x, size: 20, color: AppTheme.textSecondary),
                          ),
                        ],
                      ),

                      const SizedBox(height: 8),
                      Text(
                        'Recover access to your student dashboard.',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 18),

                      if (_forgotMsg.isNotEmpty) ...[
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: _forgotMsgOk ? const Color(0xFFF0FDF4) : const Color(0xFFFFF5F5),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: _forgotMsgOk ? const Color(0xFFBBF7D0) : const Color(0xFFFED7D7),
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                _forgotMsgOk ? Icons.check_circle_outline : Icons.error_outline,
                                size: 16,
                                color: _forgotMsgOk ? Colors.green.shade700 : Colors.red.shade700,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _forgotMsg,
                                  style: GoogleFonts.inter(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w700,
                                    color: _forgotMsgOk ? Colors.green.shade800 : Colors.red.shade800,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      if (_forgotStep == 1) ...[
                        _fieldLabel('REGISTERED EMAIL'),
                        const SizedBox(height: 8),
                        _inputField(
                          controller: _forgotEmailCtrl,
                          hint: 'name@email.com',
                          icon: LucideIcons.mail,
                          keyboardType: TextInputType.emailAddress,
                        ),
                        const SizedBox(height: 18),
                        _primarySubmitButton(
                          label: 'SEND RESET CODE',
                          onTap: _fStep1,
                          icon: Icons.send_rounded,
                          isLoading: _forgotLoading,
                        ),
                      ] else ...[
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _fieldLabel('6-DIGIT RESET CODE'),
                            TextButton(
                              onPressed: (_forgotLoading || _forgotResendLoading)
                                  ? null
                                  : _fResendCode,
                              style: TextButton.styleFrom(
                                padding: EdgeInsets.zero,
                                minimumSize: Size.zero,
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                              child: _forgotResendLoading
                                  ? const SizedBox(
                                      width: 14,
                                      height: 14,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: AppTheme.gold,
                                      ),
                                    )
                                  : Text(
                                      'RESEND CODE',
                                      style: GoogleFonts.inter(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: 1.0,
                                        color: AppTheme.goldDark,
                                      ),
                                    ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        _inputField(
                          controller: _forgotOtpCtrl,
                          hint: '000000',
                          icon: LucideIcons.key,
                          keyboardType: TextInputType.number,
                          textAlign: TextAlign.center,
                          letterSpacing: 4.0,
                        ),
                        const SizedBox(height: 14),

                        _fieldLabel('NEW PASSWORD'),
                        const SizedBox(height: 8),
                        _inputField(
                          controller: _forgotPwCtrl,
                          hint: '••••••••',
                          icon: LucideIcons.lock,
                          obscureText: !_showForgotPw,
                          suffixIcon: GestureDetector(
                            onTap: () => setState(() => _showForgotPw = !_showForgotPw),
                            child: Icon(
                              _showForgotPw ? LucideIcons.eyeOff : LucideIcons.eye,
                              size: 16,
                              color: AppTheme.gold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),

                        _fieldLabel('CONFIRM PASSWORD'),
                        const SizedBox(height: 8),
                        _inputField(
                          controller: _forgotCfmCtrl,
                          hint: '••••••••',
                          icon: LucideIcons.lock,
                          obscureText: !_showForgotCfm,
                          suffixIcon: GestureDetector(
                            onTap: () => setState(() => _showForgotCfm = !_showForgotCfm),
                            child: Icon(
                              _showForgotCfm ? LucideIcons.eyeOff : LucideIcons.eye,
                              size: 16,
                              color: AppTheme.gold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 18),

                        _primarySubmitButton(
                          label: 'RESET PASSWORD',
                          onTap: _fStep2,
                          icon: Icons.lock_reset_rounded,
                          isLoading: _forgotLoading,
                        ),
                        const SizedBox(height: 12),
                        Center(
                          child: TextButton(
                            onPressed: _forgotLoading
                                ? null
                                : () => setState(() {
                                      _forgotStep = 1;
                                      _forgotMsg = '';
                                    }),
                            child: Text(
                              '← CHANGE EMAIL ADDRESS',
                              style: GoogleFonts.inter(
                                fontSize: 10.5,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 1.0,
                                color: AppTheme.textSecondary,
                              ),
                            ),
                          ),
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
    );
  }
}
