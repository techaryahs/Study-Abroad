import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import '../features/apple_payment/apple_product_ids.dart';
import '../features/apple_payment/apple_purchase_manager.dart';
import '../features/membership/models/membership_plan.dart';

enum PaymentState { idle, loading, pending, success, restored, error, cancelled }

/// Single iOS membership purchase facade.
///
/// Architecture:
/// - StoreKit [ProductDetails] = display source (localized price/title)
/// - Backend catalog [MembershipPlan] = entitlements / plan mapping / business logic
/// - After success or restore, [onMembershipRefresh] reloads MembershipManager
class PaymentService extends ChangeNotifier {
  static final PaymentService instance = PaymentService._();

  PaymentService._() {
    if (Platform.isIOS) {
      _appleManager = ApplePurchaseManager(
        onStateChanged: _handleAppleState,
        onError: (msg) {
          _error = msg;
          _state = PaymentState.error;
          notifyListeners();
        },
      );
    }
  }

  ApplePurchaseManager? _appleManager;

  PaymentState _state = PaymentState.idle;
  String? _error;

  /// Wired from app root to [MembershipManager.refresh] so purchase/restore
  /// never leave entitlements stale.
  Future<void> Function()? onMembershipRefresh;

  PaymentState get state => _state;
  String? get error => _error;

  /// Whether StoreKit products have been loaded at least once.
  bool get storeProductsLoaded => _appleManager?.productsLoaded ?? false;

  /// Cached StoreKit products (empty when not iOS or not loaded).
  Map<String, ProductDetails> get storeProducts =>
      _appleManager?.products ?? const {};

  ProductDetails? storeProductForPlan(MembershipPlan plan) {
    final productId = AppleProductIds.productIdForPlanId(plan.planId) ??
        plan.appleProductId;
    if (productId == null) return null;
    return _appleManager?.productFor(productId);
  }

  /// Localized StoreKit price string, or null if unavailable.
  String? localizedPriceFor(MembershipPlan plan) =>
      storeProductForPlan(plan)?.price;

  /// Localized StoreKit title, or null if unavailable.
  String? localizedTitleFor(MembershipPlan plan) =>
      storeProductForPlan(plan)?.title;

  Future<void> _handleAppleState(ApplePurchaseState appleState) async {
    switch (appleState) {
      case ApplePurchaseState.loading:
        _state = PaymentState.loading;
        break;
      case ApplePurchaseState.pending:
        _state = PaymentState.pending;
        break;
      case ApplePurchaseState.success:
        _state = PaymentState.success;
        await _refreshMembershipAfterActivation('purchase');
        break;
      case ApplePurchaseState.restored:
        _state = PaymentState.restored;
        await _refreshMembershipAfterActivation('restore');
        break;
      case ApplePurchaseState.cancelled:
        _state = PaymentState.cancelled;
        break;
      case ApplePurchaseState.error:
        _state = PaymentState.error;
        break;
    }
    notifyListeners();
  }

  Future<void> _refreshMembershipAfterActivation(String reason) async {
    final refresh = onMembershipRefresh;
    if (refresh == null) {
      debugPrint(
        '[PaymentService] ⚠️ No membership refresher bound — '
        'entitlements may be stale after $reason',
      );
      return;
    }
    try {
      debugPrint('[PaymentService] 🔄 Refreshing membership after $reason');
      await refresh();
      debugPrint('[PaymentService] ✅ Membership refreshed after $reason');
    } catch (e) {
      debugPrint('[PaymentService] ❌ Membership refresh failed after $reason: $e');
    }
  }

  /// Preload StoreKit products for paywall display (price/title).
  /// Does not start a purchase. Safe to call on every MembershipScreen open.
  Future<bool> loadStoreProducts({bool silent = true}) async {
    if (!Platform.isIOS || _appleManager == null) return false;
    return _appleManager!.loadProducts(silent: silent);
  }

  Future<void> purchase(MembershipPlan plan) async {
    _state = PaymentState.loading;
    _error = null;
    notifyListeners();

    debugPrint(
      '\n[PaymentService] 💳 Initiating purchase for plan: '
      '${plan.name} (${plan.planId})',
    );

    try {
      if (Platform.isIOS) {
        if (_appleManager == null) {
          throw Exception('Apple Purchase Manager not initialized');
        }

        final subPlan = AppleProductIds.planForName(plan.planId);
        if (subPlan == null) {
          throw Exception(
            'No Apple Product ID mapped for plan: ${plan.planId}',
          );
        }

        // Prefer strict map; if catalog carries appleProductId, ensure it matches.
        final mappedProductId = AppleProductIds.productIdFor(subPlan);
        if (plan.appleProductId != null &&
            plan.appleProductId!.isNotEmpty &&
            plan.appleProductId != mappedProductId) {
          throw Exception(
            'Catalog appleProductId mismatch for ${plan.planId}: '
            'catalog=${plan.appleProductId}, expected=$mappedProductId',
          );
        }

        debugPrint('[PaymentService] 🍎 Routing to ApplePurchaseManager');
        await _appleManager!.purchase(
          subPlan,
          items: const [],
          currency: plan.currency ?? 'INR',
          planId: plan.planId,
        );
      } else {
        debugPrint('[PaymentService] 🤖 Routing to Razorpay (Not yet migrated)');
        _state = PaymentState.error;
        _error = 'Android Razorpay integration pending.';
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      _state = PaymentState.error;
      notifyListeners();
    }
  }

  Future<void> restorePurchases() async {
    _state = PaymentState.loading;
    _error = null;
    notifyListeners();

    if (Platform.isIOS) {
      debugPrint('[PaymentService] 🔄 Routing restore to ApplePurchaseManager');
      await _appleManager?.restorePurchases();
    } else {
      _state = PaymentState.error;
      _error = 'Restore not supported on Android.';
      notifyListeners();
    }
  }

  void reset() {
    _state = PaymentState.idle;
    _error = null;
    notifyListeners();
  }
}
