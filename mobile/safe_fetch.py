import re

with open('lib/features/dashboard/dashboard_screen.dart', 'r') as f:
    content = f.read()

content = content.replace(
'''    try {
      final profileRes = await ApiClient.instance.get('/api/user/profile/$userId');
      final receiptsRes = await ApiClient.instance.get('/api/payment/user/${auth.user?['email']}');

      if (mounted) {
        setState(() {
          _userData = profileRes.data;
          _receipts = receiptsRes.data is List ? receiptsRes.data : [];
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Dashboard fetch error: $e'), backgroundColor: Colors.red),
        );
        setState(() => _loading = false);
      }
    }''',
'''    try {
      final profileRes = await ApiClient.instance.get('/api/user/profile/$userId');
      
      dynamic receiptsData = [];
      try {
        final email = auth.user?['email'];
        if (email != null && email.toString().isNotEmpty) {
          final receiptsRes = await ApiClient.instance.get('/api/payment/user/$email');
          receiptsData = receiptsRes.data;
        }
      } catch (receiptErr) {
        // Ignore receipt error, continue loading profile
        print("Receipt fetch failed: $receiptErr");
      }

      if (mounted) {
        setState(() {
          _userData = profileRes.data;
          _receipts = receiptsData is List ? receiptsData : [];
          _loading = false;
        });
      }
    } catch (e) {
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
