import 'package:flutter/material.dart';

enum MembershipStatusType { active, gracePeriod, expired, cancelled, trial, unknown }

class MembershipStatusChip extends StatelessWidget {
  final String status;
  final double fontSize;

  const MembershipStatusChip({
    super.key,
    required this.status,
    this.fontSize = 12,
  });

  MembershipStatusType get _type {
    switch (status.toLowerCase()) {
      case 'active':
        return MembershipStatusType.active;
      case 'grace_period':
      case 'grace':
        return MembershipStatusType.gracePeriod;
      case 'expired':
        return MembershipStatusType.expired;
      case 'cancelled':
      case 'inactive':
        return MembershipStatusType.cancelled;
      case 'trial':
      case 'trialing':
        return MembershipStatusType.trial;
      default:
        return MembershipStatusType.unknown;
    }
  }

  String get _label {
    switch (_type) {
      case MembershipStatusType.active:
        return 'Active';
      case MembershipStatusType.gracePeriod:
        return 'Grace Period';
      case MembershipStatusType.expired:
        return 'Expired';
      case MembershipStatusType.cancelled:
        return 'Cancelled';
      case MembershipStatusType.trial:
        return 'Trial';
      case MembershipStatusType.unknown:
        return status.toUpperCase();
    }
  }

  IconData get _icon {
    switch (_type) {
      case MembershipStatusType.active:
        return Icons.check_circle_rounded;
      case MembershipStatusType.gracePeriod:
        return Icons.warning_amber_rounded;
      case MembershipStatusType.expired:
        return Icons.cancel_rounded;
      case MembershipStatusType.cancelled:
        return Icons.do_not_disturb_on_rounded;
      case MembershipStatusType.trial:
        return Icons.stars_rounded;
      case MembershipStatusType.unknown:
        return Icons.info_outline_rounded;
    }
  }

  Color get _fgColor {
    switch (_type) {
      case MembershipStatusType.active:
        return const Color(0xFF137333);
      case MembershipStatusType.gracePeriod:
        return const Color(0xFFB06000);
      case MembershipStatusType.expired:
        return const Color(0xFFC5221F);
      case MembershipStatusType.cancelled:
        return const Color(0xFF5F6368);
      case MembershipStatusType.trial:
        return const Color(0xFF1A73E8);
      case MembershipStatusType.unknown:
        return const Color(0xFF5F6368);
    }
  }

  Color get _bgColor {
    switch (_type) {
      case MembershipStatusType.active:
        return const Color(0xE6E6F4EA);
      case MembershipStatusType.gracePeriod:
        return const Color(0xE6FEF7E0);
      case MembershipStatusType.expired:
        return const Color(0xE6FCE8E6);
      case MembershipStatusType.cancelled:
        return const Color(0xE6F1F3F4);
      case MembershipStatusType.trial:
        return const Color(0xE6E8F0FE);
      case MembershipStatusType.unknown:
        return const Color(0xE6F1F3F4);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: _bgColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _fgColor.withOpacity(0.3), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(_icon, size: fontSize + 2, color: _fgColor),
          const SizedBox(width: 5),
          Text(
            _label,
            style: TextStyle(
              color: _fgColor,
              fontSize: fontSize,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.3,
            ),
          ),
        ],
      ),
    );
  }
}
