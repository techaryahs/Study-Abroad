import re

with open('lib/features/universities/university_list_screen.dart', 'r') as f:
    content = f.read()

# Fix 1: PREMIUM UNIVERSITY Banner Overflow
content = content.replace(
'''                      Text(
                        'PREMIUM UNIVERSITY • UNLOCK WITH MEMBERSHIP',''',
'''                      Flexible(
                        child: Text(
                          'PREMIUM UNIVERSITY • UNLOCK WITH MEMBERSHIP',
                          overflow: TextOverflow.visible,'''
).replace(
'''                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),''',
'''                          letterSpacing: 0.5,
                        ),
                      ),
                      ),
                    ],
                  ),
                ),'''
)

# Fix 2: Top Tier badge alignment
content = content.replace(
'''                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(''',
'''                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded('''
)

# Fix 3: Use Wrap instead of SingleChildScrollView+Row for badges
badges_block = '''                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: [
                              if (isLocked) ...[
                                _badge(
                                    LucideIcons.lock,
                                    '🔒 Premium Data Locked',
                                    AppTheme.gold.withOpacity(0.1),
                                    AppTheme.darkBrown),
                              ] else ...[
                                _badge(
                                    LucideIcons.checkCircle2,
                                    '8%',
                                    const Color(0xFF10B981).withOpacity(0.1),
                                    const Color(0xFF10B981)),
                                const SizedBox(width: 8),
                                _badge(
                                    LucideIcons.graduationCap,
                                    u.fee,
                                    AppTheme.gold.withOpacity(0.1),
                                    AppTheme.gold),
                              ],
                            ],
                          ),
                        ),'''
new_badges_block = '''                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            if (isLocked)
                              _badge(
                                  LucideIcons.lock,
                                  '🔒 Premium Data Locked',
                                  AppTheme.gold.withOpacity(0.1),
                                  AppTheme.darkBrown)
                            else ...[
                              _badge(
                                  LucideIcons.checkCircle2,
                                  '8%',
                                  const Color(0xFF10B981).withOpacity(0.1),
                                  const Color(0xFF10B981)),
                              _badge(
                                  LucideIcons.graduationCap,
                                  u.fee,
                                  AppTheme.gold.withOpacity(0.1),
                                  AppTheme.gold),
                            ],
                          ],
                        ),'''

content = content.replace(badges_block, new_badges_block)

with open('lib/features/universities/university_list_screen.dart', 'w') as f:
    f.write(content)
