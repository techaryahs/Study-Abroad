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
      lastUsedAt: json['lastUsedAt'] != null
          ? DateTime.tryParse(json['lastUsedAt'].toString())
          : null,
    );
  }
}

/// User's purchased membership record (not plan catalog).
///
/// Purchase metadata must come from the membership / payment record:
/// purchasedAt, expiresAt, paymentDate, amountPaid, paymentStatus, transactionId.
class UserMembership {
  final String planId;
  final int catalogVersion;
  final String status;
  final String platform;
  final String? productId;
  final String? transactionId;

  /// When the user purchased / activated this membership.
  final DateTime? purchaseDate;

  /// Calendar end of the membership period; null for lifetime / one-time access.
  final DateTime? expiryDate;

  /// Amount actually charged for this purchase (not catalog list price).
  final num? amountPaid;

  /// Currency of [amountPaid] (e.g. INR, USD).
  final String? currency;

  /// Payment status from the purchase record (e.g. paid, refunded).
  final String? paymentStatus;

  /// When payment was recorded (may equal [purchaseDate]).
  final DateTime? paymentDate;

  /// Auto-renew status for subscription plans.
  final bool autoRenew;

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
    this.amountPaid,
    this.currency,
    this.paymentStatus,
    this.paymentDate,
    this.autoRenew = true,
    this.usage = const {},
  });

  static DateTime? _parseDate(dynamic value) {
    if (value == null) return null;
    if (value is DateTime) return value;
    return DateTime.tryParse(value.toString());
  }

  static num? _parseNum(dynamic value) {
    if (value == null) return null;
    if (value is num) return value;
    return num.tryParse(value.toString());
  }

  /// Parse first non-null date from a list of JSON keys (aliases).
  static DateTime? _firstDate(Map<String, dynamic> json, List<String> keys) {
    for (final key in keys) {
      final parsed = _parseDate(json[key]);
      if (parsed != null) return parsed;
    }
    return null;
  }

  static bool _parseBool(dynamic value, {bool defaultValue = false}) {
    if (value == null) return defaultValue;
    if (value is bool) return value;
    final str = value.toString().toLowerCase().trim();
    if (str == 'true' || str == '1' || str == 'yes' || str == 'on') return true;
    if (str == 'false' || str == '0' || str == 'no' || str == 'off') return false;
    return defaultValue;
  }

  factory UserMembership.fromJson(Map<String, dynamic> json) {
    Map<String, UsageTracking> parseUsage(dynamic usageJson) {
      if (usageJson == null || usageJson is! Map) return {};
      return usageJson.map(
        (key, value) => MapEntry(
          key.toString(),
          UsageTracking.fromJson(
            value is Map<String, dynamic>
                ? value
                : Map<String, dynamic>.from(value as Map),
          ),
        ),
      );
    }

    // Purchase date aliases: purchaseDate | purchasedAt | activatedAt | paymentDate
    final purchaseDate = _firstDate(json, [
      'purchaseDate',
      'purchasedAt',
      'activatedAt',
      'paymentDate',
    ]);

    // Expiry aliases: expiryDate | expiresAt
    final expiryDate = _firstDate(json, ['expiryDate', 'expiresAt']);

    final paymentDate =
        _firstDate(json, ['paymentDate', 'purchaseDate', 'purchasedAt']) ??
            purchaseDate;

    return UserMembership(
      planId: (json['planId'] ?? 'free').toString(),
      catalogVersion: json['catalogVersion'] is int
          ? json['catalogVersion'] as int
          : int.tryParse('${json['catalogVersion'] ?? 1}') ?? 1,
      status: (json['status'] ?? 'none').toString(),
      platform: (json['platform'] ?? 'none').toString(),
      productId: json['productId']?.toString(),
      transactionId: json['transactionId']?.toString(),
      purchaseDate: purchaseDate,
      expiryDate: expiryDate,
      amountPaid: _parseNum(json['amountPaid'] ?? json['amount']),
      currency: json['currency']?.toString(),
      paymentStatus: json['paymentStatus']?.toString(),
      paymentDate: paymentDate,
      autoRenew: _parseBool(json['autoRenew'] ?? json['isAutoRenew'] ?? json['auto_renew'], defaultValue: false),
      usage: parseUsage(json['usage']),
    );
  }

  /// Whether this membership has a calendar end date.
  bool get hasExpiry => expiryDate != null;

  /// True when status indicates an active paid membership.
  bool get isActiveStatus {
    final s = status.toLowerCase();
    if (s == 'active' || s == 'grace_period' || s == 'trialing') {
      return true;
    }
    if (s == 'cancelled' && expiryDate != null && expiryDate!.isAfter(DateTime.now())) {
      return true;
    }
    return false;
  }
}
