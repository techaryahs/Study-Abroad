import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../data/university_repository.dart';

class PopularProgramsScreen extends StatefulWidget {
  const PopularProgramsScreen({super.key});

  @override
  State<PopularProgramsScreen> createState() => _PopularProgramsScreenState();
}

class _PopularProgramsScreenState extends State<PopularProgramsScreen> {
  Map<String, Map<String, List<UniversityItem>>> _categorizedData = {};
  bool _isLoading = true;
  String? _expandedCategory;
  String? _selectedProgram;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final data = await UniversityRepository.getCategorizedPrograms();
    setState(() {
      _categorizedData = data;
      _isLoading = false;
      if (data.isNotEmpty) {
        _expandedCategory = data.keys.first;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator(color: AppTheme.gold)));
    }

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 120,
            pinned: true,
            backgroundColor: AppTheme.darkBrown,
            elevation: 0,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text('POPULAR PROGRAMS', 
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 2, color: Colors.white)),
              centerTitle: true,
              background: Container(color: AppTheme.darkBrown),
            ),
            leading: IconButton(
              icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
              onPressed: () => context.pop(),
            ),
          ),
          
          SliverPadding(
            padding: const EdgeInsets.symmetric(vertical: 20),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final category = _categorizedData.keys.elementAt(index);
                  final isExpanded = _expandedCategory == category;
                  
                  return _buildCategoryTile(category, isExpanded);
                },
                childCount: _categorizedData.length,
              ),
            ),
          ),
          
          if (_selectedProgram != null)
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 100),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final unis = _categorizedData[_expandedCategory]![_selectedProgram!]!;
                    final uni = unis[index];
                    return _universityInfoCard(uni).animate().fadeIn(delay: Duration(milliseconds: index * 50)).slideY(begin: 0.1, end: 0);
                  },
                  childCount: _categorizedData[_expandedCategory]![_selectedProgram!]!.length,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildCategoryTile(String category, bool isExpanded) {
    final programs = _categorizedData[category]!;
    
    return Column(
      children: [
        GestureDetector(
          onTap: () {
            setState(() {
              _expandedCategory = isExpanded ? null : category;
              _selectedProgram = null;
            });
          },
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            decoration: BoxDecoration(
              color: isExpanded ? AppTheme.darkBrown : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(category.toUpperCase(), 
                  style: TextStyle(
                    fontSize: 13, 
                    fontWeight: FontWeight.w900, 
                    letterSpacing: 1, 
                    color: isExpanded ? AppTheme.gold : AppTheme.textPrimary
                  )),
                Icon(
                  isExpanded ? LucideIcons.minus : LucideIcons.plus, 
                  size: 16, 
                  color: isExpanded ? AppTheme.gold : AppTheme.textSecondary
                ),
              ],
            ),
          ),
        ),
        
        if (isExpanded)
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 20),
            padding: const EdgeInsets.symmetric(vertical: 8),
            decoration: BoxDecoration(
              color: AppTheme.darkBrown.withOpacity(0.95),
              borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(16), bottomRight: Radius.circular(16)),
            ),
            child: Column(
              children: programs.keys.map((prog) {
                final isSelected = _selectedProgram == prog;
                return InkWell(
                  onTap: () {
                    setState(() {
                      _selectedProgram = isSelected ? null : prog;
                    });
                  },
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                    child: Text(prog, 
                      style: TextStyle(
                        fontSize: 14, 
                        fontWeight: isSelected ? FontWeight.w900 : FontWeight.w500,
                        color: isSelected ? AppTheme.gold : Colors.white70,
                      )),
                  ),
                );
              }).toList(),
            ),
          ).animate().fadeIn(duration: const Duration(milliseconds: 150)),
      ],
    );
  }

  Widget _universityInfoCard(UniversityItem u) {
    return Container(
      margin: const EdgeInsets.only(top: 24),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 20, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 50,
                height: 50,
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppTheme.background,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
                ),
                child: _buildLogo(u.logo),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(u.name, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
                    const SizedBox(height: 4),
                    Text(u.fullLocation, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _infoTile('Acceptance', '15%', const Color(0xFF10B981)),
              _infoTile('Tuition', u.fee, AppTheme.gold),
              _infoTile('Avg Salary', '\$90k', AppTheme.darkBrown),
            ],
          ),
        ],
      ),
    );
  }

  Widget _infoTile(String label, String value, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: const TextStyle(fontSize: 8, fontWeight: FontWeight.w900, letterSpacing: 1, color: AppTheme.textSecondary)),
        const SizedBox(height: 4),
        Text(value, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: color)),
      ],
    );
  }

  Widget _buildLogo(String? path) {
    if (path == null) return const Icon(LucideIcons.graduationCap, color: AppTheme.gold);
    if (path.startsWith('http')) {
      return Image.network(path, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Icon(LucideIcons.graduationCap, color: AppTheme.gold));
    }
    return Image.asset(path, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Icon(LucideIcons.graduationCap, color: AppTheme.gold));
  }
}
