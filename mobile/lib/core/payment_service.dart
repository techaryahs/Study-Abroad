import 'dart:io';
import 'package:flutter/foundation.dart';
import '../../models/checkout_item.dart';
import '../features/apple_payment/apple_product_ids.dart';
import '../features/apple_payment/apple_purchase_manager.dart';
import '../features/membership/models/membership_plan.dart';

enum PaymentState { idle, loading, pending, success, restored, error, cancelled }

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

  PaymentState get state => _state;
  String? get error => _error;

  void _handleAppleState(ApplePurchaseState appleState) {
    switch (appleState) {
      case ApplePurchaseState.loading:
        _state = PaymentState.loading;
        break;
      case ApplePurchaseState.pending:
        _state = PaymentState.pending;
        break;
      case ApplePurchaseState.success:
        _state = PaymentState.success;
        break;
      case ApplePurchaseState.restored:
        _state = PaymentState.restored;
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

  Future<void> purchase(MembershipPlan plan) async {
    _state = PaymentState.loading;
    _error = null;
    notifyListeners();

    debugPrint('\n[PaymentService] 💳 Initiating purchase for plan: ${plan.name} (${plan.planId})');

    try {
      if (Platform.isIOS) {
        if (_appleManager == null) throw Exception("Apple Purchase Manager not initialized");
        
        final subPlan = AppleProductIds.planForName(plan.planId);
        if (subPlan == null) {
          throw Exception("No Apple Product ID mapped for plan: ${plan.planId}");
        }

        debugPrint('[PaymentService] 🍎 Routing to ApplePurchaseManager');
        await _appleManager!.purchase(
          subPlan,
          items: [], // Deprecated in new membership flow
          currency: plan.currency ?? 'INR',
          planId: plan.planId,
        );
      } else {
        // Razorpay logic goes here
        debugPrint('[PaymentService] 🤖 Routing to Razorpay (Not yet migrated)');
        // Await razorpay...
        _state = PaymentState.error;
        _error = "Android Razorpay integration pending.";
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
      _error = "Restore not supported on Android.";
      notifyListeners();
    }
  }

  void reset() {
    _state = PaymentState.idle;
    _error = null;
    notifyListeners();
  }
}
