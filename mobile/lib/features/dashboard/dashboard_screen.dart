import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:study_abroad/features/dashboard/widgets/profile_recommendation_card.dart';
import 'package:study_abroad/features/dashboard/widgets/profile_progress_bar.dart';
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';
import '../auth/auth_provider.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, dynamic>? _userData;
  List<dynamic> _receipts = [];
  bool _loading = true;
  String _activeTab = 'profile'; // 'profile', 'bookings', 'sessions'
  String _activeProfileTab = 'about';
  final _picker = ImagePicker();

  Future<void> _pickAndUploadPhoto() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 50);
    if (pickedFile == null) return;

    try {
      final formData = FormData.fromMap({
        'profileImage': await MultipartFile.fromFile(pickedFile.path, filename: 'photo.jpg'),
      });
      await ApiClient.instance.put('/api/user/profile/${_userData!['_id']}', data: formData);
      _fetchData(); // Refresh to show new photo
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Upload failed: $e')));
    }
  }

  void _showBioLinkedInModal() {
    final profile = _userData?['profile'] ?? {};
    final bioController = TextEditingController(text: profile['bio'] ?? '');
    final linkedinController = TextEditingController(text: profile['linkedin'] ?? '');
    bool saving = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 40,
            left: 28, right: 28, top: 32,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(36)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('PROFESSIONAL INFO', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: 1.5, fontFamily: 'Playfair Display')),
                  IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close, size: 20)),
                ],
              ),
              const SizedBox(height: 30),
              const Text('BIO / TAGLINE', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 2)),
              const SizedBox(height: 12),
              TextField(
                controller: bioController,
                maxLines: 4,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                decoration: InputDecoration(
                  hintText: 'e.g. Aspiring Ivy League candidate interest in Fintech...',
                  filled: true,
                  fillColor: AppTheme.background,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 24),
              const Text('LINKEDIN PROFILE URL', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 2)),
              const SizedBox(height: 12),
              TextField(
                controller: linkedinController,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.link, color: AppTheme.gold, size: 18),
                  hintText: 'https://linkedin.com/in/username',
                  filled: true,
                  fillColor: AppTheme.background,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                ),
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: saving ? null : () async {
                    setModalState(() => saving = true);
                    try {
                      await ApiClient.instance.put('/api/user/profile/${_userData!['_id']}', data: {
                        'profile': {
                          'bio': bioController.text,
                          'linkedin': linkedinController.text,
                        }
                      });
                      if (context.mounted) {
                        Navigator.pop(context);
                        _fetchData();
                      }
                    } catch (e) {
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
                      }
                    } finally {
                      if (context.mounted) setModalState(() => saving = false);
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.darkBrown,
                    foregroundColor: AppTheme.gold,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  child: saving 
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: AppTheme.gold, strokeWidth: 2))
                    : const Text('UPDATE PROFILE', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.5, fontSize: 11)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _showAddProfileItemSheet(Map<String, String> sectionInfo) async {
    final section = sectionInfo['section']!;
    final title = sectionInfo['title']!;
    
    final controllers = <String, TextEditingController>{};
    final fields = _getFieldsForSection(section);
    for (var f in fields) {
      controllers[f['key']!] = TextEditingController();
    }

    bool saving = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 40,
            left: 28, right: 28, top: 32,
          ),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(36)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('ADD $title', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: 1.5, fontFamily: 'Playfair Display')),
                  IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close, size: 20)),
                ],
              ),
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
                      decoration: InputDecoration(
                        hintText: f['hint'],
                        filled: true,
                        fillColor: AppTheme.background,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
                      ),
                    ),
                  ],
                ),
              )).toList(),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: saving ? null : () async {
                    setModalState(() => saving = true);
                    try {
                      final data = <String, dynamic>{};
                      for (var f in fields) {
                        data[f['key']!] = controllers[f['key']]!.text;
                      }

                      await ApiClient.instance.post('/api/user/profile/${_userData!['_id']}/add-item', data: {
                        'section': section,
                        'data': data,
                      });
                      
                      if (context.mounted) {
                        Navigator.pop(context);
                        _fetchData();
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$title Added!'), backgroundColor: Colors.green));
                      }
                    } catch (e) {
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red));
                      }
                    } finally {
                      if (context.mounted) setModalState(() => saving = false);
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.darkBrown,
                    foregroundColor: AppTheme.gold,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  child: saving 
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: AppTheme.gold, strokeWidth: 2))
                    : const Text('SAVE RECORD', style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.5, fontSize: 11)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<Map<String, String>> _getFieldsForSection(String section) {
    switch (section) {
      case 'highSchool':
        return [
          {'key': 'schoolName', 'label': 'School Name', 'hint': 'e.g. St. Xaviers'},
          {'key': 'cgpa', 'label': 'CGPA / Percentage', 'hint': 'e.g. 9.5'},
          {'key': 'outOf', 'label': 'Out Of', 'hint': 'e.g. 10.0'},
        ];
      case 'underGrad':
      case 'masters':
        return [
          {'key': 'uniName', 'label': 'University Name', 'hint': 'e.g. IIT Bombay'},
          {'key': 'degreeName', 'label': 'Degree', 'hint': 'e.g. B.Tech Computer Science'},
          {'key': 'cgpa', 'label': 'CGPA', 'hint': '9.0'},
          {'key': 'outOf', 'label': 'Out Of', 'hint': '10.0'},
        ];
      case 'targetUniversities':
        return [
          {'key': 'uniName', 'label': 'University Name', 'hint': 'e.g. Stanford University'},
          {'key': 'degree', 'label': 'Target Degree', 'hint': 'MS in AI'},
          {'key': 'major', 'label': 'Major', 'hint': 'Computer Science'},
          {'key': 'term', 'label': 'Intake Term', 'hint': 'Fall / Spring'},
          {'key': 'year', 'label': 'Year', 'hint': '2026'},
        ];
      case 'workExperience':
        return [
          {'key': 'role', 'label': 'Job Role', 'hint': 'Software Engineer'},
          {'key': 'organization', 'label': 'Company', 'hint': 'Google'},
          {'key': 'type', 'label': 'Work Type', 'hint': 'Full-time / Internship'},
          {'key': 'country', 'label': 'Country', 'hint': 'e.g. India'},
          {'key': 'description', 'label': 'Description', 'hint': 'Worked on cloud infrastructure...'},
        ];
      case 'projects':
        return [
          {'key': 'title', 'label': 'Project Title', 'hint': 'AI Chatbot'},
          {'key': 'category', 'label': 'Category', 'hint': 'Web Development'},
          {'key': 'description', 'label': 'Details', 'hint': 'Built using Flutter and Node.js'},
        ];
      case 'research':
        return [
          {'key': 'title', 'label': 'Research Title', 'hint': 'e.g. Machine Learning in Healthcare'},
          {'key': 'publisher', 'label': 'Publisher / Journal', 'hint': 'IEEE / ACM'},
          {'key': 'url', 'label': 'Link', 'hint': 'https://doi.org/...'},
        ];
      case 'volunteering':
        return [
          {'key': 'organization', 'label': 'Organization', 'hint': 'Blue Cross'},
          {'key': 'role', 'label': 'Role', 'hint': 'Volunteer'},
          {'key': 'description', 'label': 'What did you do?', 'hint': 'Organized events...'},
        ];
      case 'testScores':
        return [
          {'key': 'testType', 'label': 'Test Name', 'hint': 'IELTS / TOEFL / GRE'},
          {'key': 'score', 'label': 'Score', 'hint': '8.0 / 320'},
          {'key': 'date', 'label': 'Date Taken', 'hint': 'YYYY-MM-DD'},
        ];
      default:
        return [
          {'key': 'title', 'label': 'Title', 'hint': 'Enter details'},
        ];
    }
  }

  Future<void> _togglePublicStatus(bool current) async {
    final auth = context.read<AuthProvider>();
    
    // ── OPTIMISTIC UI: Update locally first for instant feel ──
    setState(() {
      if (_userData != null && _userData!['profile'] != null) {
        _userData!['profile']['isPublic'] = !current;
      }
    });

    try {
      await ApiClient.instance.put('/api/user/profile/${auth.userId}', data: {
        'profile': {'isPublic': !current}
      });
      // Silent refresh to ensure sync
      final profileRes = await ApiClient.instance.get('/api/user/profile/${auth.userId}');
      if (mounted) {
        setState(() {
          _userData = profileRes.data;
        });
      }
    } catch (e) {
      // ── ROLLBACK: If API fails, revert the toggle ──
      setState(() {
        if (_userData != null && _userData!['profile'] != null) {
          _userData!['profile']['isPublic'] = current;
        }
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content: Text('Sync failed: $e'),
            backgroundColor: Colors.red));
      }
    }
  }

  final List<Map<String, String>> _profileCards = [
    {'title': 'Target Uni', 'icon': '🏛️', 'section': 'targetUniversities', 'desc': 'Define destiny.'},
    {'title': 'High School', 'icon': '🏫', 'section': 'highSchool', 'desc': 'Foundations.'},
    {'title': 'Bachelor\'s', 'icon': '🎓', 'section': 'underGrad', 'desc': 'Core degree.'},
    {'title': 'Master\'s', 'icon': '📜', 'section': 'masters', 'desc': 'Advanced study.'},
    {'title': 'Test Scores', 'icon': '📊', 'section': 'testScores', 'desc': 'GRE/TOEFL.'},
    {'title': 'Work Exp', 'icon': '💼', 'section': 'workExperience', 'desc': 'Trajectory.'},
    {'title': 'Research', 'icon': '🔬', 'section': 'research', 'desc': 'Discoveries.'},
    {'title': 'Projects', 'icon': '🚀', 'section': 'projects', 'desc': 'Engineering.'},
    {'title': 'Volunteering', 'icon': '🤝', 'section': 'volunteering', 'desc': 'Community.'},
  ];

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final auth = context.read<AuthProvider>();
    final userId = auth.userId;
    if (userId == null) { setState(() => _loading = false); return; }

    try {
      final profileRes = await ApiClient.instance.get('/api/user/profile/$userId');
      final receiptsRes = await ApiClient.instance.get('/api/payment/user/${auth.user?['email']}');

      if (mounted) {
        setState(() {
          _userData = profileRes.data;
          _receipts = receiptsRes.data is List ? receiptsRes.data : [];
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: AppTheme.background,
        body: Center(child: CircularProgressIndicator(color: AppTheme.gold)),
      );
    }

    final profile = _userData != null && _userData!['profile'] is Map ? Map<String, dynamic>.from(_userData!['profile']) : <String, dynamic>{};
    final name = _userData?['name'] ?? 'Student Member';
    final completedSteps = _countCompleted(profile);

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: RefreshIndicator(
        onRefresh: _fetchData,
        color: AppTheme.gold,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
          child: Column(
            children: [
              // ── PREMIUM HEADER ──
              Container(
                padding: const EdgeInsets.fromLTRB(24, 70, 24, 40),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  border: Border(bottom: BorderSide(color: AppTheme.borderLight)),
                ),
                child: Column(
                  children: [
                     Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        GestureDetector(
                          onTap: _pickAndUploadPhoto,
                          child: Stack(
                            children: [
                              Container(
                                width: 86, height: 86,
                                padding: const EdgeInsets.all(4),
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AppTheme.borderLight),
                                  gradient: LinearGradient(
                                    colors: [AppTheme.gold.withOpacity(0.2), Colors.transparent],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                ),
                                child: ClipOval(
                                  child: profile['profileImage'] != null
                                      ? _buildProfileImage(profile['profileImage'], name)
                                      : _avatarPlaceholder(name),
                                ),
                              ),
                              Positioned(
                                bottom: 0, right: 0,
                                child: Container(
                                  width: 32, height: 32,
                                  decoration: BoxDecoration(
                                    color: AppTheme.gold,
                                    shape: BoxShape.circle,
                                    border: Border.all(color: Colors.white, width: 3),
                                    boxShadow: [BoxShadow(color: AppTheme.gold.withOpacity(0.3), blurRadius: 10)],
                                  ),
                                  child: const Icon(Icons.camera_alt, color: Colors.white, size: 14),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 20),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(name.toUpperCase(),
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 1.5,
                                    color: AppTheme.textPrimary,
                                    fontFamily: 'Playfair Display',
                                    fontStyle: FontStyle.italic,
                                  )),
                              const SizedBox(height: 6),
                              GestureDetector(
                                onTap: () => _togglePublicStatus(profile['isPublic'] ?? false),
                                behavior: HitTestBehavior.opaque,
                                child: Row(
                                  children: [
                                    Text(
                                      (profile['isPublic'] ?? false) ? "PUBLIC" : "PRIVATE",
                                      style: TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 2,
                                        color: (profile['isPublic'] ?? false) ? Colors.green : AppTheme.textSecondary,
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    _toggle(profile['isPublic'] ?? false),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.1),
  
                    const SizedBox(height: 30),
                    
                    // Location & LinkedIn
                    Row(
                      children: [
                        _headerIconLink(Icons.location_on, _userData?['country'] ?? 'Global Citizen'),
                        const SizedBox(width: 24),
                        GestureDetector(
                          onTap: () {
                            final url = profile['linkedin'];
                            if (url != null && url.toString().isNotEmpty) {
                              launchUrl(Uri.parse(url));
                            } else {
                              _showBioLinkedInModal();
                            }
                          },
                          child: _headerIconLink(
                            Icons.link, 
                            (profile['linkedin'] != null && profile['linkedin'].toString().isNotEmpty) ? 'LinkedIn' : 'Connect',
                            color: (profile['linkedin'] != null && profile['linkedin'].toString().isNotEmpty) ? AppTheme.gold : null,
                          ),
                        ),
                      ],
                    ),
  
                    const SizedBox(height: 30),
  
                    // Actions
                    Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: _showBioLinkedInModal,
                            child: _secondaryBtn(
                              (profile['bio'] != null && profile['bio'].toString().isNotEmpty) ? Icons.edit_note : Icons.add_circle_outline, 
                              (profile['bio'] != null && profile['bio'].toString().isNotEmpty) ? 'EDIT BIO' : 'ADD BIO'
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: GestureDetector(
                            onTap: () async {
                              final updated = await context.push('/dashboard/edit', extra: _userData);
                              if (updated == true) _fetchData();
                            },
                            child: _primaryBtn(Icons.edit, 'EDIT PROFILE'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
  
              // ── MAIN TABS ──
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  child: Row(
                    children: ['profile', 'bookings', 'sessions'].map((tab) {
                      final isSelected = _activeTab == tab;
                      return GestureDetector(
                        onTap: () => setState(() => _activeTab = tab),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 300),
                          margin: const EdgeInsets.only(right: 12),
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                          decoration: BoxDecoration(
                            color: isSelected ? AppTheme.darkBrown : Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: isSelected ? AppTheme.darkBrown : AppTheme.borderLight),
                            boxShadow: isSelected ? [BoxShadow(color: AppTheme.darkBrown.withOpacity(0.2), blurRadius: 15, offset: const Offset(0, 5))] : null,
                          ),
                          child: Text(
                            tab == 'profile' ? 'PROFILE' : tab == 'bookings' ? 'MY BOOKINGS' : 'MY SESSIONS',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.5,
                              color: isSelected ? AppTheme.gold : AppTheme.textSecondary,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
  
              if (_activeTab == 'profile') ...[
                // ── IDENTITY MODULE ──
                _buildIdentityModule(profile),
  
                // ── RECOMMENDED CAROUSEL ──
                _buildRecommendedCarousel(profile, completedSteps),
  
                // ── SYSTEM NODES ──
                _buildSystemNodes(profile),
              ],
  
              if (_activeTab == 'bookings') _buildBookingsTab(),
              if (_activeTab == 'sessions') _buildSessionsTab(profile),
  
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileImage(String imgSource, String name) {
    if (imgSource.startsWith('data:')) {
      // Handle Base64 from backend
      final base64String = imgSource.split(',').last;
      return Image.memory(base64Decode(base64String), fit: BoxFit.cover, errorBuilder: (_, __, ___) => _avatarPlaceholder(name));
    }
    // Handle URL
    final fullUrl = imgSource.startsWith('http') ? imgSource : '${ApiClient.baseUrl}$imgSource';
    return Image.network(fullUrl, fit: BoxFit.cover, errorBuilder: (_, __, ___) => _avatarPlaceholder(name));
  }

  Widget _buildScoreView(Map<String, dynamic> score) {
    final sections = score['sectionScores'] as Map<String, dynamic>? ?? {};
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
           children: [
             Icon(Icons.emoji_events, color: AppTheme.gold, size: 20),
             const SizedBox(width: 8),
             Text("${score['testType']} RESULTS".toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5, color: AppTheme.textPrimary)),
           ],
        ),
        const SizedBox(height: 24),
        ...sections.entries.map((e) => Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(e.key.toUpperCase(), style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1.2)),
              Text(e.value.toString(), style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
            ],
          ),
        )),
        const Divider(height: 32, color: AppTheme.borderLight),
        Row(
           mainAxisAlignment: MainAxisAlignment.spaceBetween,
           children: [
             const Text("TOTAL SCORE", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.gold, letterSpacing: 2)),
             Text(score['score'].toString(), style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, color: AppTheme.textPrimary)),
           ],
        ),
      ],
    );
  }

  Widget _buildBookingsTab() {
    return Container(
      margin: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('PURCHASE HISTORY',
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: 1.5)),
          const SizedBox(height: 20),
          ..._receipts.map((r) => Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppTheme.borderLight),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10)],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text((r['orderId'] ?? 'Order').toUpperCase(), 
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textSecondary)),
                    Text('${r['currency']} ${r['total']}', 
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.redAccent, fontStyle: FontStyle.italic)),
                  ],
                ),
                const SizedBox(height: 12),
                const Text('PAID', style: TextStyle(color: Colors.green, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 2)),
                const Divider(height: 32, color: AppTheme.borderLight),
                ...((r['items'] as List? ?? []).map((item) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle_outline, color: AppTheme.gold, size: 14),
                      const SizedBox(width: 8),
                      Expanded(child: Text(item['title'] ?? 'Service', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700))),
                    ],
                  ),
                ))),
              ],
            ).animate().fadeIn(duration: 400.ms),
          )),
          if (_receipts.isEmpty)
             Center(child: Padding(
               padding: const EdgeInsets.symmetric(vertical: 60),
               child: Text("NO PURCHASES FOUND", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textMuted, letterSpacing: 2)),
             )),
        ],
      ),
    );
  }

  String _sessionFilter = 'upcoming';

  Widget _buildSessionsTab(Map<String, dynamic> profile) {
    final now = DateTime.now();
    final allSessions = profile['mySessions'] as List? ?? [];
    
    final sessions = allSessions.where((s) {
      final dateStr = s['date'] ?? '';
      final timeStr = s['time'] ?? '00:00';
      try {
        final d = DateTime.parse('${dateStr}T${timeStr}:00');
        final isUpcoming = d.isAfter(now);
        return _sessionFilter == 'upcoming' ? isUpcoming : !isUpcoming;
      } catch (_) { 
        // If date is invalid, show it in upcoming just in case
        return _sessionFilter == 'upcoming'; 
      }
    }).toList();

    return Container(
      margin: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('MY SESSIONS', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: 1.5)),
              Row(
                children: ['upcoming', 'past'].map((f) => GestureDetector(
                  onTap: () => setState(() => _sessionFilter = f),
                  child: Container(
                    margin: const EdgeInsets.only(left: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: _sessionFilter == f ? AppTheme.gold : AppTheme.background,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(f.toUpperCase(), style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: _sessionFilter == f ? Colors.white : AppTheme.textSecondary)),
                  ),
                )).toList(),
              ),
            ],
          ),
          const SizedBox(height: 24),
          ...sessions.map((s) => Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.borderLight),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text((s['consultantName']?.toString() ?? 'Counselling Session').toUpperCase(), 
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900)),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Icon(Icons.calendar_today, size: 10, color: AppTheme.gold),
                          const SizedBox(width: 4),
                          Text((s['date'] == null || s['date'] == "null") ? 'Scheduled' : s['date'].toString(), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900)),
                          const SizedBox(width: 12),
                          const Icon(Icons.access_time, size: 10, color: AppTheme.gold),
                          const SizedBox(width: 4),
                          Text((s['time'] == null || s['time'] == "null") ? 'Live' : s['time'].toString(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.gold)),
                        ],
                      ),
                    ],
                  ),
                ),
                if (_sessionFilter == 'upcoming')
                   GestureDetector(
                     onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Joining session...'), duration: Duration(seconds: 1)),
                        );
                        context.push('/meeting/${s['_id']}', extra: s);
                     },
                     child: Container(
                       padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                       decoration: BoxDecoration(
                         color: Colors.green,
                         borderRadius: BorderRadius.circular(12),
                         boxShadow: [BoxShadow(color: Colors.green.withOpacity(0.3), blurRadius: 10)],
                       ),
                       child: const Text('JOIN', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900)),
                     ),
                   ),
              ],
            ),
          )),
          if (sessions.isEmpty)
             Padding(
               padding: const EdgeInsets.symmetric(vertical: 60),
               child: Column(
                 children: [
                   Icon(Icons.event_busy, color: AppTheme.textMuted, size: 40),
                   const SizedBox(height: 16),
                   Text("NO ${_sessionFilter.toUpperCase()} SESSIONS", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textMuted, letterSpacing: 2)),
                   if (_sessionFilter == 'upcoming')
                     Padding(
                       padding: const EdgeInsets.only(top: 8),
                       child: Text("Check the 'Past' tab for finished sessions.", style: TextStyle(fontSize: 9, color: AppTheme.textMuted)),
                     ),
                 ],
               ),
             ),
        ],
      ),
    );
  }

  Widget _buildIdentityModule(Map<String, dynamic> profile) {
    final testScores = profile['testScores'] as List? ?? [];

    final tabs = [
      {'id': 'about', 'label': 'ABOUT'},
      if ((profile['highSchool'] as List?)?.isNotEmpty ?? false) {'id': 'highSchool', 'label': 'HIGH SCHOOL'},
      if ((profile['underGrad'] as List?)?.isNotEmpty ?? false) {'id': 'undergrad', 'label': 'BACHELOR\'S'},
      if ((profile['masters'] as List?)?.isNotEmpty ?? false) {'id': 'masters', 'label': 'MASTER\'S'},
      if ((profile['targetUniversities'] as List?)?.isNotEmpty ?? false) {'id': 'target', 'label': 'TARGET'},
      ...testScores.map((s) => {'id': 'score-${s['testType']}', 'label': s['testType'].toString().toUpperCase()}),
    ];

    return Container(
      margin: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Column(
        children: [
          // Sub-Tabs
          Container(
            padding: const EdgeInsets.all(12),
            decoration: const BoxDecoration(
              color: AppTheme.background,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              border: Border(bottom: BorderSide(color: AppTheme.borderLight)),
            ),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              child: Row(
                children: tabs.map((t) {
                  final isS = _activeProfileTab == t['id'];
                  return GestureDetector(
                    onTap: () => setState(() => _activeProfileTab = t['id']!),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      margin: const EdgeInsets.only(right: 8),
                      decoration: BoxDecoration(
                        color: isS ? AppTheme.gold : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(t['label']!,
                          style: TextStyle(
                            fontSize: 9,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.5,
                            color: isS ? Colors.white : AppTheme.textSecondary,
                          )),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          
          // Content
          Padding(
            padding: const EdgeInsets.all(24),
            child: _buildIdentityContent(profile),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 500.ms);
  }

  Widget _buildIdentityContent(Map<String, dynamic> profile) {
    if (_activeProfileTab.startsWith('score-')) {
      final type = _activeProfileTab.replaceFirst('score-', '');
      final scores = profile['testScores'] as List? ?? [];
      final score = scores.firstWhere((s) => s['testType'] == type, orElse: () => null);
      if (score != null) return _buildScoreView(score);
    }

    switch (_activeProfileTab) {
      case 'about':
        return Column(
          children: [
            _premiumInfoRow(Icons.person, 'FULL NAME', _userData?['name'] ?? '—'),
            _premiumInfoRow(Icons.location_on, 'LOCATION', _userData?['country'] ?? '—'),
            _premiumInfoRow(Icons.calendar_today, 'JOINED', 'Sep 2025'),
          ],
        );
      case 'highSchool':
        return _buildEduList(profile['highSchool'] ?? [], 'schoolName');
      case 'undergrad':
        return _buildEduList(profile['underGrad'] ?? [], 'uniName');
      default:
        return Center(child: Text("NO CONTENT", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textMuted)));
    }
  }

  Widget _buildEduList(List items, String nameKey) {
    return Column(
      children: items.map((it) => Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.background,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.borderLight),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(it[nameKey].toString().toUpperCase(), 
                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
                  const SizedBox(height: 4),
                  Text('CGPA: ${it['cgpa']} / ${it['outOf']}', 
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppTheme.textSecondary)),
                ],
              ),
            ),
            const Icon(Icons.verified, color: AppTheme.gold, size: 16),
          ],
        ),
      )).toList(),
    );
  }

  Widget _buildRecommendedCarousel(Map<String, dynamic> profile, int completed) {
    final pending = _profileCards.where((c) => !_hasData(profile, c['section']!)).toList();

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: AppTheme.borderLight),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 20, offset: const Offset(0, 10))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(color: AppTheme.gold.withOpacity(0.1), shape: BoxShape.circle),
                child: const Icon(Icons.star, color: AppTheme.gold, size: 14),
              ),
              const SizedBox(width: 12),
              const Text('RECOMMENDED FOR YOU',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1.8)),
            ],
          ),
          const SizedBox(height: 30),
          // Progress Bar
          ProfileProgressBar(completed: completed),
          
          const SizedBox(height: 32),
          
          if (pending.isNotEmpty)
            SizedBox(
              height: 200,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                itemCount: pending.length,
                itemBuilder: (context, i) {
                  return ProfileRecommendationCard(
                    card: pending[i],
                    onComplete: () => _showAddProfileItemSheet(pending[i]),
                  );
                },
              ),
            )
          else
             Container(
               padding: const EdgeInsets.symmetric(vertical: 40),
               width: double.infinity,
               child: Column(
                 children: [
                   const Icon(Icons.verified, color: Colors.green, size: 40),
                   const SizedBox(height: 16),
                   const Text("PROFILE 100% COMPLETE", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: 1.2)),
                   Text("You are ready for applications.", style: TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                 ],
               ),
             ),
        ],
      ),
    ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.05);
  }

  Widget _buildSystemNodes(Map<String, dynamic> profile) {
    final nodes = [
      {'id': 'workExperience', 'label': 'WORK EXPERIENCE', 'icon': Icons.business_center},
      {'id': 'projects', 'label': 'PROJECTS', 'icon': Icons.rocket_launch},
    ];

    return Column(
      children: nodes.map((n) {
        final items = profile[n['id']] as List? ?? [];
        return Container(
          margin: const EdgeInsets.fromLTRB(20, 10, 20, 10),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppTheme.borderLight),
          ),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Icon(n['icon'] as IconData, color: AppTheme.gold, size: 16),
                    const SizedBox(width: 8),
                    Text(n['label'] as String, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textMuted)),
                    const Spacer(),
                    GestureDetector(
                      onTap: () {
                        final card = _profileCards.firstWhere((c) => c['section'] == n['id']);
                        _showAddProfileItemSheet(card);
                      },
                      child: const Icon(Icons.add_circle, color: Colors.green, size: 24),
                    ),
                  ],
                ),
              ),
              if (items.isNotEmpty) ...items.map((it) => Container(
                padding: const EdgeInsets.all(16),
                margin: const EdgeInsets.fromLTRB(12, 0, 12, 12),
                decoration: BoxDecoration(
                  color: AppTheme.background,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Expanded(child: Text(it['role'] ?? it['title'] ?? 'Record', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900))),
                    const Icon(Icons.chevron_right, color: AppTheme.textMuted, size: 16),
                  ],
                ),
              )),
            ],
          ),
        );
      }).toList(),
    );
  }

  // ── UI COMPONENTS ──────────────────────────────

  Widget _toggle(bool active) {
    return Container(
      width: 32, height: 18,
      padding: const EdgeInsets.all(2),
      decoration: BoxDecoration(
        color: active ? Colors.green.withOpacity(0.2) : AppTheme.textMuted.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: active ? Colors.green.withOpacity(0.3) : AppTheme.borderLight),
      ),
      child: AnimatedAlign(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutExpo,
        alignment: active ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          width: 12, height: 12,
          decoration: BoxDecoration(
            color: active ? Colors.green : AppTheme.textMuted,
            shape: BoxShape.circle,
          ),
        ),
      ),
    );
  }

  Widget _headerIconLink(IconData icon, String text, {Color? color}) {
    return Row(
      children: [
        Icon(icon, color: color ?? AppTheme.gold, size: 16),
        const SizedBox(width: 8),
        Text(text.toUpperCase(),
            style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: color ?? AppTheme.textSecondary, letterSpacing: 1.5)),
      ],
    );
  }

  Widget _primaryBtn(IconData icon, String text) {
    return Container(
      height: 52,
      decoration: BoxDecoration(
        color: AppTheme.gold,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: AppTheme.gold.withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 5))],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: Colors.white, size: 16),
          const SizedBox(width: 8),
          Text(text, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
        ],
      ),
    );
  }

  Widget _secondaryBtn(IconData icon, String text) {
    return Container(
      height: 52,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: AppTheme.gold, size: 16),
          const SizedBox(width: 8),
          Text(text, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
        ],
      ),
    );
  }

  Widget _premiumInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
               color: AppTheme.background,
               borderRadius: BorderRadius.circular(12),
               border: Border.all(color: AppTheme.borderLight),
            ),
            child: Icon(icon, color: AppTheme.gold, size: 18),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 2)),
                const SizedBox(height: 2),
                Text(value.toUpperCase(), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: 0.5)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _avatarPlaceholder(String name) {
    return Container(
      color: AppTheme.gold.withOpacity(0.1),
      child: Center(
        child: Text(
          name.isNotEmpty ? name[0].toUpperCase() : 'U',
          style: const TextStyle(color: AppTheme.gold, fontSize: 32, fontWeight: FontWeight.w900),
        ),
      ),
    );
  }

  int _countCompleted(Map profile) {
    int count = 0;
    for (final key in ['highSchool', 'underGrad', 'masters', 'testScores', 'workExperience', 'research', 'projects', 'volunteering', 'targetUniversities']) {
      if ((profile[key] as List?)?.isNotEmpty ?? false) count++;
    }
    return count;
  }

  bool _hasData(Map profile, String section) {
    return (profile[section] as List?)?.isNotEmpty ?? false;
  }
}
