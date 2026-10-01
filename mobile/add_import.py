with open('lib/features/dashboard/dashboard_screen.dart', 'r') as f:
    content = f.read()

if "import 'edit_profile_screen.dart';" not in content:
    content = content.replace(
        "import 'package:flutter/material.dart';",
        "import 'package:flutter/material.dart';\nimport 'edit_profile_screen.dart';"
    )

with open('lib/features/dashboard/dashboard_screen.dart', 'w') as f:
    f.write(content)
