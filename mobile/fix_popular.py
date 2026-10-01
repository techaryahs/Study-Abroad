import re

with open('lib/features/universities/popular_programs_screen.dart', 'r') as f:
    content = f.read()

# Fix 1: PREMIUM UNIVERSITY Banner Overflow
content = content.replace(
'''                      Text(
                        'PREMIUM UNIVERSITY • UNLOCK WITH MEMBERSHIP',''',
'''                      Flexible(
                        child: Text(
                          'PREMIUM UNIVERSITY • UNLOCK WITH MEMBERSHIP',
                          overflow: TextOverflow.visible,'''
).replace(
'''                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),''',
'''                          letterSpacing: 0.5,
                        ),
                      ),
                      ),
                    ],
                  ),
                ),'''
)

with open('lib/features/universities/popular_programs_screen.dart', 'w') as f:
    f.write(content)
