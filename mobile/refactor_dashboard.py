import os

code = """
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:jovial_svg/jovial_svg.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';

import '../../core/theme.dart';
import '../auth/auth_provider.dart';
import 'dashboard_provider.dart';
import 'widgets/profile_progress_bar.dart';
import 'widgets/profile_recommendation_card.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  final List<String> _mainTabs = ['PROFILE', 'MEMBERSHIP CENTER', 'MY BOOKINGS', 'MY SESSIONS'];
  int _selectedMainTab = 0;

  final List<String> _subTabs = ['ABOUT', 'INSIGHTS', 'HIGH SCHOOL', 'BACHELOR\\'S', 'MASTER\\'S', 'TARGET', 'DOCUMENTS'];
  int _selectedSubTab = 0;

  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(dashboardProvider.notifier).loadProfile());
  }

  void _showDeleteAccountDialog() {
    // Implemented dialog here
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(dashboardProvider);

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        centerTitle: false,
        title: const Text(
          'DASHBOARD',
          style: TextStyle(
            fontFamily: 'Cormorant Garamond',
            fontSize: 24,
            fontWeight: FontWeight.w900,
            color: AppTheme.textPrimary,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.logOut, color: AppTheme.textSecondary),
            onPressed: () {
              ref.read(authProvider.notifier).logout();
              context.go('/auth');
            },
          ),
        ],
      ),
      body: state.when(
        data: (profile) => _buildBody(profile ?? {}),
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppTheme.gold),
        ),
        error: (err, stack) => Center(
          child: Text('Error loading profile\\n$err', textAlign: TextAlign.center),
        ),
      ),
    );
  }

  Widget _buildBody(Map<String, dynamic> profile) {
    return RefreshIndicator(
      color: AppTheme.gold,
      onRefresh: () => ref.read(dashboardProvider.notifier).loadProfile(),
      child: ListView(
        padding: const EdgeInsets.only(bottom: 100),
        children: [
          _buildProfileHeader(profile),
          const SizedBox(height: 16),
          _buildMainTabs(),
          const SizedBox(height: 16),
          if (_selectedMainTab == 0) ...[
            _buildSubTabs(),
            const SizedBox(height: 24),
            _buildAboutContent(profile),
          ],
        ],
      ),
    );
  }

  Widget _buildProfileHeader(Map<String, dynamic> profile) {
    final user = ref.read(authProvider).user;
    final name = (profile['firstName'] ?? user?.name ?? 'Student').toString();
    final isPrivate = profile['isPrivate'] ?? false;
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Avatar
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  color: AppTheme.gold.withOpacity(0.1),
                  border: Border.all(color: AppTheme.gold.withOpacity(0.3), width: 2),
                ),
                child: Center(
                  child: Text(
                    name.isNotEmpty ? name[0].toUpperCase() : 'S',
                    style: const TextStyle(color: AppTheme.gold, fontSize: 32, fontWeight: FontWeight.w900),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              // Name and Private toggle
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontFamily: 'Cormorant Garamond',
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.textPrimary,
                        height: 1.1,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        const Text('PRIVATE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textMuted, letterSpacing: 1.5)),
                        const SizedBox(width: 8),
                        _toggle(isPrivate),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Icon(LucideIcons.mapPin, size: 14, color: AppTheme.gold),
              const SizedBox(width: 4),
              const Text('GLOBAL CITIZEN', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1)),
              const SizedBox(width: 16),
              const Icon(LucideIcons.link, size: 14, color: AppTheme.gold),
              const SizedBox(width: 4),
              const Text('ADD LINKEDIN', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1)),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {},
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppTheme.borderLight),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: const Text('+ ADD SHORT BIO', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1.5)),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () => context.push('/edit-profile'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.gold,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(LucideIcons.pencil, size: 14, color: Colors.white),
                      SizedBox(width: 6),
                      Text('EDIT PROFILE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 1.5)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMainTabs() {
    return SizedBox(
      height: 40,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: _mainTabs.length,
        itemBuilder: (context, index) {
          final isSelected = _selectedMainTab == index;
          return GestureDetector(
            onTap: () => setState(() => _selectedMainTab = index),
            child: Container(
              margin: const EdgeInsets.only(right: 12),
              padding: const EdgeInsets.symmetric(horizontal: 20),
              decoration: BoxDecoration(
                color: isSelected ? AppTheme.gold : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: isSelected ? AppTheme.gold : AppTheme.borderLight),
              ),
              alignment: Alignment.center,
              child: Text(
                _mainTabs[index],
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1.2,
                  color: isSelected ? Colors.white : AppTheme.textSecondary,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildSubTabs() {
    return SizedBox(
      height: 36,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: _subTabs.length,
        itemBuilder: (context, index) {
          final isSelected = _selectedSubTab == index;
          return GestureDetector(
            onTap: () => setState(() => _selectedSubTab = index),
            child: Container(
              margin: const EdgeInsets.only(right: 10),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: isSelected ? AppTheme.gold.withOpacity(0.8) : Colors.transparent,
                borderRadius: BorderRadius.circular(18),
              ),
              child: Text(
                _subTabs[index],
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 1,
                  color: isSelected ? Colors.white : AppTheme.textSecondary,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildAboutContent(Map<String, dynamic> profile) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildBasicInfoGrid(profile),
          const SizedBox(height: 32),
          _buildRecommendedSection(profile),
          const SizedBox(height: 32),
          _buildAccordions(profile),
        ],
      ),
    );
  }

  Widget _buildBasicInfoGrid(Map<String, dynamic> profile) {
    final user = ref.read(authProvider).user;
    final name = '${profile['firstName'] ?? user?.name ?? ''} ${profile['lastName'] ?? ''}'.trim();
    final gender = profile['gender'] ?? 'N/A';
    final location = profile['location'] ?? 'N/A';
    final dob = profile['dateOfBirth'] != null ? DateFormat('MMM dd, yyyy').format(DateTime.parse(profile['dateOfBirth'])) : 'N/A';

    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 2.5,
      children: [
        _infoCard(LucideIcons.user, 'FULL NAME', name),
        _infoCard(LucideIcons.venetianMask, 'GENDER', gender),
        _infoCard(LucideIcons.mapPin, 'LOCATION', location),
        _infoCard(LucideIcons.calendar, 'BIRTH DATE', dob),
      ],
    );
  }

  Widget _infoCard(IconData icon, String title, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppTheme.textMuted),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(title, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textMuted, letterSpacing: 1)),
                const SizedBox(height: 4),
                Text(value.toUpperCase(), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textPrimary), maxLines: 1, overflow: TextOverflow.ellipsis),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendedSection(Map<String, dynamic> profile) {
    int completed = _countCompleted(profile);
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.star_border, color: AppTheme.gold, size: 20),
              const SizedBox(width: 8),
              const Text('RECOMMENDED FOR YOU', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: 1.5)),
              const Spacer(),
              Row(
                children: [
                  const Icon(Icons.chevron_left, color: AppTheme.textMuted, size: 20),
                  const SizedBox(width: 8),
                  const Icon(Icons.chevron_right, color: AppTheme.textSecondary, size: 20),
                ],
              )
            ],
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('PROFILE COMPLETION', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: 1.5)),
              Text('$completed/10', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.gold)),
            ],
          ),
          const SizedBox(height: 12),
          ProfileProgressBar(progress: completed / 10.0),
          const SizedBox(height: 24),
          SizedBox(
            height: 160,
            child: ListView(
              scrollDirection: Axis.horizontal,
              clipBehavior: Clip.none,
              children: [
                _actionCard('STANDARDIZED TESTS', 'Sync GRE, TOEFL, or IELTS protocols.', Icons.bar_chart),
                const SizedBox(width: 16),
                _actionCard('WORK EXPERIENCE', 'Catalogue your professional trajectory.', Icons.work_outline),
                const SizedBox(width: 16),
                _actionCard('RESEARCH WORK', 'Incorporate your academic discoveries.', Icons.biotech),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _actionCard(String title, String desc, IconData icon) {
    return Container(
      width: 260,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderLight),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: [
          Icon(icon, size: 32, color: AppTheme.gold),
          const SizedBox(height: 12),
          Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: 1.2)),
          const SizedBox(height: 4),
          Text(desc, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
          const Spacer(),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {},
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppTheme.borderLight),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text('SKIP', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textMuted)),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: const Text('SUBMIT', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAccordions(Map<String, dynamic> profile) {
    return Column(
      children: [
        _accordionItem('WORK EXPERIENCE', LucideIcons.briefcase, profile['workExperience'] as List? ?? []),
        _accordionItem('PROJECTS', LucideIcons.star, profile['projects'] as List? ?? []),
        _accordionItem('RESEARCH PAPERS', LucideIcons.fileText, profile['research'] as List? ?? []),
        _accordionItem('VOLUNTEERING', LucideIcons.heart, profile['volunteering'] as List? ?? []),
        _accordionItem('ACHIEVEMENTS & AWARDS', LucideIcons.award, profile['achievements'] as List? ?? []),
      ],
    );
  }

  Widget _accordionItem(String title, IconData icon, List data) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(icon, color: AppTheme.gold, size: 20),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.textPrimary, letterSpacing: 1.5)),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppTheme.darkBrown,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(LucideIcons.plus, color: Colors.white, size: 16),
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: AppTheme.borderLight),
          Padding(
            padding: const EdgeInsets.all(24),
            child: Text(
              'NO ENTRIES ADDED YET. CLICK + TO ADD $title.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textMuted, letterSpacing: 1),
            ),
          ),
        ],
      ),
    );
  }

  Widget _toggle(bool active) {
    return Container(
      width: 36, height: 20,
      padding: const EdgeInsets.all(2),
      decoration: BoxDecoration(
        color: active ? AppTheme.darkBrown : AppTheme.borderLight,
        borderRadius: BorderRadius.circular(20),
      ),
      child: AnimatedAlign(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
        alignment: active ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          width: 16, height: 16,
          decoration: const BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
          ),
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
}
"""

with open("lib/features/dashboard/dashboard_screen.dart", "w") as f:
    f.write(code)

print("Dashboard rewritten")
