import re

with open('lib/features/dashboard/dashboard_screen.dart', 'r') as f:
    content = f.read()

# Fix 1: Header Links Overflow
# Replace Row with Wrap for GLOBAL CITIZEN and ADD LINKEDIN
content = content.replace(
'''Row(
            children: [
              const Icon(LucideIcons.mapPin, size: 14, color: AppTheme.gold),
              const SizedBox(width: 4),
              const Text('GLOBAL CITIZEN', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1)),
              const SizedBox(width: 16),
              const Icon(LucideIcons.link, size: 14, color: AppTheme.gold),
              const SizedBox(width: 4),
              const Text('ADD LINKEDIN', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1)),
            ],
          ),''',
'''Wrap(
            spacing: 16,
            runSpacing: 8,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(LucideIcons.mapPin, size: 14, color: AppTheme.gold),
                  const SizedBox(width: 4),
                  const Text('GLOBAL CITIZEN', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1)),
                ],
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(LucideIcons.link, size: 14, color: AppTheme.gold),
                  const SizedBox(width: 4),
                  const Text('ADD LINKEDIN', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1)),
                ],
              ),
            ],
          ),'''
)

# Fix 2: Buttons Overflow
content = content.replace(
'''const Text('+ ADD SHORT BIO', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1.5))''',
'''const FittedBox(child: Text('+ ADD BIO', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1)))'''
).replace(
'''Text('EDIT PROFILE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 1.5))''',
'''Expanded(child: Text('EDIT PROFILE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 1), overflow: TextOverflow.ellipsis))'''
)


# Fix 3: Profile Completion duplicate and hardcoded text
# Replace the Row containing PROFILE COMPLETION 4/10
profile_comp_regex = re.compile(r'''Row\(\s*mainAxisAlignment:\s*MainAxisAlignment\.spaceBetween,\s*children:\s*\[\s*const\s*Text\('PROFILE COMPLETION',\s*style:\s*TextStyle\(.*?\)\),\s*Text\('\$completed/10',\s*style:\s*const\s*TextStyle\(.*?\)\),\s*\],\s*\),\s*const\s*SizedBox\(height:\s*12\),\s*ProfileProgressBar\(progress:\s*completed\s*/\s*10\.0\),''', re.DOTALL)

replacement_comp = '''ProfileProgressBar(completed: completed, total: 10),'''
content = profile_comp_regex.sub(replacement_comp, content)
content = content.replace("ProfileProgressBar(progress: completed / 10.0)", "ProfileProgressBar(completed: completed, total: 10)")

# Fix 4: Grid Overflow (Change childAspectRatio from 2.5 to 3.0 or use Wrap)
content = content.replace('childAspectRatio: 2.5', 'childAspectRatio: 2.8')

# Fix 5: Grid Text overflow LOCATIO N
content = content.replace(
'''Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textMuted, letterSpacing: 1)),''',
'''FittedBox(fit: BoxFit.scaleDown, alignment: Alignment.centerLeft, child: Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textMuted, letterSpacing: 1))),'''
)

with open('lib/features/dashboard/dashboard_screen.dart', 'w') as f:
    f.write(content)
