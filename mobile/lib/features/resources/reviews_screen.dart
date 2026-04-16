import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';
import 'package:intl/intl.dart';

class ReviewsScreen extends StatefulWidget {
  const ReviewsScreen({super.key});

  @override
  State<ReviewsScreen> createState() => _ReviewsScreenState();
}

class _ReviewsScreenState extends State<ReviewsScreen> {
  List<dynamic> _reviews = [];
  bool _loading = true;
  String _activeFilter = 'all';
  int _total = 0;
  List<String> _filters = ['all'];

  @override
  void initState() {
    super.initState();
    _fetchReviews();
  }

  Future<void> _fetchReviews() async {
    setState(() => _loading = true);
    try {
      final params = {'limit': '50'};
      if (_activeFilter != 'all') params['service'] = _activeFilter;
      
      final res = await ApiClient.instance.get('/api/reviews', queryParameters: params);
      setState(() {
        _reviews = res.data['reviews'] ?? [];
        _total = res.data['total'] ?? 0;
        
        // Extract filters from stats if available
        if (res.data['stats'] != null) {
          final stats = List<Map<String, dynamic>>.from(res.data['stats']);
          _filters = ['all', ...stats.map((s) => s['_id'] as String).where((id) => id.isNotEmpty)];
        }
      });
    } catch (e) {
      debugPrint('Error fetching reviews: $e');
    } finally {
      setState(() => _loading = false);
    }
  }

  void _showReviewForm() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _WriteReviewSheet(onSuccess: _fetchReviews),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          // ── HERO APP BAR ──
          SliverAppBar(
            expandedHeight: 240.0,
            floating: false,
            pinned: true,
            backgroundColor: AppTheme.background,
            surfaceTintColor: Colors.transparent,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20, color: AppTheme.textPrimary),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      AppTheme.gold.withOpacity(0.08),
                      AppTheme.background,
                    ],
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 80, 24, 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          'STUDENT VOICES',
                          style: GoogleFonts.outfit(
                            color: AppTheme.gold,
                            fontWeight: FontWeight.w800,
                            fontSize: 10,
                            letterSpacing: 2,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Real Reviews',
                        style: GoogleFonts.cormorantGaramond(
                          color: AppTheme.textPrimary,
                          fontSize: 48,
                          fontWeight: FontWeight.w700,
                          height: 1,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            _total.toString(),
                            style: GoogleFonts.outfit(
                              fontSize: 24,
                              fontWeight: FontWeight.w900,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'HONEST FEEDBACKS',
                            style: GoogleFonts.outfit(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textMuted,
                              letterSpacing: 1,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // ── FILTERS ──
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              child: Row(
                children: _filters.map((f) {
                  final isActive = _activeFilter == f;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(
                        f == 'all' ? 'ALL REVIEWS' : f.toUpperCase(),
                        style: GoogleFonts.outfit(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.5,
                          color: isActive ? AppTheme.gold : AppTheme.textSecondary,
                        ),
                      ),
                      selected: isActive,
                      onSelected: (val) {
                        if (val) {
                          setState(() => _activeFilter = f);
                          _fetchReviews();
                        }
                      },
                      backgroundColor: Colors.white,
                      selectedColor: AppTheme.darkBrown,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(
                          color: isActive ? AppTheme.darkBrown : AppTheme.borderLight,
                        ),
                      ),
                      showCheckmark: false,
                    ),
                  );
                }).toList(),
              ),
            ),
          ),

          // ── REVIEWS LIST ──
          if (_loading)
            SliverFillRemaining(
              child: Center(
                child: CircularProgressIndicator(color: AppTheme.gold),
              ),
            )
          else if (_reviews.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Text(
                  'No reviews found for this section.',
                  style: GoogleFonts.outfit(color: AppTheme.textMuted),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.all(20),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final review = _reviews[index];
                    return _ReviewCard(review: review)
                        .animate()
                        .fadeIn(delay: Duration(milliseconds: index * 50))
                        .slideY(begin: 0.1, end: 0);
                  },
                  childCount: _reviews.length,
                ),
              ),
            ),
          
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showReviewForm,
        backgroundColor: AppTheme.darkBrown,
        foregroundColor: AppTheme.gold,
        icon: const Icon(Icons.rate_review_outlined),
        label: Text(
          'WRITE A REVIEW',
          style: GoogleFonts.outfit(fontWeight: FontWeight.w800, letterSpacing: 1),
        ),
      ),
    );
  }
}

class _WriteReviewSheet extends StatefulWidget {
  final VoidCallback onSuccess;
  const _WriteReviewSheet({required this.onSuccess});

  @override
  State<_WriteReviewSheet> createState() => _WriteReviewSheetState();
}

class _WriteReviewSheetState extends State<_WriteReviewSheet> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _titleController = TextEditingController();
  final _bodyController = TextEditingController();
  String? _selectedService;
  double _rating = 0;
  bool _submitting = false;

  final List<String> _services = [
    "Initial Counseling Session",
    "Profile Evaluation & University Shortlisting",
    "Statement of Purpose / Essay Writing",
    "Letter of Recommendation Drafting",
    "Personal History Statement Drafting",
    "Premium Resume Drafting",
    "Complete Application Help",
    "Visa Application Help",
    "US Visa Mock Interview",
    "Scholarship Application Help",
    "LinkedIn Profile Boosting",
    "Research Paper Drafting & Publishing Help",
    "Cover Letter Writing",
    "GRE Preparation",
    "TOEFL Preparation",
    "Singapore Pass Application",
    "EB-2 NIW Application",
  ];

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_rating == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a rating')),
      );
      return;
    }
    if (_selectedService == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a service')),
      );
      return;
    }

    setState(() => _submitting = true);
    try {
      await ApiClient.instance.post('/api/reviews', data: {
        'name': _nameController.text.trim(),
        'service': _selectedService,
        'rating': _rating.toInt(),
        'title': _titleController.text.trim(),
        'body': _bodyController.text.trim(),
      });
      
      if (!mounted) return;
      Navigator.pop(context);
      widget.onSuccess();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Thank you for your review!')),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to submit: ${e.toString()}')),
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppTheme.background,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(32),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppTheme.borderLight,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'SHARE YOUR EXPERIENCE',
                style: GoogleFonts.outfit(
                  color: AppTheme.gold,
                  fontWeight: FontWeight.w800,
                  fontSize: 10,
                  letterSpacing: 2,
                ),
              ),
              Text(
                'Write a Review',
                style: GoogleFonts.cormorantGaramond(
                  color: AppTheme.textPrimary,
                  fontSize: 32,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 24),
              _buildLabel('YOUR NAME *'),
              TextFormField(
                controller: _nameController,
                decoration: _inputDecoration('e.g. Arjun Sharma'),
                validator: (v) => v!.isEmpty ? 'Name is required' : null,
              ),
              const SizedBox(height: 20),
              _buildLabel('SERVICE *'),
              DropdownButtonFormField<String>(
                value: _selectedService,
                dropdownColor: Colors.white,
                items: _services.map((s) => DropdownMenuItem(
                  value: s,
                  child: Text(s, style: GoogleFonts.outfit(fontSize: 14)),
                )).toList(),
                onChanged: (v) => setState(() => _selectedService = v),
                decoration: _inputDecoration('Select a service'),
              ),
              const SizedBox(height: 20),
              _buildLabel('OVERALL RATING *'),
              Row(
                children: List.generate(5, (index) => IconButton(
                  onPressed: () => setState(() => _rating = index + 1.0),
                  icon: Icon(
                    Icons.star_rounded,
                    size: 32,
                    color: index < _rating ? AppTheme.gold : AppTheme.borderLight,
                  ),
                )),
              ),
              const SizedBox(height: 20),
              _buildLabel('REVIEW TITLE'),
              TextFormField(
                controller: _titleController,
                decoration: _inputDecoration('Summarize your experience'),
              ),
              const SizedBox(height: 20),
              _buildLabel('YOUR REVIEW *'),
              TextFormField(
                controller: _bodyController,
                maxLines: 4,
                decoration: _inputDecoration('Tell us about your experience...'),
                validator: (v) => v!.isEmpty ? 'Review text is required' : null,
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _submitting ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.darkBrown,
                    foregroundColor: AppTheme.gold,
                    padding: const EdgeInsets.symmetric(vertical: 20),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: _submitting
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: AppTheme.gold,
                          ),
                        )
                      : Text(
                          'SUBMIT REVIEW',
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: GoogleFonts.outfit(
          fontSize: 10,
          fontWeight: FontWeight.w900,
          color: AppTheme.gold,
          letterSpacing: 1.5,
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: GoogleFonts.outfit(color: AppTheme.textMuted, fontSize: 14),
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppTheme.gold.withOpacity(0.2)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppTheme.gold.withOpacity(0.1)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppTheme.gold),
      ),
    );
  }
}


class _ReviewCard extends StatelessWidget {
  final dynamic review;
  const _ReviewCard({required this.review});

  @override
  Widget build(BuildContext context) {
    final name = review['name'] ?? 'Anonymous';
    final initials = name.split(' ').map((e) => e.isNotEmpty ? e[0] : '').take(2).join('').toUpperCase();
    final rating = (review['rating'] ?? 0).toDouble();
    final date = review['createdAt'] != null 
        ? DateFormat('d MMM, yyyy').format(DateTime.parse(review['createdAt']))
        : '';

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.gold.withOpacity(0.15)),
        boxShadow: [
          BoxShadow(
            color: AppTheme.darkBrown.withOpacity(0.03),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppTheme.darkBrown,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    initials,
                    style: GoogleFonts.outfit(
                      color: AppTheme.gold,
                      fontWeight: FontWeight.w900,
                      fontSize: 14,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          name,
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.w700,
                            fontSize: 14,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                        if (review['isVerified'] == true) ...[
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'VERIFIED',
                              style: GoogleFonts.outfit(
                                fontSize: 6,
                                fontWeight: FontWeight.w900,
                                color: AppTheme.gold,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: List.generate(5, (i) => Icon(
                        Icons.star_rounded,
                        size: 14,
                        color: i < rating ? AppTheme.gold : AppTheme.borderLight,
                      )),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.background,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.borderLight),
            ),
            child: Text(
              (review['service'] ?? 'General').toUpperCase(),
              style: GoogleFonts.outfit(
                fontSize: 8,
                fontWeight: FontWeight.w900,
                color: AppTheme.textSecondary,
                letterSpacing: 0.5,
              ),
            ),
          ),
          const SizedBox(height: 12),
          if (review['title'] != null && review['title'].toString().isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Text(
                review['title'],
                style: GoogleFonts.outfit(
                  fontWeight: FontWeight.w700,
                  fontSize: 15,
                  color: AppTheme.textPrimary,
                ),
              ),
            ),
          Text(
            review['body'] ?? '',
            style: GoogleFonts.outfit(
              fontSize: 14,
              color: AppTheme.textSecondary,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            date,
            style: GoogleFonts.outfit(
              fontSize: 10,
              fontWeight: FontWeight.w600,
              color: AppTheme.textMuted,
            ),
          ),
        ],
      ),
    );
  }
}
