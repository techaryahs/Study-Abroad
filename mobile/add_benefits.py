import re

file_path = 'lib/features/dashboard/dashboard_screen.dart'
with open(file_path, 'r') as f:
    content = f.read()

benefits_ui = """
          if (currentPlan.benefits.isNotEmpty) ...[
            const SizedBox(height: 24),
            const Text(
              'INCLUDED BENEFITS',
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.gold, letterSpacing: 2),
            ),
            const SizedBox(height: 12),
            ...currentPlan.benefits.map((b) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.check_circle, color: AppTheme.gold, size: 16),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      b,
                      style: const TextStyle(fontSize: 13, color: AppTheme.textPrimary, height: 1.4),
                    ),
                  ),
                ],
              ),
            )).toList(),
          ],
          if (userMembership.usage.isNotEmpty) ...["""

content = content.replace("          if (userMembership.usage.isNotEmpty) ...[", benefits_ui)

with open(file_path, 'w') as f:
    f.write(content)
print("Added benefits to dashboard_screen.dart")
