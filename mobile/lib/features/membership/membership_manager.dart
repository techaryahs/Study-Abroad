import 'package:flutter/foundation.dart';
import 'models/membership_plan.dart';
import 'models/user_membership.dart';
import 'entitlement_engine.dart';
import '../../core/api_client.dart'; // Assume this exists based on common flutter structures

class MembershipManager extends ChangeNotifier {
  UserMembership? _userMembership;
  List<MembershipPlan> _activePlans = [];
  bool _isLoading = false;
  String? _error;

  MembershipManager();

  UserMembership? get userMembership => _userMembership;
  List<MembershipPlan> get activePlans => _activePlans;
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

  /// Refreshes both catalog plans and the user's specific membership state from the backend
  Future<void> refresh() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // 1. Fetch Catalog Plans
      final plansResponse = await ApiClient.instance.get('/api/memberships/plans');
      if (plansResponse.statusCode == 200) {
        final List<dynamic> data = plansResponse.data;
        _activePlans = data.map((json) => MembershipPlan.fromJson(json)).toList();
      }

      // 2. Fetch User Profile to get membership
      final profileResponse = await ApiClient.instance.get('/api/auth/me');
      if (profileResponse.statusCode == 200) {
        final Map<String, dynamic> userData = profileResponse.data['user'] ?? profileResponse.data;
        // Depending on backend structure, membership might be inside 'profile' or top level
        final membershipJson = userData['membership']; 
        if (membershipJson != null) {
          _userMembership = UserMembership.fromJson(membershipJson);
        }
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
    _error = null;
    notifyListeners();
  }
}
