import re

with open('lib/features/dashboard/dashboard_screen.dart', 'r') as f:
    content = f.read()

content = content.replace(
'''                              final updated = await context.push('/dashboard/edit', extra: _userData);
                              if (updated == true) _fetchData();''',
'''                              final updated = await context.push('/dashboard/edit', extra: _userData);
                              if (updated == true) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Profile updated successfully'), backgroundColor: Colors.green),
                                );
                                _fetchData();
                              }'''
)

with open('lib/features/dashboard/dashboard_screen.dart', 'w') as f:
    f.write(content)
