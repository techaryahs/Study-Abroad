import re

with open('lib/features/universities/university_list_screen.dart', 'r') as f:
    content = f.read()

# Fix badge overflow and font size
content = content.replace(
'''  Widget _badge(IconData icon, String label, Color bg, Color text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration:
          BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 10, color: text),
          const SizedBox(width: 4),
          Text(label,
              style: TextStyle(
                  fontSize: 14, fontWeight: FontWeight.w900, color: text)),
        ],
      ),
    );
  }''',
'''  Widget _badge(IconData icon, String label, Color bg, Color text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration:
          BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: text),
          const SizedBox(width: 4),
          Flexible(
            child: Text(label,
                style: TextStyle(
                    fontSize: 11, fontWeight: FontWeight.w900, color: text)),
          ),
        ],
      ),
    );
  }'''
)

with open('lib/features/universities/university_list_screen.dart', 'w') as f:
    f.write(content)
