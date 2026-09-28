/// Subscription/plan tiers available for Apple In-App Purchase.
///
/// This enum is platform-agnostic. The Apple payment layer maps each value
/// to the corresponding Apple Product ID internally.
enum SubscriptionPlan {
  starter,
  essential,
  premium,
  elite,
}

/// Maps [SubscriptionPlan] values to Apple App Store product identifiers and
/// provides helpers for querying product metadata.
///
/// All Apple-specific identifiers are confined to this file.
///
/// Mapping contract (1:1, fixed — plan IDs must not change):
///   starter    ↔ com.iecstudyabroad.starter.onetime   (consumable one-time)
///   essential  ↔ com.iecstudyabroad.essential.yearly  (auto-renewable)
///   premium    ↔ com.iecstudyabroad.premium.yearly    (auto-renewable)
///   elite      ↔ com.iecstudyabroad.elite.yearly      (auto-renewable)
class AppleProductIds {
  AppleProductIds._();

  // ── Product ID constants ─────────────────────────────────────────────────
  static const String starter = 'com.iecstudyabroad.starter.onetime';
  static const String essential = 'com.iecstudyabroad.essential.yearly';
  static const String premium = 'com.iecstudyabroad.premium.yearly';
  static const String elite = 'com.iecstudyabroad.elite.yearly';

  /// All product IDs that should be queried from the App Store.
  static const Set<String> all = {starter, essential, premium, elite};

  // ── Plan ↔ Product ID mapping ────────────────────────────────────────────

  static const Map<SubscriptionPlan, String> _planToProductId = {
    SubscriptionPlan.starter: starter,
    SubscriptionPlan.essential: essential,
    SubscriptionPlan.premium: premium,
    SubscriptionPlan.elite: elite,
  };

  static const Map<String, SubscriptionPlan> _productIdToPlan = {
    starter: SubscriptionPlan.starter,
    essential: SubscriptionPlan.essential,
    premium: SubscriptionPlan.premium,
    elite: SubscriptionPlan.elite,
  };

  static const Map<String, SubscriptionPlan> _nameToPlan = {
    'starter': SubscriptionPlan.starter,
    'essential': SubscriptionPlan.essential,
    'premium': SubscriptionPlan.premium,
    'elite': SubscriptionPlan.elite,
  };

  /// Resolves a [SubscriptionPlan] to its Apple Product ID.
  static String productIdFor(SubscriptionPlan plan) => _planToProductId[plan]!;

  /// Resolves an Apple Product ID back to a [SubscriptionPlan], or `null` if
  /// the ID is not recognized.
  static SubscriptionPlan? planFor(String productId) =>
      _productIdToPlan[productId];

  /// Backend / catalog planId string for a known product, or `null` if unknown.
  static String? planIdForProduct(String productId) {
    final plan = planFor(productId);
    if (plan == null) return null;
    return nameForPlan(plan);
  }

  /// Whether [productId] is a known, mapped Apple product.
  static bool isKnownProduct(String productId) =>
      _productIdToPlan.containsKey(productId);

  static SubscriptionPlan? planForName(String name) =>
      _nameToPlan[name.toLowerCase()];

  static String nameForPlan(SubscriptionPlan plan) {
    return _nameToPlan.entries.firstWhere((e) => e.value == plan).key;
  }

  /// Product ID for a backend planId, or `null` if unmapped.
  static String? productIdForPlanId(String planId) {
    final plan = planForName(planId);
    if (plan == null) return null;
    return productIdFor(plan);
  }

  // ── Product type helpers ─────────────────────────────────────────────────

  /// Returns `true` when the product is a consumable (one-time purchase).
  ///
  /// Starter is intentionally consumable: catalog type is `one_time` and the
  /// product may be re-purchased. ASC must list this product as Consumable.
  static bool isConsumable(String productId) => productId == starter;

  /// Human-readable plan name for display purposes (fallback when StoreKit
  /// title is unavailable).
  static const Map<String, String> displayNames = {
    starter: 'Starter',
    essential: 'Essential',
    premium: 'Premium',
    elite: 'Elite Global',
  };

  /// Returns the human-readable name for a product ID, or the raw ID if unknown.
  static String displayNameFor(String productId) =>
      displayNames[productId] ?? productId;
}
