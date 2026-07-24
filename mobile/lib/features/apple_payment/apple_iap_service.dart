import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import '../../core/app_logger.dart';

/// Low-level wrapper around [InAppPurchase] that isolates all StoreKit
/// interaction. This service handles product querying, purchasing, completing,
/// and restoring — but contains no business logic or backend calls.
class AppleIapService {
  AppleIapService._();
  static final AppleIapService instance = AppleIapService._();

  final InAppPurchase _iap = InAppPurchase.instance;

  // ── Store availability ───────────────────────────────────────────────────

  /// Returns `true` when the App Store is reachable and IAP is enabled.
  Future<bool> isAvailable() async {
    final available = await _iap.isAvailable();
    AppLogger.info('[AppleIAP] Store available: $available');
    return available;
  }

  // ── Product querying ─────────────────────────────────────────────────────

  /// Queries the App Store for the given [productIds].
  ///
  /// Returns a [ProductDetailsResponse] containing both found products and
  /// IDs that were not recognized by the store.
  Future<ProductDetailsResponse> queryProducts(Set<String> productIds) async {
    AppLogger.debug('[AppleIAP] Querying products: $productIds');
    final response = await _iap.queryProductDetails(productIds);

    if (response.error != null) {
      AppLogger.error('[AppleIAP] Query error: ${response.error!.message}');
    }
    if (response.notFoundIDs.isNotEmpty) {
      AppLogger.warning('[AppleIAP] Products not found: ${response.notFoundIDs}');
    }
    for (final product in response.productDetails) {
      AppLogger.info(
        '[AppleIAP] Found product: ${product.id} — '
        '${product.title} — ${product.price}',
      );
    }

    return response;
  }

  // ── Purchasing ───────────────────────────────────────────────────────────

  /// Initiates a consumable purchase (one-time, can be re-purchased).
  Future<bool> buyConsumable(ProductDetails product) {
    AppLogger.info('[AppleIAP] Buying consumable: ${product.id}');
    final param = PurchaseParam(productDetails: product);
    return _iap.buyConsumable(purchaseParam: param);
  }

  /// Initiates a non-consumable / subscription purchase.
  ///
  /// The `in_app_purchase` plugin uses [buyNonConsumable] to start
  /// auto-renewable subscription purchases on iOS.
  Future<bool> buyNonConsumable(ProductDetails product) {
    AppLogger.info('[AppleIAP] Buying non-consumable/subscription: ${product.id}');
    final param = PurchaseParam(productDetails: product);
    return _iap.buyNonConsumable(purchaseParam: param);
  }

  // ── Purchase completion ──────────────────────────────────────────────────

  /// Marks a purchase as completed. This **must** be called for every
  /// [PurchaseDetails] with status `purchased` or `restored`, otherwise the
  /// App Store will refund the transaction automatically.
  Future<void> completePurchase(PurchaseDetails purchase) async {
    AppLogger.info('[AppleIAP] Completing purchase: ${purchase.productID}');
    await _iap.completePurchase(purchase);
  }

  // ── Restore purchases ───────────────────────────────────────────────────

  /// Triggers a restore-purchases flow. Results arrive via [purchaseStream].
  Future<void> restorePurchases() async {
    AppLogger.info('[AppleIAP] Restoring purchases');
    await _iap.restorePurchases();
  }

  // ── Purchase stream ──────────────────────────────────────────────────────

  /// Exposes the raw purchase update stream from the App Store.
  Stream<List<PurchaseDetails>> get purchaseStream => _iap.purchaseStream;
}
