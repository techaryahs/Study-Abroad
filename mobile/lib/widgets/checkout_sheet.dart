import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../models/checkout_item.dart';
import '../core/api_client.dart';
import '../core/storage.dart';

import 'package:razorpay_flutter/razorpay_flutter.dart';

class CheckoutSheet extends StatefulWidget {
  final List<CheckoutItem> items;
  final String currency;
  final VoidCallback? onPaymentSuccess;
  final String title;

  const CheckoutSheet({
    super.key,
    required this.items,
    this.currency = 'INR',
    this.onPaymentSuccess,
    this.title = 'Checkout Summary',
  });

  static Future<T?> show<T>(
    BuildContext context, {
    required List<CheckoutItem> items,
    String currency = 'INR',
    VoidCallback? onPaymentSuccess,
    String title = 'Checkout Summary',
  }) {
    return showModalBottomSheet<T>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Padding(
          padding:
              EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
          child: CheckoutSheet(
            items: items,
            currency: currency,
            onPaymentSuccess: onPaymentSuccess,
            title: title,
          ),
        );
      },
    );
  }

  @override
  State<CheckoutSheet> createState() => _CheckoutSheetState();
}

class _CheckoutSheetState extends State<CheckoutSheet> {
  Razorpay? _razorpay;
  bool _isProcessing = false;
  Map<String, dynamic>? _receiptData;

  int get subtotal =>
      widget.items.fold(0, (value, item) => value + item.price * item.quantity);
  int get actualTotal => widget.items
      .fold(0, (value, item) => value + item.actualPrice * item.quantity);
  int get discount => (actualTotal - subtotal).clamp(0, actualTotal).toInt();

  String formatPrice(dynamic price) {
    if (price is num) return price.round().toString();
    return price?.toString() ?? '0';
  }

  int _amountValue(dynamic value) {
    if (value is num) return value.round();
    return double.tryParse(value?.toString() ?? '')?.round() ?? 0;
  }

  @override
  void initState() {
    super.initState();
    if (!kIsWeb) {
      _razorpay = Razorpay();
      _razorpay!.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
      _razorpay!.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
      _razorpay!.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
    }
  }

  @override
  void dispose() {
    _razorpay?.clear();
    super.dispose();
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    try {
      final user = await AppStorage.getUser();
      if (user == null) throw Exception("User not found");

      final verifyRes =
          await ApiClient.instance.post('/api/payment/verify', data: {
        'razorpay_order_id': response.orderId,
        'razorpay_payment_id': response.paymentId,
        'razorpay_signature': response.signature,
        'userId': user['_id'] ?? user['id'],
        'userEmail': user['email'],
        'items': widget.items
            .map((i) => {
                  'title': i.title,
                  'price': i.price,
                  'quantity': i.quantity,
                  'lineTotal': i.price * i.quantity,
                  'currency': i.currency,
                  'serviceId': i.id
                })
            .toList(),
        'subtotal': subtotal,
        'discount': discount,
        'total': subtotal, // Payable
        'currency': widget.currency
      });

      if (mounted) {
        setState(() {
          _receiptData = verifyRes.data['receipt'] ??
              {
                'paymentId': response.paymentId,
                'items': widget.items
                    .map((e) => {
                          'title': e.title,
                          'price': e.price,
                          'quantity': e.quantity,
                          'lineTotal': e.price * e.quantity,
                        })
                    .toList(),
                'currency': widget.currency,
                'total': subtotal,
                'subtotal': subtotal,
                'discount': discount,
                'userEmail': user['email']
              };
          _isProcessing = false;
        });
        widget.onPaymentSuccess?.call();
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isProcessing = false);
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content:
                Text('Payment verification failed: ${extractErrorMessage(e)}'),
            backgroundColor: Colors.red));
      }
    }
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    setState(() => _isProcessing = false);
    ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Payment Failed: ${response.message}')));
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    setState(() => _isProcessing = false);
    ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('External Wallet: ${response.walletName}')));
  }

  Future<void> _initiatePayment() async {
    // ── Web Platform Guard ─────────────────────────────────────
    if (kIsWeb) {
      _showWebPaymentDialog();
      return;
    }

    setState(() => _isProcessing = true);
    try {
      final user = await AppStorage.getUser();
      if (user == null)
        throw Exception("Please login first to make a payment.");

      final res = await ApiClient.instance.post(
        '/api/payment/create-order',
        data: {
          'amount': subtotal,
          'currency': widget.currency,
        },
      );

      final data = res.data;
      var options = {
        'key': 'rzp_live_RseCm2t4lFlfMC',
        'amount': data['amount'],
        'currency': data['currency'],
        'order_id': data['id'],
        'name': 'International Eduleader Council',
        'description': widget.items.map((e) => e.title).join(', '),
        'prefill': {
          'contact': user['phone'] ?? user['mobile'] ?? '',
          'email': user['email'] ?? ''
        },
        'theme': {'color': '#C5A059'}
      };

      _razorpay!.open(options);
    } catch (e) {
      setState(() => _isProcessing = false);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(extractErrorMessage(e))));
    }
  }

  /// Shows a user-friendly dialog when payment is attempted on Flutter Web.
  void _showWebPaymentDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        backgroundColor: Colors.white,
        icon: Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: AppTheme.gold.withOpacity(0.1),
            borderRadius: BorderRadius.circular(28),
          ),
          child:
              const Center(child: Text('📱', style: TextStyle(fontSize: 28))),
        ),
        title: const Text(
          'Payment Not Available',
          style: TextStyle(
              fontWeight: FontWeight.w900,
              fontSize: 16,
              color: AppTheme.textPrimary),
        ),
        content: const Text(
          'Online payments via Razorpay are currently supported only on the mobile app (Android/iOS).\n\nPlease use the mobile app to complete your payment.',
          style: TextStyle(
              color: AppTheme.textSecondary, fontSize: 13, height: 1.6),
          textAlign: TextAlign.center,
        ),
        actions: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => Navigator.pop(ctx),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gold,
                foregroundColor: AppTheme.darkBrown,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: const Text('GOT IT',
                  style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14)),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_receiptData != null) {
      return _buildReceiptView();
    }

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
                    borderRadius: BorderRadius.circular(2)),
              ),
            ),
            const SizedBox(height: 18),
            Text(widget.title,
                style: Theme.of(context)
                    .textTheme
                    .titleLarge
                    ?.copyWith(fontWeight: FontWeight.w900)),
            const SizedBox(height: 16),
            if (widget.items.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 24),
                child: Text('No items available for checkout.',
                    style: Theme.of(context).textTheme.bodyMedium),
              )
            else
              Column(
                children: widget.items.map((item) {
                  final linePrice = item.price * item.quantity;
                  final lineActualPrice = item.actualPrice * item.quantity;
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                        color: AppTheme.background,
                        borderRadius: BorderRadius.circular(18)),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 46,
                          height: 46,
                          decoration: BoxDecoration(
                              color: AppTheme.darkBrown,
                              borderRadius: BorderRadius.circular(14)),
                          alignment: Alignment.center,
                          child: Text(item.icon,
                              style: const TextStyle(fontSize: 24)),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item.title,
                                  style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w800,
                                      color: AppTheme.textPrimary)),
                              if (item.quantity > 1) ...[
                                const SizedBox(height: 4),
                                Text('Qty ${item.quantity}',
                                    style: const TextStyle(
                                        fontSize: 13,
                                        color: AppTheme.textSecondary,
                                        fontWeight: FontWeight.w700)),
                              ],
                              if (item.subtitle != null) ...[
                                const SizedBox(height: 6),
                                Text(item.subtitle!,
                                    style: const TextStyle(
                                        fontSize: 13,
                                        color: AppTheme.textSecondary)),
                              ],
                              const SizedBox(height: 8),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  if (item.actualPrice > item.price)
                                    Text(
                                      '${widget.currency} ${formatPrice(lineActualPrice)}',
                                      style: const TextStyle(
                                          fontSize: 14,
                                          color: AppTheme.textSecondary,
                                          decoration:
                                              TextDecoration.lineThrough),
                                    ),
                                  if (item.actualPrice > item.price)
                                    const SizedBox(width: 8),
                                  Text(
                                    '${widget.currency} ${formatPrice(linePrice)}',
                                    style: const TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w900,
                                        color: AppTheme.gold),
                                  ),
                                ],
                              ),
                              if (item.quantity > 1)
                                Padding(
                                  padding: const EdgeInsets.only(top: 4),
                                  child: Text(
                                      '${widget.currency} ${formatPrice(item.price)} each',
                                      style: const TextStyle(
                                          fontSize: 12,
                                          color: AppTheme.textSecondary)),
                                ),
                              if (item.description != null)
                                Padding(
                                  padding: const EdgeInsets.only(top: 10),
                                  child: Text(item.description!,
                                      style: const TextStyle(
                                          fontSize: 14,
                                          color: AppTheme.textSecondary,
                                          height: 1.5)),
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
            if (widget.items.isNotEmpty)
              Column(
                children: [
                  _buildSummaryRow('Subtotal',
                      '${widget.currency} ${formatPrice(actualTotal)}'),
                  const SizedBox(height: 6),
                  _buildSummaryRow('Discount',
                      '- ${widget.currency} ${formatPrice(discount)}'),
                  const SizedBox(height: 6),
                  Divider(color: AppTheme.borderLight),
                  const SizedBox(height: 10),
                  _buildSummaryRow(
                      'Payable', '${widget.currency} ${formatPrice(subtotal)}',
                      isBold: true),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton.icon(
                      onPressed: _isProcessing ? null : _initiatePayment,
                      icon: _isProcessing
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                  color: Colors.white, strokeWidth: 2))
                          : const Icon(Icons.lock_rounded, size: 18),
                      label: Text(
                          _isProcessing ? 'PROCESSING...' : 'PROCEED TO PAY ',
                          style: const TextStyle(
                              fontWeight: FontWeight.w900, letterSpacing: 1.1)),
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
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isBold = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: TextStyle(
                fontSize: 13,
                fontWeight: isBold ? FontWeight.w800 : FontWeight.w600,
                color: AppTheme.textPrimary)),
        Text(value,
            style: TextStyle(
                fontSize: isBold ? 17 : 13,
                fontWeight: isBold ? FontWeight.w900 : FontWeight.w700,
                color: isBold ? AppTheme.gold : AppTheme.textPrimary)),
      ],
    );
  }

  Widget _buildReceiptView() {
    final r = _receiptData!;
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: const BoxDecoration(
                color: Colors.green,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.check_circle_rounded,
                      color: Colors.white, size: 20),
                  SizedBox(width: 8),
                  Text('PAYMENT SUCCESSFUL',
                      style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w900,
                          fontSize: 13,
                          letterSpacing: 1.5)),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const Text('Receipt',
                      style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.darkBrown)),
                  const SizedBox(height: 4),
                  Text('ID: ${r['paymentId']}',
                      style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.5,
                          color: Colors.grey)),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('SERVICES',
                          style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.5,
                              color: Colors.grey)),
                      const Text('AMOUNT',
                          style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.5,
                              color: Colors.grey)),
                    ],
                  ),
                  const Divider(),
                  ...(r['items'] as List).map((item) {
                    final quantity = _amountValue(item['quantity']);
                    final safeQuantity = quantity < 1 ? 1 : quantity;
                    final unitPrice = _amountValue(item['price']);
                    final rawLineTotal = _amountValue(item['lineTotal']);
                    final lineTotal = rawLineTotal > 0
                        ? rawLineTotal
                        : unitPrice * safeQuantity;
                    final title = safeQuantity > 1
                        ? '${item['title']} x$safeQuantity'
                        : item['title'].toString();

                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                              child: Text(title,
                                  style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w700))),
                          Text('${r['currency']} ${formatPrice(lineTotal)}',
                              style: const TextStyle(
                                  fontSize: 13, fontWeight: FontWeight.w900)),
                        ],
                      ),
                    );
                  }),
                  const Divider(),
                  _buildSummaryRow('Subtotal',
                      '${r['currency']} ${formatPrice(r['subtotal'])}'),
                  const SizedBox(height: 6),
                  _buildSummaryRow('Discount',
                      '- ${r['currency']} ${formatPrice(r['discount'])}'),
                  const SizedBox(height: 6),
                  _buildSummaryRow('Total Paid',
                      '${r['currency']} ${formatPrice(r['total'])}',
                      isBold: true),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(color: AppTheme.borderLight),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16)),
                      ),
                      child: const Text('DONE',
                          style: TextStyle(
                              fontWeight: FontWeight.w900,
                              color: AppTheme.textPrimary)),
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
