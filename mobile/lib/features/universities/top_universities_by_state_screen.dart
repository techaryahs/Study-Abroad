import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class TopUniversitiesByStateScreen extends StatelessWidget {
  const TopUniversitiesByStateScreen({super.key});

  static final List<Map<String, dynamic>> _states = [
    {'state': 'California', 'unis': 8, 'icon': '☀️'},
    {'state': 'Texas', 'unis': 6, 'icon': '⭐'},
    {'state': 'New York', 'unis': 7, 'icon': '🗽'},
    {'state': 'Massachusetts', 'unis': 5, 'icon': '🏫'},
    {'state': 'Illinois', 'unis': 4, 'icon': '🌆'},
    {'state': 'Pennsylvania', 'unis': 5, 'icon': '📜'},
    {'state': 'Ohio', 'unis': 4, 'icon': '🎓'},
    {'state': 'Michigan', 'unis': 3, 'icon': '🌊'},
    {'state': 'Florida', 'unis': 3, 'icon': '🏖️'},
    {'state': 'Washington', 'unis': 3, 'icon': '🏔️'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        title: const Text('Top Universities by State', style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.w900, fontSize: 20)),
        iconTheme: const IconThemeData(color: AppTheme.textPrimary),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Filter top schools by state and region.',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppTheme.textSecondary, height: 1.6),
              ),
              const SizedBox(height: 20),
              Expanded(
                child: GridView.builder(
                  physics: const BouncingScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 14,
                    mainAxisSpacing: 14,
                    childAspectRatio: 1.0,
                  ),
                  itemCount: _states.length,
                  itemBuilder: (context, index) {
                    final state = _states[index];
                    return _stateCard(context, state);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _stateCard(BuildContext context, Map<String, dynamic> state) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () {
            context.push('/universities/usa?state=${state['state']}');
          },
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  state['icon'] as String,
                  style: const TextStyle(fontSize: 40),
                ),
                const SizedBox(height: 12),
                Text(
                  state['state'] as String,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppTheme.textPrimary),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppTheme.gold.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '${state['unis']} Universities',
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.gold),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
