import 'dart:io' show Platform;
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/membership_plan.dart';
import '../models/user_membership.dart';
import 'membership_status_chip.dart';
import 'subscription_progress_bar.dart';
import 'sandbox_badge.dart';
import '../../../widgets/book_counselling_sheet.dart';

class MembershipOverviewCard extends StatelessWidget {
  final UserMembership userMembership;
  final MembershipPlan catalogPlan;
  final VoidCallback? onPrimaryAction;

  const MembershipOverviewCard({
    super.key,
    required this.userMembership,
    required this.catalogPlan,
    this.onPrimaryAction,
  });

  static const kGold = Color(0xFFC49A28);
  static const kGoldDark = Color(0xFFA07020);
  static const kTextPrimary = Color(0xFF2C1A00);
  static const kTextSecondary = Color(0xFF7A6040);

  bool get _isActive => userMembership.isActiveStatus;
  bool get _isApple => userMembership.platform.toLowerCase() == 'apple';

  String _formatDate(DateTime? date) {
    if (date == null) return '—';
    final local = date.toLocal();
    final now = DateTime.now();
    // Include time if purchase/expiry occurred within 48h (e.g. Sandbox testing precision)
    final isRecent = local.difference(now).abs().inHours < 48;
    if (isRecent) {
      return DateFormat('dd MMM yyyy, h:mm a').format(local);
    }
    return DateFormat('dd MMM yyyy').format(local);
  }

  String get _contextualDateLabel {
    final status = userMembership.status.toLowerCase();
    if (status == 'active' || status == 'grace_period' || status == 'trialing') {
      return userMembership.hasExpiry ? 'Next renewal' : 'Active since';
    }
    if (status == 'cancelled') {
      return 'Access ends on';
    }
    return 'Expired on';
  }

  DateTime? get _targetDate {
    return userMembership.expiryDate ?? userMembership.purchaseDate;
  }

  String get _formattedAmount {
    final amount = userMembership.amountPaid ?? catalogPlan.price;
    if (amount == null) return 'Free';
    final curr = (userMembership.currency ?? catalogPlan.currency ?? 'INR').toUpperCase();
    final symbol = curr == 'USD' ? '\$' : (curr == 'GBP' ? '£' : '₹');
    final numVal = amount % 1 == 0 ? amount.toInt().toString() : amount.toStringAsFixed(2);
    final period = catalogPlan.type == 'yearly'
        ? '/ year'
        : catalogPlan.type == 'monthly'
            ? '/ month'
            : '';
    return '$symbol$numVal$period'.trim();
  }

  String get _actionButtonText {
    final status = userMembership.status.toLowerCase();
    if (_isActive) {
      return 'Manage Membership';
    }
    if (status == 'expired' || status == 'cancelled') {
      return 'Renew Membership';
    }
    return 'Explore Plans';
  }

  Future<void> _handleManageSubscription(BuildContext context) async {
    if (_isActive && _isApple && Platform.isIOS) {
      final url = Uri.parse('https://apps.apple.com/account/subscriptions');
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
        return;
      }
    }
    context.push('/membership');
  }

  @override
  Widget build(BuildContext context) {
    final purchaseDateStr = _formatDate(userMembership.purchaseDate ?? userMembership.paymentDate);
    final targetDateStr = _formatDate(_targetDate);
    final planTitle = catalogPlan.name.toLowerCase().endsWith('membership')
        ? catalogPlan.name
        : '${catalogPlan.name} Membership';

    final defaultBenefits = catalogPlan.benefits.isNotEmpty
        ? catalogPlan.benefits
        : [
            'Unlimited Counselling',
            'University Shortlisting',
            'SOP & LOR Guidance',
            'Visa Assistance',
            'Priority Support',
          ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: kGold.withOpacity(0.35), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: kGold.withOpacity(0.1),
            blurRadius: 24,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. Hero Section: 🌍 Plan Name + Subtitle + Status Chip
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '🌍 $planTitle',
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: kTextPrimary,
                            height: 1.2,
                          ),
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          'Your premium study abroad membership',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: kTextSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  MembershipStatusChip(status: userMembership.status),
                ],
              ),

              const SizedBox(height: 20),
              const Divider(height: 1),
              const SizedBox(height: 20),

              // 2. Member Since & Next Renewal Card
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: const Color(0xFFFAF3EA),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: kGold.withOpacity(0.2)),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Member Since',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: kTextSecondary,
                          ),
                        ),
                        Text(
                          purchaseDateStr,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: kTextPrimary,
                          ),
                        ),
                      ],
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 10),
                      child: Divider(height: 1),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _contextualDateLabel,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: kTextSecondary,
                          ),
                        ),
                        Text(
                          targetDateStr,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            color: kTextPrimary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 3. Your Plan & Payment Method Section
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'YOUR PLAN',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: kGoldDark,
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          catalogPlan.name,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: kTextPrimary,
                          ),
                        ),
                        Text(
                          _formattedAmount,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: kTextPrimary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      catalogPlan.type == 'yearly' ? 'Annual Plan' : 'Monthly Plan',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: kTextSecondary,
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 10),
                      child: Divider(height: 1),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Payment Method',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: kTextSecondary,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Flexible(
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              if (_isApple)
                                const Padding(
                                  padding: EdgeInsets.only(right: 4),
                                  child: Icon(Icons.apple, size: 15, color: kTextPrimary),
                                ),
                              Flexible(
                                child: Text(
                                  _isApple ? 'Apple App Store' : 'In-App Payment',
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w700,
                                    color: kTextPrimary,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 4. "Included in [Plan Name]" Benefits Section
              Text(
                'INCLUDED IN ${catalogPlan.name.toUpperCase()}',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  color: kGoldDark,
                  letterSpacing: 1.2,
                ),
              ),
              const SizedBox(height: 12),
              ...defaultBenefits.map(
                (benefit) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(
                        Icons.check_circle_rounded,
                        size: 18,
                        color: kGold,
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          benefit,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: kTextPrimary,
                            height: 1.3,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // 5. Primary CTA Button ("MANAGE MEMBERSHIP")
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isActive ? kTextPrimary : kGold,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  onPressed: () {
                    if (onPrimaryAction != null) {
                      onPrimaryAction?.call();
                    } else {
                      _handleManageSubscription(context);
                    }
                  },
                  child: Text(
                    _actionButtonText.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 24),
              const Divider(height: 1),
              const SizedBox(height: 20),

              // 6. "Need Help?" Customer Support Section
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: kGold.withOpacity(0.06),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: kGold.withOpacity(0.2)),
                ),
                child: Column(
                  children: [
                    const Text(
                      'Questions about your membership?',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                        color: kTextPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Our study abroad counsellors are here to guide you anytime.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: kTextSecondary,
                      ),
                    ),
                    const SizedBox(height: 14),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () => showBookCounsellingSheet(context),
                            icon: const Icon(Icons.chat_bubble_outline_rounded, size: 16),
                            label: const Text('Chat with Counsellor'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: kTextPrimary,
                              side: const BorderSide(color: kGold, width: 1.5),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              textStyle: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
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

  Widget _timelineStep({
    required String title,
    required String dateStr,
    required bool isDone,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isDone ? kGold : Colors.grey.shade400,
              ),
            ),
            const SizedBox(width: 6),
            Text(
              title,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: isDone ? kTextPrimary : kTextSecondary,
              ),
            ),
          ],
        ),
        const SizedBox(height: 2),
        Padding(
          padding: const EdgeInsets.only(left: 16),
          child: Text(
            dateStr,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: kTextPrimary,
            ),
          ),
        ),
      ],
    );
  }
}
