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
/// - Loads and caches Apple products ([ProductDetails] for UI display)
/// - Initiates purchases by resolving [SubscriptionPlan] → Apple Product ID
/// - Listens to the purchase stream and handles every [PurchaseStatus]
/// - Calls the existing backend payment verification after success
/// - Rejects unknown product IDs (no plan mapping)
/// - Provides restore-purchases support
///
/// Business rules (entitlements, plan catalog) stay on the backend.
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

  /// Cached product details from the App Store (display source of truth).
  Map<String, ProductDetails> _products = {};

  /// The checkout items associated with the current purchase (used for backend
  /// verification). Membership flow always sends an empty list.
  List<CheckoutItem> _currentItems = [];
  String _currentCurrency = 'INR';
  String? _currentPlanId;
  VoidCallback? _currentOnPaymentSuccess;

  /// Whether products have been successfully loaded.
  bool get productsLoaded => _products.isNotEmpty;

  /// Unmodifiable view of cached StoreKit products.
  Map<String, ProductDetails> get products => Map.unmodifiable(_products);

  ProductDetails? productFor(String productId) => _products[productId];

  // ── Product loading ──────────────────────────────────────────────────────

  /// Queries the App Store for all configured Apple products.
  ///
  /// Returns `true` if at least one product was found.
  /// When [silent] is true, does not emit [ApplePurchaseState.loading]
  /// (used for paywall preload so UI is not stuck in processing).
  Future<bool> loadProducts({bool silent = false}) async {
    debugPrint('[ApplePurchaseManager] Loading products (silent=$silent)...');
    if (!silent) {
      onStateChanged(ApplePurchaseState.loading);
    }

    final available = await AppleIapService.instance.isAvailable();
    if (!available) {
      debugPrint('[ApplePurchaseManager] Store not available');
      // Silent preload must not flip global purchase error state.
      if (!silent) {
        onError?.call('The App Store is not available. Please try again later.');
        onStateChanged(ApplePurchaseState.error);
      }
      return false;
    }

    final response = await AppleIapService.instance.queryProducts(
      AppleProductIds.all,
    );

    if (response.error != null) {
      if (!silent) {
        onError?.call(
          'Failed to load products: ${response.error!.message}',
        );
        onStateChanged(ApplePurchaseState.error);
      }
      return false;
    }

    // Only keep products that map to a known plan (reject unknown IDs).
    final mapped = <String, ProductDetails>{};
    for (final product in response.productDetails) {
      if (AppleProductIds.isKnownProduct(product.id)) {
        mapped[product.id] = product;
      } else {
        debugPrint(
          '[ApplePurchaseManager] ⚠️ Ignoring unmapped StoreKit product: '
          '${product.id}',
        );
      }
    }

    _products = mapped;

    debugPrint(
      '\n[ApplePurchaseManager] 📦 StoreKit ProductDetailsResponse:\n'
      '   • error: ${response.error?.message ?? "none"}\n'
      '   • productDetails.length: ${response.productDetails.length}\n'
      '   • mapped.length: ${_products.length}\n'
      '   • notFoundIDs: ${response.notFoundIDs}',
    );

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
    required String planId,
    VoidCallback? onPaymentSuccess,
  }) async {
    final productId = AppleProductIds.productIdFor(plan);
    final expectedPlanId = AppleProductIds.nameForPlan(plan);

    if (planId != expectedPlanId) {
      onError?.call(
        'Plan ID mismatch: client sent "$planId", expected "$expectedPlanId".',
      );
      onStateChanged(ApplePurchaseState.error);
      return;
    }

    debugPrint(
      '\n[ApplePurchaseManager] 🛒 Purchase requested: '
      '${plan.name} → $productId (planId=$planId)',
    );

    // Ensure products are loaded.
    if (!_products.containsKey(productId)) {
      final loaded = await loadProducts();
      if (!loaded || !_products.containsKey(productId)) {
        final name = AppleProductIds.displayNameFor(productId);
        onError?.call('The "$name" product is not available in your region.');
        onStateChanged(ApplePurchaseState.error);
        return;
      }
    }

    // Stash context for post-purchase verification.
    _currentItems = items;
    _currentCurrency = currency;
    _currentPlanId = planId;
    _currentOnPaymentSuccess = onPaymentSuccess;

    final product = _products[productId]!;

    debugPrint('[ApplePurchaseManager] 🚀 Launching StoreKit for $productId');
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
      // Reject unknown product IDs — never invent a plan.
      final mappedPlanId = AppleProductIds.planIdForProduct(purchase.productID);
      if (mappedPlanId == null) {
        debugPrint(
          '[ApplePurchaseManager] ❌ Unknown product ID rejected: '
          '${purchase.productID}',
        );
        if (purchase.pendingCompletePurchase) {
          await AppleIapService.instance.completePurchase(purchase);
        }
        onStateChanged(ApplePurchaseState.error);
        onError?.call(
          'Unrecognized App Store product (${purchase.productID}). '
          'Membership was not activated.',
        );
        return;
      }

      // Authoritative plan comes from product ID mapping.
      // Client planId (if present) must match.
      if (_currentPlanId != null && _currentPlanId != mappedPlanId) {
        debugPrint(
          '[ApplePurchaseManager] ❌ planId/product mismatch: '
          'client=$_currentPlanId product=$mappedPlanId',
        );
        if (purchase.pendingCompletePurchase) {
          await AppleIapService.instance.completePurchase(purchase);
        }
        onStateChanged(ApplePurchaseState.error);
        onError?.call(
          'Purchase product does not match selected plan. '
          'Membership was not activated.',
        );
        return;
      }

      final planId = mappedPlanId;

      // Always complete the purchase with the App Store first.
      if (purchase.pendingCompletePurchase) {
        await AppleIapService.instance.completePurchase(purchase);
      }

      final user = await AppStorage.getUser();
      if (user == null) {
        onError?.call('User not found. Please login and try again.');
        onStateChanged(ApplePurchaseState.error);
        return;
      }

      // Call the existing backend payment verification endpoint (unchanged contract).
      debugPrint('[ApplePurchaseManager] 🌐 Verifying purchase with Backend...');
      final verifyRes = await ApiClient.instance.post(
        '/api/payment/verify',
        data: {
          'platform': 'apple_iap',
          'planId': planId,
          'productId': purchase.productID,
          'transactionId': purchase.purchaseID,
          'verificationData': purchase.verificationData.serverVerificationData,
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
        },
      );

      debugPrint(
        '[ApplePurchaseManager] ✅ Backend verification response: '
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
            'planId': planId,
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
