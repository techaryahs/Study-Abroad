import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../core/theme.dart';
import '../../models/checkout_item.dart';
import '../../widgets/checkout_sheet.dart';
import 'cart_provider.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CartProvider>().fetchCart();
    });
  }

  @override
  Widget build(BuildContext context) {
    final cart = context.watch<CartProvider>();
    final items = cart.items;

    final subtotal = cart.subtotal.round();
    final gst = (subtotal * 0.18).round();
    final total = subtotal + gst;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('My Cart'),
        backgroundColor: AppTheme.background,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/');
            }
          },
        ),
        actions: [
          if (items.isNotEmpty)
            TextButton(
              onPressed: () async {
                final messenger = ScaffoldMessenger.of(context);
                try {
                  await cart.clearCart();
                  if (mounted) {
                    messenger.showSnackBar(
                      SnackBar(
                        content: const Text('Cart cleared'),
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        duration: const Duration(seconds: 1),
                      ),
                    );
                  }
                } catch (_) {
                  if (mounted) {
                    messenger.showSnackBar(
                      SnackBar(
                        content: const Text('Failed to clear cart'),
                        behavior: SnackBarBehavior.floating,
                        backgroundColor: Colors.red,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                    );
                  }
                }
              },
              child: const Text('Clear',
                  style: TextStyle(
                      color: Colors.red,
                      fontSize: 14,
                      fontWeight: FontWeight.w700)),
            ),
        ],
      ),
      body: cart.isLoading && items.isEmpty
          ? const Center(child: CircularProgressIndicator(color: AppTheme.gold))
          : items.isEmpty
              ? _emptyCart()
              : Column(
                  children: [
                    Expanded(
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: items.length,
                        itemBuilder: (_, i) {
                          final item = items[i];
                          return Dismissible(
                            key: ValueKey(item.itemId),
                            direction: DismissDirection.endToStart,
                            background: Container(
                              alignment: Alignment.centerRight,
                              padding: const EdgeInsets.only(right: 24),
                              margin: const EdgeInsets.only(bottom: 12),
                              decoration: BoxDecoration(
                                color: Colors.red.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: const Icon(Icons.delete_outline_rounded,
                                  color: Colors.red),
                            ),
                            onDismissed: (_) => _removeItem(item.itemId),
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: AppTheme.borderLight),
                              ),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  Container(
                                    width: 52,
                                    height: 52,
                                    decoration: BoxDecoration(
                                      color: AppTheme.darkBrown,
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                    child: Center(
                                        child: Text(item.icon,
                                            style:
                                                const TextStyle(fontSize: 24))),
                                  ),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          item.title,
                                          style: const TextStyle(
                                              fontSize: 14,
                                              fontWeight: FontWeight.w800,
                                              color: AppTheme.textPrimary),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          '\u20B9${item.lineTotal.round()}',
                                          style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.w900,
                                              color: AppTheme.gold),
                                        ),
                                        if (item.quantity > 1)
                                          Text(
                                            '\u20B9${item.price.round()} each',
                                            style: const TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w600,
                                                color: AppTheme.textSecondary),
                                          ),
                                      ],
                                    ),
                                  ),
                                  _quantityStepper(item),
                                  IconButton(
                                    tooltip: 'Remove',
                                    onPressed: () => _removeItem(item.itemId),
                                    icon: const Icon(
                                        Icons.delete_outline_rounded,
                                        color: Colors.red,
                                        size: 20),
                                  ),
                                ],
                              ),
                            )
                                .animate()
                                .fadeIn(delay: Duration(milliseconds: i * 60))
                                .slideX(begin: -0.05),
                          );
                        },
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: const BorderRadius.vertical(
                            top: Radius.circular(28)),
                        boxShadow: [
                          BoxShadow(
                              color: Colors.black.withOpacity(0.06),
                              blurRadius: 20,
                              offset: const Offset(0, -4)),
                        ],
                      ),
                      child: SafeArea(
                        top: false,
                        child: Column(
                          children: [
                            _summaryRow('Subtotal', '\u20B9$subtotal'),
                            const SizedBox(height: 8),
                            _summaryRow('GST (18%)', '\u20B9$gst'),
                            const Padding(
                              padding: EdgeInsets.symmetric(vertical: 12),
                              child: Divider(color: AppTheme.borderLight),
                            ),
                            _summaryRow('Total', '\u20B9$total', bold: true),
                            const SizedBox(height: 20),
                            SizedBox(
                              width: double.infinity,
                              height: 56,
                              child: ElevatedButton.icon(
                                onPressed: () => CheckoutSheet.show(
                                  context,
                                  items: items
                                      .map((ci) => CheckoutItem(
                                            id: ci.serviceId,
                                            title: ci.title,
                                            icon: ci.icon,
                                            price: ci.price.round(),
                                            actualPrice: ci.price.round(),
                                            currency: 'INR',
                                            quantity: ci.quantity,
                                          ))
                                      .toList(),
                                  currency: 'INR',
                                  onPaymentSuccess: () {
                                    cart.clearCart();
                                  },
                                ),
                                icon: const Icon(Icons.lock_rounded, size: 18),
                                label: const Text(
                                  'PROCEED TO CHECKOUT',
                                  style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: 1),
                                ),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.darkBrown,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16)),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
    );
  }

  Widget _quantityStepper(CartItem item) {
    return Container(
      height: 36,
      decoration: BoxDecoration(
        color: AppTheme.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            tooltip: item.quantity == 1 ? 'Remove one' : 'Decrease quantity',
            visualDensity: VisualDensity.compact,
            constraints: const BoxConstraints.tightFor(width: 34, height: 34),
            padding: EdgeInsets.zero,
            onPressed: () => _changeQuantity(item, item.quantity - 1),
            icon: const Icon(Icons.remove_rounded, size: 18),
          ),
          SizedBox(
            width: 28,
            child: Text(
              '${item.quantity}',
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.textPrimary),
            ),
          ),
          IconButton(
            tooltip: 'Increase quantity',
            visualDensity: VisualDensity.compact,
            constraints: const BoxConstraints.tightFor(width: 34, height: 34),
            padding: EdgeInsets.zero,
            onPressed: () => _changeQuantity(item, item.quantity + 1),
            icon: const Icon(Icons.add_rounded, size: 18),
          ),
        ],
      ),
    );
  }

  Future<void> _changeQuantity(CartItem item, int quantity) async {
    try {
      await context.read<CartProvider>().updateQuantity(item.itemId, quantity);
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Failed to update quantity'),
            behavior: SnackBarBehavior.floating,
            backgroundColor: Colors.red,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    }
  }

  Future<void> _removeItem(String itemId) async {
    try {
      await context.read<CartProvider>().removeFromCart(itemId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Item removed from cart'),
            behavior: SnackBarBehavior.floating,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            duration: const Duration(seconds: 1),
          ),
        );
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Failed to remove item'),
            behavior: SnackBarBehavior.floating,
            backgroundColor: Colors.red,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        );
      }
    }
  }

  Widget _emptyCart() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('\u{1F6D2}', style: TextStyle(fontSize: 72)),
          const SizedBox(height: 24),
          const Text('Your cart is empty',
              style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textPrimary)),
          const SizedBox(height: 8),
          const Text('Browse services to add items',
              style: TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => context.go('/services'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.gold,
              foregroundColor: AppTheme.darkBrown,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
            child: const Text('BROWSE SERVICES',
                style:
                    TextStyle(fontWeight: FontWeight.w800, letterSpacing: 1)),
          ),
        ],
      ),
    );
  }

  Widget _summaryRow(String label, String value, {bool bold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: TextStyle(
              fontSize: bold ? 16 : 13,
              fontWeight: bold ? FontWeight.w900 : FontWeight.w600,
              color: bold ? AppTheme.textPrimary : AppTheme.textSecondary,
            )),
        Text(value,
            style: TextStyle(
              fontSize: bold ? 20 : 13,
              fontWeight: bold ? FontWeight.w900 : FontWeight.w700,
              color: bold ? AppTheme.gold : AppTheme.textPrimary,
            )),
      ],
    );
  }
}
