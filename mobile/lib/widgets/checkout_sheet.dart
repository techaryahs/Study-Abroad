import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../models/checkout_item.dart';

class CheckoutSheet extends StatelessWidget {
  final List<CheckoutItem> items;
  final String currency;
  final VoidCallback? onCheckout;
  final String title;

  const CheckoutSheet({
    super.key,
    required this.items,
    this.currency = 'INR',
    this.onCheckout,
    this.title = 'Checkout Summary',
  });

  static Future<T?> show<T>(
    BuildContext context, {
    required List<CheckoutItem> items,
    String currency = 'INR',
    VoidCallback? onCheckout,
    String title = 'Checkout Summary',
  }) {
    return showModalBottomSheet<T>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
          child: CheckoutSheet(
            items: items,
            currency: currency,
            onCheckout: onCheckout,
            title: title,
          ),
        );
      },
    );
  }

  int get subtotal => items.fold(0, (value, item) => value + item.price);
  int get actualTotal => items.fold(0, (value, item) => value + item.actualPrice);
  int get discount => (actualTotal - subtotal).clamp(0, actualTotal);

  String formatPrice(int price) {
    return price.toString();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 48,
                height: 4,
                decoration: BoxDecoration(
                  color: AppTheme.borderLight,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 18),
            Text(title, style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
            const SizedBox(height: 16),
            if (items.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 24),
                child: Text('No items available for checkout.', style: Theme.of(context).textTheme.bodyMedium),
              )
            else
              Column(
                children: items.map((item) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.background,
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 46,
                          height: 46,
                          decoration: BoxDecoration(
                            color: AppTheme.darkBrown,
                            borderRadius: BorderRadius.circular(14),
                          ),
                          alignment: Alignment.center,
                          child: Text(item.icon, style: const TextStyle(fontSize: 24)),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: AppTheme.textPrimary)),
                              if (item.subtitle != null) ...[
                                const SizedBox(height: 6),
                                Text(item.subtitle!, style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
                              ],
                              const SizedBox(height: 8),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  if (item.actualPrice > item.price)
                                    Text(
                                      '$currency ${formatPrice(item.actualPrice)}',
                                      style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary, decoration: TextDecoration.lineThrough),
                                    ),
                                  if (item.actualPrice > item.price) const SizedBox(width: 8),
                                  Text(
                                    '$currency ${formatPrice(item.price)}',
                                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppTheme.gold),
                                  ),
                                ],
                              ),
                              if (item.description != null)
                                Padding(
                                  padding: const EdgeInsets.only(top: 10),
                                  child: Text(item.description!, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary, height: 1.5)),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            const SizedBox(height: 12),
            if (items.isNotEmpty)
              Column(
                children: [
                  _buildSummaryRow('Subtotal', '$currency ${formatPrice(actualTotal)}'),
                  const SizedBox(height: 6),
                  _buildSummaryRow('Discount', '- $currency ${formatPrice(discount)}'),
                  const SizedBox(height: 6),
                  Divider(color: AppTheme.borderLight),
                  const SizedBox(height: 10),
                  _buildSummaryRow('Payable', '$currency ${formatPrice(subtotal)}', isBold: true),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: onCheckout,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.darkBrown,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text('Proceed to Checkout', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.1)),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(fontSize: 13, fontWeight: isBold ? FontWeight.w800 : FontWeight.w600, color: AppTheme.textPrimary)),
        Text(value, style: TextStyle(fontSize: isBold ? 17 : 13, fontWeight: isBold ? FontWeight.w900 : FontWeight.w700, color: isBold ? AppTheme.gold : AppTheme.textPrimary)),
      ],
    );
  }
}
