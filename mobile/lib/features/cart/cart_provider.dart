import 'package:flutter/material.dart';
import '../../core/api_client.dart';
import '../../core/app_logger.dart';
import '../services/service_model.dart';

class CartItem {
  final String itemId;
  final String serviceId;
  final String title;
  final double price;
  final String icon;
  final int quantity;

  CartItem({
    required this.itemId,
    required this.serviceId,
    required this.title,
    required this.price,
    required this.icon,
    this.quantity = 1,
  });

  double get lineTotal => price * quantity;

  CartItem copyWith({
    String? itemId,
    String? serviceId,
    String? title,
    double? price,
    String? icon,
    int? quantity,
  }) {
    return CartItem(
      itemId: itemId ?? this.itemId,
      serviceId: serviceId ?? this.serviceId,
      title: title ?? this.title,
      price: price ?? this.price,
      icon: icon ?? this.icon,
      quantity: quantity ?? this.quantity,
    );
  }

  factory CartItem.fromService(ServiceModel service,
      {String? itemId, int quantity = 1}) {
    return CartItem(
      itemId: itemId ?? service.slug,
      serviceId: service.slug,
      title: service.title,
      price: service.price,
      icon: service.icon,
      quantity: quantity < 1 ? 1 : quantity,
    );
  }

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      itemId: _stringValue(json['itemId'] ?? json['_id'] ?? json['id']),
      serviceId: _stringValue(json['serviceId'] ?? json['slug'] ?? json['id']),
      title: _stringValue(json['title'], fallback: 'Cart item'),
      price: _doubleValue(json['price']),
      icon: _stringValue(json['icon'], fallback: '\u{1F6D2}'),
      quantity: _quantityValue(json['quantity']),
    );
  }

  static String _stringValue(dynamic value, {String fallback = ''}) {
    final text = value?.toString();
    if (text == null || text.isEmpty) return fallback;
    return text;
  }

  static double _doubleValue(dynamic value) {
    if (value is num) return value.toDouble();
    return double.tryParse(value?.toString().replaceAll(',', '') ?? '') ?? 0;
  }

  static int _quantityValue(dynamic value) {
    if (value is int) return value < 1 ? 1 : value;
    final parsed = int.tryParse(value?.toString() ?? '') ?? 1;
    return parsed < 1 ? 1 : parsed;
  }
}

class CartProvider extends ChangeNotifier {
  List<CartItem> _items = [];
  bool _isLoading = false;

  List<CartItem> get items => List.unmodifiable(_items);
  bool get isLoading => _isLoading;
  int get totalQuantity => _items.fold(0, (sum, item) => sum + item.quantity);
  double get subtotal => _items.fold(0, (sum, item) => sum + item.lineTotal);

  bool isInCart(String serviceId) {
    return _items.any((item) => _matchesService(item, serviceId));
  }

  int quantityFor(String serviceId) {
    for (final item in _items) {
      if (_matchesService(item, serviceId)) return item.quantity;
    }
    return 0;
  }

  bool _matchesService(CartItem item, String serviceId) {
    return item.serviceId == serviceId || item.itemId == serviceId;
  }

  List<CartItem> _parseCartItems(dynamic cartData) {
    if (cartData is! List) return [];

    return cartData
        .whereType<Map>()
        .map((item) => CartItem.fromJson(Map<String, dynamic>.from(item)))
        .toList();
  }

  void _replaceItems(dynamic cartData, {bool notify = true}) {
    _items = _parseCartItems(cartData);
    if (notify) notifyListeners();
  }

  Future<void> fetchCart() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiClient.instance.get('/api/user/get-cart');
      if (response.data != null && response.data['success'] == true) {
        _replaceItems(response.data['cart']);
      }
    } catch (e) {
      AppLogger.error('Error fetching cart', extractErrorMessage(e));
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addToCart(ServiceModel service) async {
    final previousItems = List<CartItem>.from(_items);
    final existingIndex =
        _items.indexWhere((item) => _matchesService(item, service.slug));

    if (existingIndex == -1) {
      _items = [..._items, CartItem.fromService(service)];
    } else {
      _items = [
        for (var i = 0; i < _items.length; i++)
          if (i == existingIndex)
            _items[i].copyWith(quantity: _items[i].quantity + 1)
          else
            _items[i],
      ];
    }
    notifyListeners();

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
            'quantity': 1,
          },
        },
      );

      if (response.data != null && response.data['success'] == true) {
        _replaceItems(response.data['cart']);
      }
    } catch (e) {
      _items = previousItems;
      notifyListeners();
      AppLogger.error('Error adding to cart', extractErrorMessage(e));
      rethrow;
    }
  }

  Future<void> removeFromCart(String itemId) async {
    final previousItems = List<CartItem>.from(_items);
    _items = _items.where((item) => item.itemId != itemId).toList();
    notifyListeners();

    try {
      final response = await ApiClient.instance.delete(
        '/api/user/remove-from-cart',
        data: {'itemId': itemId},
      );

      if (response.data != null && response.data['success'] == true) {
        _replaceItems(response.data['cart']);
      }
    } catch (e) {
      _items = previousItems;
      notifyListeners();
      AppLogger.error('Error removing from cart', extractErrorMessage(e));
      rethrow;
    }
  }

  Future<void> updateQuantity(String itemId, int quantity) async {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    final index = _items.indexWhere((item) => item.itemId == itemId);
    if (index == -1) return;

    final previousItems = List<CartItem>.from(_items);
    _items = [
      for (var i = 0; i < _items.length; i++)
        if (i == index) _items[i].copyWith(quantity: quantity) else _items[i],
    ];
    notifyListeners();

    try {
      final response = await ApiClient.instance.patch(
        '/api/user/update-cart-item-quantity',
        data: {
          'itemId': itemId,
          'quantity': quantity,
        },
      );

      if (response.data != null && response.data['success'] == true) {
        _replaceItems(response.data['cart']);
      }
    } catch (e) {
      _items = previousItems;
      notifyListeners();
      AppLogger.error('Error updating cart quantity', extractErrorMessage(e));
      rethrow;
    }
  }

  Future<void> clearCart() async {
    final previousItems = List<CartItem>.from(_items);
    _items = [];
    notifyListeners();

    try {
      final response = await ApiClient.instance.delete('/api/user/clear-cart');
      if (response.data != null && response.data['success'] == true) {
        _items = [];
        notifyListeners();
      }
    } catch (e) {
      _items = previousItems;
      notifyListeners();
      AppLogger.error('Error clearing cart', extractErrorMessage(e));
      rethrow;
    }
  }
}
