import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
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
  int _currentIndex = 0;

  final List<_NavItem> _navItems = [
    _NavItem(icon: Icons.home_rounded, label: 'Home', route: '/'),
    _NavItem(icon: Icons.public_rounded, label: 'Countries', route: '/countries'),
    _NavItem(icon: Icons.medical_services_outlined, label: 'Services', route: '/services'),
    _NavItem(icon: Icons.person_rounded, label: 'Dashboard', route: '/dashboard'),
    _NavItem(icon: Icons.more_horiz_rounded, label: 'More', route: ''),
  ];

  void _onTap(int index) {
    if (index == 4) {
      _showMoreMenu(context);
      return;
    }
    setState(() => _currentIndex = index);
    context.go(_navItems[index].route);
  }

  void _showMoreMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => _MoreMenuSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: AppTheme.borderLight, width: 1)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(_navItems.length, (i) {
                final item = _navItems[i];
                final isSelected = _currentIndex == i && i != 4;
                return GestureDetector(
                  onTap: () => _onTap(i),
                  behavior: HitTestBehavior.opaque,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? AppTheme.gold.withOpacity(0.12) : Colors.transparent,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          item.icon,
                          size: 22,
                          color: isSelected ? AppTheme.gold : AppTheme.textSecondary.withOpacity(0.6),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item.label,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: isSelected ? FontWeight.w900 : FontWeight.w600,
                            color: isSelected ? AppTheme.gold : AppTheme.textSecondary.withOpacity(0.6),
                            letterSpacing: 0.2,
                          ),
                        ),
                      ],
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
}

class _NavItem {
  final IconData icon;
  final String label;
  final String route;
  _NavItem({required this.icon, required this.label, required this.route});
}

class _MoreMenuSheet extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthProvider>();
    final items = [
      _MoreItem(Icons.shopping_cart_rounded, 'Cart', '/cart'),
      _MoreItem(Icons.article_rounded, 'Blogs', '/blogs'),
      _MoreItem(Icons.auto_awesome_rounded, 'AI Services', '/ai-services'),
      _MoreItem(Icons.menu_book_rounded, 'Resources', '/resources'),
      _MoreItem(Icons.star_rounded, 'Success Stories', '/success-stories'),
      _MoreItem(Icons.info_outline_rounded, 'About Us', '/about'),
      _MoreItem(Icons.mail_outline_rounded, 'Contact', '/contact'),
    ];

    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 12),
          Container(
            width: 40, height: 4,
            decoration: BoxDecoration(
              color: AppTheme.borderLight,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: GridView.count(
              crossAxisCount: 3,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              children: items.map((item) {
                return GestureDetector(
                  onTap: () {
                    Navigator.pop(context);
                    context.go(item.route);
                  },
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppTheme.background,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.borderLight),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(item.icon, color: AppTheme.gold, size: 24),
                        const SizedBox(height: 6),
                        Text(
                          item.label,
                          style: const TextStyle(
                            fontSize: 10, fontWeight: FontWeight.w700,
                            color: AppTheme.textPrimary,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: SizedBox(
              width: double.infinity,
              child: TextButton.icon(
                onPressed: () async {
                  Navigator.pop(context);
                  await auth.logout();
                },
                icon: const Icon(Icons.logout_rounded, color: Colors.red, size: 18),
                label: const Text('Sign Out',
                    style: TextStyle(color: Colors.red, fontWeight: FontWeight.w700, fontSize: 13)),
              ),
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}

class _MoreItem {
  final IconData icon;
  final String label;
  final String route;
  _MoreItem(this.icon, this.label, this.route);
}
