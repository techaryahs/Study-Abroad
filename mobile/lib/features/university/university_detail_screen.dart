import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../data/university_repository.dart';

class UniversityDetailScreen extends StatefulWidget {
  final String slug;
  const UniversityDetailScreen({super.key, required this.slug});

  @override
  State<UniversityDetailScreen> createState() => _UniversityDetailScreenState();
}

class _UniversityDetailScreenState extends State<UniversityDetailScreen> {
  late Future<UniversityItem?> _universityFuture;

  @override
  void initState() {
    super.initState();
    _universityFuture = UniversityRepository.getUniversityBySlug(widget.slug);
  }

  @override
  void didUpdateWidget(covariant UniversityDetailScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.slug != widget.slug) {
      _universityFuture = UniversityRepository.getUniversityBySlug(widget.slug);
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<UniversityItem?>(
      future: _universityFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        final details = snapshot.data;
        if (details == null) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('University Details'),
              backgroundColor: AppTheme.darkBrown,
            ),
            body: const Center(
              child: Text('University not found', style: TextStyle(fontSize: 16)),
            ),
          );
        }

        return Scaffold(
          backgroundColor: AppTheme.background,
          appBar: AppBar(
            backgroundColor: AppTheme.darkBrown,
            title: Text(details.name),
          ),
          body: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppTheme.darkBrown,
                    borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(30),
                      bottomRight: Radius.circular(30),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 16),
                      Text(details.name,
                          style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.w900, height: 1.1)),
                      const SizedBox(height: 12),
                      Text(details.location,
                          style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.6)),
                      const SizedBox(height: 20),
                      Wrap(
                        spacing: 10,
                        runSpacing: 10,
                        children: [
                          _badge(details.rank),
                          _badge(details.type),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _detailTile('Programs', details.programs),
                      const SizedBox(height: 12),
                      _detailTile('Fee', details.fee),
                      const SizedBox(height: 24),
                      const Text('About', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
                      const SizedBox(height: 10),
                      Text(details.about, style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.6)),
                      const SizedBox(height: 24),
                      const Text('Highlights', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.textPrimary)),
                      const SizedBox(height: 12),
                      ...details.highlights.map(
                        (feature) => Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('• ', style: TextStyle(fontSize: 18, color: AppTheme.gold)),
                              Expanded(child: Text(feature, style: const TextStyle(fontSize: 14, color: AppTheme.textSecondary, height: 1.6))),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 30),
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.gold,
                            foregroundColor: AppTheme.darkBrown,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          child: const Text('Apply for Guidance', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900)),
                        ),
                      ),
                      const SizedBox(height: 30),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _badge(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppTheme.gold.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(text, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.gold)),
    );
  }

  Widget _detailTile(String label, String value) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppTheme.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppTheme.textSecondary)),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppTheme.textPrimary)),
        ],
      ),
    );
  }
}
