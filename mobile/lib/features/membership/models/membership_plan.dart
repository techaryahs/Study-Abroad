import 'package:flutter/foundation.dart';

class Entitlement {
  final bool enabled;
  final int? limit;
  final String? renewal;
  final int? accessDays;

  Entitlement({
    this.enabled = true,
    this.limit,
    this.renewal,
    this.accessDays,
  });

  factory Entitlement.fromJson(Map<String, dynamic> json) {
    return Entitlement(
      enabled: json['enabled'] ?? true,
      limit: json['limit'],
      renewal: json['renewal'],
      accessDays: json['accessDays'],
    );
  }
}

class EntitlementCategories {
  final Map<String, Entitlement> ai;
  final Map<String, Entitlement> human;
  final Map<String, Entitlement> access;

  EntitlementCategories({
    required this.ai,
    required this.human,
    required this.access,
  });

  factory EntitlementCategories.fromJson(Map<String, dynamic> json) {
    Map<String, Entitlement> parseCategory(
      String category,
      Map<String, dynamic>? catJson,
    ) {
      if (catJson == null) return {};
      return catJson.map(
        (key, value) => MapEntry(key, Entitlement.fromJson(value)),
      );
    }

    return EntitlementCategories(
      ai: parseCategory('ai', json['ai']),
      human: parseCategory('human', json['human']),
      access: parseCategory('access', json['access']),
    );
  }
}

class MembershipPlan {
  final String planId;
  final int version;
  final String name;
  final String type;
  final String? appleProductId;
  final String? razorpayPlanId;
  final String? description;
  final num? price;
  final String? currency;
  final bool recommended;
  final String? badge;
  final int sortOrder;
  final List<String> benefits;
  final bool allAccess;
  final EntitlementCategories entitlements;

  MembershipPlan({
    required this.planId,
    required this.version,
    required this.name,
    required this.type,
    this.appleProductId,
    this.razorpayPlanId,
    this.description,
    this.price,
    this.currency = 'INR',
    this.recommended = false,
    this.badge,
    this.sortOrder = 0,
    this.benefits = const [],
    this.allAccess = false,
    required this.entitlements,
  });

  factory MembershipPlan.fromJson(Map<String, dynamic> json) {
    return MembershipPlan(
      planId: json['planId'],
      version: json['version'] ?? 1,
      name: json['name'],
      type: json['type'],
      appleProductId: json['appleProductId'],
      razorpayPlanId: json['razorpayPlanId'],
      description: json['description'],
      price: json['price'],
      currency: json['currency'] ?? 'INR',
      recommended: json['recommended'] ?? false,
      badge: json['badge'],
      sortOrder: json['sortOrder'] ?? 0,
      benefits: List<String>.from(json['benefits'] ?? []),
      allAccess: json['allAccess'] ?? false,
      entitlements: EntitlementCategories.fromJson(json['entitlements'] ?? {}),
    );
  }
}
