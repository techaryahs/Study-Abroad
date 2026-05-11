import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:country_flags/country_flags.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/theme.dart';
import '../../data/university_repository.dart';

class UniversityListScreen extends StatefulWidget {
  final String country;
  final String? state;
  const UniversityListScreen({super.key, required this.country, this.state});

  @override
  State<UniversityListScreen> createState() => _UniversityListScreenState();
}

class _UniversityListScreenState extends State<UniversityListScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  String _searchQuery = '';
  late Future<UniversityCountry?> _countryFuture;

  @override
  void initState() {
    super.initState();
    _countryFuture = UniversityRepository.getCountryBySlug(widget.country);
  }

  @override
  void didUpdateWidget(covariant UniversityListScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.country != widget.country) {
      _countryFuture = UniversityRepository.getCountryBySlug(widget.country);
    }
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<UniversityCountry?>(
      future: _countryFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
              body: Center(
                  child: CircularProgressIndicator(color: AppTheme.gold)));
        }

        // ── Error Boundary ─────────────────────────────────────
        if (snapshot.hasError) {
          return Scaffold(
            backgroundColor: AppTheme.background,
            appBar: AppBar(
              backgroundColor: AppTheme.background,
              elevation: 0,
              iconTheme: const IconThemeData(color: AppTheme.textPrimary),
              leading: IconButton(
                icon: const Icon(LucideIcons.arrowLeft),
                onPressed: () =>
                    context.canPop() ? context.pop() : context.go('/countries'),
              ),
            ),
            body: Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(LucideIcons.alertTriangle,
                        size: 64, color: Colors.red.withOpacity(0.3)),
                    const SizedBox(height: 20),
                    const Text(
                      'Something went wrong',
                      style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.textPrimary),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Could not load universities for "${widget.country}".\nPlease check your connection and try again.',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          fontSize: 13,
                          color: AppTheme.textSecondary,
                          height: 1.6),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () {
                        setState(() {
                          _countryFuture =
                              UniversityRepository.getCountryBySlug(
                                  widget.country);
                        });
                      },
                      icon: const Icon(LucideIcons.refreshCw, size: 16),
                      label: const Text('RETRY',
                          style: TextStyle(
                              fontWeight: FontWeight.w900, letterSpacing: 1)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.gold,
                        foregroundColor: AppTheme.darkBrown,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 28, vertical: 12),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }

        final country = snapshot.data;
        if (country == null || country.universities.isEmpty) {
          return Scaffold(
            backgroundColor: AppTheme.background,
            appBar: AppBar(
              backgroundColor: AppTheme.background,
              elevation: 0,
              iconTheme: const IconThemeData(color: AppTheme.textPrimary),
              leading: IconButton(
                icon: const Icon(LucideIcons.arrowLeft),
                onPressed: () =>
                    context.canPop() ? context.pop() : context.go('/countries'),
              ),
            ),
            body: Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(LucideIcons.searchX,
                        size: 64, color: AppTheme.gold.withOpacity(0.2)),
                    const SizedBox(height: 16),
                    Text(
                      country == null
                          ? 'No institutional data found for "${widget.country}"'
                          : 'No universities available for ${country.name} yet',
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                          fontSize: 15,
                          color: AppTheme.textSecondary,
                          fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 20),
                    OutlinedButton.icon(
                      onPressed: () => context.canPop()
                          ? context.pop()
                          : context.go('/countries'),
                      icon: const Icon(LucideIcons.arrowLeft, size: 16),
                      label: const Text('GO BACK',
                          style: TextStyle(fontWeight: FontWeight.w800)),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppTheme.borderLight),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 24, vertical: 10),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }

        final universities = country.universities
            .where((u) =>
                (_searchQuery.isEmpty ||
                    u.name
                        .toLowerCase()
                        .contains(_searchQuery.toLowerCase())) &&
                (widget.state == null ||
                    u.stateName.toLowerCase() == widget.state!.toLowerCase()))
            .toList();

        return Scaffold(
          backgroundColor: AppTheme.background,
          body: CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 180,
                pinned: true,
                backgroundColor: AppTheme.background,
                elevation: 0,
                flexibleSpace: FlexibleSpaceBar(
                  background: Container(
                    padding: const EdgeInsets.fromLTRB(24, 80, 24, 20),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                  color: AppTheme.gold.withOpacity(0.1))),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: CountryFlag.fromCountryCode(country.code,
                                height: 44, width: 66),
                          ),
                        ),
                        const SizedBox(width: 20),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                widget.state != null
                                    ? 'Study in ${widget.state}'
                                    : 'Study in ${country.name}',
                                style: const TextStyle(
                                    fontFamily: 'Cormorant Garamond',
                                    fontSize: 24,
                                    fontWeight: FontWeight.w900,
                                    color: AppTheme.textPrimary),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                  '${universities.length} TOP INSTITUTIONS DOCUMENTED',
                                  style: const TextStyle(
                                      color: AppTheme.gold,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: 1)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                leading: IconButton(
                  icon: const Icon(LucideIcons.arrowLeft,
                      color: AppTheme.textPrimary),
                  onPressed: () => context.canPop()
                      ? context.pop()
                      : context.go('/countries'),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
                    ),
                    child: TextField(
                      controller: _searchCtrl,
                      onChanged: (v) => setState(() => _searchQuery = v),
                      style: const TextStyle(
                          fontSize: 14, fontWeight: FontWeight.bold),
                      decoration: const InputDecoration(
                        hintText: 'FILTER INSTITUTIONS...',
                        hintStyle: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1,
                            color: AppTheme.textSecondary),
                        prefixIcon: Icon(LucideIcons.search,
                            size: 18, color: AppTheme.gold),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(vertical: 16),
                      ),
                    ),
                  ),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.all(24),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (_, i) {
                      final u = universities[i];
                      return _uniCard(u)
                          .animate()
                          .fadeIn(delay: Duration(milliseconds: i * 50))
                          .slideY(begin: 0.1, end: 0);
                    },
                    childCount: universities.length,
                  ),
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        );
      },
    );
  }

  Widget _uniCard(UniversityItem u) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 20,
              offset: const Offset(0, 4))
        ],
      ),
      child: InkWell(
        onTap: () => context.push('/university/${u.slug}'),
        borderRadius: BorderRadius.circular(24),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                        color: AppTheme.background,
                        borderRadius: BorderRadius.circular(16),
                        border:
                            Border.all(color: AppTheme.gold.withOpacity(0.1))),
                    child: ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: _buildLogo(u.logo)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                                child: Text(u.name,
                                    style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.textPrimary))),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                  color: AppTheme.gold.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(4)),
                              child: Text('#${u.rank}',
                                  style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w900,
                                      color: AppTheme.gold)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(LucideIcons.mapPin,
                                size: 10, color: AppTheme.gold),
                            const SizedBox(width: 4),
                            Expanded(
                                child: Text(u.fullLocation,
                                    style: const TextStyle(
                                        fontSize: 13,
                                        color: AppTheme.textSecondary),
                                    overflow: TextOverflow.ellipsis)),
                          ],
                        ),
                        const SizedBox(height: 12),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: [
                              _badge(
                                  LucideIcons.checkCircle2,
                                  '8%',
                                  const Color(0xFF10B981).withOpacity(0.1),
                                  const Color(0xFF10B981)),
                              const SizedBox(width: 8),
                              _badge(
                                  LucideIcons.graduationCap,
                                  u.fee,
                                  AppTheme.gold.withOpacity(0.1),
                                  AppTheme.gold),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _badge(IconData icon, String label, Color bg, Color text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration:
          BoxDecoration(color: bg, borderRadius: BorderRadius.circular(8)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 10, color: text),
          const SizedBox(width: 4),
          Text(label,
              style: TextStyle(
                  fontSize: 14, fontWeight: FontWeight.w900, color: text)),
        ],
      ),
    );
  }

  Widget _buildLogo(String? path) {
    if (path == null)
      return const Icon(LucideIcons.graduationCap, color: AppTheme.gold);
    if (path.startsWith('http')) {
      return Image.network(path,
          fit: BoxFit.contain,
          errorBuilder: (_, __, ___) =>
              const Icon(LucideIcons.graduationCap, color: AppTheme.gold));
    }
    return Image.asset(path,
        fit: BoxFit.contain,
        errorBuilder: (_, __, ___) =>
            const Icon(LucideIcons.graduationCap, color: AppTheme.gold));
  }
}
