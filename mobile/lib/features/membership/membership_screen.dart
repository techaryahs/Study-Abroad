import 'dart:io' show Platform;

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:url_launcher/url_launcher.dart';
import 'membership_manager.dart';
import 'models/membership_plan.dart';
import '../../core/payment_service.dart';
import '../../core/app_logger.dart';

/// App Store Guideline 3.1.2(c) — subscription presentation only.
/// Purchase / membership architecture is unchanged.
class MembershipScreen extends StatefulWidget {
  final String? recommendedPlanId;
  final String? lockedFeatureId;

  const MembershipScreen({
    super.key,
    this.recommendedPlanId,
    this.lockedFeatureId,
  });

  @override
  State<MembershipScreen> createState() => _MembershipScreenState();
}

class _MembershipScreenState extends State<MembershipScreen> {
  static const kBgColor = Color(0xFFFAF3EA);
  static const kTextPrimary = Color(0xFF2C1A00);
  static const kTextSecondary = Color(0xFF7A6040);
  static const kGold = Color(0xFFC49A28);
  static const kGoldDark = Color(0xFFA07020);

  /// Apple Standard Licensed Application End User License Agreement.
  static final Uri _appleStandardEula = Uri.parse(
    'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
  );

  bool _isAutoRenewable(MembershipPlan plan) =>
      plan.type != 'one_time' && plan.type != 'lifetime';

  bool _isStarter(MembershipPlan plan) =>
      plan.planId.toLowerCase() == 'starter';

  @override
  void initState() {
    super.initState();
    if (Platform.isIOS) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        PaymentService.instance.loadStoreProducts(silent: true).then((_) {
          if (mounted) setState(() {});
        });
      });
    }
  }

  Future<void> _onRestore() async {
    AppLogger.info('Restore purchases requested');
    await PaymentService.instance.restorePurchases();
    if (!mounted) return;
    if (PaymentService.instance.error != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(PaymentService.instance.error!),
          backgroundColor: Colors.red,
        ),
      );
    } else if (PaymentService.instance.state == PaymentState.restored ||
        PaymentService.instance.state == PaymentState.success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Purchases restored. Membership updated.'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  Future<void> _onSubscribe(MembershipPlan plan) async {
    AppLogger.info('Subscribe initiated for plan: ${plan.planId}');
    await PaymentService.instance.purchase(plan);
    if (!mounted) return;
    if (PaymentService.instance.error != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(PaymentService.instance.error!),
          backgroundColor: Colors.red,
        ),
      );
    } else if (PaymentService.instance.state == PaymentState.success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Membership activated.'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  /// Opens existing in-app Privacy Policy screen (always available offline).
  void _openPrivacyPolicy() {
    context.push('/privacy-policy');
  }

  /// Opens Apple Standard EULA; falls back to in-app Terms if launch fails.
  Future<void> _openTermsOfUse() async {
    final ok = await launchUrl(
      _appleStandardEula,
      mode: LaunchMode.externalApplication,
    );
    if (!ok && mounted) {
      context.push('/terms-condition');
    }
  }

  /// Fixed 3.1.2(c) titles per plan.
  String _displayTitle(MembershipPlan plan) {
    switch (plan.planId.toLowerCase()) {
      case 'starter':
        return 'Starter Membership';
      case 'essential':
        return 'Essential Membership';
      case 'premium':
        return 'Premium Membership';
      case 'elite':
        return 'Elite Global Membership';
      default:
        final name = plan.name.trim();
        if (name.toLowerCase().endsWith('membership')) return name;
        return '$name Membership';
    }
  }

  String _billingPeriodLabel(MembershipPlan plan) {
    if (!_isAutoRenewable(plan)) return 'One-time Purchase';
    if (plan.type == 'yearly') return '1 Year Subscription';
    if (plan.type == 'monthly') return '1 Month Subscription';
    return 'Subscription';
  }

  /// Builds the price line shown on each card.
  ///
  /// Prefer StoreKit [ProductDetails.price] (localized, App Store–authoritative).
  /// Catalog price is fallback only when StoreKit is unavailable (e.g. Android,
  /// products not loaded yet). Period is already shown as "1 Year Subscription"
  /// so StoreKit strings are not mangled with an extra "/year".
  String _priceLine({
    required MembershipPlan plan,
    required String? storeKitPrice,
    required String catalogFallback,
  }) {
    // 1) StoreKit wins when present — display exactly as Apple localizes it.
    if (storeKitPrice != null && storeKitPrice.trim().isNotEmpty) {
      return storeKitPrice.trim();
    }

    // 2) Catalog fallback only.
    if (!_isAutoRenewable(plan)) return catalogFallback;
    if (plan.type == 'yearly') {
      final lower = catalogFallback.toLowerCase();
      if (lower.contains('/year') ||
          lower.contains('year') ||
          lower.contains('/yr')) {
        return catalogFallback;
      }
      return '$catalogFallback/year';
    }
    if (plan.type == 'monthly') {
      final lower = catalogFallback.toLowerCase();
      if (lower.contains('/month') || lower.contains('month')) {
        return catalogFallback;
      }
      return '$catalogFallback/month';
    }
    return catalogFallback;
  }

  @override
  Widget build(BuildContext context) {
    final manager = context.watch<MembershipManager>();

    final plans = List<MembershipPlan>.from(manager.activePlans)
      ..sort((a, b) => a.sortOrder.compareTo(b.sortOrder));

    final currentPlan = manager.currentPlan;
    final hasAutoRenewablePlans = plans.any(_isAutoRenewable);

    return Scaffold(
      backgroundColor: kBgColor,
      appBar: AppBar(
        backgroundColor: kBgColor,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Choose Your Plan',
          style: TextStyle(
            color: kTextPrimary,
            fontWeight: FontWeight.w900,
            fontSize: 20,
            letterSpacing: 0.5,
          ),
        ),
        actions: [
          TextButton(
            onPressed: _onRestore,
            child: const Text(
              'Restore Purchases',
              style: TextStyle(
                color: kGold,
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
          ),
        ],
        iconTheme: const IconThemeData(color: kTextPrimary),
      ),
      body: manager.isLoading
          ? const Center(child: CircularProgressIndicator(color: kGold))
          : plans.isEmpty
              ? const Center(
                  child: Text(
                    'No plans available at the moment.',
                    style: TextStyle(color: kTextSecondary, fontSize: 16),
                  ),
                )
              : AnimatedBuilder(
                  animation: PaymentService.instance,
                  builder: (context, _) {
                    return CustomScrollView(
                      physics: const BouncingScrollPhysics(),
                      slivers: [
                        if (widget.lockedFeatureId != null)
                          SliverToBoxAdapter(
                            child: Padding(
                              padding:
                                  const EdgeInsets.fromLTRB(24, 16, 24, 0),
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: Colors.red.withOpacity(0.05),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: Colors.red.withOpacity(0.2),
                                  ),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(Icons.lock_outline, color: Colors.red),
                                    SizedBox(width: 12),
                                    Expanded(
                                      child: Text(
                                        'This feature requires a premium membership.',
                                        style: TextStyle(
                                          color: Colors.red,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              )
                                  .animate()
                                  .fadeIn()
                                  .slideY(begin: -0.2, curve: Curves.easeOut),
                            ),
                          ),
                        SliverPadding(
                          padding: const EdgeInsets.fromLTRB(24, 24, 24, 8),
                          sliver: SliverList(
                            delegate: SliverChildBuilderDelegate(
                              (context, index) {
                                final currentPlanId = manager.currentPlanId;
                                final userMembership = manager.userMembership;
                                final plan = plans[index];
                                final isRecommended = plan.recommended ||
                                    plan.planId == widget.recommendedPlanId;
                                final isCurrentPlan =
                                    currentPlanId != null && currentPlanId == plan.planId;

                                final isDowngrade = currentPlan != null && plan.sortOrder < currentPlan.sortOrder;
                                final isUpgrade = currentPlan != null && plan.sortOrder > currentPlan.sortOrder;
                                final isExpiredPlan = userMembership != null &&
                                    !userMembership.isActiveStatus &&
                                    userMembership.planId == plan.planId;

                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 24),
                                  child: _buildPremiumCard(
                                    plan: plan,
                                    isRecommended: isRecommended,
                                    isCurrentPlan: isCurrentPlan,
                                    isDowngrade: isDowngrade,
                                    isUpgrade: isUpgrade,
                                    isExpiredPlan: isExpiredPlan,
                                  )
                                      .animate()
                                      .fadeIn(
                                        delay: Duration(
                                          milliseconds: 100 * index,
                                        ),
                                      )
                                      .slideY(
                                        begin: 0.1,
                                        curve: Curves.easeOut,
                                      ),
                                );
                              },
                              childCount: plans.length,
                            ),
                          ),
                        ),
                        // Guideline 3.1.2(c) legal footer
                        SliverToBoxAdapter(
                          child: Padding(
                            padding: const EdgeInsets.fromLTRB(24, 8, 24, 40),
                            child: _buildComplianceFooter(
                              showSubscriptionLegal: hasAutoRenewablePlans,
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                ),
    );
  }

  /// Privacy Policy, Terms of Use (EULA), Restore, subscription legal text.
  Widget _buildComplianceFooter({required bool showSubscriptionLegal}) {
    final linkStyle = TextStyle(
      color: kGoldDark,
      fontWeight: FontWeight.w700,
      fontSize: 14,
      decoration: TextDecoration.underline,
      decorationColor: kGoldDark,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Center(
          child: Wrap(
            alignment: WrapAlignment.center,
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 8,
            children: [
              TextButton(
                onPressed: _openPrivacyPolicy,
                style: TextButton.styleFrom(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: Text('Privacy Policy', style: linkStyle),
              ),
              Text(
                '·',
                style: TextStyle(color: kTextSecondary.withOpacity(0.6)),
              ),
              TextButton(
                onPressed: _openTermsOfUse,
                style: TextButton.styleFrom(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: Text('Terms of Use (EULA)', style: linkStyle),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),
        Center(
          child: OutlinedButton(
            onPressed: _onRestore,
            style: OutlinedButton.styleFrom(
              foregroundColor: kGoldDark,
              side: BorderSide(color: kGold.withOpacity(0.6)),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text(
              'Restore Purchases',
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 13,
                letterSpacing: 0.5,
              ),
            ),
          ),
        ),
        if (showSubscriptionLegal) ...[
          const SizedBox(height: 20),
          Text(
            'Payment will be charged to your Apple ID at confirmation of purchase.\n\n'
            'Subscriptions automatically renew unless cancelled at least 24 hours before renewal.\n\n'
            'Manage or cancel subscriptions anytime from Apple ID Settings.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 11,
              height: 1.5,
              color: kTextSecondary.withOpacity(0.9),
            ),
          ),
        ],
      ],
    );
  }

  Widget _benefitRow(String text, {required bool isRecommended}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.check_circle,
            color: isRecommended ? kGold : Colors.green.shade600,
            size: 22,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 15,
                color: kTextPrimary.withOpacity(0.85),
                fontWeight: FontWeight.w500,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPremiumCard({
    required MembershipPlan plan,
    required bool isRecommended,
    required bool isCurrentPlan,
    required bool isDowngrade,
    required bool isUpgrade,
    bool isExpiredPlan = false,
  }) {
    // StoreKit ProductDetails.price is the display source of truth on iOS.
    // Backend catalog price is fallback only (never overrides StoreKit).
    final storeKitPrice = PaymentService.instance.localizedPriceFor(plan);
    final currencySymbol =
        plan.currency == 'USD' ? '\$' : (plan.currency == 'GBP' ? '£' : '₹');
    final catalogFallback =
        plan.price != null ? '$currencySymbol${plan.price}' : 'Free';
    final priceLine = _priceLine(
      plan: plan,
      storeKitPrice: storeKitPrice,
      catalogFallback: catalogFallback,
    );
    final usingStoreKit = storeKitPrice != null && storeKitPrice.trim().isNotEmpty;
    final displayTitle = _displayTitle(plan);
    final periodLabel = _billingPeriodLabel(plan);
    final isAutoRenew = _isAutoRenewable(plan);
    final isStarter = _isStarter(plan);

    // HIDE UNAVAILABLE STOREKIT PLANS
    if (Platform.isIOS && !usingStoreKit && PaymentService.instance.storeProductsLoaded) {
      // If we loaded StoreKit products but this specific plan is missing,
      // it means Apple didn't return it (e.g. pending review or wrong ID).
      // We MUST hide it, otherwise users get a dead "Subscribe" button.
      return const SizedBox.shrink();
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isRecommended ? kGold : Colors.grey.withOpacity(0.2),
          width: isRecommended ? 2.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: isRecommended
                ? kGold.withOpacity(0.15)
                : Colors.black.withOpacity(0.04),
            blurRadius: isRecommended ? 24 : 12,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(22),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (isRecommended || plan.badge != null)
              Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: isRecommended
                        ? [kGold, kGoldDark]
                        : [Colors.grey.shade800, Colors.black],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Center(
                  child: Text(
                    (plan.badge ??
                            (isRecommended ? 'RECOMMENDED' : 'PREMIUM'))
                        .toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                    ),
                  ),
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    displayTitle,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w900,
                      color: kTextPrimary,
                      height: 1.1,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Billing period
                  Text(
                    periodLabel,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: isAutoRenew ? kGoldDark : kTextSecondary,
                      letterSpacing: 0.2,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Starter lifetime line / catalog description for others
                  if (isStarter)
                    const Text(
                      'Lifetime access to Starter features.',
                      style: TextStyle(
                        fontSize: 14,
                        color: kTextSecondary,
                        height: 1.5,
                      ),
                    )
                  else if (plan.description != null)
                    Text(
                      plan.description!,
                      style: const TextStyle(
                        fontSize: 14,
                        color: kTextSecondary,
                        height: 1.5,
                      ),
                    ),

                  const SizedBox(height: 20),

                  // Price — StoreKit localized when available (e.g. ₹14,999.00)
                  Text(
                    priceLine,
                    style: const TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.w900,
                      color: kTextPrimary,
                      letterSpacing: -1,
                    ),
                  ),
                  // Period reminder under StoreKit price (period line above is primary)
                  if (usingStoreKit && isAutoRenew && plan.type == 'yearly')
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(
                        'per year',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: kTextSecondary.withOpacity(0.9),
                        ),
                      ),
                    ),

                  // Auto-renew (yearly only) — never for Starter
                  if (isAutoRenew) ...[
                    const SizedBox(height: 12),
                    Text(
                      'Automatically renews every year unless cancelled at least '
                      '24 hours before the end of the current billing period.',
                      style: TextStyle(
                        fontSize: 12,
                        height: 1.45,
                        color: kTextSecondary.withOpacity(0.95),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],

                  const SizedBox(height: 28),
                  const Divider(height: 1),
                  const SizedBox(height: 24),

                  const Text(
                    'Includes:',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w800,
                      color: kTextPrimary,
                      letterSpacing: 0.3,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Starter: fixed compliance bullets (no auto-renew wording)
                  if (isStarter) ...[
                    _benefitRow(
                      '1 Consultation Credit',
                      isRecommended: isRecommended,
                    ),
                    _benefitRow(
                      'Lifetime Starter Features',
                      isRecommended: isRecommended,
                    ),
                    ...plan.benefits
                        .where((b) {
                          final lower = b.toLowerCase();
                          return !lower.contains('consultation') &&
                              !lower.contains('counselling') &&
                              !lower.contains('counseling') &&
                              !lower.contains('10 minute');
                        })
                        .map(
                          (b) => _benefitRow(b, isRecommended: isRecommended),
                        ),
                  ] else
                    ...plan.benefits.map(
                      (b) => _benefitRow(b, isRecommended: isRecommended),
                    ),

                  const SizedBox(height: 24),

                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: Builder(
                      builder: (context) {
                        final paymentState = PaymentService.instance.state;
                        final isProcessing =
                            paymentState == PaymentState.loading ||
                                paymentState == PaymentState.pending;
                        
                        final bool isDisabled = isCurrentPlan || isDowngrade || isProcessing;
                        String buttonText;
                        if (isCurrentPlan) {
                          buttonText = 'ACTIVE PLAN';
                        } else if (isDowngrade) {
                          buttonText = 'UNAVAILABLE';
                        } else if (isUpgrade) {
                          buttonText = 'UPGRADE PLAN';
                        } else if (isExpiredPlan) {
                          buttonText = 'RENEW MEMBERSHIP';
                        } else {
                          buttonText = isAutoRenew ? 'SUBSCRIBE NOW' : 'GET ACCESS';
                        }

                        return ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: isDisabled
                                ? Colors.grey.shade200
                                : (isRecommended ? kTextPrimary : Colors.white),
                            foregroundColor: isDisabled
                                ? kTextSecondary
                                : (isRecommended
                                    ? Colors.white
                                    : kTextPrimary),
                            elevation:
                                isRecommended && !isDisabled ? 8 : 0,
                            shadowColor: kTextPrimary.withOpacity(0.4),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                              side: isDisabled || isRecommended
                                  ? BorderSide.none
                                  : BorderSide(color: Colors.grey.shade300),
                            ),
                          ),
                          onPressed: isDisabled
                              ? null
                              : () => _onSubscribe(plan),
                          child: isProcessing && !isCurrentPlan && !isDowngrade
                              ? const SizedBox(
                                  height: 24,
                                  width: 24,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                  ),
                                )
                              : Text(
                                  buttonText,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 1.5,
                                  ),
                                ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
