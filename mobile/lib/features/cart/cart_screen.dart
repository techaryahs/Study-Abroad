import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../models/checkout_item.dart';
import '../../widgets/checkout_sheet.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});
  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final List<CheckoutItem> _cartItems = [
    CheckoutItem(
      id: 'admission-guidance',
      title: 'Admission Guidance',
      icon: '🏛️',
      price: 4999,
      actualPrice: 5999,
      currency: 'INR',
      description: 'Expert step-by-step application strategy for top global universities.',
    ),
    CheckoutItem(
      id: 'sop-lor-support',
      title: 'SOP & LOR Support',
      icon: '✍️',
      price: 5999,
      actualPrice: 7499,
      currency: 'INR',
      description: 'Premium Statement of Purpose and Letter of Recommendation crafting.',
    ),
  ];

  int get _subtotal => _cartItems.fold(0, (sum, item) => sum + item.price);
  int get _gst => (_subtotal * 0.18).round();
  int get _total => _subtotal + _gst;

  void _removeItem(int index) {
    setState(() => _cartItems.removeAt(index));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Item removed from cart'),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 1),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('My Cart'),
        backgroundColor: AppTheme.background,
        actions: [
          if (_cartItems.isNotEmpty)
            TextButton(
              onPressed: () => setState(() => _cartItems.clear()),
              child: const Text('Clear', style: TextStyle(color: Colors.red, fontSize: 12, fontWeight: FontWeight.w700)),
            ),
        ],
      ),
      body: _cartItems.isEmpty
          ? _emptyCart()
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _cartItems.length,
                    itemBuilder: (_, i) {
                      final item = _cartItems[i];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.borderLight),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 52, height: 52,
                              decoration: BoxDecoration(
                                color: AppTheme.darkBrown,
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Center(child: Text(item.icon, style: const TextStyle(fontSize: 24))),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(item.title,
                                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
                                  const SizedBox(height: 4),
                                  Text('₹${item.price}',
                                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.gold)),
                                ],
                              ),
                            ),
                            IconButton(
                              onPressed: () => _removeItem(i),
                              icon: const Icon(Icons.delete_outline_rounded, color: Colors.red, size: 20),
                            ),
                          ],
                        ),
                      ).animate().fadeIn(delay: Duration(milliseconds: i * 60)).slideX(begin: -0.05);
                    },
                  ),
                ),

                // ── ORDER SUMMARY ────────────────────────
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 20, offset: const Offset(0, -4)),
                    ],
                  ),
                  child: SafeArea(
                    top: false,
                    child: Column(
                      children: [
                        _summaryRow('Subtotal', '₹$_subtotal'),
                        const SizedBox(height: 8),
                        _summaryRow('GST (18%)', '₹$_gst'),
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 12),
                          child: Divider(color: AppTheme.borderLight),
                        ),
                        _summaryRow('Total', '₹$_total', bold: true),
                        const SizedBox(height: 20),
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: ElevatedButton.icon(
                            onPressed: () => CheckoutSheet.show(
                              context,
                              items: _cartItems,
                              currency: 'INR',
                              onCheckout: () {
                                Navigator.pop(context);
                                _showPaymentDialog();
                              },
                            ),
                            icon: const Icon(Icons.lock_rounded, size: 18),
                            label: Text('PROCEED TO PAY  ₹$_total',
                                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, letterSpacing: 1)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.darkBrown,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
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

  Widget _emptyCart() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('🛒', style: TextStyle(fontSize: 72)),
          const SizedBox(height: 24),
          const Text('Your cart is empty',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
          const SizedBox(height: 8),
          const Text('Browse services to add items',
              style: TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
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

  void _showPaymentDialog() {
    showDialog(
      context: context,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.orange.shade50,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.info_outline_rounded, color: Colors.orange, size: 40),
              ),
              const SizedBox(height: 20),
              const Text('Payment Info',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
              const SizedBox(height: 12),
              const Text(
                'Online payment gateway integration requires a live deployment. Please contact us on WhatsApp to complete your purchase.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: AppTheme.textSecondary, height: 1.5),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('GOT IT'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
