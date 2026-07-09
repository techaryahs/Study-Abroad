import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'membership_manager.dart';
import 'models/membership_plan.dart';
import '../../core/payment_service.dart';

class MembershipScreen extends StatelessWidget {
  final String? recommendedPlanId;
  final String? lockedFeatureId;

  const MembershipScreen({
    super.key,
    this.recommendedPlanId,
    this.lockedFeatureId,
  });

  @override
  Widget build(BuildContext context) {
    final manager = context.watch<MembershipManager>();
    
    // Sort plans by sortOrder dynamically
    final plans = List<MembershipPlan>.from(manager.activePlans)
      ..sort((a, b) => a.sortOrder.compareTo(b.sortOrder));
      
    final currentPlan = manager.currentPlan;

    // Premium styling constants
    const kBgColor = Color(0xFFFAF3EA);
    const kTextPrimary = Color(0xFF2C1A00);
    const kTextSecondary = Color(0xFF7A6040);
    const kGold = Color(0xFFC49A28);
    const kGoldDark = Color(0xFFA07020);

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
            onPressed: () async {
              debugPrint('[MembershipScreen] 🖱️ Restore Tapped');
              await PaymentService.instance.restorePurchases();
              if (PaymentService.instance.error != null) {
                if (!context.mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(PaymentService.instance.error!),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            child: const Text('Restore', style: TextStyle(color: kGold, fontWeight: FontWeight.bold)),
          )
        ],
        iconTheme: const IconThemeData(color: kTextPrimary),
      ),
      body: manager.isLoading
          ? const Center(child: CircularProgressIndicator(color: kGold))
          : plans.isEmpty
              ? const Center(
                  child: Text(
                    "No plans available at the moment.",
                    style: TextStyle(color: kTextSecondary, fontSize: 16),
                  ),
                )
              : CustomScrollView(
                  physics: const BouncingScrollPhysics(),
                  slivers: [
                    if (lockedFeatureId != null)
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.red.withOpacity(0.05),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.red.withOpacity(0.2)),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.lock_outline, color: Colors.red),
                                SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    'This feature requires a premium membership.',
                                    style: TextStyle(color: Colors.red, fontWeight: FontWeight.w600),
                                  ),
                                ),
                              ],
                            ),
                          ).animate().fadeIn().slideY(begin: -0.2, curve: Curves.easeOut),
                        ),
                      ),
                    SliverPadding(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
                      sliver: SliverList(
                        delegate: SliverChildBuilderDelegate(
                          (context, index) {
                            final plan = plans[index];
                            final isRecommended = plan.recommended || plan.planId == recommendedPlanId;
                            final isCurrentPlan = currentPlan?.planId == plan.planId;
                            
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 24),
                              child: _buildPremiumCard(
                                context,
                                plan: plan,
                                isRecommended: isRecommended,
                                isCurrentPlan: isCurrentPlan,
                                kGold: kGold,
                                kGoldDark: kGoldDark,
                                kTextPrimary: kTextPrimary,
                                kTextSecondary: kTextSecondary,
                              ).animate().fadeIn(delay: Duration(milliseconds: 100 * index)).slideY(begin: 0.1, curve: Curves.easeOut),
                            );
                          },
                          childCount: plans.length,
                        ),
                      ),
                    ),
                  ],
                ),
    );
  }

  Widget _buildPremiumCard(
    BuildContext context, {
    required MembershipPlan plan,
    required bool isRecommended,
    required bool isCurrentPlan,
    required Color kGold,
    required Color kGoldDark,
    required Color kTextPrimary,
    required Color kTextSecondary,
  }) {
    final currencySymbol = plan.currency == 'USD' ? '\$' : (plan.currency == 'GBP' ? '£' : '₹');
    
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
            color: isRecommended ? kGold.withOpacity(0.15) : Colors.black.withOpacity(0.04),
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
            // Header
            if (isRecommended || plan.badge != null)
              Container(
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: isRecommended ? [kGold, kGoldDark] : [Colors.grey.shade800, Colors.black],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Center(
                  child: Text(
                    (plan.badge ?? (isRecommended ? 'RECOMMENDED' : 'PREMIUM')).toUpperCase(),
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
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Expanded(
                        child: Text(
                          plan.name,
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            color: kTextPrimary,
                            height: 1.1,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  if (plan.description != null)
                    Text(
                      plan.description!,
                      style: TextStyle(
                        fontSize: 14,
                        color: kTextSecondary,
                        height: 1.5,
                      ),
                    ),
                  const SizedBox(height: 24),
                  
                  // Pricing
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        plan.price != null ? '$currencySymbol${plan.price}' : 'Free',
                        style: TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.w900,
                          color: kTextPrimary,
                          letterSpacing: -1,
                        ),
                      ),
                      if (plan.type != 'one_time' && plan.price != null)
                        Text(
                          ' /${plan.type.replaceAll('ly', '')}',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: kTextSecondary,
                          ),
                        ),
                    ],
                  ),
                  
                  const SizedBox(height: 32),
                  const Divider(height: 1),
                  const SizedBox(height: 32),
                  
                  // Benefits
                  ...plan.benefits.map((benefit) => Padding(
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
                            benefit,
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
                  )),
                  
                  const SizedBox(height: 32),
                  
                  // CTA Button
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: AnimatedBuilder(
                      animation: PaymentService.instance,
                      builder: (context, _) {
                        final paymentState = PaymentService.instance.state;
                        final isProcessing = paymentState == PaymentState.loading || paymentState == PaymentState.pending;
                        
                        return ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: isCurrentPlan 
                                ? Colors.grey.shade200 
                                : (isRecommended ? kTextPrimary : Colors.white),
                            foregroundColor: isCurrentPlan 
                                ? kTextSecondary 
                                : (isRecommended ? Colors.white : kTextPrimary),
                            elevation: isRecommended && !isCurrentPlan ? 8 : 0,
                            shadowColor: kTextPrimary.withOpacity(0.4),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                              side: isCurrentPlan || isRecommended 
                                  ? BorderSide.none 
                                  : BorderSide(color: Colors.grey.shade300),
                            ),
                          ),
                          onPressed: (isCurrentPlan || isProcessing) ? null : () async {
                            debugPrint('[MembershipScreen] 🖱️ Subscribe Tapped for: ${plan.planId}');
                            await PaymentService.instance.purchase(plan);
                            if (PaymentService.instance.error != null) {
                              if (!context.mounted) return;
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(PaymentService.instance.error!),
                                  backgroundColor: Colors.red,
                                ),
                              );
                            }
                          },
                          child: isProcessing && !isCurrentPlan
                              ? const SizedBox(
                                  height: 24,
                                  width: 24,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                )
                              : Text(
                                  isCurrentPlan 
                                      ? 'CURRENT PLAN' 
                                      : (plan.type == 'one_time' ? 'GET ACCESS' : 'SUBSCRIBE NOW'),
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 1.5,
                                  ),
                                ),
                        );
                      }
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

