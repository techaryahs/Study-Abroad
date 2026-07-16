import 'package:flutter/foundation.dart';
import 'models/membership_plan.dart';
import 'models/user_membership.dart';
import 'entitlement_engine.dart';
import '../../core/api_client.dart';

class MembershipManager extends ChangeNotifier {
  UserMembership? _userMembership;
  List<MembershipPlan> _activePlans = [];
  Map<String, dynamic>? _accessSummary;
  bool _isLoading = false;
  String? _error;

  MembershipManager();

  UserMembership? get userMembership => _userMembership;
  List<MembershipPlan> get activePlans => _activePlans;
  /// Latest `/api/memberships/access` payload (null until first successful fetch).
  Map<String, dynamic>? get accessSummary => _accessSummary;
  bool get isLoading => _isLoading;
  String? get error => _error;

  MembershipPlan? get currentPlan {
    if (_userMembership == null || _activePlans.isEmpty) return null;
    try {
      return _activePlans.firstWhere((p) => p.planId == _userMembership!.planId);
    } catch (e) {
      return null;
    }
  }

  /// Checks if the user has access to a given feature
  bool canAccess(String featureId) {
    return EntitlementEngine.canAccess(
      featureId: featureId,
      userMembership: _userMembership,
      catalogPlan: currentPlan,
    );
  }

  /// Refreshes catalog plans, current membership, and access summary from backend.
  ///
  /// [showLoading] when false avoids full-screen loading flicker after purchase
  /// / restore while still notifying listeners when data arrives.
  Future<void> refresh({bool showLoading = true}) async {
    if (showLoading) {
      _isLoading = true;
      _error = null;
      notifyListeners();
    }

    try {
      // 1. Fetch Catalog Plans (entitlements / business catalog — source of truth)
      final plansResponse =
          await ApiClient.instance.get('/api/memberships/plans');
      if (plansResponse.statusCode == 200) {
        final List<dynamic> data = plansResponse.data;
        _activePlans =
            data.map((json) => MembershipPlan.fromJson(json)).toList();
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

      // 3. Access summary (server-side entitlement snapshot; UI may use later)
      try {
        final accessResponse =
            await ApiClient.instance.get('/api/memberships/access');
        if (accessResponse.statusCode == 200 &&
            accessResponse.data is Map<String, dynamic>) {
          _accessSummary = Map<String, dynamic>.from(accessResponse.data as Map);
        }
      } catch (e) {
        // Non-fatal: membership + plans still refreshed
        debugPrint('[MembershipManager] access summary fetch failed: $e');
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clear() {
    _userMembership = null;
    _activePlans = [];
    _accessSummary = null;
    _error = null;
    notifyListeners();
  }
}
