class CheckoutItem {
  final String id;
  final String title;
  final String icon;
  final int price;
  final int actualPrice;
  final String currency;
  final String? description;
  final String? subtitle;
  final List<String>? features;
  final String? serviceId;
  final int quantity;

  CheckoutItem({
    required this.id,
    required this.title,
    required this.icon,
    required this.price,
    int? actualPrice,
    this.currency = 'INR',
    this.description,
    this.subtitle,
    this.features,
    this.serviceId,
    int quantity = 1,
  })  : actualPrice = actualPrice ?? price,
        quantity = quantity < 1 ? 1 : quantity;

  int get discount {
    final value = actualPrice - price;
    return value < 0 ? 0 : value;
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'icon': icon,
      'price': price,
      'actualPrice': actualPrice,
      'currency': currency,
      'description': description,
      'subtitle': subtitle,
      'features': features,
      'serviceId': serviceId,
      'quantity': quantity,
    };
  }

  factory CheckoutItem.fromMap(Map<String, dynamic> map) {
    return CheckoutItem(
      id: map['id']?.toString() ?? map['title']?.toString() ?? 'item',
      title: map['title']?.toString() ?? '',
      icon: map['icon']?.toString() ?? '🛒',
      price: map['price'] is int
          ? map['price'] as int
          : int.tryParse(map['price']?.toString() ?? '0') ?? 0,
      actualPrice: map['actualPrice'] is int
          ? map['actualPrice'] as int
          : int.tryParse(map['actualPrice']?.toString() ??
                  map['price']?.toString() ??
                  '0') ??
              0,
      currency: map['currency']?.toString() ?? 'INR',
      description: map['description']?.toString(),
      subtitle: map['subtitle']?.toString(),
      features: map['features'] is List
          ? List<String>.from(map['features'] as List)
          : null,
      serviceId: map['serviceId']?.toString(),
      quantity: map['quantity'] is int
          ? map['quantity'] as int
          : int.tryParse(map['quantity']?.toString() ?? '1') ?? 1,
    );
  }
}
