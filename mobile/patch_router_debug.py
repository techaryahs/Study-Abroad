import re

with open('lib/core/router.dart', 'r') as f:
    content = f.read()

content = content.replace(
'''              path: '/dashboard/edit',
              redirect: (context, state) {
                if (state.extra == null) return '/dashboard';
                return null;
              },''',
'''              path: '/dashboard/edit',
              redirect: (context, state) {
                print("Dashboard edit redirect. state.extra: ${state.extra}");
                if (state.extra == null) return '/dashboard';
                return null;
              },'''
)

with open('lib/core/router.dart', 'w') as f:
    f.write(content)
