import 'models/membership_plan.dart';
import 'models/user_membership.dart';

class EntitlementEngine {
  /// Evaluates if the given [userMembership] can access the specified [featureId]
  /// based on the [catalogPlan].
  static bool canAccess({
    required String featureId,
    required UserMembership? userMembership,
    required MembershipPlan? catalogPlan,
  }) {
    if (userMembership == null || catalogPlan == null) return false;
    
    // Check if membership is active (or grace period)
    if (userMembership.status != 'active' && userMembership.status != 'grace_period') {
      return false;
    }

    // Elite all-access override
    if (catalogPlan.allAccess) return true;

    // Search for the feature across all categories
    Entitlement? entitlement;
    if (catalogPlan.entitlements.ai.containsKey(featureId)) {
      entitlement = catalogPlan.entitlements.ai[featureId];
    } else if (catalogPlan.entitlements.human.containsKey(featureId)) {
      entitlement = catalogPlan.entitlements.human[featureId];
    } else if (catalogPlan.entitlements.access.containsKey(featureId)) {
      entitlement = catalogPlan.entitlements.access[featureId];
    }

    if (entitlement == null || !entitlement.enabled) return false;

    // Time-based check (e.g. 30 days AI access)
    if (entitlement.accessDays != null && userMembership.purchaseDate != null) {
      final daysSincePurchase = DateTime.now().difference(userMembership.purchaseDate!).inDays;
      if (daysSincePurchase > entitlement.accessDays!) {
        return false;
      }
    }

    // Usage limit check
    if (entitlement.limit != null) {
      final usage = userMembership.usage[featureId];
      if (usage != null && usage.used >= entitlement.limit!) {
        return false;
      }
    }

    return true;
  }
}
