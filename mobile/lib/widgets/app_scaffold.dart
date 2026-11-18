import 'dart:io' show Platform;
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../features/auth/auth_provider.dart';

class AppScaffold extends StatefulWidget {
  final Widget child;
  const AppScaffold({super.key, required this.child});

  @override
  State<AppScaffold> createState() => _AppScaffoldState();
}

class _AppScaffoldState extends State<AppScaffold> {
  final List<_NavItem> _navItems = [
    _NavItem(icon: Icons.home_rounded, label: 'Home', route: '/'),
    _NavItem(icon: Icons.public_rounded, label: 'Countries', route: '/countries'),
    _NavItem(icon: Icons.auto_awesome_rounded, label: 'Services', route: '/services'),
    _NavItem(icon: Icons.person_rounded, label: 'Dashboard', route: '/dashboard'),
    _NavItem(icon: Icons.grid_view_rounded, label: 'More', route: ''),
  ];

  int _calculateSelectedIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    if (location.startsWith('/countries')) return 1;
    if (location.startsWith('/services')) return 2;
    if (location.startsWith('/dashboard')) return 3;
    if (location == '/') return 0;
    return -1;
  }

  void _onTap(int index) {
    if (index == _navItems.length - 1) {
      _showMoreMenu(context);
      return;
    }
    context.go(_navItems[index].route);
  }

  @override
  Widget build(BuildContext context) {
    final selectedIndex = _calculateSelectedIndex(context);

    return Scaffold(
      body: widget.child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(
            top: BorderSide(color: AppTheme.borderLight, width: 1),
          ),
          boxShadow: [
            BoxShadow(
              color: AppTheme.navyDark.withValues(alpha: 0.06),
              blurRadius: 24,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            child: Row(
              children: List.generate(_navItems.length, (i) {
                final item = _navItems[i];
                final isSelected = selectedIndex == i;
                return Expanded(
                  child: GestureDetector(
                    onTap: () => _onTap(i),
                    behavior: HitTestBehavior.opaque,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppTheme.gold.withValues(alpha: 0.14)
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            item.icon,
                            size: 21,
                            color: isSelected
                                ? AppTheme.goldDark
                                : AppTheme.textSecondary.withValues(alpha: 0.7),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            item.label,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                              color: isSelected
                                  ? AppTheme.navy
                                  : AppTheme.textSecondary.withValues(alpha: 0.7),
                              letterSpacing: 0.2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }),
            ),
          ),
        ),
      ),
    );
  }

  void _showMoreMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const SafeArea(
        bottom: true,
        top: false,
        child: _MoreMenuSheet(),
      ),
    );
  }
}

class _MoreMenuSheet extends StatelessWidget {
  const _MoreMenuSheet();

  @override
  Widget build(BuildContext context) {
    final items = [
      const _MoreItem(Icons.school_rounded, 'Universities', '/universities'),
      const _MoreItem(Icons.psychology_rounded, 'AI Services', '/ai-services'),
      if (!Platform.isIOS)
        const _MoreItem(Icons.shopping_cart_outlined, 'Cart', '/cart'),
      const _MoreItem(Icons.menu_book_rounded, 'Resources', '/resources'),
      const _MoreItem(Icons.support_agent_rounded, 'Contact', '/contact'),
      const _MoreItem(Icons.info_outline_rounded, 'About Us', '/about'),
    ];

    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: AppTheme.borderLight),
        boxShadow: AppTheme.navyShadow,
      ),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.8,
        ),
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 12),
              Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color: AppTheme.borderLight,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 18),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  children: [
                    Text(
                      'EXPLORE MORE',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 2.0,
                        color: AppTheme.tealDark,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                    childAspectRatio: 1.0,
                  ),
                  itemCount: items.length + 1,
                  itemBuilder: (context, i) {
                    // Last tile = Sign Out
                    if (i == items.length) {
                      return GestureDetector(
                        onTap: () {
                          showDialog(
                            context: context,
                            builder: (dialogContext) => AlertDialog(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(24),
                              ),
                              backgroundColor: Colors.white,
                              title: Text(
                                'Sign Out',
                                style: GoogleFonts.playfairDisplay(
                                  fontWeight: FontWeight.w800,
                                  fontSize: 18,
                                  color: AppTheme.navy,
                                ),
                              ),
                              content: Text(
                                'Are you sure you want to sign out of your account?',
                                style: GoogleFonts.inter(
                                  color: AppTheme.textSecondary,
                                  fontSize: 13,
                                ),
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(dialogContext),
                                  child: Text(
                                    'CANCEL',
                                    style: GoogleFonts.inter(
                                      fontWeight: FontWeight.w800,
                                      fontSize: 12,
                                      letterSpacing: 1.2,
                                      color: AppTheme.textSecondary,
                                    ),
                                  ),
                                ),
                                ElevatedButton(
                                  onPressed: () async {
                                    Navigator.pop(dialogContext);
                                    Navigator.pop(context);
                                    await context.read<AuthProvider>().logout();
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.redAccent,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 20,
                                      vertical: 10,
                                    ),
                                  ),
                                  child: Text(
                                    'SIGN OUT',
                                    style: GoogleFonts.inter(
                                      fontWeight: FontWeight.w800,
                                      fontSize: 12,
                                      letterSpacing: 1.2,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.red.withValues(alpha: 0.05),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: Colors.red.withValues(alpha: 0.15),
                            ),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(
                                Icons.logout_rounded,
                                color: Colors.redAccent,
                                size: 24,
                              ),
                              const SizedBox(height: 6),
                              Text(
                                'Sign Out',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.redAccent,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                      );
                    }
                    final item = items[i];
                    return GestureDetector(
                      onTap: () {
                        Navigator.pop(context);
                        context.push(item.route);
                      },
                      child: Container(
                        decoration: BoxDecoration(
                          color: AppTheme.background,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.borderLight),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(item.icon, color: AppTheme.goldDark, size: 24),
                            const SizedBox(height: 6),
                            Text(
                              item.label,
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                                color: AppTheme.navy,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}

class _MoreItem {
  final IconData icon;
  final String label;
  final String route;
  const _MoreItem(this.icon, this.label, this.route);
}

class _NavItem {
  final IconData icon;
  final String label;
  final String route;
  _NavItem({required this.icon, required this.label, required this.route});
}
