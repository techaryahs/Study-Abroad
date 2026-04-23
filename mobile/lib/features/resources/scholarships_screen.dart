import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../widgets/book_counselling_sheet.dart';
import '../../core/theme.dart';
import '../../data/scholarship_repository.dart';

class ScholarshipsScreen extends StatefulWidget {
  const ScholarshipsScreen({super.key});

  @override
  State<ScholarshipsScreen> createState() => _ScholarshipsScreenState();
}

class _ScholarshipsScreenState extends State<ScholarshipsScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _selectedCategory = 'All Categories';
  List<ScholarshipItem> _allScholarships = [];
  List<ScholarshipItem> _filteredScholarships = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final data = await ScholarshipRepository.getScholarships();
    setState(() {
      _allScholarships = data;
      _filteredScholarships = data;
      _isLoading = false;
    });
  }

  void _filter() {
    setState(() {
      _filteredScholarships = _allScholarships.where((s) {
        final matchesSearch = s.name.toLowerCase().contains(_searchController.text.toLowerCase()) ||
            s.sponsor.toLowerCase().contains(_searchController.text.toLowerCase());
        final matchesCategory = _selectedCategory == 'All Categories' || s.category == _selectedCategory;
        return matchesSearch && matchesCategory;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    final categories = ['All Categories', ..._allScholarships.map((s) => s.category).toSet()];

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // Elegant Header (Sliver)
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.fromLTRB(24, 60, 24, 40),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppTheme.gold.withOpacity(0.1),
                    AppTheme.background,
                  ],
                ),
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'FINANCIAL SUPPORT INDEX',
                      style: TextStyle(
                        color: AppTheme.gold,
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 2,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Elite',
                    style: TextStyle(
                      fontFamily: 'Cormorant Garamond',
                      fontSize: 48,
                      fontWeight: FontWeight.w300,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  ShaderMask(
                    shaderCallback: (bounds) => const LinearGradient(
                      colors: [Color(0xFFC5A059), Color(0xFFE6D5B8), Color(0xFFC5A059)],
                    ).createShader(bounds),
                    child: const Text(
                      'Scholarships',
                      style: TextStyle(
                        fontFamily: 'Cormorant Garamond',
                        fontSize: 64,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                        height: 0.9,
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                  
                  // Search & Filter Container
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        TextField(
                          controller: _searchController,
                          onChanged: (_) => _filter(),
                          decoration: InputDecoration(
                            prefixIcon: const Icon(LucideIcons.search, size: 20, color: AppTheme.textSecondary),
                            hintText: 'Search by name or provider...',
                            hintStyle: TextStyle(color: AppTheme.textSecondary.withOpacity(0.5), fontSize: 14),
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                        ),
                        const Divider(height: 1, indent: 20, endIndent: 20),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: _selectedCategory,
                              isExpanded: true,
                              icon: const Icon(LucideIcons.filter, size: 16, color: AppTheme.gold),
                              items: categories.map((cat) {
                                return DropdownMenuItem(
                                  value: cat,
                                  child: Text(cat, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.textSecondary)),
                                );
                              }).toList(),
                              onChanged: (val) {
                                if (val != null) {
                                  setState(() => _selectedCategory = val);
                                  _filter();
                                }
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Tabs
          SliverPersistentHeader(
            pinned: true,
            delegate: _SliverAppBarDelegate(
              minHeight: 60,
              maxHeight: 60,
              child: Container(
                color: AppTheme.background,
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Row(
                  children: [
                    _tabButton('Opportunities (${_filteredScholarships.length})', true),
                    const SizedBox(width: 24),
                    _tabButton('Portfolio (0)', false),
                  ],
                ),
              ),
            ),
          ),

          // List
          _isLoading
              ? const SliverFillRemaining(
                  child: Center(child: CircularProgressIndicator(color: AppTheme.gold)),
                )
              : _filteredScholarships.isEmpty
                  ? SliverFillRemaining(
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(LucideIcons.graduationCap, size: 64, color: AppTheme.textSecondary.withOpacity(0.2)),
                            const SizedBox(height: 16),
                            const Text('No scholarships found', style: TextStyle(color: AppTheme.textSecondary, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    )
                  : SliverPadding(
                      padding: const EdgeInsets.all(24),
                      sliver: SliverList(
                        delegate: SliverChildBuilderDelegate(
                          (context, index) => _scholarshipCard(_filteredScholarships[index]),
                          childCount: _filteredScholarships.length,
                        ),
                      ),
                    ),
          
          SliverToBoxAdapter(
            child: _AdvisorCTA(onBooking: () => showBookCounsellingSheet(context)),
          ),
          
          const SliverToBoxAdapter(child: SizedBox(height: 60)),
        ],
      ),
    );
  }

  Widget _tabButton(String text, bool active) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          text.toUpperCase(),
          style: TextStyle(
            color: active ? AppTheme.textPrimary : AppTheme.textSecondary.withOpacity(0.5),
            fontSize: 11,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.5,
          ),
        ),
        if (active) ...[
          const SizedBox(height: 8),
          Container(height: 2, width: 40, color: AppTheme.gold),
        ],
      ],
    );
  }

  Widget _scholarshipCard(ScholarshipItem s) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 20,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: InkWell(
        onTap: () => context.push('/resources/scholarships/${s.slug}'),
        borderRadius: BorderRadius.circular(24),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.gold.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      s.category.toUpperCase(),
                      style: const TextStyle(color: AppTheme.gold, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 1),
                    ),
                  ),
                  const Icon(LucideIcons.bookmark, size: 18, color: AppTheme.textSecondary),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                s.name,
                style: const TextStyle(
                  fontFamily: 'Cormorant Garamond',
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                  height: 1.1,
                ),
              ),
              const SizedBox(height: 8),
              RichText(
                text: TextSpan(
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppTheme.textSecondary, letterSpacing: 1),
                  children: [
                    const TextSpan(text: 'PROVIDER: '),
                    TextSpan(
                      text: s.sponsor.toUpperCase(),
                      style: TextStyle(color: AppTheme.textPrimary.withOpacity(0.7), fontWeight: FontWeight.w500),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              const Divider(height: 1, color: AppTheme.borderLight),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('CLOSING DATE', style: TextStyle(color: AppTheme.textSecondary, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 1)),
                        const SizedBox(height: 4),
                        Text(s.deadline, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('AWARD VALUE', style: TextStyle(color: AppTheme.gold, fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 1)),
                        const SizedBox(height: 4),
                        Text(s.amount, style: const TextStyle(color: AppTheme.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  Container(
                    width: 44,
                    height: 44,
                    decoration: const BoxDecoration(
                      color: AppTheme.darkBrown,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(LucideIcons.arrowRight, color: Colors.white, size: 18),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  _SliverAppBarDelegate({
    required this.minHeight,
    required this.maxHeight,
    required this.child,
  });
  final double minHeight;
  final double maxHeight;
  final Widget child;

  @override
  double get minExtent => minHeight;
  @override
  double get maxExtent => maxHeight;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return SizedBox.expand(child: child);
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return maxHeight != oldDelegate.maxHeight ||
        minHeight != oldDelegate.minHeight ||
        child != oldDelegate.child;
  }
}
class _AdvisorCTA extends StatelessWidget {
  final VoidCallback onBooking;
  const _AdvisorCTA({required this.onBooking});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 24),
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: AppTheme.darkBrown,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 30,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          const Text(
            'Expert Financial',
            style: TextStyle(
              fontFamily: 'Cormorant Garamond',
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          ShaderMask(
            shaderCallback: (bounds) => const LinearGradient(
              colors: [Color(0xFFC5A059), Color(0xFFE6D5B8), Color(0xFFC5A059)],
            ).createShader(bounds),
            child: const Text(
              'Guidance',
              style: TextStyle(
                fontFamily: 'Cormorant Garamond',
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                height: 0.9,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Connect with our dedicated funding specialists to maximize your chances of securing institutional support.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.white.withOpacity(0.5),
              fontSize: 13,
              fontWeight: FontWeight.w500,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 28),
          ElevatedButton(
            onPressed: onBooking,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.gold,
              foregroundColor: AppTheme.darkBrown,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 10,
              shadowColor: AppTheme.gold.withOpacity(0.3),
            ),
            child: const Text(
              'SCHEDULE BRIEFING',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w900,
                letterSpacing: 2,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
