import re

with open('lib/features/dashboard/dashboard_screen.dart', 'r') as f:
    content = f.read()

content = content.replace(
'''                            onTap: () async {
                              final updated = await context.push('/dashboard/edit', extra: _userData);
                              if (updated == true) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Profile updated successfully'), backgroundColor: Colors.green),
                                );
                                _fetchData();
                              }
                            },''',
'''                            onTap: () async {
                              if (_userData == null) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('User data is still loading or failed to load.'), backgroundColor: Colors.red),
                                );
                                return;
                              }
                              final updated = await context.push('/dashboard/edit', extra: _userData);
                              if (updated == true) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Profile updated successfully'), backgroundColor: Colors.green),
                                );
                                _fetchData();
                              }
                            },'''
)

with open('lib/features/dashboard/dashboard_screen.dart', 'w') as f:
    f.write(content)
