import re

with open('lib/features/dashboard/edit_profile_screen.dart', 'r') as f:
    content = f.read()

content = content.replace(
'''            PersonalInfoSection(
              nameController: _nameController,
              countryController: _countryController,
              bioController: _bioController,
              linkedinController: _linkedinController,
            ),''',
'''            PersonalInfoSection(
              nameController: _nameController,
              countryController: _countryController,
              bioController: _bioController,
              linkedinController: _linkedinController,
              dobController: _dobController,
              mobileController: _mobileController,
              gender: _gender,
              onGenderChanged: (val) => setState(() => _gender = val),
            ),'''
)

with open('lib/features/dashboard/edit_profile_screen.dart', 'w') as f:
    f.write(content)
