import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';

import '../../core/api_client.dart';
import '../../core/storage.dart';
import '../../models/checkout_item.dart';
import 'apple_iap_service.dart';
import 'apple_product_ids.dart';

/// Callback signature for purchase status updates.
typedef ApplePurchaseStatusCallback = void Function(ApplePurchaseState state);

/// Represents the current state of an Apple purchase flow.
enum ApplePurchaseState {
  /// Products are being loaded from the App Store.
  loading,

  /// A purchase is pending (e.g. parental approval required).
  pending,

  /// Purchase completed successfully.
  success,

  /// A previous purchase was restored.
  restored,

  /// The user cancelled the purchase.
  cancelled,

  /// An error occurred during the purchase.
  error,
}

/// High-level manager that coordinates Apple In-App Purchase flows.
///
/// This class:
/// - Loads and caches Apple products
/// - Initiates purchases by resolving [SubscriptionPlan] → Apple Product ID
/// - Listens to the purchase stream and handles every [PurchaseStatus]
/// - Calls the existing backend payment verification after success
/// - Provides restore-purchases support
///
/// All Apple-specific logic is confined here — the rest of the app only
/// interacts via [SubscriptionPlan] and callbacks.
class ApplePurchaseManager {
  ApplePurchaseManager({
    required this.onStateChanged,
    this.onError,
    this.onReceiptReady,
  }) {
    _subscription = AppleIapService.instance.purchaseStream.listen(
      _onPurchaseUpdate,
      onDone: () => debugPrint('[ApplePurchaseManager] Purchase stream closed'),
      onError: (Object error) {
        debugPrint('[ApplePurchaseManager] Purchase stream error: $error');
        onError?.call('Purchase stream error: $error');
      },
    );
  }

  /// Called whenever the purchase state changes.
  final ApplePurchaseStatusCallback onStateChanged;

  /// Called with a human-readable error message on failure.
  final void Function(String message)? onError;

  /// Called with receipt data after a successful purchase or restore, so the
  /// caller can display a receipt view.
  final void Function(Map<String, dynamic> receiptData)? onReceiptReady;

  StreamSubscription<List<PurchaseDetails>>? _subscription;

  /// Cached product details from the App Store.
  Map<String, ProductDetails> _products = {};

  /// The checkout items associated with the current purchase (used for backend
  /// verification).
  List<CheckoutItem> _currentItems = [];
  String _currentCurrency = 'INR';
  VoidCallback? _currentOnPaymentSuccess;

  /// Whether products have been successfully loaded.
  bool get productsLoaded => _products.isNotEmpty;

  // ── Product loading ──────────────────────────────────────────────────────

  /// Queries the App Store for all configured Apple products.
  ///
  /// Returns `true` if at least one product was found.
  Future<bool> loadProducts() async {
    debugPrint('[ApplePurchaseManager] Loading products...');
    onStateChanged(ApplePurchaseState.loading);

    final available = await AppleIapService.instance.isAvailable();
    if (!available) {
      debugPrint('[ApplePurchaseManager] Store not available');
      onError?.call('The App Store is not available. Please try again later.');
      return false;
    }

    final response = await AppleIapService.instance.queryProducts(
      AppleProductIds.all,
    );

    if (response.error != null) {
      onError?.call(
        'Failed to load products: ${response.error!.message}',
      );
      return false;
    }

    _products = {
      for (final product in response.productDetails) product.id: product,
    };

    debugPrint(
      '[ApplePurchaseManager] Loaded ${_products.length} products: '
      '${_products.keys.toList()}',
    );

    if (response.notFoundIDs.isNotEmpty) {
      debugPrint(
        '[ApplePurchaseManager] Unavailable products: '
        '${response.notFoundIDs}',
      );
    }

    return _products.isNotEmpty;
  }

  // ── Purchasing ───────────────────────────────────────────────────────────

  /// Initiates an Apple IAP purchase for the given [plan].
  ///
  /// [items], [currency], and [onPaymentSuccess] mirror the parameters used in
  /// the existing Razorpay flow so that post-payment logic is reused identically.
  Future<void> purchase(
    SubscriptionPlan plan, {
    required List<CheckoutItem> items,
    required String currency,
    VoidCallback? onPaymentSuccess,
  }) async {
    final productId = AppleProductIds.productIdFor(plan);
    debugPrint(
      '[ApplePurchaseManager] Purchase requested: '
      '${plan.name} → $productId',
    );

    // Ensure products are loaded.
    if (!_products.containsKey(productId)) {
      final loaded = await loadProducts();
      if (!loaded || !_products.containsKey(productId)) {
        final name = AppleProductIds.displayNameFor(productId);
        onError?.call('The "$name" product is not available in your region.');
        return;
      }
    }

    // Stash context for post-purchase verification.
    _currentItems = items;
    _currentCurrency = currency;
    _currentOnPaymentSuccess = onPaymentSuccess;

    final product = _products[productId]!;

    if (AppleProductIds.isConsumable(productId)) {
      await AppleIapService.instance.buyConsumable(product);
    } else {
      await AppleIapService.instance.buyNonConsumable(product);
    }
  }

  // ── Restore purchases ────────────────────────────────────────────────────

  /// Triggers the App Store restore-purchases flow.
  ///
  /// Results arrive via [onStateChanged] with [ApplePurchaseState.restored].
  Future<void> restorePurchases() async {
    debugPrint('[ApplePurchaseManager] Restore purchases requested');
    onStateChanged(ApplePurchaseState.loading);
    await AppleIapService.instance.restorePurchases();
  }

  // ── Purchase stream handler ──────────────────────────────────────────────

  void _onPurchaseUpdate(List<PurchaseDetails> purchaseList) {
    for (final purchase in purchaseList) {
      debugPrint(
        '[ApplePurchaseManager] Purchase update: '
        'product=${purchase.productID}, '
        'status=${purchase.status}, '
        'error=${purchase.error?.message}',
      );

      switch (purchase.status) {
        case PurchaseStatus.pending:
          debugPrint('[ApplePurchaseManager] ⏳ Purchase pending');
          onStateChanged(ApplePurchaseState.pending);

        case PurchaseStatus.purchased:
          debugPrint('[ApplePurchaseManager] ✅ Purchase successful');
          _handleSuccessfulPurchase(purchase, isRestore: false);

        case PurchaseStatus.restored:
          debugPrint('[ApplePurchaseManager] 🔄 Purchase restored');
          _handleSuccessfulPurchase(purchase, isRestore: true);

        case PurchaseStatus.error:
          debugPrint(
            '[ApplePurchaseManager] ❌ Purchase error: '
            '${purchase.error?.message}',
          );
          onStateChanged(ApplePurchaseState.error);
          onError?.call(
            purchase.error?.message ?? 'Purchase failed. Please try again.',
          );
          if (purchase.pendingCompletePurchase) {
            AppleIapService.instance.completePurchase(purchase);
          }

        case PurchaseStatus.canceled:
          debugPrint('[ApplePurchaseManager] 🚫 Purchase cancelled by user');
          onStateChanged(ApplePurchaseState.cancelled);
          if (purchase.pendingCompletePurchase) {
            AppleIapService.instance.completePurchase(purchase);
          }
      }
    }
  }

  // ── Post-purchase verification ───────────────────────────────────────────

  Future<void> _handleSuccessfulPurchase(
    PurchaseDetails purchase, {
    required bool isRestore,
  }) async {
    try {
      // Always complete the purchase with the App Store first.
      if (purchase.pendingCompletePurchase) {
        await AppleIapService.instance.completePurchase(purchase);
      }

      final user = await AppStorage.getUser();
      if (user == null) {
        onError?.call('User not found. Please login and try again.');
        return;
      }

      // Call the existing backend payment verification endpoint.
      final verifyRes = await ApiClient.instance.post(
        '/api/payment/verify',
        data: {
          'apple_transaction_id': purchase.purchaseID,
          'apple_product_id': purchase.productID,
          'verification_data': purchase.verificationData.serverVerificationData,
          'source': purchase.verificationData.source,
          'is_restore': isRestore,
          'userId': user['_id'] ?? user['id'],
          'userEmail': user['email'],
          'items': _currentItems
              .map((i) => {
                    'title': i.title,
                    'price': i.price,
                    'quantity': i.quantity,
                    'lineTotal': i.price * i.quantity,
                    'currency': i.currency,
                    'serviceId': i.id,
                  })
              .toList(),
          'subtotal': _currentItems.fold<int>(
            0,
            (sum, item) => sum + item.price * item.quantity,
          ),
          'discount': _currentItems.fold<int>(
            0,
            (sum, item) =>
                sum +
                ((item.actualPrice - item.price) * item.quantity)
                    .clamp(0, item.actualPrice * item.quantity),
          ),
          'total': _currentItems.fold<int>(
            0,
            (sum, item) => sum + item.price * item.quantity,
          ),
          'currency': _currentCurrency,
          'paymentMethod': 'apple_iap',
        },
      );

      debugPrint(
        '[ApplePurchaseManager] Backend verification response: '
        '${verifyRes.statusCode}',
      );

      final receiptData = verifyRes.data['receipt'] as Map<String, dynamic>? ??
          {
            'paymentId': purchase.purchaseID,
            'items': _currentItems
                .map((e) => {
                      'title': e.title,
                      'price': e.price,
                      'quantity': e.quantity,
                      'lineTotal': e.price * e.quantity,
                    })
                .toList(),
            'currency': _currentCurrency,
            'total': _currentItems.fold<int>(
              0,
              (sum, item) => sum + item.price * item.quantity,
            ),
            'subtotal': _currentItems.fold<int>(
              0,
              (sum, item) => sum + item.price * item.quantity,
            ),
            'discount': _currentItems.fold<int>(
              0,
              (sum, item) =>
                  sum +
                  ((item.actualPrice - item.price) * item.quantity)
                      .clamp(0, item.actualPrice * item.quantity),
            ),
            'userEmail': user['email'],
          };

      onReceiptReady?.call(receiptData);
      onStateChanged(
        isRestore ? ApplePurchaseState.restored : ApplePurchaseState.success,
      );
      _currentOnPaymentSuccess?.call();
    } catch (e) {
      debugPrint(
        '[ApplePurchaseManager] Backend verification failed: '
        '${extractErrorMessage(e)}',
      );
      onStateChanged(ApplePurchaseState.error);
      onError?.call(
        'Payment was successful but verification failed: '
        '${extractErrorMessage(e)}',
      );
    }
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  /// Cancels the purchase stream subscription. Call this when the widget
  /// owning this manager is disposed to prevent memory leaks.
  void dispose() {
    debugPrint('[ApplePurchaseManager] Disposing');
    _subscription?.cancel();
    _subscription = null;
  }
}
