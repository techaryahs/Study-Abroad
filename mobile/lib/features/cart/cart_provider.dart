import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../services/service_model.dart';

class CartItem {
  final String itemId;
  final String serviceId;
  final String title;
  final double price;
  final String icon;

  CartItem({
    required this.itemId,
    required this.serviceId,
    required this.title,
    required this.price,
    required this.icon,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      itemId: json['itemId'] as String,
      serviceId: json['serviceId'] as String,
      title: json['title'] as String,
      price: (json['price'] as num).toDouble(),
      icon: json['icon'] as String? ?? '🏛️',
    );
  }
}

class CartProvider extends ChangeNotifier {
  List<CartItem> _items = [];
  bool _isLoading = false;

  List<CartItem> get items => _items;
  bool get isLoading => _isLoading;

  bool isInCart(String serviceId) {
    return _items.any((item) => item.serviceId == serviceId);
  }

  Future<void> fetchCart() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiClient.instance.get('/api/user/get-cart');
      if (response.data != null && response.data['success'] == true) {
        final List<dynamic> cartData = response.data['cart'] ?? [];
        _items = cartData.map((item) => CartItem.fromJson(item as Map<String, dynamic>)).toList();
      }
    } catch (e) {
      debugPrint('Error fetching cart: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addToCart(ServiceModel service) async {
    try {
      final response = await ApiClient.instance.post(
        '/api/user/add-to-cart',
        data: {
          'serviceId': service.slug,
          'cartData': {
            'title': service.title,
            'price': service.price,
            'icon': service.icon,
            'description': service.description,
            'duration': 'Full Support',
          },
        },
      );

      if (response.data != null && response.data['success'] == true) {
        final List<dynamic> cartData = response.data['cart'] ?? [];
        _items = cartData.map((item) => CartItem.fromJson(item as Map<String, dynamic>)).toList();
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error adding to cart: $e');
      rethrow;
    }
  }

  Future<void> removeFromCart(String itemId) async {
    try {
      final response = await ApiClient.instance.delete(
        '/api/user/remove-from-cart',
        data: {'itemId': itemId},
      );

      if (response.data != null && response.data['success'] == true) {
        final List<dynamic> cartData = response.data['cart'] ?? [];
        _items = cartData.map((item) => CartItem.fromJson(item as Map<String, dynamic>)).toList();
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error removing from cart: $e');
      rethrow;
    }
  }

  Future<void> clearCart() async {
    try {
      final response = await ApiClient.instance.delete('/api/user/clear-cart');
      if (response.data != null && response.data['success'] == true) {
        _items = [];
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error clearing cart: $e');
      rethrow;
    }
  }
}
