import 'package:flutter/material.dart';

class SubscriptionProgressBar extends StatelessWidget {
  final DateTime? purchaseDate;
  final DateTime? expiryDate;
  final String? planType;

  const SubscriptionProgressBar({
    super.key,
    required this.purchaseDate,
    required this.expiryDate,
    this.planType,
  });

  bool get _shouldShow {
    if (expiryDate == null || purchaseDate == null) return false;
    final type = (planType ?? '').toLowerCase();
    if (type == 'one_time' || type == 'lifetime' || type == 'free') return false;
    return expiryDate!.isAfter(purchaseDate!);
  }

  String get _remainingLabel {
    if (expiryDate == null) return '';
    final now = DateTime.now();
    final diff = expiryDate!.difference(now);

    if (diff.isNegative) {
      return 'Expired';
    }

    final totalMinutes = diff.inMinutes;
    final totalHours = diff.inHours;
    final totalDays = diff.inDays;

    if (totalMinutes < 60) {
      return '$totalMinutes minutes remaining';
    } else if (totalHours < 48) {
      return '$totalHours hours remaining';
    } else {
      return '$totalDays days remaining';
    }
  }

  double get _progressFraction {
    if (expiryDate == null || purchaseDate == null) return 0.0;
    final now = DateTime.now();
    final totalDurationMs = expiryDate!.millisecondsSinceEpoch - purchaseDate!.millisecondsSinceEpoch;
    if (totalDurationMs <= 0) return 0.0;

    final elapsedMs = now.millisecondsSinceEpoch - purchaseDate!.millisecondsSinceEpoch;
    final fraction = elapsedMs / totalDurationMs;
    return fraction.clamp(0.0, 1.0);
  }

  @override
  Widget build(BuildContext context) {
    if (!_shouldShow) return const SizedBox.shrink();

    final remainingText = _remainingLabel;
    final progress = _progressFraction;
    const goldColor = Color(0xFFC49A28);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Subscription Period',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: Color(0xFF7A6040),
              ),
            ),
            Text(
              remainingText,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                color: goldColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 8,
            backgroundColor: const Color(0xFFFAF3EA),
            valueColor: AlwaysStoppedAnimation<Color>(
              progress > 0.9 ? Colors.red.shade400 : goldColor,
            ),
          ),
        ),
      ],
    );
  }
}
