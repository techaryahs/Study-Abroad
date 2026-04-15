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
  
  Map<String, dynamic>? _currentData;
  File? _imageFile;
  bool _saving = false;
  final _picker = ImagePicker();
  
  String _activeTab = 'PERSONAL';
  final List<String> _tabs = ['PERSONAL', 'EDUCATION', 'CAREER', 'ACADEMIC', 'STRATEGY'];

  @override
  void initState() {
    super.initState();
    _currentData = widget.userData;
    _nameController = TextEditingController(text: _currentData?['name']);
    _countryController = TextEditingController(text: _currentData?['country']);
    _bioController = TextEditingController(text: _currentData?['profile']?['bio']);
    _linkedinController = TextEditingController(text: _currentData?['profile']?['linkedin']);
  }

  Future<void> _fetchFreshData() async {
    try {
      final res = await ApiClient.instance.get('/api/user/profile/${_currentData!['_id']}');
      if (mounted) setState(() => _currentData = res.data);
    } catch (_) {}
  }

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 70);
    if (pickedFile != null) setState(() => _imageFile = File(pickedFile.path));
  }

  Future<void> _saveGlobal() async {
    setState(() => _saving = true);
    try {
      final Map<String, dynamic> data = {
        'name': _nameController.text,
        'country': _countryController.text,
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
          'profileImage': await MultipartFile.fromFile(_imageFile!.path, filename: 'profile.jpg'),
        });
      }

      await ApiClient.instance.put('/api/user/profile/${_currentData!['_id']}', data: payload);
      if (mounted) Navigator.pop(context, true);
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('EDIT PROFILE', 
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, letterSpacing: 2, fontFamily: 'Playfair Display')),
        backgroundColor: Colors.white,
        foregroundColor: AppTheme.textPrimary,
        elevation: 0, centerTitle: true,
      ),
      body: Column(
        children: [
          Container(
            height: 60,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: AppTheme.borderLight))),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _tabs.length,
              itemBuilder: (context, i) {
                final active = _activeTab == _tabs[i];
                return GestureDetector(
                  onTap: () => setState(() => _activeTab = _tabs[i]),
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(border: active ? const Border(bottom: BorderSide(color: AppTheme.gold, width: 3)) : null),
                    child: Text(_tabs[i], style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 2, color: active ? AppTheme.textPrimary : AppTheme.textMuted)),
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
        padding: EdgeInsets.only(left: 24, right: 24, top: 20, bottom: MediaQuery.of(context).padding.bottom + 20),
        decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: AppTheme.borderLight))),
        child: SizedBox(
            width: double.infinity, height: 56,
            child: ElevatedButton(
              onPressed: _saving ? null : _saveGlobal,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.darkBrown,
                foregroundColor: AppTheme.gold,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: _saving 
                ? const CircularProgressIndicator(color: AppTheme.gold)
                : const Text('SAVE GLOBAL CHANGES', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 2)),
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
                    width: 120, height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppTheme.gold, width: 2),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 20)],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(60),
                      child: _imageFile != null 
                        ? Image.file(_imageFile!, fit: BoxFit.cover)
                        : (_currentData?['profile']?['profileImage'] != null
                            ? Image.network(_currentData!['profile']['profileImage'], fit: BoxFit.cover, errorBuilder: (_, __, ___) => const Icon(Icons.person, size: 60))
                            : const Icon(Icons.person, size: 60)),
                    ),
                  ),
                  Positioned(
                    bottom: 0, right: 0,
                    child: GestureDetector(
                      onTap: _pickImage,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(color: AppTheme.gold, shape: BoxShape.circle),
                        child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 18),
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
            ),
          ],
        ).animate().fadeIn();
      case 'EDUCATION':
        return EducationDetailsSection(
          userData: _currentData!,
          onAddItem: (section, item) => _showItemModal(section, existingItem: item),
        ).animate().fadeIn();
      case 'CAREER':
        return CareerExperienceSection(
          userData: _currentData!,
          onAddItem: (section, item) => _showItemModal(section, existingItem: item),
        ).animate().fadeIn();
      case 'ACADEMIC':
        return AcademicExtrasSection(
          userData: _currentData!,
          onAddItem: (section, item) => _showItemModal(section, existingItem: item),
        ).animate().fadeIn();
      case 'STRATEGY':
        return TargetStrategySection(
          userData: _currentData!,
          onAddItem: (section, item) => _showItemModal(section, existingItem: item),
        ).animate().fadeIn();
      default:
        return Container();
    }
  }

  void _showItemModal(String section, {Map<String, dynamic>? existingItem}) {
    final controllers = <String, TextEditingController>{};
    final fields = _getFieldsForSection(section);
    
    for (var f in fields) {
      controllers[f['key']!] = TextEditingController(text: existingItem?[f['key']]?.toString());
    }

    bool savingModal = false;
    final isEditing = existingItem != null;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom + 40, left: 28, right: 28, top: 32),
          decoration: const BoxDecoration(color: Colors.white, borderRadius: BorderRadius.vertical(top: Radius.circular(36))),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(isEditing ? 'UPDATE RECORD' : 'ADD NEW RECORD', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: 1.5, fontFamily: 'Playfair Display')),
              const SizedBox(height: 24),
              ...fields.map((f) => Padding(
                padding: const EdgeInsets.only(bottom: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(f['label']!.toUpperCase(), style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 2)),
                    const SizedBox(height: 10),
                    TextField(
                      controller: controllers[f['key']],
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                      decoration: InputDecoration(hintText: f['hint'], filled: true, fillColor: AppTheme.background, border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none)),
                    ),
                  ],
                ),
              )).toList(),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: savingModal ? null : () async {
                    setModalState(() => savingModal = true);
                    try {
                      final data = <String, dynamic>{};
                      for (var f in fields) data[f['key']!] = controllers[f['key']]!.text;

                      if (isEditing) {
                        await ApiClient.instance.put('/api/user/profile/${_currentData!['_id']}/update-item', data: {
                          'section': section,
                          'itemId': existingItem['_id'],
                          'data': data,
                        });
                      } else {
                        await ApiClient.instance.post('/api/user/profile/${_currentData!['_id']}/add-item', data: {
                          'section': section,
                          'data': data,
                        });
                      }
                      
                      if (context.mounted) {
                        Navigator.pop(context);
                        _fetchFreshData();
                      }
                    } catch (e) {
                      if (context.mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
                    } finally {
                      if (context.mounted) setModalState(() => savingModal = false);
                    }
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.darkBrown, foregroundColor: AppTheme.gold, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                  child: savingModal ? const CircularProgressIndicator(color: AppTheme.gold) : Text(isEditing ? 'UPDATE ITEM' : 'SAVE RECORD', style: const TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<Map<String, String>> _getFieldsForSection(String section) {
    if (section == 'highSchool') return [{'key': 'schoolName', 'label': 'School', 'hint': 'Name'}, {'key': 'cgpa', 'label': 'Result', 'hint': 'e.g. 9.5'}, {'key': 'outOf', 'label': 'Out Of', 'hint': '10.0'}];
    if (section == 'underGrad' || section == 'masters') return [{'key': 'uniName', 'label': 'University', 'hint': 'Name'}, {'key': 'degreeName', 'label': 'Degree', 'hint': 'Major'}, {'key': 'cgpa', 'label': 'CGPA', 'hint': '9.0'}, {'key': 'outOf', 'label': 'Out Of', 'hint': '10.0'}];
    if (section == 'workExperience') return [{'key': 'role', 'label': 'Job Role', 'hint': 'e.g. Software Engineer'}, {'key': 'organization', 'label': 'Organization', 'hint': 'e.g. Google / Microsoft'}, {'key': 'type', 'label': 'Work Type', 'hint': 'Full-time / Internship'}, {'key': 'country', 'label': 'Country', 'hint': 'e.g. India'}, {'key': 'description', 'label': 'Description', 'hint': 'What were your impact areas?'}];
    if (section == 'projects') return [{'key': 'title', 'label': 'Title', 'hint': 'Project Name'}, {'key': 'category', 'label': 'Category', 'hint': 'Tech Stack'}];
    if (section == 'research') return [{'key': 'title', 'label': 'Title', 'hint': 'Paper Title'}, {'key': 'publisher', 'label': 'Publisher', 'hint': 'Conference/Journal'}];
    if (section == 'volunteering') return [{'key': 'organization', 'label': 'Org', 'hint': 'Name'}, {'key': 'role', 'label': 'Role', 'hint': 'Volunteer'}];
    if (section == 'testScores') return [{'key': 'testType', 'label': 'Test', 'hint': 'GRE/IELTS'}, {'key': 'score', 'label': 'Score', 'hint': '320'}];
    if (section == 'targetUniversities') return [{'key': 'uniName', 'label': 'University', 'hint': 'Target Uni'}, {'key': 'degree', 'label': 'Degree', 'hint': 'MS/PhD'}, {'key': 'major', 'label': 'Major', 'hint': 'CS/DS'}, {'key': 'term', 'label': 'Term', 'hint': 'Fall'}, {'key': 'year', 'label': 'Year', 'hint': '2026'}];
    return [{'key': 'title', 'label': 'Title', 'hint': 'Enter detail'}];
  }
}
