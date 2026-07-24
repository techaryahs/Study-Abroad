import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';

import '../../core/api_client.dart';
import '../../core/app_logger.dart';
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
      onDone: () => AppLogger.debug('[ApplePurchaseManager] Purchase stream closed'),
      onError: (Object error) {
        AppLogger.error('[ApplePurchaseManager] Purchase stream error', error);
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
  
  /// Track purchases we are currently verifying
  /// to prevent duplicate concurrent backend calls for the same transaction.
  final Set<String> _processingPurchases = {};

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
    AppLogger.debug('[ApplePurchaseManager] Loading products (silent=$silent)...');
    if (!silent) {
      onStateChanged(ApplePurchaseState.loading);
    }

    final available = await AppleIapService.instance.isAvailable();
    if (!available) {
      AppLogger.warning('[ApplePurchaseManager] Store not available');
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
        AppLogger.warning(
          '[ApplePurchaseManager] ⚠️ Ignoring unmapped StoreKit product: '
          '${product.id}',
        );
      }
    }

    _products = mapped;

    AppLogger.info(
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

    AppLogger.info(
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

    AppLogger.info('[ApplePurchaseManager] 🚀 Launching StoreKit for $productId');
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
    AppLogger.info('[ApplePurchaseManager] Restore purchases requested');
    onStateChanged(ApplePurchaseState.loading);
    await AppleIapService.instance.restorePurchases();
  }

  // ── Purchase stream handler ──────────────────────────────────────────────

  void _onPurchaseUpdate(List<PurchaseDetails> purchaseList) {
    for (final purchase in purchaseList) {
      AppLogger.debug(
        '[ApplePurchaseManager] Purchase update: '
        'product=${purchase.productID}, '
        'status=${purchase.status}, '
        'error=${purchase.error?.message}',
      );

      switch (purchase.status) {
        case PurchaseStatus.pending:
          AppLogger.info('[ApplePurchaseManager] ⏳ Purchase pending');
          onStateChanged(ApplePurchaseState.pending);

        case PurchaseStatus.purchased:
          AppLogger.info('[ApplePurchaseManager] ✅ Purchase successful');
          _handleSuccessfulPurchase(purchase, isRestore: false);

        case PurchaseStatus.restored:
          AppLogger.info('[ApplePurchaseManager] 🔄 Purchase restored');
          _handleSuccessfulPurchase(purchase, isRestore: true);

        case PurchaseStatus.error:
          AppLogger.error(
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
          AppLogger.info('[ApplePurchaseManager] 🚫 Purchase cancelled by user');
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
    final purchaseId = purchase.purchaseID;
    if (purchaseId != null) {
      if (_processingPurchases.contains(purchaseId)) {
        AppLogger.debug('[ApplePurchaseManager] ⏭️ Skipping already processing purchase: $purchaseId');
        return;
      }
      _processingPurchases.add(purchaseId);
    }

    try {
      // Reject unknown product IDs — never invent a plan.
      final mappedPlanId = AppleProductIds.planIdForProduct(purchase.productID);
      if (mappedPlanId == null) {
        AppLogger.error(
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
        AppLogger.error(
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

      AppLogger.info('[ApplePurchaseManager] 🌐 Verifying purchase with Backend V2...');
      final verifyRes = await ApiClient.instance.post(
        '/api/payments/v2/verify',
        data: {
          'gateway': 'apple',
          'payload': {
            'receiptData': purchase.verificationData.serverVerificationData,
          },
        },
      );

      AppLogger.info(
        '[ApplePurchaseManager] ✅ Backend verification response: '
        '${verifyRes.statusCode}',
      );

      final responseData = verifyRes.data;
      final receiptData = {
        'paymentId': responseData['transactionId'] ?? purchase.purchaseID,
        'planId': responseData['planId'] ?? responseData['subscription']?['planId'],
        'membership': responseData['membership'],
        'subscription': responseData['subscription'],
        'currency': _currentCurrency,
      };

      onReceiptReady?.call(receiptData);
      onStateChanged(
        isRestore ? ApplePurchaseState.restored : ApplePurchaseState.success,
      );
      _currentOnPaymentSuccess?.call();
    } catch (e) {
      AppLogger.error(
        '[ApplePurchaseManager] Backend verification failed: '
        '${extractErrorMessage(e)}',
      );
      onStateChanged(ApplePurchaseState.error);
      onError?.call(
        'Payment was successful but verification failed: '
        '${extractErrorMessage(e)}',
      );
    } finally {
      if (purchaseId != null) {
        _processingPurchases.remove(purchaseId);
      }
    }
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  /// Cancels the purchase stream subscription. Call this when the widget
  /// owning this manager is disposed to prevent memory leaks.
  void dispose() {
    AppLogger.debug('[ApplePurchaseManager] Disposing');
    _subscription?.cancel();
    _subscription = null;
  }
}
