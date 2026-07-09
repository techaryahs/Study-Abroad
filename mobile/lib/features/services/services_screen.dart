import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/theme.dart';
import '../../widgets/book_counselling_sheet.dart';
import '../cart/cart_provider.dart';
import '../membership/membership_manager.dart';
import '../membership/membership_screen.dart';
import 'service_model.dart';

class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

  static final List<ServiceModel> _services = ServiceModel.allServices;

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final membershipManager = context.watch<MembershipManager>();
    final bool isIOS = !kIsWeb && Platform.isIOS;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('Our Services'),
        backgroundColor: AppTheme.background,
        actions: [
          if (!isIOS)
            Stack(
              alignment: Alignment.center,
              children: [
                IconButton(
                  icon: const Icon(Icons.shopping_cart_outlined),
                  onPressed: () => context.push('/cart'),
                ),
                if (cart.totalQuantity > 0)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      constraints:
                          const BoxConstraints(minWidth: 16, minHeight: 16),
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.gold,
                        borderRadius: BorderRadius.circular(999),
                      ),
                      child: Center(
                        child: Text(
                          '${cart.totalQuantity}',
                          style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w900,
                              color: AppTheme.darkBrown),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.darkBrown,
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Premium Study\nAbroad Services',
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      height: 1.2),
                ),
                const SizedBox(height: 8),
                Text('Trusted by 1000+ students worldwide',
                    style: TextStyle(
                        color: Colors.white.withOpacity(0.5), fontSize: 14)),
                const SizedBox(height: 20),
                GestureDetector(
                  onTap: () => showBookCounsellingSheet(context),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 12),
                    decoration: BoxDecoration(
                      color: AppTheme.gold,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Text(
                      'Book Free Counselling',
                      style: TextStyle(
                          color: AppTheme.darkBrown,
                          fontSize: 13,
                          fontWeight: FontWeight.w800),
                    ),
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),
          const SizedBox(height: 24),
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
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: inCart ? AppTheme.gold : AppTheme.borderLight,
                    width: inCart ? 1.5 : 1,
                  ),
                  boxShadow: inCart
                      ? [
                          BoxShadow(
                              color: AppTheme.gold.withOpacity(0.1),
                              blurRadius: 12,
                              offset: const Offset(0, 4))
                        ]
                      : [],
                ),
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
                                  color: AppTheme.darkBrown,
                                  borderRadius: BorderRadius.circular(14),
                                ),
                                child: Center(
                                    child: Text(service.icon,
                                        style: const TextStyle(fontSize: 22))),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      service.title,
                                      style: const TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w800,
                                          color: AppTheme.textPrimary),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      '\u20B9${service.price.toStringAsFixed(0)}',
                                      style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.w900,
                                          color: AppTheme.gold),
                                    ),
                                  ],
                                ),
                              ),
                              if (inCart)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 5),
                                  decoration: BoxDecoration(
                                    color: AppTheme.gold.withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(999),
                                  ),
                                  child: Text(
                                    'IN CART x$quantity',
                                    style: const TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w900,
                                        color: AppTheme.gold),
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 14),
                          Text(service.description,
                              style: const TextStyle(
                                  fontSize: 14,
                                  color: AppTheme.textSecondary,
                                  height: 1.6)),
                          const SizedBox(height: 14),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: service.features
                                .map((feature) => Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 10, vertical: 5),
                                      decoration: BoxDecoration(
                                        color: AppTheme.background,
                                        borderRadius: BorderRadius.circular(20),
                                        border: Border.all(
                                            color: AppTheme.borderLight),
                                      ),
                                      child: Text(
                                        '\u2713 $feature',
                                        style: const TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w600,
                                            color: AppTheme.textSecondary),
                                      ),
                                    ))
                                .toList(),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 14),
                      decoration: BoxDecoration(
                        color: AppTheme.background,
                        borderRadius: const BorderRadius.vertical(
                            bottom: Radius.circular(20)),
                        border: Border(
                            top: BorderSide(color: AppTheme.borderLight)),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => showBookCounsellingSheet(context),
                              child: const Text(
                                'Get Free Advice ->',
                                style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: AppTheme.gold),
                              ),
                            ),
                          ),
                          if (isIOS)
                            ElevatedButton(
                              onPressed: () {
                                if (hasAccess) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Starting ${service.title}...')),
                                  );
                                } else {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (_) => MembershipScreen(
                                        lockedFeatureId: service.slug,
                                      ),
                                    ),
                                  );
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.gold,
                                foregroundColor: AppTheme.darkBrown,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12)),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 18, vertical: 10),
                              ),
                              child: Text(
                                hasAccess ? 'Access' : 'Unlock',
                                style: const TextStyle(
                                    fontSize: 14, fontWeight: FontWeight.w800),
                              ),
                            )
                          else
                            ElevatedButton(
                              onPressed: () => _addToCart(context, service),
                              style: ElevatedButton.styleFrom(
                                backgroundColor:
                                    inCart ? AppTheme.darkBrown : AppTheme.gold,
                                foregroundColor:
                                    inCart ? Colors.white : AppTheme.darkBrown,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12)),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 18, vertical: 10),
                              ),
                              child: Text(
                                inCart ? 'Add Again' : 'Add to Cart',
                                style: const TextStyle(
                                    fontSize: 14, fontWeight: FontWeight.w800),
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
                .fadeIn(delay: Duration(milliseconds: i * 80))
                .slideY(begin: 0.1);
          }),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: InkWell(
              onTap: () => context.push('/faq'),
              borderRadius: BorderRadius.circular(20),
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
                decoration: BoxDecoration(
                  color: AppTheme.gold.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Icon(Icons.help_outline_rounded,
                        color: AppTheme.gold, size: 22),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        'Frequently Asked Questions',
                        style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                            color: AppTheme.gold),
                      ),
                    ),
                    Icon(Icons.arrow_forward_ios_rounded,
                        color: AppTheme.gold, size: 12),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 30),
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
            backgroundColor: Colors.green.shade700,
            behavior: SnackBarBehavior.floating,
            duration: const Duration(seconds: 1),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to add item: $e'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    }
  }
}
