import re

with open('lib/features/dashboard/dashboard_screen.dart', 'r') as f:
    content = f.read()

content = content.replace(
'''    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }''',
'''    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Dashboard fetch error: $e'), backgroundColor: Colors.red),
        );
        setState(() => _loading = false);
      }
    }'''
)

with open('lib/features/dashboard/dashboard_screen.dart', 'w') as f:
    f.write(content)
