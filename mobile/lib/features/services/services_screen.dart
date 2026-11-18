import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb, defaultTargetPlatform, TargetPlatform;
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme.dart';
import '../../widgets/book_counselling_sheet.dart';
import '../../widgets/edu_components.dart';
import '../cart/cart_provider.dart';
import '../membership/membership_manager.dart';
import 'service_model.dart';
import 'service_launcher.dart';

class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

  static final List<ServiceModel> _services = ServiceModel.allServices;

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final membershipManager = context.watch<MembershipManager>();
    final bool isIOS = !kIsWeb && (defaultTargetPlatform == TargetPlatform.iOS || Platform.isIOS);

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const EduBrandHeaderTitle(),
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.white,
        actions: [
          if (!isIOS)
            Stack(
              alignment: Alignment.center,
              children: [
                IconButton(
                  icon: const Icon(Icons.shopping_cart_outlined, color: AppTheme.navy),
                  onPressed: () => context.push('/cart'),
                ),
                if (cart.totalQuantity > 0)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.gold,
                        borderRadius: BorderRadius.circular(999),
                        boxShadow: AppTheme.goldGlow,
                      ),
                      child: Center(
                        child: Text(
                          '${cart.totalQuantity}',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            color: AppTheme.navy,
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
        ],
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        children: [
          // ── Navy Header Card ──────────────────────────
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.navy,
              borderRadius: BorderRadius.circular(32),
              border: Border.all(color: Colors.white.withValues(alpha: 0.12)),
              boxShadow: AppTheme.navyShadow,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const EduPillBadge(
                  label: 'Personalized Advisory',
                  icon: Icons.auto_awesome,
                  backgroundColor: Color(0x332CA59D),
                  textColor: AppTheme.goldLight,
                  borderColor: Color(0x442CA59D),
                ),
                const SizedBox(height: 14),
                Text(
                  'Premium Study\nAbroad Services',
                  style: GoogleFonts.playfairDisplay(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    height: 1.15,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Admissions strategy, SOP & LOR drafting, visa preparation, and career optimization.',
                  style: GoogleFonts.inter(
                    color: Colors.white.withValues(alpha: 0.75),
                    fontSize: 13,
                    height: 1.4,
                  ),
                ),
                const SizedBox(height: 20),
                EduGoldButton(
                  label: 'Book Free Counselling',
                  onPressed: () => showBookCounsellingSheet(context),
                  height: 44,
                ),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: 24),

          const EduSectionHeader(
            tagline: 'Expertise',
            title: 'Structured Programs',
            padding: EdgeInsets.zero,
          ),

          const SizedBox(height: 12),

          ...List.generate(_services.length, (i) {
            final service = _services[i];
            final inCart = cart.isInCart(service.slug);
            final quantity = cart.quantityFor(service.slug);
            final hasAccess = isIOS ? membershipManager.canAccess(service.slug) : false;

            return GestureDetector(
              onTap: () => context.push('/services/${service.slug}'),
              child: Container(
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: inCart ? AppTheme.gold : AppTheme.borderLight,
                    width: inCart ? 1.5 : 1,
                  ),
                  boxShadow: inCart ? AppTheme.goldGlow : AppTheme.cardShadow,
                ),
                clipBehavior: Clip.antiAlias,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  color: AppTheme.surfaceMuted,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: AppTheme.borderLight),
                                ),
                                child: Center(
                                  child: Text(
                                    service.icon,
                                    style: const TextStyle(fontSize: 22),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      service.title,
                                      style: GoogleFonts.inter(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w900,
                                        color: AppTheme.navy,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    if (isIOS)
                                      Text(
                                        hasAccess ? 'Included with Membership' : 'Unlock with Membership',
                                        style: GoogleFonts.inter(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w800,
                                          color: hasAccess ? AppTheme.tealDark : AppTheme.goldDark,
                                        ),
                                      )
                                    else
                                      Text(
                                        '\u20B9${service.price.toStringAsFixed(0)}',
                                        style: GoogleFonts.inter(
                                          fontSize: 17,
                                          fontWeight: FontWeight.w900,
                                          color: AppTheme.goldDark,
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                              if (inCart)
                                EduStatusChip(
                                  label: 'IN CART x$quantity',
                                  color: AppTheme.goldDark,
                                ),
                            ],
                          ),
                          const SizedBox(height: 14),
                          Text(
                            service.description,
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              color: AppTheme.textSecondary,
                              height: 1.5,
                            ),
                          ),
                          const SizedBox(height: 14),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: service.features
                                .map((feature) => Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 5,
                                      ),
                                      decoration: BoxDecoration(
                                        color: AppTheme.surfaceMuted,
                                        borderRadius: BorderRadius.circular(20),
                                        border: Border.all(color: AppTheme.borderLight),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Icon(
                                            Icons.check_circle_rounded,
                                            size: 13,
                                            color: AppTheme.teal,
                                          ),
                                          const SizedBox(width: 5),
                                          Text(
                                            feature,
                                            style: GoogleFonts.inter(
                                              fontSize: 12,
                                              fontWeight: FontWeight.w600,
                                              color: AppTheme.textSecondary,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ))
                                .toList(),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                      decoration: const BoxDecoration(
                        color: AppTheme.surfaceMuted,
                        border: Border(top: BorderSide(color: AppTheme.borderLight)),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => showBookCounsellingSheet(context),
                              child: Row(
                                children: [
                                  Text(
                                    'Get Free Advice',
                                    style: GoogleFonts.inter(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w800,
                                      color: AppTheme.tealDark,
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  const Icon(
                                    Icons.arrow_forward_rounded,
                                    size: 14,
                                    color: AppTheme.tealDark,
                                  ),
                                ],
                              ),
                            ),
                          ),
                          if (isIOS)
                            ElevatedButton(
                              onPressed: () => ServiceLauncher.launch(context, service),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.gold,
                                foregroundColor: AppTheme.navy,
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                              ),
                              child: Text(
                                hasAccess ? 'Access Service' : 'Unlock Membership',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            )
                          else
                            ElevatedButton(
                              onPressed: () => _addToCart(context, service),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: inCart ? AppTheme.navy : AppTheme.gold,
                                foregroundColor: inCart ? Colors.white : AppTheme.navy,
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                              ),
                              child: Text(
                                inCart ? 'Add Again' : 'Add to Cart',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            )
                .animate()
                .fadeIn(delay: Duration(milliseconds: i * 70))
                .slideY(begin: 0.05);
          }),

          const SizedBox(height: 12),

          GestureDetector(
            onTap: () => context.push('/faq'),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppTheme.borderLight),
                boxShadow: AppTheme.cardShadow,
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppTheme.teal.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.help_outline_rounded,
                      color: AppTheme.tealDark,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      'Frequently Asked Questions',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.navy,
                      ),
                    ),
                  ),
                  const Icon(
                    Icons.arrow_forward_ios_rounded,
                    color: AppTheme.textSecondary,
                    size: 14,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 36),
        ],
      ),
    );
  }

  Future<void> _addToCart(BuildContext context, ServiceModel service) async {
    final cart = context.read<CartProvider>();

    try {
      await cart.addToCart(service);
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Added ${service.title} to cart'),
            backgroundColor: AppTheme.tealDark,
            behavior: SnackBarBehavior.floating,
            duration: const Duration(seconds: 1),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to add item: $e'),
            backgroundColor: Colors.redAccent,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    }
  }
}
