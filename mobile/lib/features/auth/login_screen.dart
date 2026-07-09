import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/api_client.dart';
import 'auth_provider.dart';
import '../cart/cart_provider.dart';

// ── Design tokens ──────────────────────────────────────────────────
const _kBg        = Color(0xFFFAF3EA);
const _kGold      = Color(0xFFC49A28);
const _kGoldBtn1  = Color(0xFFD4A435);
const _kGoldBtn2  = Color(0xFFA07020);
const _kText      = Color(0xFF2C1A00);
const _kMuted     = Color(0xFF7A6040);
const _kBorder    = Color(0xFFE0CFA8);
const _kFieldBg   = Color(0xFFFFFBF5);
const _kTabBg     = Color(0xFFF0E6D0);
const _kIconCircle= Color(0xFFF2E4C8);

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _formKey      = GlobalKey<FormState>();
  final _emailCtrl    = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _phoneCtrl    = TextEditingController();
  final _phoneOtpCtrl = TextEditingController();

  bool _showPassword = false;
  bool _isLoading    = false;
  String? _error;
  int  _tabIndex     = 0;
  bool _otpSent      = false;

  bool   _showForgotModal  = false;
  int    _forgotStep       = 1;
  final  _forgotEmailCtrl  = TextEditingController();
  final  _forgotOtpCtrl    = TextEditingController();
  final  _forgotPwCtrl     = TextEditingController();
  final  _forgotCfmCtrl    = TextEditingController();
  bool   _forgotLoading    = false;
  String _forgotMsg        = '';
  bool   _forgotMsgOk      = false;
  bool   _showForgotPw     = false;
  bool   _showForgotCfm    = false;

  late final TabController _tabCtrl;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ));
    _tabCtrl = TabController(length: 2, vsync: this)
      ..addListener(() => setState(() => _tabIndex = _tabCtrl.index));
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    for (final c in [
      _emailCtrl, _passwordCtrl, _phoneCtrl, _phoneOtpCtrl,
      _forgotEmailCtrl, _forgotOtpCtrl, _forgotPwCtrl, _forgotCfmCtrl,
    ]) c.dispose();
    super.dispose();
  }

  // ── Login ─────────────────────────────────────────────────────────
  Future<void> _handleLogin() async {
    FocusScope.of(context).unfocus();
    if (!_formKey.currentState!.validate()) return;
    setState(() { _isLoading = true; _error = null; });
    try {
      final user = await context.read<AuthProvider>()
          .login(_emailCtrl.text.trim(), _passwordCtrl.text.trim());
      if (!mounted) return;
      context.read<CartProvider>().fetchCart();
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

  // ── Phone OTP Login ──────────────────────────────────────────────
  Future<void> _handleSendLoginOtp() async {
    FocusScope.of(context).unfocus();
    if (!_formKey.currentState!.validate()) return;
    setState(() { _isLoading = true; _error = null; });
    try {
      await context.read<AuthProvider>().sendLoginOtp(_phoneCtrl.text.trim());
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
    setState(() { _isLoading = true; _error = null; });
    try {
      final user = await context.read<AuthProvider>().loginWithOtp(
        _phoneCtrl.text.trim(),
        _phoneOtpCtrl.text.trim(),
      );
      if (!mounted) return;
      context.read<CartProvider>().fetchCart();
      final role = user['role'] as String? ?? 'student';
      if (role == 'admin')           context.go('/admin-dashboard');
      else if (role == 'consultant') context.go('/consultant-dashboard');
      else                           context.go('/');
    } catch (e) {
      if (mounted) setState(() => _error = extractErrorMessage(e));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _fStep1() async {
    FocusScope.of(context).unfocus();
    if (_forgotEmailCtrl.text.trim().isEmpty) {
      setState(() { _forgotMsg = 'Please enter your email'; _forgotMsgOk = false; }); return;
    }
    setState(() { _forgotLoading = true; _forgotMsg = ''; });
    try {
      await ApiClient.instance.post('/api/auth/forgot-password',
          data: {'email': _forgotEmailCtrl.text.trim()});
      if (mounted) setState(() {
        _forgotMsg = 'Reset code sent!'; _forgotMsgOk = true;
        Future.delayed(const Duration(seconds: 1), () {
          if (mounted) setState(() => _forgotStep = 2);
        });
      });
    } catch (e) {
      if (mounted) setState(() { _forgotMsg = extractErrorMessage(e); _forgotMsgOk = false; });
    } finally {
      if (mounted) setState(() => _forgotLoading = false);
    }
  }

  Future<void> _fStep2() async {
    FocusScope.of(context).unfocus();
    if (_forgotOtpCtrl.text.isEmpty || _forgotPwCtrl.text.isEmpty || _forgotCfmCtrl.text.isEmpty) {
      setState(() { _forgotMsg = 'Please fill all fields'; _forgotMsgOk = false; }); return;
    }
    if (_forgotPwCtrl.text != _forgotCfmCtrl.text) {
      setState(() { _forgotMsg = 'Passwords do not match'; _forgotMsgOk = false; }); return;
    }
    final rx = RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$');
    if (!rx.hasMatch(_forgotPwCtrl.text)) {
      setState(() { _forgotMsg = 'Must be 8+ chars with upper, lower & number'; _forgotMsgOk = false; }); return;
    }
    setState(() { _forgotLoading = true; _forgotMsg = ''; });
    try {
      bool ok = false;
      for (final ep in ['/api/auth/verify-otp', '/api/auth/admin/verify-otp']) {
        try {
          await ApiClient.instance.post(ep, data: {
            'email': _forgotEmailCtrl.text.trim(), 'otp': _forgotOtpCtrl.text.trim()
          });
          ok = true; break;
        } catch (_) {}
      }
      if (!ok) throw Exception('OTP verification failed');
      for (final ep in ['/api/auth/reset-password', '/api/auth/admin/reset-password']) {
        try {
          await ApiClient.instance.post(ep, data: {
            'email': _forgotEmailCtrl.text.trim(),
            'otp': _forgotOtpCtrl.text.trim(),
            'newPassword': _forgotPwCtrl.text,
          }); break;
        } catch (_) {}
      }
      if (mounted) setState(() {
        _forgotMsg = 'Password reset successfully!'; _forgotMsgOk = true;
        Future.delayed(const Duration(seconds: 1), () {
          if (mounted) setState(() {
            _showForgotModal = false; _forgotStep = 1;
            for (final c in [_forgotEmailCtrl, _forgotOtpCtrl, _forgotPwCtrl, _forgotCfmCtrl]) c.clear();
            _forgotMsg = '';
          });
        });
      });
    } catch (e) {
      if (mounted) setState(() { _forgotMsg = extractErrorMessage(e); _forgotMsgOk = false; });
    } finally {
      if (mounted) setState(() => _forgotLoading = false);
    }
  }

  // ── BUILD ─────────────────────────────────────────────────────────
  bool get _isTablet => MediaQuery.of(context).size.shortestSide >= 600;

  @override
  Widget build(BuildContext context) {
    // Calculate the height and width available without the keyboard (excluding safe area padding).
    // Using MediaQuery.size ensures these values don't shrink when the keyboard appears,
    // which prevents the UI from squishing or jumping abruptly.
    final size = MediaQuery.of(context).size;
    final padding = MediaQuery.of(context).padding;
    final safeHeight = size.height - padding.top - padding.bottom;
    final safeWidth = size.width - padding.left - padding.right;
    
    final isLandscape = MediaQuery.of(context).orientation == Orientation.landscape;

    return Scaffold(
      // resizeToAvoidBottomInset defaults to true. This allows the Scaffold's body to 
      // shrink when the keyboard appears, which enables Flutter's native 
      // "automatically scroll focused text field into view" behavior.
      backgroundColor: _kBg,
      body: Stack(
        children: [
          SafeArea(
            child: isLandscape
                ? _buildLandscape(safeWidth, safeHeight)
                : _buildPortrait(safeWidth, safeHeight),
          ),
          if (_showForgotModal) _buildForgotOverlay(),
        ],
      ),
    );
  }

  // ── PORTRAIT ──────────────────────────────────────────────────────
  Widget _buildPortrait(double width, double safeHeight) {
    // Ensure the hero is at least 40% of the screen height, but clamp it to a minimum
    // so it doesn't become tiny on small screens and cause squished text.
    final double minHeroHeight = (safeHeight * 0.40).clamp(280.0, double.infinity);

    return CustomScrollView(
      keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
      physics: const ClampingScrollPhysics(),
      slivers: [
        SliverToBoxAdapter(
          child: _buildHero(isLandscape: false, minHeight: minHeroHeight),
        ),
        SliverFillRemaining(
          hasScrollBody: false,
          child: Container(
            color: _kBg,
            padding: const EdgeInsets.fromLTRB(20, 24, 20, 24),
            child: _buildFormContent(),
          ),
        ),
      ],
    );
  }

  // ── LANDSCAPE ─────────────────────────────────────────────────────
  Widget _buildLandscape(double width, double safeHeight) {
    final double heroWidth = width * 0.42;
    
    return SingleChildScrollView(
      keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
      physics: const ClampingScrollPhysics(),
      child: ConstrainedBox(
        constraints: BoxConstraints(minHeight: safeHeight),
        child: Stack(
          children: [
            Positioned(
              top: 0,
              bottom: 0,
              left: 0,
              width: heroWidth,
              child: _buildHero(isLandscape: true, minHeight: safeHeight),
            ),
            Container(
              margin: EdgeInsets.only(left: heroWidth),
              width: width - heroWidth,
              color: _kBg,
              padding: const EdgeInsets.fromLTRB(24, 24, 24, 24),
              child: _buildFormContent(),
            ),
          ],
        ),
      ),
    );
  }

  // ── HERO ──────────────────────────────────────────────────────────
  Widget _buildHero({required bool isLandscape, required double minHeight}) {
    return Container(
      constraints: BoxConstraints(minHeight: minHeight),
      child: Stack(
        children: [
          // Gold gradient bg
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFFF5DFA0),
                    Color(0xFFECC96A),
                    Color(0xFFF0D888),
                    Color(0xFFFAF3EA),
                  ],
                  stops: [0.0, 0.35, 0.65, 1.0],
                ),
              ),
            ),
          ),

          // Radial glow top-right
          Positioned(
            top: -30, right: -30,
            child: Container(
              width: 160, height: 160,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(colors: [
                  Colors.white.withOpacity(0.55),
                  Colors.white.withOpacity(0.0),
                ]),
              ),
            ),
          ),

          // Wave edge
          Positioned.fill(
            child: CustomPaint(
              painter: isLandscape
                  ? _WavePainterRight()
                  : _WavePainterBottom(),
            ),
          ),

          // Content
          Padding(
            padding: EdgeInsets.fromLTRB(
              _isTablet ? 36.0 : 24.0,
              isLandscape ? (_isTablet ? 30.0 : 16.0) : (_isTablet ? 36.0 : 24.0),
              isLandscape ? (_isTablet ? 50.0 : 36.0) : (_isTablet ? 36.0 : 24.0),
              isLandscape ? (_isTablet ? 30.0 : 16.0) : (_isTablet ? 50.0 : 42.0),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // Logo — pinned top
                Container(
                  width: _isTablet ? 56.0 : 44.0,
                  height: _isTablet ? 56.0 : 44.0,
                  decoration: BoxDecoration(
                    color: _kGoldBtn1,
                    borderRadius: BorderRadius.circular(_isTablet ? 16 : 12),
                    boxShadow: [
                      BoxShadow(
                        color: _kGold.withOpacity(0.4),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(Icons.auto_awesome_rounded,
                      color: Colors.white, size: _isTablet ? 28.0 : 22.0),
                ).animate().fadeIn(duration: 350.ms),

                // Responsive spacing to replace spaceBetween
                SizedBox(height: isLandscape ? 24.0 : (_isTablet ? 42.0 : 32.0)),

                // Headline + divider + tagline
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    LayoutBuilder(builder: (ctx, bc) {
                      final fs = isLandscape
                          ? (_isTablet ? 36.0 : 22.0)
                          : _heroFontSize(context);
                      return Text.rich(
                        TextSpan(
                          style: TextStyle(
                            fontWeight: FontWeight.w900,
                            height: 1.08,
                            letterSpacing: 0.2,
                            fontSize: fs,
                          ),
                          children: const [
                            TextSpan(text: 'BUILD YOUR\n',
                                style: TextStyle(color: _kText)),
                            TextSpan(text: 'GLOBAL ',
                                style: TextStyle(color: _kGold,
                                    fontStyle: FontStyle.italic)),
                            TextSpan(text: '\nLEGACY.',
                                style: TextStyle(color: _kText)),
                          ],
                        ),
                      );
                    }).animate().fadeIn(delay: 80.ms, duration: 450.ms),

                    SizedBox(height: isLandscape ? (_isTablet ? 12.0 : 6.0) : (_isTablet ? 16.0 : 10.0)),
                    Container(
                      width: _isTablet ? 54.0 : 36.0,
                      height: _isTablet ? 3.5 : 2.5,
                      color: _kGold,
                    ),
                    SizedBox(height: isLandscape ? (_isTablet ? 12.0 : 6.0) : (_isTablet ? 16.0 : 10.0)),

                    Text.rich(
                      TextSpan(
                        style: TextStyle(
                          fontSize: isLandscape
                              ? (_isTablet ? 13.0 : 9.5)
                              : (_isTablet ? 15.0 : 11.0),
                          fontWeight: FontWeight.w600,
                          letterSpacing: 0.3,
                          height: 1.6,
                        ),
                        children: const [
                          TextSpan(
                            text: 'ELITE ACADEMIC MENTORSHIP\n'
                                'FOR THE IVY LEAGUE AND BEYOND.\n',
                            style: TextStyle(color: Color(0xFF6B4E20)),
                          ),
                          TextSpan(
                            text: 'ACCESS YOUR CENTRALIZED DASHBOARD.',
                            style: TextStyle(
                                color: _kGold, fontWeight: FontWeight.w700),
                          ),
                        ],
                      ),
                    ).animate().fadeIn(delay: 140.ms, duration: 400.ms),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  double _heroFontSize(BuildContext ctx) {
    final shortest = MediaQuery.of(ctx).size.shortestSide;
    final isTablet = shortest >= 600;
    if (isTablet) return 48.0;
    final w = MediaQuery.of(ctx).size.width;
    if (w < 360) return 28;
    if (w < 400) return 32;
    return 36;
  }

  // ── FORM CONTENT ──────────────────────────────────────────────────
  Widget _buildFormContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('WELCOME BACK',
            style: TextStyle(
              fontSize: _isTablet ? 30.0 : 22.0,
              fontWeight: FontWeight.w900,
              letterSpacing: 0.8,
              color: _kText,
              fontStyle: FontStyle.italic,
            )),
        SizedBox(height: _isTablet ? 10.0 : 6.0),
        Container(
          width: _isTablet ? 64.0 : 48.0,
          height: _isTablet ? 3.5 : 2.5,
          color: _kGold,
        ),
        SizedBox(height: _isTablet ? 26.0 : 18.0),

        _buildTabSwitcher(),
        SizedBox(height: _isTablet ? 26.0 : 18.0),

        Form(
          key: _formKey,
          child: _tabIndex == 0 ? _buildEmailTab() : _buildPhoneTab(),
        ),

        SizedBox(height: _isTablet ? 26.0 : 18.0),
        const Divider(color: _kBorder, height: 1),
        SizedBox(height: _isTablet ? 24.0 : 16.0),

        // Footer
        Row(
          children: [
            Container(
              width: _isTablet ? 50.0 : 42.0,
              height: _isTablet ? 50.0 : 42.0,
              decoration: const BoxDecoration(
                  color: _kIconCircle, shape: BoxShape.circle),
              child: Icon(Icons.school_rounded, color: _kGold, size: _isTablet ? 24.0 : 20.0),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: GestureDetector(
                onTap: () => context.go('/register'),
                child: Text.rich(
                  TextSpan(
                    style: TextStyle(
                        fontSize: _isTablet ? 13.0 : 11.0, height: 1.5, letterSpacing: 0.2),
                    children: [
                      const TextSpan(
                          text: 'IF YOU ARE A NEW STUDENT,\n',
                          style: TextStyle(
                              color: _kMuted, fontWeight: FontWeight.w600)),
                      TextSpan(
                          text: 'CLICK HERE',
                          style: TextStyle(
                              color: _kGold,
                              fontWeight: FontWeight.w800,
                              decoration: TextDecoration.underline,
                              decorationColor: _kGold)),
                      const TextSpan(
                          text: ' TO INITIALIZE YOUR ACCOUNT',
                          style: TextStyle(
                              color: _kMuted, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ).animate().fadeIn(delay: 180.ms),

        const SizedBox(height: 8),
      ],
    );
  }

  // ── Tab switcher ──────────────────────────────────────────────────
  Widget _buildTabSwitcher() {
    return Container(
      decoration: BoxDecoration(
        color: _kTabBg,
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: _kBorder, width: 1),
      ),
      child: Row(
        children: [
          _tabPill('EMAIL & PASSWORD', Icons.mail_outline_rounded, 0),
          _tabPill('PHONE OTP LOGIN', Icons.phone_iphone_rounded, 1),
        ],
      ),
    );
  }

  Widget _tabPill(String label, IconData icon, int index) {
    final active = _tabIndex == index;
    final double labelFs = _isTablet ? 12.0 : 10.0;
    final double iconSize = _isTablet ? 15.0 : 13.0;

    return Expanded(
      child: GestureDetector(
        onTap: () {
          _tabCtrl.animateTo(index);
          setState(() => _error = null);
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          margin: const EdgeInsets.all(4),
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
          decoration: BoxDecoration(
            gradient: active
                ? const LinearGradient(
                colors: [_kGoldBtn1, _kGoldBtn2],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight)
                : null,
            borderRadius: BorderRadius.circular(26),
            boxShadow: active
                ? [
              BoxShadow(
                  color: _kGold.withOpacity(0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 3))
            ]
                : null,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: iconSize, color: active ? Colors.white : _kMuted),
              const SizedBox(width: 4),
              Flexible(
                child: Text(label,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: labelFs,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.5,
                      color: active ? Colors.white : _kMuted,
                    )),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── Email tab ─────────────────────────────────────────────────────
  Widget _buildEmailTab() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        _lbl('ENTER YOUR REGISTERED EMAIL'),
        const SizedBox(height: 6),
        _field(
            ctrl: _emailCtrl,
            hint: 'name@university.com',
            icon: Icons.mail_outline_rounded,
            type: TextInputType.emailAddress,
            validator: (v) {
              if (v == null || v.trim().isEmpty) return 'Enter your email';
              if (!v.contains('@')) return 'Enter a valid email';
              return null;
            }),
        const SizedBox(height: 14),

        _lbl('ENTER PASSWORD'),
        const SizedBox(height: 6),
        _field(
          ctrl: _passwordCtrl,
          hint: '••••••••',
          icon: Icons.lock_outline_rounded,
          obscure: !_showPassword,
          suffix: GestureDetector(
            onTap: () => setState(() => _showPassword = !_showPassword),
            child: Icon(
              _showPassword
                  ? Icons.visibility_off_rounded
                  : Icons.remove_red_eye_outlined,
              size: 18,
              color: _kGold,
            ),
          ),
          validator: (v) =>
          (v == null || v.isEmpty) ? 'Enter your password' : null,
        ),
        const SizedBox(height: 8),

        Align(
          alignment: Alignment.centerRight,
          child: GestureDetector(
            onTap: () => setState(() => _showForgotModal = true),
            child: const Text('Forgot Password?',
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: _kGold,
                    decoration: TextDecoration.underline,
                    decorationColor: _kGold)),
          ),
        ),
        const SizedBox(height: 16),

        if (_error != null) ...[_errBox(_error!), const SizedBox(height: 12)],
        _goldBtn('SIGN IN', _handleLogin),
      ],
    );
  }

  // ── Phone tab ─────────────────────────────────────────────────────
  Widget _buildPhoneTab() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        _lbl('MOBILE NUMBER'),
        const SizedBox(height: 6),
        _field(
            ctrl: _phoneCtrl,
            hint: '+91 9999999999',
            icon: Icons.phone_outlined,
            type: TextInputType.phone,
            validator: (v) => (v == null || v.trim().length < 10)
                ? 'Enter a valid mobile number'
                : null),
        if (_otpSent) ...[
          const SizedBox(height: 14),
          _lbl('ENTER OTP'),
          const SizedBox(height: 6),
          _field(
              ctrl: _phoneOtpCtrl,
              hint: '──────',
              icon: Icons.confirmation_number_outlined,
              type: TextInputType.number),
        ],
        const SizedBox(height: 16),
        if (_error != null) ...[_errBox(_error!), const SizedBox(height: 12)],
        _goldBtn(_otpSent ? 'VERIFY OTP' : 'SEND OTP',
                _otpSent ? _handleVerifyLoginOtp : _handleSendLoginOtp),
      ],
    );
  }

  // ── Gold button ───────────────────────────────────────────────────
  Widget _goldBtn(String label, VoidCallback onTap) {
    final double labelFs = _isTablet ? 16.0 : 14.0;
    final double iconSize = _isTablet ? 22.0 : 18.0;

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
            colors: [_kGoldBtn1, _kGoldBtn2],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight),
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
              color: _kGold.withOpacity(0.4),
              blurRadius: 12,
              offset: const Offset(0, 5))
        ],
      ),
      child: ElevatedButton(
        onPressed: _isLoading ? null : onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          padding: EdgeInsets.symmetric(
            vertical: _isTablet ? 18.0 : 14.0,
            horizontal: 16.0,
          ),
        ),
        child: _isLoading
            ? SizedBox(
            width: _isTablet ? 26.0 : 22.0,
            height: _isTablet ? 26.0 : 22.0,
            child: const CircularProgressIndicator(
                strokeWidth: 2.5, color: Colors.white))
            : Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Flexible(
              child: Text(label,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      fontSize: labelFs,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 3,
                      color: Colors.white)),
            ),
            const SizedBox(width: 10),
            Icon(Icons.arrow_forward_rounded,
                size: iconSize, color: Colors.white),
          ],
        ),
      ),
    );
  }

  // ── Forgot overlay ────────────────────────────────────────────────
  Widget _buildForgotOverlay() {
    return GestureDetector(
      onTap: () => setState(() => _showForgotModal = false),
      child: Container(
        color: Colors.black.withOpacity(0.5),
        child: SafeArea(
          child: LayoutBuilder(
            builder: (ctx, constraints) {
              return Center(
                child: SingleChildScrollView(
                  child: GestureDetector(
                    onTap: () {}, // Blocks tap to dismiss
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 18, vertical: 24),
                      constraints: const BoxConstraints(maxWidth: 420),
                      padding: const EdgeInsets.all(22),
                      decoration: BoxDecoration(
                        color: _kFieldBg,
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: _kBorder),
                        boxShadow: [
                          BoxShadow(
                              color: _kGold.withOpacity(0.15),
                              blurRadius: 20,
                              offset: const Offset(0, 8))
                        ],
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text('Reset Password',
                                        style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w900,
                                            color: _kText)),
                                    const SizedBox(height: 4),
                                    Container(width: 32, height: 2.5, color: _kGold),
                                  ]),
                              GestureDetector(
                                onTap: () => setState(() {
                                  _showForgotModal = false;
                                  _forgotStep = 1;
                                  _forgotMsg = '';
                                }),
                                child: Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                      color: _kTabBg,
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(color: _kBorder)),
                                  child: const Icon(Icons.close_rounded,
                                      size: 16, color: _kMuted),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          const Text('Recover your account access',
                              style: TextStyle(fontSize: 12, color: _kMuted)),
                          const SizedBox(height: 16),
  
                          if (_forgotMsg.isNotEmpty) ...[
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: _forgotMsgOk
                                    ? Colors.green.shade50
                                    : Colors.red.shade50,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(
                                    color: _forgotMsgOk
                                        ? Colors.green.shade200
                                        : Colors.red.shade200),
                              ),
                              child: Row(children: [
                                Icon(
                                    _forgotMsgOk
                                        ? Icons.check_circle_outline
                                        : Icons.error_outline,
                                    size: 15,
                                    color:
                                    _forgotMsgOk ? Colors.green : Colors.red),
                                const SizedBox(width: 8),
                                Expanded(
                                    child: Text(_forgotMsg,
                                        style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w600,
                                            color: _forgotMsgOk
                                                ? Colors.green.shade700
                                                : Colors.red.shade700))),
                              ]),
                            ),
                            const SizedBox(height: 14),
                          ],
  
                          if (_forgotStep == 1) ...[
                            _lbl('EMAIL ADDRESS'),
                            const SizedBox(height: 6),
                            _field(
                                ctrl: _forgotEmailCtrl,
                                hint: 'name@email.com',
                                icon: Icons.mail_outline_rounded,
                                type: TextInputType.emailAddress),
                            const SizedBox(height: 14),
                            _modalBtns(
                                'Cancel',
                                    () => setState(() {
                                  _showForgotModal = false;
                                  _forgotStep = 1;
                                  _forgotMsg = '';
                                }),
                                'Send Code',
                                _fStep1,
                                _forgotLoading),
                          ],
  
                          if (_forgotStep == 2) ...[
                            _lbl('RESET CODE'),
                            const SizedBox(height: 6),
                            _field(
                                ctrl: _forgotOtpCtrl,
                                hint: '000000',
                                icon: Icons.confirmation_number_outlined,
                                type: TextInputType.number),
                            const SizedBox(height: 12),
                            _lbl('NEW PASSWORD'),
                            const SizedBox(height: 6),
                            _field(
                                ctrl: _forgotPwCtrl,
                                hint: '••••••••',
                                icon: Icons.lock_outline_rounded,
                                obscure: !_showForgotPw,
                                suffix: GestureDetector(
                                    onTap: () => setState(
                                            () => _showForgotPw = !_showForgotPw),
                                    child: Icon(
                                        _showForgotPw
                                            ? Icons.visibility_off_rounded
                                            : Icons.remove_red_eye_outlined,
                                        size: 16,
                                        color: _kGold))),
                            const SizedBox(height: 12),
                            _lbl('CONFIRM PASSWORD'),
                            const SizedBox(height: 6),
                            _field(
                                ctrl: _forgotCfmCtrl,
                                hint: '••••••••',
                                icon: Icons.lock_outline_rounded,
                                obscure: !_showForgotCfm,
                                suffix: GestureDetector(
                                    onTap: () => setState(
                                            () => _showForgotCfm = !_showForgotCfm),
                                    child: Icon(
                                        _showForgotCfm
                                            ? Icons.visibility_off_rounded
                                            : Icons.remove_red_eye_outlined,
                                        size: 16,
                                        color: _kGold))),
                            const SizedBox(height: 14),
                            _modalBtns(
                                'Back',
                                    () => setState(() => _forgotStep = 1),
                                'Reset Password',
                                _fStep2,
                                _forgotLoading),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  // ── Shared helpers ────────────────────────────────────────────────
  Widget _lbl(String t) => Text(t,
      style: TextStyle(
          fontSize: _isTablet ? 13.0 : 10.0,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
          color: _kMuted));

  Widget _field({
    required TextEditingController ctrl,
    required String hint,
    required IconData icon,
    TextInputType? type,
    bool obscure = false,
    Widget? suffix,
    String? Function(String?)? validator,
  }) {
    final double fs = _isTablet ? 16.0 : 14.0;
    final double hintFs = _isTablet ? 15.0 : 13.0;
    final double iconSize = _isTablet ? 21.0 : 17.0;
    final double paddingVertical = _isTablet ? 18.0 : 14.0;
    final double paddingHorizontal = _isTablet ? 18.0 : 14.0;

    return TextFormField(
      controller: ctrl,
      obscureText: obscure,
      keyboardType: type,
      validator: validator,
      style: TextStyle(
          fontSize: fs, fontWeight: FontWeight.w500, color: _kText),
      cursorColor: _kGold,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle:
        TextStyle(color: _kMuted.withOpacity(0.6), fontSize: hintFs),
        filled: true,
        fillColor: _kFieldBg,
        isDense: true,
        contentPadding:
        EdgeInsets.symmetric(horizontal: paddingHorizontal, vertical: paddingVertical),
        prefixIcon: Padding(
          padding: EdgeInsets.only(left: _isTablet ? 16 : 12, right: _isTablet ? 12 : 8),
          child: Icon(icon, size: iconSize, color: _kMuted),
        ),
        prefixIconConstraints:
        const BoxConstraints(minWidth: 0, minHeight: 0),
        suffixIcon: suffix != null
            ? Padding(
            padding: EdgeInsets.only(right: _isTablet ? 16 : 12), child: suffix)
            : null,
        suffixIconConstraints:
        const BoxConstraints(minWidth: 0, minHeight: 0),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: _kBorder, width: 1)),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: _kGold, width: 1.5)),
        errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.red.shade300)),
        focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide:
            BorderSide(color: Colors.red.shade400, width: 1.5)),
        errorStyle:
        TextStyle(color: Colors.red.shade600, fontSize: _isTablet ? 13.0 : 11.0),
      ),
    );
  }

  Widget _errBox(String msg) => Container(
    padding:
    const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
    decoration: BoxDecoration(
        color: Colors.red.shade50,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.red.shade200)),
    child: Row(children: [
      Icon(Icons.error_outline_rounded,
          color: Colors.red.shade600, size: 15),
      const SizedBox(width: 8),
      Expanded(
          child: Text(msg,
              style: TextStyle(
                  color: Colors.red.shade700,
                  fontSize: 12,
                  fontWeight: FontWeight.w600))),
    ]),
  ).animate().shake();

  Widget _modalBtns(
      String cancelLbl,
      VoidCallback onCancel,
      String confirmLbl,
      VoidCallback onConfirm,
      bool loading) {
    return Row(children: [
      Expanded(
        child: OutlinedButton(
          onPressed: onCancel,
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
            side: const BorderSide(color: _kBorder),
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10)),
          ),
          child: Text(cancelLbl,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: _kMuted)),
        ),
      ),
      const SizedBox(width: 10),
      Expanded(
        child: DecoratedBox(
          decoration: BoxDecoration(
            gradient: loading
                ? null
                : const LinearGradient(
                colors: [_kGoldBtn1, _kGoldBtn2],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight),
            borderRadius: BorderRadius.circular(10),
          ),
          child: ElevatedButton(
            onPressed: loading ? null : onConfirm,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
              backgroundColor: loading ? _kBorder : Colors.transparent,
              shadowColor: Colors.transparent,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
            ),
            child: loading
                ? const SizedBox(
                width: 16,
                height: 16,
                child: CircularProgressIndicator(
                    strokeWidth: 2, color: Colors.white))
                : Text(confirmLbl,
                textAlign: TextAlign.center,
                style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    letterSpacing: 0.5)),
          ),
        ),
      ),
    ]);
  }
}

// ── Wave painters ─────────────────────────────────────────────────
class _WavePainterBottom extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final fill = Paint()..color = const Color(0xFFFAF3EA);
    final path = Path()
      ..moveTo(0, size.height - 28)
      ..cubicTo(size.width * 0.25, size.height - 50,
          size.width * 0.75, size.height + 10, size.width, size.height - 28)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();
    canvas.drawPath(path, fill);

    final stroke = Paint()
      ..color = const Color(0xFFD4A435)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    final strokePath = Path()
      ..moveTo(0, size.height - 28)
      ..cubicTo(size.width * 0.25, size.height - 50,
          size.width * 0.75, size.height + 10, size.width, size.height - 28);
    canvas.drawPath(strokePath, stroke);
  }

  @override
  bool shouldRepaint(_) => false;
}

class _WavePainterRight extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final fill = Paint()..color = const Color(0xFFFAF3EA);
    final path = Path()
      ..moveTo(size.width - 28, 0)
      ..cubicTo(size.width - 50, size.height * 0.25,
          size.width + 10, size.height * 0.75, size.width - 28, size.height)
      ..lineTo(size.width, size.height)
      ..lineTo(size.width, 0)
      ..close();
    canvas.drawPath(path, fill);

    final stroke = Paint()
      ..color = const Color(0xFFD4A435)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    final strokePath = Path()
      ..moveTo(size.width - 28, 0)
      ..cubicTo(size.width - 50, size.height * 0.25,
          size.width + 10, size.height * 0.75, size.width - 28, size.height);
    canvas.drawPath(strokePath, stroke);
  }

  @override
  bool shouldRepaint(_) => false;
}