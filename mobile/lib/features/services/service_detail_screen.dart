import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/theme.dart';
import 'service_model.dart';
import '../../widgets/book_counselling_sheet.dart';
import '../cart/cart_provider.dart';

class ServiceDetailScreen extends StatelessWidget {
  final String slug;

  const ServiceDetailScreen({super.key, required this.slug});

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final inCart = cart.isInCart(slug);

    final service = ServiceModel.allServices.firstWhere(
      (s) => s.slug == slug,
      orElse: () => ServiceModel.allServices.first,
    );

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          // ── HERO APP BAR ──────────────────────────────────
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: AppTheme.darkBrown,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: AppTheme.gold),
              onPressed: () => context.pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                   Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [AppTheme.darkBrown, AppTheme.darkBrown.withValues(alpha: 0.8)],
                      ),
                    ),
                  ),
                  Positioned(
                    right: -20,
                    bottom: -20,
                    child: Opacity(
                      opacity: 0.1,
                      child: Text(service.icon, style: const TextStyle(fontSize: 180)),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.gold.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppTheme.gold.withValues(alpha: 0.3)),
                          ),
                          child: const Text(
                            'PREMIUM SERVICE',
                            style: TextStyle(color: AppTheme.gold, fontSize: 9, fontWeight: FontWeight.w800, letterSpacing: 1.5),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          service.title,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            height: 1,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── PRICE CARD ─────────────────────────────
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: AppTheme.borderLight),
                      boxShadow: [
                        BoxShadow(color: AppTheme.darkBrown.withValues(alpha: 0.05), blurRadius: 20, offset: const Offset(0, 10)),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Service Investment', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppTheme.textSecondary)),
                            const SizedBox(height: 4),
                            Text('₹${service.price.toStringAsFixed(0)}', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppTheme.gold)),
                          ],
                        ),
                        ElevatedButton(
                          onPressed: inCart ? null : () async {
                            try {
                              await cart.addToCart(service);
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('✓ Added ${service.title} to cart'),
                                    backgroundColor: Colors.green.shade700,
                                    behavior: SnackBarBehavior.floating,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                );
                              }
                            } catch (e) {
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
                                );
                              }
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: inCart ? Colors.grey.shade300 : AppTheme.darkBrown,
                            foregroundColor: inCart ? Colors.grey : Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            elevation: inCart ? 0 : 2,
                          ),
                          child: Text(
                            inCart ? 'IN CART' : 'ADD TO CART',
                            style: TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 12,
                              letterSpacing: 1,
                              color: inCart ? Colors.grey.shade600 : Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ).animate().fadeIn(duration: 500.ms).slideY(begin: 0.1),

                  const SizedBox(height: 32),

                  // ── DESCRIPTION ────────────────────────────
                  const Text('OVERVIEW', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 2, color: AppTheme.gold)),
                  const SizedBox(height: 12),
                  Text(
                    service.longDescription ?? service.description,
                    style: TextStyle(fontSize: 15, color: AppTheme.textPrimary.withValues(alpha: 0.8), height: 1.6, fontWeight: FontWeight.w500),
                  ).animate().fadeIn(delay: 200.ms),

                  const SizedBox(height: 40),

                  // ── FEATURES GRID ──────────────────────────
                  const Text('KEY FEATURES', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 2, color: AppTheme.gold)),
                  const SizedBox(height: 20),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                      childAspectRatio: 1.5,
                    ),
                    itemCount: service.features.length,
                    itemBuilder: (context, i) {
                      return Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.borderLight),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.check_circle_outline, color: AppTheme.gold, size: 20),
                            const SizedBox(height: 8),
                            Text(
                              service.features[i],
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
                            ),
                          ],
                        ),
                      );
                    },
                  ).animate().fadeIn(delay: 400.ms),

                  const SizedBox(height: 48),

                  // ── HELP BANNER ────────────────────────────
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: AppTheme.gold.withValues(alpha: 0.2)),
                    ),
                    child: Column(
                      children: [
                        const Text('Need more clarity?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppTheme.darkBrown)),
                        const SizedBox(height: 8),
                        const Text(
                          'Speak with our experts for personalized guidance on this service.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 12, color: AppTheme.textSecondary, fontWeight: FontWeight.w500),
                        ),
                        const SizedBox(height: 20),
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton(
                            onPressed: () => showBookCounsellingSheet(context),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppTheme.darkBrown,
                              side: const BorderSide(color: AppTheme.gold, width: 2),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                            child: const Text('BOOK FREE COUNSELLING', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, letterSpacing: 1)),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
