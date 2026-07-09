class UsageTracking {
  final int used;
  final int? remaining;
  final DateTime? lastUsedAt;

  UsageTracking({
    required this.used,
    this.remaining,
    this.lastUsedAt,
  });

  factory UsageTracking.fromJson(Map<String, dynamic> json) {
    return UsageTracking(
      used: json['used'] ?? 0,
      remaining: json['remaining'],
      lastUsedAt: json['lastUsedAt'] != null ? DateTime.tryParse(json['lastUsedAt']) : null,
    );
  }
}

class UserMembership {
  final String planId;
  final int catalogVersion;
  final String status;
  final String platform;
  final String? productId;
  final String? transactionId;
  final DateTime? purchaseDate;
  final DateTime? expiryDate;
  final Map<String, UsageTracking> usage;

  UserMembership({
    required this.planId,
    required this.catalogVersion,
    required this.status,
    required this.platform,
    this.productId,
    this.transactionId,
    this.purchaseDate,
    this.expiryDate,
    this.usage = const {},
  });

  factory UserMembership.fromJson(Map<String, dynamic> json) {
    Map<String, UsageTracking> parseUsage(Map<String, dynamic>? usageJson) {
      if (usageJson == null) return {};
      return usageJson.map((key, value) => MapEntry(key, UsageTracking.fromJson(value)));
    }

    return UserMembership(
      planId: json['planId'] ?? 'free',
      catalogVersion: json['catalogVersion'] ?? 1,
      status: json['status'] ?? 'none',
      platform: json['platform'] ?? 'none',
      productId: json['productId'],
      transactionId: json['transactionId'],
      purchaseDate: json['purchaseDate'] != null ? DateTime.tryParse(json['purchaseDate']) : null,
      expiryDate: json['expiryDate'] != null ? DateTime.tryParse(json['expiryDate']) : null,
      usage: parseUsage(json['usage']),
    );
  }
}
