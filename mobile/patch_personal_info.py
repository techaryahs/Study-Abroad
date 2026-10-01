with open('lib/features/dashboard/widgets/profile_edit/personal_info_section.dart', 'r') as f:
    content = f.read()

content = content.replace(
'''  final TextEditingController linkedinController;

  const PersonalInfoSection({
    super.key,
    required this.nameController,
    required this.countryController,
    required this.bioController,
    required this.linkedinController,
  });''',
'''  final TextEditingController linkedinController;
  final TextEditingController dobController;
  final TextEditingController mobileController;
  final String gender;
  final Function(String) onGenderChanged;

  const PersonalInfoSection({
    super.key,
    required this.nameController,
    required this.countryController,
    required this.bioController,
    required this.linkedinController,
    required this.dobController,
    required this.mobileController,
    required this.gender,
    required this.onGenderChanged,
  });'''
)

content = content.replace(
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

gender_dropdown = '''
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
'''

# append right before the last closing brace
content = content.rstrip()
if content.endswith('}'):
    content = content[:-1] + gender_dropdown + '\n}'

with open('lib/features/dashboard/widgets/profile_edit/personal_info_section.dart', 'w') as f:
    f.write(content)
