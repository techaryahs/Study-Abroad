import 'dart:convert';
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

  /// Refreshes catalog plans, current membership, and access summary from backend.
  ///
  /// [showLoading] when false avoids full-screen loading flicker after purchase
  /// / restore while still notifying listeners when data arrives.
  Future<void> refresh({bool showLoading = true}) async {
    final traceId = identityHashCode(this);
    debugPrint(
      '[MembershipTrace][$traceId] ENTER MembershipManager.refresh '
      'showLoading=$showLoading activePlans=${_activePlans.length} '
      'isLoading=$_isLoading error=$_error',
    );
    if (showLoading) {
      _isLoading = true;
      _error = null;
      debugPrint('[MembershipTrace][$traceId] notifyListeners loading=true');
      notifyListeners();
    }

    try {
      // 1. Fetch Catalog Plans (entitlements / business catalog — source of truth)
      debugPrint('[MembershipTrace][$traceId] before ApiClient.get');
      final plansResponse =
          await ApiClient.instance.get('/api/memberships/plans');
      debugPrint(
        '[MembershipTrace][$traceId] after ApiClient.get '
        'status=${plansResponse.statusCode} dataType=${plansResponse.data.runtimeType}',
      );
      if (plansResponse.statusCode == 200) {
        final List<dynamic> data = plansResponse.data;
        debugPrint('[MembershipTrace][$traceId] Response.data listCount=${data.length}');
        final parsedPlans = <MembershipPlan>[];
        for (var index = 0; index < data.length; index += 1) {
          final raw = data[index];
          debugPrint(
            '[MembershipTrace][$traceId] plan[$index] input '
            'type=${raw.runtimeType} '
            'planId=${raw is Map ? raw['planId'] : null}',
          );
          try {
            final plan = MembershipPlan.fromJson(raw as Map<String, dynamic>);
            parsedPlans.add(plan);
            debugPrint(
              '[MembershipTrace][$traceId] plan[$index] output '
              'planId=${plan.planId} parsedCount=${parsedPlans.length}',
            );
          } catch (error, stackTrace) {
            debugPrint(
              '[MembershipTrace][$traceId] plan[$index] PARSE EXCEPTION '
              'value=$error raw=$raw parsedCount=${parsedPlans.length}',
            );
            debugPrintStack(
              label: '[MembershipTrace][$traceId] plan[$index] parse stack',
              stackTrace: stackTrace,
            );
            rethrow;
          }
        }
        debugPrint('[MembershipTrace][$traceId] parsedPlanCount=${parsedPlans.length}');
        debugPrint(
          '[MembershipTrace][$traceId] activePlans before assignment=${_activePlans.length}',
        );
        _activePlans = parsedPlans;
        debugPrint(
          '[MembershipTrace][$traceId] activePlans after assignment=${_activePlans.length}',
        );
      } else {
        debugPrint(
          '[MembershipTrace][$traceId] non-200 plans response; '
          'activePlans remains=${_activePlans.length}',
        );
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
        debugPrint("AUTH RESPONSE");
        debugPrint(jsonEncode(profileResponse.data));
        debugPrint("CURRENT MEMBERSHIP");
        debugPrint(_userMembership?.planId);
      }

      // 3. Access summary (server-side entitlement snapshot; UI may use later)
      try {
        final accessResponse =
            await ApiClient.instance.get('/api/memberships/access');
        if (accessResponse.statusCode == 200 &&
            accessResponse.data is Map<String, dynamic>) {
          _accessSummary = Map<String, dynamic>.from(accessResponse.data as Map);
          debugPrint("ACCESS RESPONSE");
          debugPrint(jsonEncode(accessResponse.data));
          debugPrint("ACCESS SUMMARY FEATURES");
          debugPrint(_accessSummary?['features']?.keys.toList().toString());
        }
      } catch (e) {
        // Non-fatal: membership + plans still refreshed
        debugPrint('[MembershipManager] access summary fetch failed: $e');
      }
    } catch (e, stackTrace) {
      _error = e.toString();
      debugPrint(
        '[MembershipTrace][$traceId] refresh EXCEPTION '
        'type=${e.runtimeType} value=$e activePlans=${_activePlans.length}',
      );
      debugPrintStack(
        label: '[MembershipTrace][$traceId] refresh stack',
        stackTrace: stackTrace,
      );
    } finally {
      _isLoading = false;
      _initialized = true;
      debugPrint(
        '[MembershipTrace][$traceId] notifyListeners finally '
        'activePlans=${_activePlans.length} error=$_error',
      );
      notifyListeners();
    }
  }

  void clear() {
    debugPrint(
      '[MembershipTrace][${identityHashCode(this)}] clear() '
      'activePlans before=${_activePlans.length}',
    );
    _userMembership = null;
    _activePlans = [];
    _accessSummary = null;
    _error = null;
    _initialized = false;
    debugPrint(
      '[MembershipTrace][${identityHashCode(this)}] clear() '
      'activePlans after=${_activePlans.length} notifyListeners',
    );
    notifyListeners();
  }
}
