import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';
import 'package:dio/dio.dart';
import '../auth/auth_provider.dart';
import 'widgets/profile_edit/education_details_section.dart';
import 'widgets/profile_edit/personal_info_section.dart';
import 'widgets/profile_edit/career_experience_section.dart';
import 'widgets/profile_edit/academic_extras_section.dart';
import 'widgets/profile_edit/target_strategy_section.dart';

class EditProfileScreen extends StatefulWidget {
  final Map<String, dynamic> userData;
  const EditProfileScreen({super.key, required this.userData});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  late TextEditingController _nameController;
  late TextEditingController _countryController;
  late TextEditingController _bioController;
  late TextEditingController _linkedinController;
  late TextEditingController _dobController;
  late TextEditingController _mobileController;
  String _gender = 'Male';

  Map<String, dynamic>? _currentData;
  File? _imageFile;
  bool _saving = false;
  final _picker = ImagePicker();

  String _activeTab = 'PERSONAL';
  final List<String> _tabs = [
    'PERSONAL',
    'EDUCATION',
    'CAREER',
    'ACADEMIC',
    'STRATEGY'
  ];

  @override
  void initState() {
    super.initState();
    _currentData = widget.userData;
    _nameController = TextEditingController(text: _currentData?['name']);
    _countryController = TextEditingController(text: _currentData?['country']);
    _bioController =
        TextEditingController(text: _currentData?['profile']?['bio']);
    _linkedinController =
        TextEditingController(text: _currentData?['profile']?['linkedin']);
    _dobController = TextEditingController(text: _currentData?['dob']);
    _mobileController = TextEditingController(text: _currentData?['mobile']);
    _gender = _currentData?['gender'] ?? 'Male';
  }

  Future<void> _fetchFreshData() async {
    try {
      final res = await ApiClient.instance
          .get('/api/user/profile/${_currentData!['_id']}');
      if (mounted) {
        setState(() => _currentData = res.data);
      }
    } catch (_) {}
  }

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 20,
      maxWidth: 800,
      maxHeight: 800,
    );
    if (pickedFile != null) {
      setState(() => _imageFile = File(pickedFile.path));
    }
  }

  Future<void> _saveGlobal() async {
    FocusManager.instance.primaryFocus?.unfocus();
    setState(() => _saving = true);
    try {
      final Map<String, dynamic> data = {
        'name': _nameController.text,
        'country': _countryController.text,
        'dob': _dobController.text,
        'mobile': _mobileController.text,
        'gender': _gender,
        'profile': {
          'bio': _bioController.text,
          'linkedin': _linkedinController.text,
        }
      };

      dynamic payload = data;

      // If image selected, switch to FormData
      if (_imageFile != null) {
        payload = FormData.fromMap({
          ...data,
          'profileImage': await MultipartFile.fromFile(_imageFile!.path,
              filename: 'profile.jpg'),
        });
      }

      await ApiClient.instance
          .put('/api/user/profile/${_currentData!['_id']}', data: payload);
      if (mounted) {
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        String msg = 'Failed to update profile. Please try again.';
        if (e is DioException && e.response?.data != null) {
          msg = e.response?.data['message'] ?? e.response?.data['error'] ?? msg;
        } else if (e is DioException && e.type != DioExceptionType.badResponse) {
          msg = 'Unable to connect. Please check your internet connection.';
        }
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(msg), backgroundColor: Colors.red));
      }
    } finally {
      if (mounted) {
        setState(() => _saving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('EDIT PROFILE',
            style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w900,
                letterSpacing: 2,
                fontFamily: 'Playfair Display')),
        backgroundColor: Colors.white,
        foregroundColor: AppTheme.textPrimary,
        elevation: 0,
        centerTitle: true,
      ),
      body: Column(
        children: [
          Container(
            height: 60,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: const BoxDecoration(
                border:
                    Border(bottom: BorderSide(color: AppTheme.borderLight))),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _tabs.length,
              itemBuilder: (context, i) {
                final active = _activeTab == _tabs[i];
                return GestureDetector(
                  onTap: () {
                    FocusManager.instance.primaryFocus?.unfocus();
                    setState(() => _activeTab = _tabs[i]);
                  },
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                        border: active
                            ? const Border(
                                bottom:
                                    BorderSide(color: AppTheme.gold, width: 3))
                            : null),
                    child: Text(_tabs[i],
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2,
                            color: active
                                ? AppTheme.textPrimary
                                : AppTheme.textMuted)),
                  ),
                );
              },
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(28),
              child: _buildActiveSection(),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.only(
            left: 24,
            right: 24,
            top: 20,
            bottom: MediaQuery.of(context).padding.bottom + 20),
        decoration: const BoxDecoration(
            color: Colors.white,
            border: Border(top: BorderSide(color: AppTheme.borderLight))),
        child: SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton(
            onPressed: _saving ? null : _saveGlobal,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.darkBrown,
              foregroundColor: AppTheme.gold,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
            ),
            child: _saving
                ? const CircularProgressIndicator(color: AppTheme.gold)
                : const Text('SAVE GLOBAL CHANGES',
                    style: TextStyle(
                        fontWeight: FontWeight.w900, letterSpacing: 2)),
          ),
        ),
      ),
    );
  }

  Widget _buildActiveSection() {
    switch (_activeTab) {
      case 'PERSONAL':
        return Column(
          children: [
            // Profile Image Editor
            Center(
              child: Stack(
                children: [
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppTheme.gold, width: 2),
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black.withValues(alpha: 0.1),
                            blurRadius: 20)
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(60),
                      child: _imageFile != null
                          ? Image.file(_imageFile!, fit: BoxFit.cover)
                          : (_currentData?['profile']?['profileImage'] != null
                              ? Image.network(
                                  _currentData!['profile']['profileImage'],
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) =>
                                      const Icon(Icons.person, size: 60))
                              : const Icon(Icons.person, size: 60)),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: GestureDetector(
                      onTap: _pickImage,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                            color: AppTheme.gold, shape: BoxShape.circle),
                        child: const Icon(Icons.camera_alt_rounded,
                            color: Colors.white, size: 18),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 40),
            PersonalInfoSection(
              nameController: _nameController,
              countryController: _countryController,
              bioController: _bioController,
              linkedinController: _linkedinController,
              dobController: _dobController,
              mobileController: _mobileController,
              gender: _gender,
              onGenderChanged: (val) => setState(() => _gender = val),
            ),
            const SizedBox(height: 28),
            // Change Password Button
            Container(
              decoration: BoxDecoration(
                color: AppTheme.darkBrown,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                    color: AppTheme.gold.withValues(alpha: 0.3), width: 1),
              ),
              child: ListTile(
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppTheme.gold.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.lock_outline,
                      color: AppTheme.gold, size: 20),
                ),
                title: const Text('Change Password',
                    style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.5,
                        color: Colors.white)),
                subtitle: const Text('Update your security credentials',
                    style: TextStyle(fontSize: 14, color: Colors.white70)),
                trailing: const Icon(Icons.chevron_right, color: AppTheme.gold),
                onTap: () => _showChangePasswordModal(),
              ),
            ),
          ],
        ).animate().fadeIn();
      case 'EDUCATION':
        return EducationDetailsSection(
          userData: _currentData!,
          onAddItem: (section, item) =>
              _showItemModal(section, existingItem: item),
        ).animate().fadeIn();
      case 'CAREER':
        return CareerExperienceSection(
          userData: _currentData!,
          onAddItem: (section, item) =>
              _showItemModal(section, existingItem: item),
        ).animate().fadeIn();
      case 'ACADEMIC':
        return AcademicExtrasSection(
          userData: _currentData!,
          onAddItem: (section, item) =>
              _showItemModal(section, existingItem: item),
        ).animate().fadeIn();
      case 'STRATEGY':
        return TargetStrategySection(
          userData: _currentData!,
          onAddItem: (section, item) =>
              _showItemModal(section, existingItem: item),
        ).animate().fadeIn();
      default:
        return Container();
    }
  }

  Future<void> _showItemModal(String section,
      {Map<String, dynamic>? existingItem}) async {
    FocusManager.instance.primaryFocus?.unfocus();
    final userId = _currentData?['_id']?.toString();
    final fields = _getFieldsForSection(section);

    if (userId == null || userId.isEmpty) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Unable to edit profile right now.')),
        );
      }
      return;
    }

    final saved = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) {
        return ProfileItemFormSheet(
          userId: userId,
          section: section,
          fields: fields,
          existingItem: existingItem,
        );
      },
    );

    if (saved == true && mounted) {
      await _fetchFreshData();
    }
  }

  List<Map<String, String>> _getFieldsForSection(String section) {
    if (section == 'highSchool') {
      return [
        {'key': 'schoolName', 'label': 'School Name', 'hint': "e.g. St. Xavier's"},
        {'key': 'board', 'label': 'Board / Curriculum', 'hint': 'e.g. CBSE / IB / ICSE'},
        {'key': 'passingYear', 'label': 'Passing Year', 'hint': 'e.g. 2024'},
        {
          'key': 'cgpa',
          'label': 'Score / Percentage',
          'hint': 'e.g. 9.5 or 95'
        },
        {'key': 'outOf', 'label': 'Out Of', 'hint': 'e.g. 10.0 or 100'}
      ];
    }
    if (section == 'underGrad' || section == 'masters') {
      return [
        {'key': 'uniName', 'label': 'University Name', 'hint': 'e.g. IIT Bombay'},
        {'key': 'degreeName', 'label': 'Degree Title', 'hint': 'e.g. Bachelor of Science'},
        {'key': 'major', 'label': 'Major / Specialization', 'hint': 'e.g. Computer Science'},
        {'key': 'startYear', 'label': 'Start Year', 'hint': 'e.g. 2020'},
        {'key': 'endYear', 'label': 'End Year', 'hint': 'e.g. 2024'},
        {
          'key': 'cgpa',
          'label': 'Score / Percentage',
          'hint': 'e.g. 9.0 or 95'
        },
        {'key': 'outOf', 'label': 'Out Of', 'hint': 'e.g. 10.0 or 100'},
        {'key': 'backlogs', 'label': 'Backlogs', 'hint': 'e.g. 0'}
      ];
    }
    if (section == 'workExperience') {
      return [
        {'key': 'role', 'label': 'Job Role', 'hint': 'e.g. Software Engineer'},
        {
          'key': 'organization',
          'label': 'Organization',
          'hint': 'e.g. Google / Microsoft'
        },
        {'key': 'type', 'label': 'Work Type', 'hint': 'Full-time / Internship'},
        {'key': 'startDate', 'label': 'Start Date', 'hint': 'YYYY-MM-DD'},
        {
          'key': 'endDate',
          'label': 'End Date',
          'hint': 'YYYY-MM-DD (leave empty if ongoing)'
        },
        {'key': 'country', 'label': 'Country', 'hint': 'e.g. India'},
        {
          'key': 'description',
          'label': 'Description',
          'hint': 'What were your impact areas?'
        }
      ];
    }
    if (section == 'projects') {
      return [
        {'key': 'title', 'label': 'Title', 'hint': 'Project Name'},
        {'key': 'category', 'label': 'Category', 'hint': 'Tech Stack'},
        {
          'key': 'description',
          'label': 'Description',
          'hint': 'Details about the project'
        },
        {'key': 'startDate', 'label': 'Start Date', 'hint': 'YYYY-MM-DD'}
      ];
    }
    if (section == 'research') {
      return [
        {'key': 'title', 'label': 'Title', 'hint': 'Paper Title'},
        {
          'key': 'publisher',
          'label': 'Publisher',
          'hint': 'Conference/Journal'
        },
        {'key': 'date', 'label': 'Publication Date', 'hint': 'YYYY-MM-DD'}
      ];
    }
    if (section == 'volunteering') {
      return [
        {'key': 'organization', 'label': 'Org', 'hint': 'Name'},
        {'key': 'role', 'label': 'Role', 'hint': 'Volunteer'},
        {'key': 'startDate', 'label': 'Start Date', 'hint': 'YYYY-MM-DD'},
        {'key': 'endDate', 'label': 'End Date', 'hint': 'YYYY-MM-DD'}
      ];
    }
    if (section == 'testScores') {
      return [
        {'key': 'testType', 'label': 'Test', 'hint': 'GRE/IELTS/GMAT/TOEFL'},
        {'key': 'score', 'label': 'Overall Score', 'hint': 'e.g. 320 or 8.0'},
        {'key': 'date', 'label': 'Test Date', 'hint': 'YYYY-MM-DD'}
      ];
    }
    if (section == 'targetUniversities') {
      return [
        {'key': 'uniName', 'label': 'University Name', 'hint': 'e.g. Stanford University'},
        {'key': 'degree', 'label': 'Target Degree', 'hint': 'e.g. MS / PhD / Bachelor'},
        {'key': 'major', 'label': 'Target Major', 'hint': 'e.g. Computer Science'},
        {'key': 'targetCountry', 'label': 'Target Country', 'hint': 'e.g. United States, UK'},
        {'key': 'term', 'label': 'Intake Term', 'hint': 'e.g. Fall / Spring'},
        {'key': 'year', 'label': 'Target Year', 'hint': 'e.g. 2026'},
        {'key': 'tuitionBudget', 'label': 'Annual Budget', 'hint': 'e.g. \$30,000 - \$50,000 / year'},
        {'key': 'scholarshipRequired', 'label': 'Scholarship Required', 'hint': 'e.g. Yes - Full / Partial / No'}
      ];
    }
    return [
      {'key': 'title', 'label': 'Title', 'hint': 'Enter detail'}
    ];
  }

  Future<void> _showChangePasswordModal() async {
    FocusManager.instance.primaryFocus?.unfocus();

    final currentPasswordController = TextEditingController();
    final newPasswordController = TextEditingController();
    final confirmPasswordController = TextEditingController();

    bool showCurrentPassword = false;
    bool showNewPassword = false;
    bool showConfirmPassword = false;
    bool isLoading = false;
    String errorMessage = '';
    String successMessage = '';

    try {
      await showModalBottomSheet<void>(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (context) => StatefulBuilder(
          builder: (context, setModalState) => Container(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom + 40,
              left: 28,
              right: 28,
              top: 32,
            ),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(36)),
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Change Password',
                      style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.5,
                          color: AppTheme.textPrimary)),
                  const SizedBox(height: 8),
                  const Text('Update your password for better security',
                      style: TextStyle(
                          fontSize: 13,
                          color: AppTheme.textMuted,
                          fontWeight: FontWeight.w500)),
                  const SizedBox(height: 28),

                  // Current Password
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Current Password',
                          style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1,
                              color: AppTheme.textPrimary)),
                      const SizedBox(height: 8),
                      TextField(
                        controller: currentPasswordController,
                        obscureText: !showCurrentPassword,
                        style: const TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 13),
                        decoration: InputDecoration(
                          hintText: 'Enter current password',
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 14),
                          border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                  color: AppTheme.borderLight)),
                          enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                  color: AppTheme.borderLight)),
                          focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                  color: AppTheme.gold, width: 1.5)),
                          suffixIcon: GestureDetector(
                            onTap: () => setModalState(() =>
                                showCurrentPassword = !showCurrentPassword),
                            child: Icon(
                                showCurrentPassword
                                    ? Icons.visibility_outlined
                                    : Icons.visibility_off_outlined,
                                color: AppTheme.gold,
                                size: 18),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // New Password
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('New Password',
                          style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1,
                              color: AppTheme.textPrimary)),
                      const SizedBox(height: 8),
                      TextField(
                        controller: newPasswordController,
                        obscureText: !showNewPassword,
                        style: const TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 13),
                        decoration: InputDecoration(
                          hintText:
                              'Min 8 chars, uppercase, lowercase & numbers',
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 14),
                          border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                  color: AppTheme.borderLight)),
                          enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                  color: AppTheme.borderLight)),
                          focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                  color: AppTheme.gold, width: 1.5)),
                          suffixIcon: GestureDetector(
                            onTap: () => setModalState(
                                () => showNewPassword = !showNewPassword),
                            child: Icon(
                                showNewPassword
                                    ? Icons.visibility_outlined
                                    : Icons.visibility_off_outlined,
                                color: AppTheme.gold,
                                size: 18),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Confirm Password
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Confirm New Password',
                          style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1,
                              color: AppTheme.textPrimary)),
                      const SizedBox(height: 8),
                      TextField(
                        controller: confirmPasswordController,
                        obscureText: !showConfirmPassword,
                        style: const TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 13),
                        decoration: InputDecoration(
                          hintText: 'Confirm your new password',
                          contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 14),
                          border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                  color: AppTheme.borderLight)),
                          enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                  color: AppTheme.borderLight)),
                          focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(
                                  color: AppTheme.gold, width: 1.5)),
                          suffixIcon: GestureDetector(
                            onTap: () => setModalState(() =>
                                showConfirmPassword = !showConfirmPassword),
                            child: Icon(
                                showConfirmPassword
                                    ? Icons.visibility_outlined
                                    : Icons.visibility_off_outlined,
                                color: AppTheme.gold,
                                size: 18),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Requirements
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFAF7F2),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppTheme.borderLight),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Requirements:',
                            style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 0.5,
                                color: AppTheme.textPrimary)),
                        const SizedBox(height: 6),
                        _buildRequirementItem('At least 8 characters',
                            newPasswordController.text.length >= 8),
                        _buildRequirementItem(
                            'Uppercase letter',
                            newPasswordController.text
                                .contains(RegExp(r'[A-Z]'))),
                        _buildRequirementItem(
                            'Lowercase letter',
                            newPasswordController.text
                                .contains(RegExp(r'[a-z]'))),
                        _buildRequirementItem(
                            'Number',
                            newPasswordController.text
                                .contains(RegExp(r'[0-9]'))),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Error/Success Messages
                  if (errorMessage.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.red.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                            color: Colors.red.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline,
                              color: Colors.red, size: 16),
                          const SizedBox(width: 8),
                          Expanded(
                              child: Text(errorMessage,
                                  style: const TextStyle(
                                      fontSize: 14,
                                      color: Colors.red,
                                      fontWeight: FontWeight.w600))),
                        ],
                      ),
                    ),
                  if (successMessage.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.green.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                            color: Colors.green.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.check_circle_outline,
                              color: Colors.green, size: 16),
                          const SizedBox(width: 8),
                          Expanded(
                              child: Text(successMessage,
                                  style: const TextStyle(
                                      fontSize: 14,
                                      color: Colors.green,
                                      fontWeight: FontWeight.w600))),
                        ],
                      ),
                    ),
                  const SizedBox(height: 24),

                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed:
                              isLoading ? null : () => Navigator.pop(context),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            side: const BorderSide(color: AppTheme.borderLight),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                          ),
                          child: const Text('Cancel',
                              style: TextStyle(
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 1,
                                  fontSize: 13,
                                  color: AppTheme.textPrimary)),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: isLoading
                              ? null
                              : () {
                                  setModalState(() => isLoading = true);
                                  _submitChangePassword(
                                    context,
                                    currentPasswordController.text,
                                    newPasswordController.text,
                                    confirmPasswordController.text,
                                    setModalState,
                                    (message, type) {
                                      setModalState(() {
                                        isLoading = false;
                                        if (type == 'error') {
                                          errorMessage = message;
                                          successMessage = '';
                                        } else {
                                          successMessage = message;
                                          errorMessage = '';
                                        }
                                      });
                                    },
                                  );
                                },
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            backgroundColor: AppTheme.darkBrown,
                            foregroundColor: AppTheme.gold,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                          ),
                          child: isLoading
                              ? const SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation(
                                          AppTheme.gold)))
                              : const Text('Update Password',
                                  style: TextStyle(
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: 1,
                                      fontSize: 13)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    } finally {
      currentPasswordController.dispose();
      newPasswordController.dispose();
      confirmPasswordController.dispose();
    }
  }

  Widget _buildRequirementItem(String text, bool isValid) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          Icon(isValid ? Icons.check_circle : Icons.radio_button_unchecked,
              size: 12, color: isValid ? Colors.green : AppTheme.textMuted),
          const SizedBox(width: 6),
          Text(text,
              style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: isValid ? Colors.green : AppTheme.textMuted)),
        ],
      ),
    );
  }

  Future<void> _submitChangePassword(
    BuildContext context,
    String currentPassword,
    String newPassword,
    String confirmPassword,
    StateSetter setModalState,
    Function(String message, String type) onResult,
  ) async {
    // Validation
    if (currentPassword.isEmpty ||
        newPassword.isEmpty ||
        confirmPassword.isEmpty) {
      onResult('All fields are required', 'error');
      return;
    }

    if (newPassword != confirmPassword) {
      onResult('New passwords do not match', 'error');
      return;
    }

    final passwordRegex = RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$');
    if (!passwordRegex.hasMatch(newPassword)) {
      onResult('Password must be 8+ chars with uppercase, lowercase & numbers',
          'error');
      return;
    }

    try {
      final token = await _getToken();
      if (token == null) {
        onResult('Authentication error. Please login again', 'error');
        return;
      }

      final response = await ApiClient.instance.post(
        '/api/user/change-password',
        data: {
          'currentPassword': currentPassword,
          'newPassword': newPassword,
          'confirmPassword': confirmPassword,
        },
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );

      if (response.statusCode == 200) {
        if (!context.mounted) {
          return;
        }
        final authProvider = context.read<AuthProvider>();
        final navigator = Navigator.of(context);

        onResult(
            'Password changed successfully! Logging you out...', 'success');
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted) {
            authProvider.logout();
            navigator.pushNamedAndRemoveUntil('/login', (route) => false);
          }
        });
      }
    } catch (e) {
      String errorMsg = 'Failed to change password';
      if (e is DioException && e.response?.data['message'] != null) {
        errorMsg = e.response?.data['message'];
      } else if (e is DioException) {
        errorMsg = e.message ?? 'Network error occurred';
      }
      onResult(errorMsg, 'error');
    }
  }

  Future<String?> _getToken() async {
    // Get token from secure storage or shared preferences
    // This depends on how your app stores tokens
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      return authProvider.token; // Adjust based on your auth implementation
    } catch (e) {
      return null;
    }
  }
}

class ProfileItemFormSheet extends StatefulWidget {
  final String userId;
  final String section;
  final List<Map<String, String>> fields;
  final Map<String, dynamic>? existingItem;

  const ProfileItemFormSheet({
    required this.userId,
    required this.section,
    required this.fields,
    this.existingItem,
  });

  @override
  State<ProfileItemFormSheet> createState() => ProfileItemFormSheetState();
}

class ProfileItemFormSheetState extends State<ProfileItemFormSheet> {
  late final Map<String, TextEditingController> _controllers;
  late final TextEditingController _docNameController;
  File? _docFile;
  int _currentStep = 0;
  bool _saving = false;
  String? _stepError;

  bool get _isEditing => widget.existingItem != null;

  @override
  void initState() {
    super.initState();
    _controllers = {
      for (final field in widget.fields)
        field['key']!: TextEditingController(
          text: widget.existingItem?[field['key']]?.toString(),
        ),
    };
    _docNameController = TextEditingController(
      text: widget.existingItem?['documentName']?.toString() ?? '',
    );
  }

  @override
  void dispose() {
    for (final controller in _controllers.values) {
      controller.dispose();
    }
    _docNameController.dispose();
    super.dispose();
  }

  List<List<Map<String, String>>> _getStepFields() {
    if (widget.fields.length <= 3) {
      return [widget.fields];
    }
    final mid = (widget.fields.length / 2).ceil();
    return [
      widget.fields.sublist(0, mid),
      widget.fields.sublist(mid),
    ];
  }

  int get _totalSteps => 3;

  String _getStepTitle(int step) {
    if (step == 0) return 'Step 1: Primary Details';
    if (step == 1) return 'Step 2: Timeline & Scores';
    return 'Step 3: Document & Proof';
  }

  bool _validateStep(int step) {
    setState(() => _stepError = null);
    final stepFields = _getStepFields();

    if (step == 0) {
      final firstStepList = stepFields[0];
      for (final field in firstStepList) {
        final key = field['key']!;
        final val = _controllers[key]?.text.trim() ?? '';
        // Main primary field check
        if (key == 'schoolName' || key == 'uniName' || key == 'role' || key == 'title' || key == 'organization') {
          if (val.isEmpty) {
            setState(() => _stepError = 'Please provide the ${field['label']} to proceed.');
            return false;
          }
        }
      }
    }
    return true;
  }

  Future<void> _pickDocument() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
    if (picked != null) {
      setState(() {
        _docFile = File(picked.path);
        if (_docNameController.text.trim().isEmpty) {
          _docNameController.text = picked.name;
        }
      });
    }
  }

  Future<void> _save() async {
    FocusScope.of(context).unfocus();
    setState(() => _saving = true);

    var didClose = false;
    try {
      final data = <String, dynamic>{};
      for (final field in widget.fields) {
        final fieldKey = field['key']!;
        data[fieldKey] = _controllers[fieldKey]!.text;
      }
      if (_docNameController.text.trim().isNotEmpty) {
        data['documentName'] = _docNameController.text.trim();
      }
      if (_docFile != null) {
        data['documentPath'] = _docFile!.path;
      }

      if (_isEditing) {
        await ApiClient.instance.put(
          '/api/user/profile/${widget.userId}/update-item',
          data: {
            'section': widget.section,
            'itemId': widget.existingItem!['_id'],
            'data': data,
          },
        );
      } else {
        await ApiClient.instance.post(
          '/api/user/profile/${widget.userId}/add-item',
          data: {
            'section': widget.section,
            'data': data,
          },
        );
      }

      if (!mounted) return;
      didClose = true;
      Navigator.of(context).pop(true);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error saving record: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted && !didClose) {
        setState(() => _saving = false);
      }
    }
  }

  Future<void> _deleteItem() async {
    if (!_isEditing || widget.existingItem?['_id'] == null) return;
    FocusScope.of(context).unfocus();

    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Record?'),
        content: const Text('This action will remove this entry permanently from your profile.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('CANCEL')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('DELETE', style: TextStyle(color: Colors.red))),
        ],
      ),
    );

    if (confirm != true) return;
    setState(() => _saving = true);

    try {
      await ApiClient.instance.delete(
        '/api/user/profile/${widget.userId}/delete-item',
        data: {
          'section': widget.section,
          'itemId': widget.existingItem!['_id'],
        },
      );
      if (mounted) {
        Navigator.of(context).pop(true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error deleting record: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _saving = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final stepFields = _getStepFields();

    return AnimatedPadding(
      duration: const Duration(milliseconds: 180),
      curve: Curves.easeOutCubic,
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: DraggableScrollableSheet(
        expand: false,
        initialChildSize: 0.88,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) {
          return Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(36)),
            ),
            child: SafeArea(
              top: false,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Drag handle
                  Center(
                    child: Container(
                      width: 44,
                      height: 4,
                      margin: const EdgeInsets.only(top: 12),
                      decoration: BoxDecoration(
                        color: AppTheme.borderLight,
                        borderRadius: BorderRadius.circular(999),
                      ),
                    ),
                  ),

                  // Header with Section Title & Delete Button
                  Padding(
                    padding: const EdgeInsets.fromLTRB(28, 20, 28, 12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _isEditing ? 'EDIT PROFILE ITEM' : '3-STEP WIZARD',
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w900,
                                color: AppTheme.gold,
                                letterSpacing: 1.5,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              _getStepTitle(_currentStep).toUpperCase(),
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1.2,
                                fontFamily: 'Playfair Display',
                              ),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            if (_isEditing)
                              IconButton(
                                onPressed: _saving ? null : _deleteItem,
                                icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 22),
                                tooltip: 'Delete Record',
                              ),
                            IconButton(
                              onPressed: () => Navigator.pop(context),
                              icon: const Icon(Icons.close, size: 20),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Progress Bar (3 steps)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 28),
                    child: Column(
                      children: [
                        Row(
                          children: List.generate(_totalSteps, (index) {
                            final isActive = index <= _currentStep;
                            return Expanded(
                              child: Container(
                                height: 4,
                                margin: EdgeInsets.only(right: index < _totalSteps - 1 ? 6 : 0),
                                decoration: BoxDecoration(
                                  color: isActive ? AppTheme.gold : AppTheme.borderLight.withValues(alpha: 0.5),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              ),
                            );
                          }),
                        ),
                        const SizedBox(height: 16),
                      ],
                    ),
                  ),

                  if (_stepError != null)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 4),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: Colors.red.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.red.withValues(alpha: 0.3)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline, color: Colors.red, size: 16),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _stepError!,
                                style: const TextStyle(color: Colors.red, fontSize: 12, fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                  // Step Content List
                  Expanded(
                    child: Scrollbar(
                      controller: scrollController,
                      child: SingleChildScrollView(
                        controller: scrollController,
                        physics: const BouncingScrollPhysics(),
                        padding: const EdgeInsets.fromLTRB(28, 8, 28, 24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (_currentStep == 0) ...[
                              ...stepFields[0].map((field) => _buildFieldInput(field)),
                            ] else if (_currentStep == 1) ...[
                              if (stepFields.length > 1)
                                ...stepFields[1].map((field) => _buildFieldInput(field))
                              else
                                const Padding(
                                  padding: EdgeInsets.symmetric(vertical: 20),
                                  child: Text('Review your details above or proceed to add supporting documents.'),
                                ),
                            ] else ...[
                              // Step 3: Document Attachment & Summary Review
                              const Text(
                                'SUPPORTING DOCUMENTATION',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 1.5,
                                  color: AppTheme.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 6),
                              const Text(
                                'Attach a transcript, marksheet, certificate, or letter for verification.',
                                style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                              ),
                              const SizedBox(height: 16),

                              GestureDetector(
                                onTap: _pickDocument,
                                child: Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(20),
                                  decoration: BoxDecoration(
                                    color: AppTheme.background,
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: AppTheme.gold.withValues(alpha: 0.4), style: BorderStyle.solid),
                                  ),
                                  child: Column(
                                    children: [
                                      if (_docFile != null) ...[
                                        ClipRRect(
                                          borderRadius: BorderRadius.circular(12),
                                          child: Image.file(_docFile!, height: 120, width: double.infinity, fit: BoxFit.cover),
                                        ),
                                        const SizedBox(height: 12),
                                        Text(
                                          'Selected: ${_docNameController.text}',
                                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ] else ...[
                                        const Icon(Icons.cloud_upload_outlined, color: AppTheme.gold, size: 36),
                                        const SizedBox(height: 8),
                                        const Text('Tap to pick document/certificate image', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
                                        const SizedBox(height: 4),
                                        const Text('JPG, PNG supported', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                                      ],
                                    ],
                                  ),
                                ),
                              ),

                              const SizedBox(height: 20),

                              TextField(
                                controller: _docNameController,
                                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                                decoration: InputDecoration(
                                  labelText: 'Document Title / Type',
                                  hintText: 'e.g. 12th Marksheet / Degree Certificate',
                                  filled: true,
                                  fillColor: AppTheme.background,
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(16),
                                    borderSide: BorderSide.none,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ),

                  // Bottom Navigation Controls (Previous / Next / Save)
                  Container(
                    padding: const EdgeInsets.fromLTRB(28, 12, 28, 28),
                    decoration: const BoxDecoration(
                      border: Border(top: BorderSide(color: AppTheme.borderLight)),
                    ),
                    child: Row(
                      children: [
                        if (_currentStep > 0)
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(right: 12),
                              child: SizedBox(
                                height: 52,
                                child: OutlinedButton(
                                  onPressed: _saving ? null : () => setState(() => _currentStep--),
                                  style: OutlinedButton.styleFrom(
                                    side: const BorderSide(color: AppTheme.borderLight),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                  ),
                                  child: const Text('BACK', style: TextStyle(fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: 1.2)),
                                ),
                              ),
                            ),
                          ),
                        Expanded(
                          flex: 2,
                          child: SizedBox(
                            height: 52,
                            child: ElevatedButton(
                              onPressed: _saving
                                  ? null
                                  : () {
                                      if (_currentStep < _totalSteps - 1) {
                                        if (_validateStep(_currentStep)) {
                                          setState(() => _currentStep++);
                                        }
                                      } else {
                                        _save();
                                      }
                                    },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.darkBrown,
                                foregroundColor: AppTheme.gold,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                              ),
                              child: _saving
                                  ? const CircularProgressIndicator(color: AppTheme.gold)
                                  : Text(
                                      _currentStep < _totalSteps - 1 ? 'NEXT STEP' : (_isEditing ? 'UPDATE RECORD' : 'SAVE & FINISH'),
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 1.5,
                                      ),
                                    ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildFieldInput(Map<String, String> field) {
    final fieldKey = field['key']!;
    final isDescription = fieldKey == 'description';

    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            field['label']!.toUpperCase(),
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w900,
              color: AppTheme.textSecondary,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _controllers[fieldKey],
            minLines: isDescription ? 3 : 1,
            maxLines: isDescription ? 5 : 1,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
            ),
            decoration: InputDecoration(
              hintText: field['hint'],
              filled: true,
              fillColor: AppTheme.background,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
