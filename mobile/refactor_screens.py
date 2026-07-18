import os
import re

screens = [
    "lib/features/services/career/resume_drafting_screen.dart",
    "lib/features/services/career/cover_letter_screen.dart",
    "lib/features/services/career/linkedin_optimization_screen.dart",
    "lib/features/services/prep/gre_prep_screen.dart",
    "lib/features/services/prep/toefl_prep_screen.dart",
    "lib/features/services/university/university_finalization_screen.dart",
    "lib/features/services/visa/visa_application_screen.dart",
    "lib/features/services/visa/o1_visa_screen.dart",
    "lib/features/services/visa/express_entry_screen.dart",
    "lib/features/services/academic/research_paper_screen.dart",
    "lib/features/services/application/application_review_screen.dart",
    "lib/features/services/application/personal_history_screen.dart",
    "lib/features/services/application/lor_drafting_screen.dart",
    "lib/features/services/application/application_help_screen.dart"
]

for screen in screens:
    if not os.path.exists(screen):
        continue
    with open(screen, 'r') as f:
        content = f.read()

    # 1. Imports
    if "import 'package:study_abroad/core/utils/responsive.dart';" not in content:
        content = content.replace("import 'package:study_abroad/core/theme.dart';", "import 'package:study_abroad/core/theme.dart';\nimport 'package:study_abroad/core/utils/responsive.dart';\nimport 'package:study_abroad/widgets/responsive_hero_image.dart';")

    # 2. Body structure
    body_pattern = r'body:\s*SingleChildScrollView\(\s*child:\s*Column\('
    new_body = '''body: SafeArea(
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: MediaQuery.sizeOf(context).height,
            ),
            child: Column('''
    
    # Check if we already have SafeArea
    if "body: SafeArea(" not in content:
        content = re.sub(body_pattern, new_body, content)
        
        # We need to add closing parenthesis for SafeArea and ConstrainedBox at the end
        # The structure usually ends with `    );\n  }\n}`
        # We can find `      ),\n    );\n  }\n}` and replace it
        end_pattern = r'(\s*)\]\,\n(\s*)\)\,\n(\s*)\)\;\n(\s*)\}\n\}'
        new_end = r'\1],\n\2),\n\3),\n\3),\n\3);\n\4}\n}'
        # Wait, a safer way is to just use regex to close it properly.
        # Let's see if we can do this carefully manually or with simple python.
        content = content.replace("          ],\n        ),\n      ),\n    );\n  }\n}", "          ],\n        ),\n            ),\n          ),\n        ),\n      );\n  }\n}")
        content = content.replace("          ],\n        ),\n      ),\n    );", "          ],\n        ),\n            ),\n          ),\n        ),\n      );")

    # 3. Common Paddings
    content = content.replace("padding: const EdgeInsets.symmetric(horizontal: 16.0)", "padding: EdgeInsets.symmetric(horizontal: AppSpacing.sm)")
    content = content.replace("padding: EdgeInsets.symmetric(horizontal: 16.0)", "padding: EdgeInsets.symmetric(horizontal: AppSpacing.sm)")
    content = content.replace("padding: const EdgeInsets.all(24.0)", "padding: EdgeInsets.all(AppSpacing.md)")
    content = content.replace("padding: const EdgeInsets.all(24)", "padding: EdgeInsets.all(AppSpacing.md)")
    content = content.replace("padding: const EdgeInsets.all(32)", "padding: EdgeInsets.all(AppSpacing.lg)")
    
    # 4. Image.asset -> ResponsiveHeroImage
    img_pattern = r'Image\.asset\(\s*\'([^\']+)\',\s*fit:\s*BoxFit\.cover,\s*width:\s*double\.infinity,\s*height:\s*\d+,\s*\)'
    content = re.sub(img_pattern, r"ResponsiveHeroImage(imagePath: '\1')", content)

    # Specific height blocks
    content = content.replace("height: 250", "height: MediaQuery.sizeOf(context).height * 0.3")

    with open(screen, 'w') as f:
        f.write(content)

print("Refactored screens")
