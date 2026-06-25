import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';

class AppleIapResult {
  final bool success;
  final String? appleTransactionId;
  final String? appleProductId;
  final String? errorMessage;

  AppleIapResult({
    required this.success,
    this.appleTransactionId,
    this.appleProductId,
    this.errorMessage,
  });
}

class AppleIapService {
  static final AppleIapService instance = AppleIapService._();
  AppleIapService._();

  final InAppPurchase _inAppPurchase = InAppPurchase.instance;
  StreamSubscription<List<PurchaseDetails>>? _subscription;
  Completer<AppleIapResult>? _purchaseCompleter;
  String? _currentProductId;

  void initialize() {
    final purchaseUpdated = _inAppPurchase.purchaseStream;
    _subscription = purchaseUpdated.listen((purchaseDetailsList) {
      _listenToPurchaseUpdated(purchaseDetailsList);
    }, onDone: () {
      _subscription?.cancel();
    }, onError: (error) {
      if (_purchaseCompleter != null && !_purchaseCompleter!.isCompleted) {
        _purchaseCompleter!.complete(
            AppleIapResult(success: false, errorMessage: error.toString()));
      }
    });
  }

  void dispose() {
  _subscription?.cancel();
  _subscription = null;
}

  Future<AppleIapResult> purchaseProduct(String productId) async {
    final bool available = await _inAppPurchase.isAvailable();
    if (!available) {
      return AppleIapResult(
          success: false, errorMessage: "Store is not available.");
    }

    final ProductDetailsResponse productDetailResponse =
        await _inAppPurchase.queryProductDetails({productId});

    if (productDetailResponse.notFoundIDs.isNotEmpty ||
        productDetailResponse.productDetails.isEmpty) {
      return AppleIapResult(
          success: false, errorMessage: "Product $productId not found.");
    }

    if (productDetailResponse.error != null) {
      return AppleIapResult(
          success: false, errorMessage: productDetailResponse.error!.message);
    }

    final ProductDetails productDetails =
        productDetailResponse.productDetails.first;
    final PurchaseParam purchaseParam =
        PurchaseParam(productDetails: productDetails);

    _currentProductId = productId;
    _purchaseCompleter = Completer<AppleIapResult>();

    try {
      final success =
          await _inAppPurchase.buyConsumable(purchaseParam: purchaseParam);
      if (!success) {
        return AppleIapResult(
            success: false, errorMessage: "Failed to initiate purchase.");
      }
    } catch (e) {
      return AppleIapResult(success: false, errorMessage: e.toString());
    }

    return _purchaseCompleter!.future;
  }

  Future<void> _listenToPurchaseUpdated(
      List<PurchaseDetails> purchaseDetailsList) async {
    for (final PurchaseDetails purchaseDetails in purchaseDetailsList) {
      if (purchaseDetails.status == PurchaseStatus.pending) {
        // Pending
      } else {
        if (purchaseDetails.status == PurchaseStatus.error) {
          if (_purchaseCompleter != null && !_purchaseCompleter!.isCompleted) {
            _purchaseCompleter!.complete(AppleIapResult(
              success: false,
              errorMessage: purchaseDetails.error?.message ?? 'Purchase failed',
            ));
          }
        } else if (purchaseDetails.status == PurchaseStatus.purchased) {
          final transactionId = purchaseDetails.purchaseID;

          if (_purchaseCompleter != null && !_purchaseCompleter!.isCompleted) {
            if (transactionId == null || transactionId.isEmpty) {
              _purchaseCompleter!.complete(
                AppleIapResult(
                  success: false,
                  errorMessage:
                      'Apple purchase completed but transaction ID was missing.',
                ),
              );
            } else {
              _purchaseCompleter!.complete(
                AppleIapResult(
                  success: true,
                  appleTransactionId: transactionId,
                  appleProductId: purchaseDetails.productID,
                ),
              );
            }
          }
        } else if (purchaseDetails.status == PurchaseStatus.restored) {
          if (_purchaseCompleter != null && !_purchaseCompleter!.isCompleted) {
            _purchaseCompleter!.complete(
              AppleIapResult(
                success: false,
                errorMessage:
                    'Restored purchases are not supported for counselling checkout.',
              ),
            );
          }
        }
        if (purchaseDetails.pendingCompletePurchase) {
          await _inAppPurchase.completePurchase(purchaseDetails);
        }
      }
    }
  }
}
