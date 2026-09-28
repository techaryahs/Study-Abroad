import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'models/membership_plan.dart';
import 'models/user_membership.dart';
import 'entitlement_engine.dart';
import '../../core/api_client.dart';
import '../../core/app_logger.dart';

class MembershipManager extends ChangeNotifier {
  UserMembership? _userMembership;
  List<MembershipPlan> _activePlans = [];
  Map<String, dynamic>? _accessSummary;
  bool _isLoading = false;
  bool _initialized = false;
  String? _error;

  MembershipManager();

  UserMembership? get userMembership => _userMembership;
  List<MembershipPlan> get activePlans => _activePlans;
  /// Latest `/api/memberships/access` payload (null until first successful fetch).
  Map<String, dynamic>? get accessSummary => _accessSummary;
  bool get isLoading => _isLoading;
  bool get initialized => _initialized;
  String? get error => _error;

  /// The active plan ID.
  /// Backend `/api/memberships/access` (accessSummary) is the single source of truth.
  /// Only falls back to `_userMembership` if `accessSummary` has not loaded yet.
  String? get currentPlanId {
    if (_accessSummary != null) {
      final summaryPlanId = _accessSummary!['currentPlanId'] as String?;
      if (summaryPlanId != null && summaryPlanId.isNotEmpty) {
        return summaryPlanId;
      }
      // Access summary loaded and currentPlanId is null: backend says NO active plan.
      return null;
    }
    // Fallback only when accessSummary has not yet been loaded (offline / initial)
    if (_userMembership != null && _userMembership!.isActiveStatus) {
      return _userMembership!.planId;
    }
    return null;
  }

  /// Catalog [MembershipPlan] for the current ACTIVE membership.
  /// Returns null if user has no active membership (e.g. expired, cancelled, inactive).
  MembershipPlan? get currentPlan {
    final activeId = currentPlanId;
    if (activeId == null || _activePlans.isEmpty) return null;
    try {
      return _activePlans.firstWhere((p) => p.planId == activeId);
    } catch (e) {
      return null;
    }
  }

  /// Catalog [MembershipPlan] associated with the user's membership record,
  /// regardless of active/expired status (used for historical display on Dashboard).
  MembershipPlan? get userMembershipPlan {
    if (_userMembership == null || _activePlans.isEmpty) return null;
    try {
      return _activePlans.firstWhere((p) => p.planId == _userMembership!.planId);
    } catch (e) {
      return null;
    }
  }

  /// Checks if the user has access to a given feature
  bool canAccess(String featureId) {
    if (_accessSummary != null) {
      final features = _accessSummary!['features'] as Map<String, dynamic>?;
      if (features != null) {
        final feature = features[featureId] as Map<String, dynamic>?;
        if (feature != null) {
          return feature['canAccess'] == true;
        }
      }
    }

    // Offline fallback only
    return EntitlementEngine.canAccess(
      featureId: featureId,
      userMembership: _userMembership,
      catalogPlan: currentPlan,
    );
  }

  /// Refreshes catalog plans, user membership, and access summary in parallel.
  /// [showLoading] when false avoids full-screen loading flicker after purchase
  /// / restore while still notifying listeners when data arrives.
  Future<void> refresh({bool showLoading = true}) async {
    AppLogger.debug('Refreshing membership data...');
    if (showLoading) {
      _isLoading = true;
      _error = null;
      notifyListeners();
    }

    try {
      // 1. Fetch Catalog Plans
      final plansResponse =
          await ApiClient.instance.get('/api/memberships/plans');
      if (plansResponse.statusCode == 200) {
        final List<dynamic> data = plansResponse.data;
        final parsedPlans = <MembershipPlan>[];
        for (var index = 0; index < data.length; index += 1) {
          final raw = data[index];
          try {
            final plan = MembershipPlan.fromJson(raw as Map<String, dynamic>);
            parsedPlans.add(plan);
          } catch (error, stackTrace) {
            AppLogger.error('Failed to parse membership plan at index $index', error, stackTrace);
            rethrow;
          }
        }
        _activePlans = parsedPlans;
      }

      // 2. Fetch User Profile to get membership
      final profileResponse = await ApiClient.instance.get('/api/auth/me');
      if (profileResponse.statusCode == 200) {
        final Map<String, dynamic> userData =
            profileResponse.data['user'] ?? profileResponse.data;
        final membershipJson = userData['membership'];
        if (membershipJson != null) {
          _userMembership = UserMembership.fromJson(membershipJson);
        } else {
          _userMembership = null;
        }
      }

      // 3. Access summary
      try {
        final accessResponse =
            await ApiClient.instance.get('/api/memberships/access');
        if (accessResponse.statusCode == 200 &&
            accessResponse.data is Map<String, dynamic>) {
          _accessSummary = Map<String, dynamic>.from(accessResponse.data as Map);
          AppLogger.info(
            'Membership access refreshed. plan=${_userMembership?.planId ?? "none"} status=${_userMembership?.status ?? "inactive"}',
          );
        }
      } catch (e) {
        // Non-fatal
        AppLogger.warning('Access summary fetch failed: $e');
      }
    } catch (e, stackTrace) {
      _error = e.toString();
      AppLogger.error('Membership refresh failed', e, stackTrace);
    } finally {
      _isLoading = false;
      _initialized = true;
      notifyListeners();
    }
  }

  void clear() {
    AppLogger.debug('MembershipManager session cleared');
    _userMembership = null;
    _activePlans = [];
    _accessSummary = null;
    _error = null;
    _initialized = false;
    notifyListeners();
  }
}
