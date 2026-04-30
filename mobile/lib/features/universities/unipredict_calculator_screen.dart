import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';

class UniPredictCalculatorScreen extends StatefulWidget {
  const UniPredictCalculatorScreen({super.key});

  @override
  State<UniPredictCalculatorScreen> createState() => _UniPredictCalculatorScreenState();
}

class _UniPredictCalculatorScreenState extends State<UniPredictCalculatorScreen> {
  String _academicType = 'Percentage';
  final TextEditingController _academicController = TextEditingController();
  
  String _aptitudeType = 'GRE';
  final TextEditingController _greVerbalController = TextEditingController();
  final TextEditingController _greQuantController = TextEditingController();
  final TextEditingController _gmatController = TextEditingController();
  
  String _englishType = 'TOEFL';
  final TextEditingController _englishController = TextEditingController();
  
  double _budget = 5000000;
  bool _isCalculating = false;

  void _handleCalculate() {
    setState(() => _isCalculating = true);
    
    Future.delayed(const Duration(seconds: 2), () {
      if (!mounted) return;
      setState(() => _isCalculating = false);
      _showResultModal();
    });
  }

  void _showResultModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _ResultModal(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('ADMISSION ANALYZER', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 2, color: AppTheme.gold)),
        centerTitle: true,
        backgroundColor: AppTheme.background,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppTheme.textPrimary),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            _buildSection(
              index: 1,
              label: 'Academic Foundation',
              child: Column(
                children: [
                  _toggleSwitch(['Percentage', 'CGPA'], _academicType, (val) => setState(() => _academicType = val)),
                  const SizedBox(height: 16),
                  _buildInput(
                    controller: _academicController,
                    hint: _academicType == 'Percentage' ? 'Score (e.g. 85)' : 'CGPA / 10 (e.g. 9.2)',
                    suffix: _academicType == 'Percentage' ? '% SCORE' : 'CGPA',
                  ),
                ],
              ),
            ),
            
            _buildSection(
              index: 2,
              label: 'Aptitude Assessment',
              child: Column(
                children: [
                  _toggleSwitch(['GRE', 'GMAT'], _aptitudeType, (val) => setState(() => _aptitudeType = val)),
                  const SizedBox(height: 16),
                  if (_aptitudeType == 'GRE')
                    Row(
                      children: [
                        Expanded(child: _buildInput(controller: _greVerbalController, hint: 'Verbal')),
                        const SizedBox(width: 12),
                        Expanded(child: _buildInput(controller: _greQuantController, hint: 'Quant')),
                      ],
                    )
                  else
                    _buildInput(controller: _gmatController, hint: 'Total GMAT Score'),
                ],
              ),
            ),
            
            _buildSection(
              index: 3,
              label: 'English Proficiency',
              child: Column(
                children: [
                  _toggleSwitch(['TOEFL', 'IELTS'], _englishType, (val) => setState(() => _englishType = val)),
                  const SizedBox(height: 16),
                  _buildInput(
                    controller: _englishController,
                    hint: _englishType == 'TOEFL' ? 'TOEFL (0-120)' : 'IELTS Band (0-9)',
                  ),
                ],
              ),
            ),
            
            _buildSection(
              index: 4,
              label: 'Financial Planning',
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.background,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('MAX BUDGET', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.textSecondary)),
                        Text(
                          NumberFormat.compactCurrency(locale: 'en_IN', symbol: '₹').format(_budget),
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.gold),
                        ),
                      ],
                    ),
                    Slider(
                      value: _budget,
                      min: 1000000,
                      max: 15000000,
                      divisions: 140,
                      activeColor: AppTheme.gold,
                      inactiveColor: AppTheme.gold.withOpacity(0.1),
                      onChanged: (val) => setState(() => _budget = val),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 32),
            
            SizedBox(
              width: double.infinity,
              height: 64,
              child: ElevatedButton(
                onPressed: _isCalculating ? null : _handleCalculate,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isCalculating ? AppTheme.textSecondary.withOpacity(0.2) : AppTheme.darkBrown,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  elevation: 0,
                ),
                child: _isCalculating
                    ? const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white)),
                          SizedBox(width: 16),
                          Text('RUNNING ALGORITHM...', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1)),
                        ],
                      )
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('ANALYZE ADMISSIONS', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, letterSpacing: 2)),
                          SizedBox(width: 8),
                          Icon(LucideIcons.chevronRight, size: 18),
                        ],
                      ),
              ),
            ),
            
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildSection({required int index, required String label, required Widget child}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(color: AppTheme.darkBrown, borderRadius: BorderRadius.circular(6)),
                child: Center(child: Text(index.toString(), style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold))),
              ),
              const SizedBox(width: 12),
              Text(label.toUpperCase(), style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1.5, color: AppTheme.gold)),
            ],
          ),
          const SizedBox(height: 20),
          child,
        ],
      ),
    );
  }

  Widget _toggleSwitch(List<String> options, String currentValue, Function(String) onChanged) {
    return Row(
      children: options.map((opt) {
        final active = currentValue == opt;
        return Expanded(
          child: GestureDetector(
            onTap: () => onChanged(opt),
            child: Container(
              margin: EdgeInsets.only(right: opt == options.first ? 8 : 0, left: opt == options.last ? 8 : 0),
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: active ? AppTheme.darkBrown : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: active ? AppTheme.darkBrown : AppTheme.gold.withOpacity(0.1)),
              ),
              child: Center(
                child: Text(
                  opt.toUpperCase(),
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    color: active ? Colors.white : AppTheme.textPrimary.withOpacity(0.4),
                    letterSpacing: 1,
                  ),
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildInput({required TextEditingController controller, required String hint, String? suffix}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
      ),
      child: TextField(
        controller: controller,
        keyboardType: TextInputType.number,
        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textPrimary),
        decoration: InputDecoration(
          border: InputBorder.none,
          hintText: hint,
          hintStyle: TextStyle(color: AppTheme.textPrimary.withOpacity(0.2), fontSize: 13, fontWeight: FontWeight.normal),
          suffixText: suffix,
          suffixStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.gold, letterSpacing: 1),
        ),
      ),
    );
  }
}

class _ResultModal extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(topLeft: Radius.circular(40), topRight: Radius.circular(40)),
      ),
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(40),
            decoration: const BoxDecoration(
              color: AppTheme.gold,
              borderRadius: BorderRadius.only(topLeft: Radius.circular(40), topRight: Radius.circular(40)),
            ),
            child: Column(
              children: [
                const Icon(LucideIcons.sparkles, color: Colors.white, size: 40),
                const SizedBox(height: 24),
                const Text(
                  'EVALUATION COMPLETE',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 3, color: Colors.white70),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Your admission landscape is ready',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Colors.white),
                ),
              ],
            ),
          ),
          
          Padding(
            padding: const EdgeInsets.all(40),
            child: Column(
              children: [
                const Text(
                  'MASTER PROFILE STRENGTH',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1.5, color: AppTheme.textSecondary),
                ),
                const SizedBox(height: 24),
                
                // Probability Bar
                Container(
                  height: 16,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: AppTheme.background,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppTheme.gold.withOpacity(0.1)),
                  ),
                  child: Stack(
                    children: [
                      Container(
                        width: MediaQuery.of(context).size.width * 0.78,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(colors: [AppTheme.gold, AppTheme.darkBrown]),
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ).animate().shimmer(duration: 1.seconds),
                    ],
                  ),
                ),
                
                const SizedBox(height: 12),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('AVERAGE', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.textSecondary)),
                    Text('78% CHANCE', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.gold)),
                    Text('EXCELLENT', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: AppTheme.textSecondary)),
                  ],
                ),
                
                const SizedBox(height: 64),
                
                SizedBox(
                  width: double.infinity,
                  height: 64,
                  child: ElevatedButton(
                    onPressed: () => context.push('/contact'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.darkBrown,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                    child: const Text('DISCUSS YOUR CASE →', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, letterSpacing: 1)),
                  ),
                ),
                
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    'CLOSE RESULTS',
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 1, color: AppTheme.textSecondary),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
