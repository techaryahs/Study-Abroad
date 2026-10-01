import re

with open('lib/features/dashboard/edit_profile_screen.dart', 'r') as f:
    content = f.read()

# 1. Add controllers
content = content.replace(
'''  late TextEditingController _linkedinController;''',
'''  late TextEditingController _linkedinController;
  late TextEditingController _dobController;
  late TextEditingController _mobileController;
  String _gender = 'Male';'''
)

# 2. Init controllers
content = content.replace(
'''    _linkedinController =
        TextEditingController(text: _currentData?['profile']?['linkedin']);''',
'''    _linkedinController =
        TextEditingController(text: _currentData?['profile']?['linkedin']);
    _dobController = TextEditingController(text: _currentData?['dob']);
    _mobileController = TextEditingController(text: _currentData?['mobile']);
    _gender = _currentData?['gender'] ?? 'Male';'''
)

# 3. Pass to PersonalInfoSection
content = content.replace(
'''        return PersonalInfoSection(
          nameController: _nameController,
          countryController: _countryController,
          bioController: _bioController,
          linkedinController: _linkedinController,
        ).animate().fadeIn();''',
'''        return PersonalInfoSection(
          nameController: _nameController,
          countryController: _countryController,
          bioController: _bioController,
          linkedinController: _linkedinController,
          dobController: _dobController,
          mobileController: _mobileController,
          gender: _gender,
          onGenderChanged: (val) => setState(() => _gender = val),
        ).animate().fadeIn();'''
)

# 4. _saveGlobal data
content = content.replace(
'''      final Map<String, dynamic> data = {
        'name': _nameController.text,
        'country': _countryController.text,
        'profile': {
          'bio': _bioController.text,
          'linkedin': _linkedinController.text,
        }
      };''',
'''      final Map<String, dynamic> data = {
        'name': _nameController.text,
        'country': _countryController.text,
        'dob': _dobController.text,
        'mobile': _mobileController.text,
        'gender': _gender,
        'profile': {
          'bio': _bioController.text,
          'linkedin': _linkedinController.text,
        }
      };'''
)

with open('lib/features/dashboard/edit_profile_screen.dart', 'w') as f:
    f.write(content)


with open('lib/features/dashboard/widgets/profile_edit/personal_info_section.dart', 'r') as f:
    p_content = f.read()

p_content = p_content.replace(
'''  final TextEditingController linkedinController;''',
'''  final TextEditingController linkedinController;
  final TextEditingController dobController;
  final TextEditingController mobileController;
  final String gender;
  final Function(String) onGenderChanged;'''
)

p_content = p_content.replace(
'''    required this.linkedinController,
  });''',
'''    required this.linkedinController,
    required this.dobController,
    required this.mobileController,
    required this.gender,
    required this.onGenderChanged,
  });'''
)

p_content = p_content.replace(
'''        _inputLabel('LEGAL FULL NAME'),
        _textField(nameController, 'Your display name', Icons.person_outline),
        const SizedBox(height: 24),
        _inputLabel('BASE RESIDENCY'),''',
'''        _inputLabel('LEGAL FULL NAME'),
        _textField(nameController, 'Your display name', Icons.person_outline),
        const SizedBox(height: 24),
        _inputLabel('MOBILE NUMBER'),
        _textField(mobileController, 'e.g. +91 9999999999', Icons.phone_android_rounded),
        const SizedBox(height: 24),
        _inputLabel('DATE OF BIRTH'),
        _textField(dobController, 'YYYY-MM-DD', Icons.calendar_today_rounded),
        const SizedBox(height: 24),
        _inputLabel('GENDER'),
        _genderDropdown(gender, onGenderChanged),
        const SizedBox(height: 24),
        _inputLabel('BASE RESIDENCY'),'''
)

gender_dropdown_code = '''
  Widget _genderDropdown(String value, Function(String) onChanged) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderLight),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.01), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: ['Male', 'Female', 'Other'].contains(value) ? value : 'Male',
          isExpanded: true,
          icon: const Icon(Icons.arrow_drop_down, color: AppTheme.gold),
          items: ['Male', 'Female', 'Other'].map((String val) {
            return DropdownMenuItem<String>(
              value: val,
              child: Text(val, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textPrimary)),
            );
          }).toList(),
          onChanged: (val) {
            if (val != null) onChanged(val);
          },
        ),
      ),
    );
  }
}'''

p_content = p_content.replace('}\n', gender_dropdown_code)
# Need to make sure we don't accidentally replace all '}'
# We will use regex to append to the end.

with open('lib/features/dashboard/widgets/profile_edit/personal_info_section.dart', 'w') as f:
    f.write(p_content)
