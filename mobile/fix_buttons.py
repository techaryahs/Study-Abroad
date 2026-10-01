import re

with open('lib/features/university/university_detail_screen.dart', 'r') as f:
    content = f.read()

# Add import
if 'book_counselling_sheet' not in content:
    content = content.replace("import '../membership/membership_screen.dart';", "import '../membership/membership_screen.dart';\nimport '../../widgets/book_counselling_sheet.dart';")

# Fix APPLY WITH PRIORITY
content = content.replace(
'''          ElevatedButton(
            onPressed: () {},
            style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gold,
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 56),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16))),
            child: const Text('APPLY WITH PRIORITY',''',
'''          ElevatedButton(
            onPressed: () => showBookCounsellingSheet(context),
            style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gold,
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 56),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16))),
            child: const Text('APPLY WITH PRIORITY','''
)

# Fix Speak with Counsellor
content = content.replace(
'''          TextButton(
            onPressed: () {},
            child: const Text('Speak with Counsellor',
                style: TextStyle(color: Colors.white70, fontSize: 14)),
          ),''',
'''          TextButton(
            onPressed: () => showBookCounsellingSheet(context),
            child: const Text('Speak with Counsellor',
                style: TextStyle(color: Colors.white70, fontSize: 14)),
          ),'''
)

with open('lib/features/university/university_detail_screen.dart', 'w') as f:
    f.write(content)
