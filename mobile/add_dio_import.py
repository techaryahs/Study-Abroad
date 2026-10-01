with open('lib/widgets/book_counselling_sheet.dart', 'r') as f:
    content = f.read()

if "import 'package:dio/dio.dart';" not in content:
    content = content.replace("import 'package:flutter/material.dart';", "import 'package:flutter/material.dart';\nimport 'package:dio/dio.dart';")

with open('lib/widgets/book_counselling_sheet.dart', 'w') as f:
    f.write(content)
