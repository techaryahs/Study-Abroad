import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../features/membership/membership_manager.dart';
import '../features/membership/membership_screen.dart';

class EntitlementGuard extends StatelessWidget {
  final String featureId;
  final Widget child;
  final String? recommendedPlanId; // Passed to MembershipScreen to pre-select or highlight

  const EntitlementGuard({
    Key? key,
    required this.featureId,
    required this.child,
    this.recommendedPlanId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final manager = Provider.of<MembershipManager>(context);

    if (manager.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    final hasAccess = manager.canAccess(featureId);

    if (hasAccess) {
      return child;
    }

    // Locked State overlay
    return Stack(
      children: [
        // Blur or obfuscate the child widget
        Opacity(
          opacity: 0.3,
          child: AbsorbPointer(child: child),
        ),
        Center(
          child: Container(
            padding: const EdgeInsets.all(24),
            margin: const EdgeInsets.symmetric(horizontal: 32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: const [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 10,
                  offset: Offset(0, 4),
                )
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.lock_outline, size: 48, color: Colors.grey),
                const SizedBox(height: 16),
                const Text(
                  'Premium Feature',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Unlock this capability and much more by upgrading your membership.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  ),
                  onPressed: () {
                    // Route to membership screen with Recommendation Engine support
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => MembershipScreen(
                          recommendedPlanId: recommendedPlanId,
                          lockedFeatureId: featureId,
                        ),
                      ),
                    );
                  },
                  child: const Text('View Membership Plans'),
                )
              ],
            ),
          ),
        )
      ],
    );
  }
}
