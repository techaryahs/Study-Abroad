import re

with open('lib/widgets/app_scaffold.dart', 'r') as f:
    content = f.read()

# Fix bottom nav text
content = content.replace(
'''                            Text(
                              item.label,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: isSelected ? FontWeight.w900 : FontWeight.w600,
                                color: isSelected ? AppTheme.gold : AppTheme.textSecondary.withOpacity(0.6),
                                letterSpacing: 0.1,
                              ),
                            ),''',
'''                            Flexible(
                              child: FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Text(
                                  item.label,
                                  maxLines: 1,
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: isSelected ? FontWeight.w900 : FontWeight.w600,
                                    color: isSelected ? AppTheme.gold : AppTheme.textSecondary.withOpacity(0.6),
                                    letterSpacing: 0.1,
                                  ),
                                ),
                              ),
                            ),'''
)

with open('lib/widgets/app_scaffold.dart', 'w') as f:
    f.write(content)
