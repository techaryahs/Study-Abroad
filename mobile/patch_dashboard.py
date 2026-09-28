import re

file_path = 'lib/features/dashboard/dashboard_screen.dart'
with open(file_path, 'r') as f:
    content = f.read()

# Add imports
imports = """import 'package:intl/intl.dart';
import '../membership/membership_manager.dart';
"""
content = re.sub(r'(import \'package:flutter/material.dart\';)', r'\1\n' + imports, content)

# Inject Membership Module call
membership_call = """              // ── MEMBERSHIP MODULE ──
              _buildMembershipModule(context),
"""
content = re.sub(r'(\s+// ── IDENTITY MODULE ──)', r'\n' + membership_call + r'\1', content)

# Define the Membership Module function
membership_func = """
  Widget _buildMembershipModule(BuildContext context) {
    final manager = context.watch<MembershipManager>();
    final currentPlan = manager.currentPlan;
    final userMembership = manager.userMembership;

    if (currentPlan == null || userMembership == null) {
      return Container(
        margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: AppTheme.borderLight),
        ),
        child: Column(
          children: [
            const Icon(Icons.stars_rounded, size: 48, color: AppTheme.borderLight),
            const SizedBox(height: 16),
            const Text(
              'No Active Membership',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Upgrade to a premium plan to unlock AI tools, expert human consultations, and exclusive resources.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.5),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.gold,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: () => context.push('/membership'),
                child: const Text(
                  'EXPLORE MEMBERSHIP PLANS',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 1),
                ),
              ),
            ),
          ],
        ),
      );
    }

    final purchaseDate = userMembership.purchaseDate != null ? DateFormat('MMM dd, yyyy').format(userMembership.purchaseDate!) : 'Unknown';
    final expiryDate = userMembership.expiryDate != null ? DateFormat('MMM dd, yyyy').format(userMembership.expiryDate!) : 'Never expires';

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.gold, width: 2),
        boxShadow: [
          BoxShadow(
            color: AppTheme.gold.withOpacity(0.15),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppTheme.gold, Color(0xFFA07020)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  (currentPlan.badge ?? 'PREMIUM').toUpperCase(),
                  style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5),
                ),
              ),
              const Spacer(),
              const Row(
                children: [
                  Icon(Icons.check_circle, color: Colors.green, size: 16),
                  SizedBox(width: 4),
                  Text('ACTIVE', style: TextStyle(color: Colors.green, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            currentPlan.name,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppTheme.textPrimary),
          ),
          const SizedBox(height: 8),
          if (currentPlan.description != null)
            Text(
              currentPlan.description!,
              style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.4),
            ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.background,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.borderLight),
            ),
            child: Column(
              children: [
                _buildMembershipDetailRow('Purchase Date', purchaseDate),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Divider(height: 1),
                ),
                _buildMembershipDetailRow('Expiry Date', expiryDate),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Divider(height: 1),
                ),
                _buildMembershipDetailRow('Plan Price', '${currentPlan.currency == 'USD' ? '\$' : (currentPlan.currency == 'GBP' ? '£' : '₹')}${currentPlan.price ?? 'Free'}'),
              ],
            ),
          ),
          if (userMembership.usage.isNotEmpty) ...[
            const SizedBox(height: 24),
            const Text(
              'REMAINING USAGE',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.gold, letterSpacing: 2),
            ),
            const SizedBox(height: 12),
            ...userMembership.usage.entries.map((entry) {
              final limit = entry.value.remaining ?? 'Unlimited';
              final label = entry.key.toUpperCase();
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  children: [
                    Expanded(child: Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.textPrimary))),
                    Text('$limit', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.gold)),
                  ],
                ),
              );
            }).toList(),
          ],
        ],
      ),
    );
  }

  Widget _buildMembershipDetailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary, fontWeight: FontWeight.w500)),
        Text(value, style: const TextStyle(fontSize: 13, color: AppTheme.textPrimary, fontWeight: FontWeight.w700)),
      ],
    );
  }
"""

content = re.sub(r'(  Widget _buildIdentityModule)', membership_func + r'\n\1', content)

with open(file_path, 'w') as f:
    f.write(content)
print("Updated dashboard_screen.dart")
