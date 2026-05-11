import 'package:flutter/material.dart';
import '../../../widgets/book_counselling_sheet.dart';

// ─── Theme Colors ─────────────────────────────────────────────────────────────

const _bg = Color(0xFFFDFBF7);
const _dark = Color(0xFF2D2926);
const _gold = Color(0xFFC5A059);
const _muted = Color(0xFF6B5E51);
const _border = Color(0xFFF1EDEA);
const _subtle = Color(0xFFA8A29E);
const _white = Colors.white;

// ─── Tab Type ─────────────────────────────────────────────────────────────────

enum _Tab { available, your, know }

// ─── Sidebar Item Model ───────────────────────────────────────────────────────

class _SidebarItem {
  final _Tab id;
  final String label;
  final IconData icon;
  const _SidebarItem({required this.id, required this.label, required this.icon});
}

const _sidebarItems = [
  _SidebarItem(id: _Tab.available, label: 'Research Hub', icon: Icons.group_outlined),
  _SidebarItem(id: _Tab.your, label: 'Active Collaborations', icon: Icons.person_outline),
  _SidebarItem(id: _Tab.know, label: 'Institutional Guidelines', icon: Icons.info_outline),
];

// ─── Entry Point ──────────────────────────────────────────────────────────────

class ResearchGroupsScreen extends StatefulWidget {
  const ResearchGroupsScreen({super.key});

  @override
  State<ResearchGroupsScreen> createState() => _ResearchGroupsScreenState();
}

class _ResearchGroupsScreenState extends State<ResearchGroupsScreen> {
  _Tab _activeTab = _Tab.available;
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  bool _showCreateModal = false;
  bool _showDrawer = false;

  @override
  void dispose() {
    _searchController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _openCreate() {
    setState(() => _showCreateModal = true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bg,
      body: Stack(
        children: [
          SafeArea(
            child: Column(
              children: [
                _TopBar(
                  onMenuTap: () => setState(() => _showDrawer = true),
                  activeTab: _activeTab,
                ),
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _HeroHeader(),
                          _MainContent(
                            activeTab: _activeTab,
                            searchController: _searchController,
                            emailController: _emailController,
                            onCreateTap: _openCreate,
                            onConsultTap: () => showBookCounsellingSheet(context),
                          ),
                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Drawer overlay
          if (_showDrawer)
            _NavDrawer(
              activeTab: _activeTab,
              onTabSelect: (tab) {
                setState(() {
                  _activeTab = tab;
                  _showDrawer = false;
                });
              },
              onClose: () => setState(() => _showDrawer = false),
              onCreateTap: () {
                setState(() => _showDrawer = false);
                _openCreate();
              },
            ),

          // Create group modal
          if (_showCreateModal)
            _CreateGroupSheet(onClose: () => setState(() => _showCreateModal = false)),
        ],
      ),
    );
  }
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

class _TopBar extends StatelessWidget {
  final VoidCallback onMenuTap;
  final _Tab activeTab;
  const _TopBar({required this.onMenuTap, required this.activeTab});

  String get _tabLabel {
    switch (activeTab) {
      case _Tab.available: return 'Research Hub';
      case _Tab.your: return 'Active Collaborations';
      case _Tab.know: return 'Institutional Guidelines';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: _bg,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Row(
        children: [
          GestureDetector(
            onTap: onMenuTap,
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: _white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _gold.withOpacity(0.2)),
              ),
              child: const Icon(Icons.menu, color: _dark, size: 20),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              _tabLabel,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: _dark, letterSpacing: 0.3),
            ),
          ),
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: _white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _gold.withOpacity(0.2)),
            ),
            child: const Icon(Icons.notifications_none_outlined, color: _dark, size: 20),
          ),
        ],
      ),
    );
  }
}

// ─── Nav Drawer ───────────────────────────────────────────────────────────────

class _NavDrawer extends StatelessWidget {
  final _Tab activeTab;
  final ValueChanged<_Tab> onTabSelect;
  final VoidCallback onClose;
  final VoidCallback onCreateTap;
  const _NavDrawer({required this.activeTab, required this.onTabSelect, required this.onClose, required this.onCreateTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onClose,
      child: Container(
        color: Colors.black54,
        child: Align(
          alignment: Alignment.centerLeft,
          child: GestureDetector(
            onTap: () {},
            child: Container(
              width: MediaQuery.of(context).size.width * 0.78,
              height: double.infinity,
              color: _white,
              child: SafeArea(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
                      child: Row(
                        children: [
                          _GoldShimmerText('Research', fontSize: 22),
                          const Text(' Groups', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: _dark)),
                          const Spacer(),
                          GestureDetector(
                            onTap: onClose,
                            child: const Icon(Icons.close, color: _muted, size: 20),
                          ),
                        ],
                      ),
                    ),
                    const Divider(color: _border, height: 24),

                    // Nav items
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Column(
                        children: [
                          ..._sidebarItems.map((item) {
                            final isActive = activeTab == item.id;
                            return GestureDetector(
                              onTap: () => onTabSelect(item.id),
                              child: Container(
                                margin: const EdgeInsets.only(bottom: 6),
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
                                decoration: BoxDecoration(
                                  color: isActive ? _dark : Colors.transparent,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Row(
                                  children: [
                                    Icon(item.icon, color: isActive ? _gold : _muted, size: 18),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Text(
                                        item.label.toUpperCase(),
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w800,
                                          color: isActive ? _white : _muted,
                                          letterSpacing: 0.8,
                                        ),
                                      ),
                                    ),
                                    if (isActive) const Icon(Icons.arrow_forward, color: _white, size: 14),
                                  ],
                                ),
                              ),
                            );
                          }),
                          const Divider(color: _border, height: 20),
                          GestureDetector(
                            onTap: onCreateTap,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
                              child: Row(
                                children: const [
                                  Icon(Icons.add_circle_outline, color: _gold, size: 20),
                                  SizedBox(width: 12),
                                  Text('INITIATE NEW GROUP', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: _gold, letterSpacing: 0.8)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const Spacer(),

                    // Newsletter compact in drawer
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Container(
                        decoration: BoxDecoration(color: _dark, borderRadius: BorderRadius.circular(20)),
                        padding: const EdgeInsets.all(18),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Icon(Icons.notifications, color: _gold, size: 20),
                            const SizedBox(height: 8),
                            const Text('Cluster Updates', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: _white)),
                            const SizedBox(height: 4),
                            const Text('Briefings on emerging research opportunities.', style: TextStyle(fontSize: 13, color: _subtle)),
                            const SizedBox(height: 14),
                            _DarkEmailField(),
                            const SizedBox(height: 10),
                            _GoldButton(label: 'SUBSCRIBE', onTap: () {}),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ─── Hero Header ─────────────────────────────────────────────────────────────

class _HeroHeader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [_gold.withOpacity(0.06), _bg.withOpacity(0)],
        ),
      ),
      padding: const EdgeInsets.fromLTRB(20, 28, 20, 28),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              border: Border.all(color: _gold.withOpacity(0.3)),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              'GLOBAL COLLABORATION FRAMEWORK',
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: _gold, letterSpacing: 1.5),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Scholarly ', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: _dark)),
            ],
          ),
          _GoldShimmerText('Research Clusters', fontSize: 28, center: true),
          const SizedBox(height: 14),
          const Text(
            'Architecting the next generation of academic breakthrough through cross-institutional collaboration and data synthesis.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: _muted, height: 1.6),
          ),
        ],
      ),
    );
  }
}

// ─── Main Content ─────────────────────────────────────────────────────────────

class _MainContent extends StatelessWidget {
  final _Tab activeTab;
  final TextEditingController searchController;
  final TextEditingController emailController;
  final VoidCallback onCreateTap;
  final VoidCallback onConsultTap;

  const _MainContent({
    required this.activeTab,
    required this.searchController,
    required this.emailController,
    required this.onCreateTap,
    required this.onConsultTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Tab pill strip
          _TabPillStrip(activeTab: activeTab),
          const SizedBox(height: 20),

          // Info banner (available tab only)
          if (activeTab == _Tab.available) ...[
            _InfoBanner(),
            const SizedBox(height: 16),
          ],

          // Search + Create (available tab only)
          if (activeTab == _Tab.available) ...[
            _SearchRow(controller: searchController, onCreateTap: onCreateTap),
            const SizedBox(height: 20),
          ],

          // Tab content
          _TabContent(activeTab: activeTab, onCreateTap: onCreateTap),

          // Bottom liaison banner (available tab only)
          if (activeTab == _Tab.available) ...[
            const SizedBox(height: 28),
            _LiaisonBanner(onTap: onConsultTap),
          ],
        ],
      ),
    );
  }
}

// ─── Tab Pill Strip ───────────────────────────────────────────────────────────

class _TabPillStrip extends StatelessWidget {
  final _Tab activeTab;
  const _TabPillStrip({required this.activeTab});

  @override
  Widget build(BuildContext context) {
    // This widget is a workaround because _ResearchGroupsScreenState owns activeTab.
    // In practice wire this up via a callback; here it is display-only since
    // tab switching is handled via the drawer.
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: _sidebarItems.map((item) {
          final isActive = activeTab == item.id;
          return Container(
            margin: const EdgeInsets.only(right: 8),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: isActive ? _dark : _white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: isActive ? _dark : _gold.withOpacity(0.2)),
            ),
            child: Row(
              children: [
                Icon(item.icon, color: isActive ? _gold : _muted, size: 14),
                const SizedBox(width: 6),
                Text(
                  item.label,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: isActive ? _white : _muted,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}

// ─── Info Banner ──────────────────────────────────────────────────────────────

class _InfoBanner extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: _white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _gold.withOpacity(0.15)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 8)],
      ),
      child: Row(
        children: [
          const Icon(Icons.info_outline, color: _gold, size: 16),
          const SizedBox(width: 10),
          Expanded(
            child: RichText(
              text: const TextSpan(
                style: TextStyle(fontSize: 14, color: _muted, fontWeight: FontWeight.w600),
                children: [
                  TextSpan(text: 'Publishing without co-authors? '),
                  TextSpan(text: 'Explore Paper Services', style: TextStyle(color: _gold, decoration: TextDecoration.underline)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Search Row ───────────────────────────────────────────────────────────────

class _SearchRow extends StatelessWidget {
  final TextEditingController controller;
  final VoidCallback onCreateTap;
  const _SearchRow({required this.controller, required this.onCreateTap});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Search field
        Container(
          decoration: BoxDecoration(
            color: _white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: _gold.withOpacity(0.2)),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 6)],
          ),
          child: TextField(
            controller: controller,
            style: const TextStyle(fontSize: 13, color: _dark),
            decoration: const InputDecoration(
              hintText: 'Locate clusters by field, topic, or investigator...',
              hintStyle: TextStyle(fontSize: 14, color: _subtle),
              prefixIcon: Icon(Icons.search, color: _subtle, size: 18),
              border: InputBorder.none,
              contentPadding: EdgeInsets.symmetric(vertical: 14),
            ),
          ),
        ),
        const SizedBox(height: 10),
        // Create button full width on mobile
        GestureDetector(
          onTap: onCreateTap,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(color: _dark, borderRadius: BorderRadius.circular(14)),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.add_circle_outline, color: _white, size: 16),
                SizedBox(width: 8),
                Text('CREATE CLUSTER', style: TextStyle(color: _white, fontSize: 13, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ─── Tab Content ─────────────────────────────────────────────────────────────

class _TabContent extends StatelessWidget {
  final _Tab activeTab;
  final VoidCallback onCreateTap;
  const _TabContent({required this.activeTab, required this.onCreateTap});

  @override
  Widget build(BuildContext context) {
    switch (activeTab) {
      case _Tab.available:
        return _AvailableGroupsPlaceholder();
      case _Tab.your:
        return _YourGroupsPlaceholder(onCreateTap: onCreateTap);
      case _Tab.know:
        return _KnowMorePlaceholder();
    }
  }
}

// ─── Available Groups Placeholder ────────────────────────────────────────────

class _AvailableGroupsPlaceholder extends StatelessWidget {
  final _mockGroups = const [
    _MockGroup(title: 'Quantum Materials Lab', field: 'Physics', members: 12, status: 'Open'),
    _MockGroup(title: 'Global Health Equity', field: 'Medicine', members: 8, status: 'Open'),
    _MockGroup(title: 'AI Ethics Consortium', field: 'Computer Science', members: 15, status: 'Closed'),
    _MockGroup(title: 'Climate Systems Research', field: 'Environmental Science', members: 6, status: 'Open'),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: _mockGroups.map((g) => _GroupCard(group: g)).toList(),
    );
  }
}

class _MockGroup {
  final String title;
  final String field;
  final int members;
  final String status;
  const _MockGroup({required this.title, required this.field, required this.members, required this.status});
}

class _GroupCard extends StatelessWidget {
  final _MockGroup group;
  const _GroupCard({required this.group});

  @override
  Widget build(BuildContext context) {
    final isOpen = group.status == 'Open';
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: _white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: _gold.withOpacity(0.12)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 8)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(group.title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: _dark)),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isOpen ? Colors.green.withOpacity(0.1) : Colors.red.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  group.status,
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: isOpen ? Colors.green[700] : Colors.red[400]),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(group.field, style: const TextStyle(fontSize: 14, color: _muted)),
          const SizedBox(height: 12),
          Row(
            children: [
              const Icon(Icons.group_outlined, color: _subtle, size: 14),
              const SizedBox(width: 4),
              Text('${group.members} members', style: const TextStyle(fontSize: 13, color: _subtle)),
              const Spacer(),
              GestureDetector(
                onTap: () {},
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: isOpen ? _dark : _border,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    isOpen ? 'Join' : 'View',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: isOpen ? _gold : _subtle),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── Your Groups Placeholder ──────────────────────────────────────────────────

class _YourGroupsPlaceholder extends StatelessWidget {
  final VoidCallback onCreateTap;
  const _YourGroupsPlaceholder({required this.onCreateTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: _white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _gold.withOpacity(0.12)),
      ),
      child: Column(
        children: [
          const Icon(Icons.person_search_outlined, color: _subtle, size: 48),
          const SizedBox(height: 16),
          const Text('No Active Collaborations', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: _dark)),
          const SizedBox(height: 8),
          const Text('Join or create a research cluster to see your active collaborations here.', textAlign: TextAlign.center, style: TextStyle(fontSize: 13, color: _muted, height: 1.5)),
          const SizedBox(height: 24),
          _GoldButton(label: 'CREATE A CLUSTER', onTap: onCreateTap),
        ],
      ),
    );
  }
}

// ─── Know More Placeholder ────────────────────────────────────────────────────

class _KnowMorePlaceholder extends StatelessWidget {
  final _guidelines = const [
    _Guideline(title: 'Authorship Policy', desc: 'All collaborators must meet authorship criteria as defined by ICMJE guidelines.'),
    _Guideline(title: 'Data Sharing Protocol', desc: 'Research data must be stored on approved institutional repositories.'),
    _Guideline(title: 'Conflict of Interest', desc: 'Disclose any financial or personal relationships that may influence your research.'),
    _Guideline(title: 'Ethics Approval', desc: 'All human or animal subject research requires prior IRB/IACUC approval.'),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: _guidelines.map((g) => _GuidelineCard(guideline: g)).toList(),
    );
  }
}

class _Guideline {
  final String title;
  final String desc;
  const _Guideline({required this.title, required this.desc});
}

class _GuidelineCard extends StatelessWidget {
  final _Guideline guideline;
  const _GuidelineCard({required this.guideline});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: _white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _gold.withOpacity(0.12)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(color: _gold.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
            child: const Icon(Icons.article_outlined, color: _gold, size: 18),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(guideline.title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: _dark)),
                const SizedBox(height: 4),
                Text(guideline.desc, style: const TextStyle(fontSize: 14, color: _muted, height: 1.5)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Liaison Banner ───────────────────────────────────────────────────────────

class _LiaisonBanner extends StatelessWidget {
  final VoidCallback onTap;
  const _LiaisonBanner({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: _dark,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 24)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Liaison Support', style: TextStyle(fontSize: 26, fontWeight: FontWeight.w800, color: _white)),
          const SizedBox(height: 8),
          const Text(
            'OUR ACADEMIC ADVISORS CAN BRIDGE THE GAP TO YOUR NEXT COLLABORATION.',
            style: TextStyle(fontSize: 14, color: _subtle, letterSpacing: 1, height: 1.5),
          ),
          const SizedBox(height: 20),
          GestureDetector(
            onTap: onTap,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(color: _gold, borderRadius: BorderRadius.circular(12)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Text('SECURE CONSULTATION', style: TextStyle(color: _white, fontSize: 13, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                  SizedBox(width: 8),
                  Icon(Icons.arrow_forward, color: _white, size: 14),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Create Group Sheet ───────────────────────────────────────────────────────

class _CreateGroupSheet extends StatefulWidget {
  final VoidCallback onClose;
  const _CreateGroupSheet({required this.onClose});

  @override
  State<_CreateGroupSheet> createState() => _CreateGroupSheetState();
}

class _CreateGroupSheetState extends State<_CreateGroupSheet> {
  int _step = 1;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onClose,
      child: Container(
        color: Colors.black54,
        child: Align(
          alignment: Alignment.bottomCenter,
          child: GestureDetector(
            onTap: () {},
            child: Container(
              decoration: const BoxDecoration(
                color: _white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Drag handle
                  Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: _border, borderRadius: BorderRadius.circular(2)))),
                  const SizedBox(height: 20),

                  // Step indicator
                  Row(
                    children: List.generate(3, (i) {
                      final active = i + 1 <= _step;
                      return Expanded(
                        child: Container(
                          margin: EdgeInsets.only(right: i < 2 ? 6 : 0),
                          height: 4,
                          decoration: BoxDecoration(
                            color: active ? _gold : _border,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 20),

                  Text(
                    _step == 1 ? 'Group Details' : _step == 2 ? 'Research Focus' : 'Finalize & Submit',
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: _dark),
                  ),
                  const SizedBox(height: 20),

                  if (_step == 1) ...[
                    _FormField(label: 'Group Name'),
                    const SizedBox(height: 12),
                    _FormField(label: 'Institution'),
                    const SizedBox(height: 12),
                    _FormField(label: 'Max Members'),
                  ],
                  if (_step == 2) ...[
                    _FormField(label: 'Research Field'),
                    const SizedBox(height: 12),
                    _FormField(label: 'Keywords (comma-separated)'),
                    const SizedBox(height: 12),
                    _FormField(label: 'Brief Description', maxLines: 3),
                  ],
                  if (_step == 3) ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: _gold.withOpacity(0.08), borderRadius: BorderRadius.circular(14), border: Border.all(color: _gold.withOpacity(0.2))),
                      child: const Text('Review your details and submit to create your research cluster. Our team will verify and activate it within 24 hours.', style: TextStyle(fontSize: 13, color: _muted, height: 1.5)),
                    ),
                  ],

                  const SizedBox(height: 24),
                  Row(
                    children: [
                      if (_step > 1)
                        Expanded(
                          child: GestureDetector(
                            onTap: () => setState(() => _step--),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              margin: const EdgeInsets.only(right: 10),
                              decoration: BoxDecoration(border: Border.all(color: _border), borderRadius: BorderRadius.circular(12)),
                              child: const Text('Back', textAlign: TextAlign.center, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: _dark)),
                            ),
                          ),
                        ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () {
                            if (_step < 3) {
                              setState(() => _step++);
                            } else {
                              widget.onClose();
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            decoration: BoxDecoration(color: _dark, borderRadius: BorderRadius.circular(12)),
                            child: Text(
                              _step < 3 ? 'CONTINUE' : 'SUBMIT',
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: _gold, letterSpacing: 1.5),
                            ),
                          ),
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
    );
  }
}

class _FormField extends StatelessWidget {
  final String label;
  final int maxLines;
  const _FormField({required this.label, this.maxLines = 1});

  @override
  Widget build(BuildContext context) {
    return TextField(
      maxLines: maxLines,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(fontSize: 13, color: _muted),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: _border)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: _border)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: _gold)),
        filled: true,
        fillColor: _bg,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    );
  }
}

// ─── Shared Widgets ───────────────────────────────────────────────────────────

class _GoldShimmerText extends StatelessWidget {
  final String text;
  final double fontSize;
  final bool center;
  const _GoldShimmerText(this.text, {required this.fontSize, this.center = false});

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      shaderCallback: (bounds) => const LinearGradient(
        colors: [Color(0xFFC5A059), Color(0xFFE6D5B8), Color(0xFFD4AF37), Color(0xFFC5A059)],
      ).createShader(bounds),
      child: Text(
        text,
        textAlign: center ? TextAlign.center : TextAlign.start,
        style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.w800, color: _white, height: 1.2),
      ),
    );
  }
}

class _GoldButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  const _GoldButton({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(color: _gold, borderRadius: BorderRadius.circular(12)),
        child: Text(label, textAlign: TextAlign.center, style: const TextStyle(color: _white, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
      ),
    );
  }
}

class _DarkEmailField extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return TextField(
      style: const TextStyle(fontSize: 14, color: _white),
      decoration: InputDecoration(
        hintText: 'Academic Email',
        hintStyle: const TextStyle(fontSize: 14, color: _subtle),
        prefixIcon: const Icon(Icons.mail_outline, color: _subtle, size: 16),
        filled: true,
        fillColor: const Color(0xFF1A1817),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0x0DFFFFFF))),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0x0DFFFFFF))),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: _gold.withOpacity(0.3))),
        contentPadding: const EdgeInsets.symmetric(vertical: 12),
      ),
    );
  }
}