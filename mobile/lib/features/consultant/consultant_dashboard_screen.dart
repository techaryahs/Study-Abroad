import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';
import '../auth/auth_provider.dart';
import 'package:go_router/go_router.dart';

class ConsultantDashboardScreen extends StatefulWidget {
  const ConsultantDashboardScreen({super.key});
  @override
  State<ConsultantDashboardScreen> createState() =>
      _ConsultantDashboardScreenState();
}

class _ConsultantDashboardScreenState extends State<ConsultantDashboardScreen> {
  List<dynamic> _bookings = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchBookings();
  }

  Future<void> _fetchBookings() async {
    try {
      final res = await ApiClient.instance.get('/api/bookings/consultant');
      setState(() {
        _bookings = res.data is List ? res.data : [];
        _loading = false;
      });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  void _showDeleteAccountDialog() {
    final textController = TextEditingController();
    bool isDeleteEnabled = false;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          backgroundColor: Colors.white,
          title: const Row(
            children: [
              Icon(Icons.warning_amber_rounded, color: Colors.redAccent, size: 24),
              SizedBox(width: 8),
              Text(
                'Delete Account?',
                style: TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                  fontFamily: 'Playfair Display',
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'This action is permanent and cannot be undone. To confirm, please type "DELETE" below.',
                style: TextStyle(color: Colors.black54, fontSize: 13, height: 1.4),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: textController,
                onChanged: (val) {
                  setState(() {
                    isDeleteEnabled = val.trim().toUpperCase() == 'DELETE';
                  });
                },
                decoration: InputDecoration(
                  hintText: 'DELETE',
                  hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                  filled: true,
                  fillColor: AppTheme.background,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppTheme.borderLight),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.redAccent),
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                textController.dispose();
                Navigator.pop(dialogContext);
              },
              child: const Text(
                'CANCEL',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 13,
                  color: Colors.black54,
                ),
              ),
            ),
            ElevatedButton(
              onPressed: isDeleteEnabled
                  ? () async {
                      Navigator.pop(dialogContext);
                      textController.dispose();
                      
                      // Show loading indicator
                      showDialog(
                        context: context,
                        barrierDismissible: false,
                        builder: (context) => const Center(
                          child: CircularProgressIndicator(
                            color: Colors.redAccent,
                          ),
                        ),
                      );

                      try {
                        await context.read<AuthProvider>().deleteAccount();
                        if (mounted) Navigator.pop(context);
                      } catch (e) {
                        if (mounted) Navigator.pop(context);
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Error deleting account: $e'),
                              backgroundColor: Colors.redAccent,
                            ),
                          );
                        }
                      }
                    }
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.redAccent,
                foregroundColor: Colors.white,
                disabledBackgroundColor: Colors.redAccent.withOpacity(0.3),
                disabledForegroundColor: Colors.white.withOpacity(0.6),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                elevation: 0,
              ),
              child: const Text(
                'DELETE ACCOUNT',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
              ),
            ),
          ],
        ),
      ),
    );
  }


  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            backgroundColor: AppTheme.darkBrown,
            expandedHeight: 140,
            actions: [
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert_rounded, color: Colors.white54),
                onSelected: (value) async {
                  if (value == 'logout') {
                    await auth.logout();
                  } else if (value == 'delete_account') {
                    _showDeleteAccountDialog();
                  }
                },
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'logout',
                    child: Row(
                      children: [
                        Icon(Icons.logout_rounded, size: 20),
                        SizedBox(width: 8),
                        Text('Logout'),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'delete_account',
                    child: Row(
                      children: [
                        Icon(Icons.delete_forever_rounded, color: Colors.redAccent, size: 20),
                        SizedBox(width: 8),
                        Text('Delete Account', style: TextStyle(color: Colors.redAccent)),
                      ],
                    ),
                  ),
                ],
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                color: AppTheme.darkBrown,
                alignment: Alignment.bottomLeft,
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
                child: SafeArea(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Flexible(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Text('Consultant Dashboard',
                              style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 22,
                                  fontWeight: FontWeight.w900)),
                        ),
                      ),
                      Flexible(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Text(auth.user?['name'] ?? 'Consultant',
                              style: TextStyle(
                                  color: Colors.white.withOpacity(0.5),
                                  fontSize: 13)),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats
                  Row(children: [
                    _statCard('${_bookings.length}', 'Total Bookings',
                        Icons.calendar_today_rounded),
                    const SizedBox(width: 12),
                    _statCard(
                        '${_bookings.where((b) => b['status'] == 'confirmed').length}',
                        'Confirmed',
                        Icons.check_circle_rounded),
                  ]).animate().fadeIn(duration: 400.ms),

                  const SizedBox(height: 24),

                  const Text('UPCOMING BOOKINGS',
                      style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 2,
                          color: AppTheme.gold)),
                  const SizedBox(height: 14),

                  if (_loading)
                    const Center(
                        child: CircularProgressIndicator(color: AppTheme.gold))
                  else if (_bookings.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.borderLight)),
                      child: const Center(
                        child: Text('No bookings yet',
                            style: TextStyle(
                                color: AppTheme.textSecondary, fontSize: 13)),
                      ),
                    )
                  else
                    ..._bookings.asMap().entries.map((e) {
                      final b = e.value;
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: AppTheme.borderLight),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                  color: AppTheme.gold.withOpacity(0.1),
                                  shape: BoxShape.circle),
                              child: const Icon(Icons.person_rounded,
                                  color: AppTheme.gold, size: 22),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                      b['studentName'] ??
                                          b['name'] ??
                                          'Student',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w800,
                                          color: AppTheme.textPrimary)),
                                  Text(b['date'] ?? b['preferredDate'] ?? '—',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                          fontSize: 13,
                                          color: AppTheme.textSecondary)),
                                ],
                              ),
                            ),
                            GestureDetector(
                              onTap: () => context.push('/meeting/${b['_id']}', extra: Map<String, dynamic>.from(b)),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                decoration: BoxDecoration(
                                  color: AppTheme.gold,
                                  borderRadius: BorderRadius.circular(12),
                                  boxShadow: [BoxShadow(color: AppTheme.gold.withOpacity(0.3), blurRadius: 8)],
                                ),
                                child: const FittedBox(
                                  fit: BoxFit.scaleDown,
                                  child: Text('JOIN CALL',
                                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Colors.black)),
                                ),
                              ),
                            ),
                          ],
                        ),
                      )
                          .animate()
                          .fadeIn(delay: Duration(milliseconds: e.key * 60));
                    }),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _statCard(String value, String label, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppTheme.borderLight),
        ),
        child: Row(
          children: [
            Icon(icon, color: AppTheme.gold, size: 22),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.centerLeft,
                    child: Text(value,
                        style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                            color: AppTheme.textPrimary)),
                  ),
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.centerLeft,
                    child: Text(label,
                        style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.textSecondary,
                            fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
