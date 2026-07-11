import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../core/theme.dart';
import '../../core/api_client.dart';
import '../features/auth/auth_provider.dart';
import '../features/membership/membership_manager.dart';
import '../features/membership/membership_screen.dart';
import '../../core/app_features.dart';

void showBookCounsellingSheet(BuildContext context) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => const BookCounsellingSheet(),
  );
}

class BookCounsellingSheet extends StatefulWidget {
  const BookCounsellingSheet({super.key});

  @override
  State<BookCounsellingSheet> createState() => _BookCounsellingSheetState();
}

class _BookCounsellingSheetState extends State<BookCounsellingSheet> {
  int _step = 1; // 1: Date, 2: Slot, 3: Details, 4: Confirmation

  // Step 1: Date selection
  late DateTime _today;
  int _calendarYear = DateTime.now().year;
  int _calendarMonth = DateTime.now().month;
  String _selectedDate = '';

  // Step 2: Slot selection
  List<Map<String, dynamic>> _slots = [];
  bool _slotsLoading = false;
  int? _selectedSlotIndex;
  String _error = '';
  String _prefetchedDate = ''; // tracks which date was prefetched

  // Step 3: Personal details
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  bool _bookingLoading = false;
  bool _eligibilityLoading = false;
  Map<String, dynamic>? _freeEligibility;

  // Step 4: Confirmation
  Map<String, dynamic>? _bookingResult;

  @override
  void initState() {
    super.initState();
    _today = DateTime.now();
    _calendarYear = _today.year;
    _calendarMonth = _today.month;
    _autofillUserData();
  }

  Future<void> _autofillUserData() async {
    final authProvider = context.read<AuthProvider>();
    if (authProvider.isLoggedIn && authProvider.user != null) {
      final user = authProvider.user!;
      _nameCtrl.text = user['fullName'] ?? user['name'] ?? '';
      _emailCtrl.text = user['email'] ?? '';
      _phoneCtrl.text = user['mobile'] ?? user['phone'] ?? '';
      if (_emailCtrl.text.isNotEmpty) {
        await _checkFreeEligibility(_emailCtrl.text);
      }
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    super.dispose();
  }

  bool get _isFreeEligible => _freeEligibility?['eligible'] == true;

  Future<Map<String, dynamic>?> _checkFreeEligibility(String email) async {
    final trimmed = email.trim();
    if (trimmed.isEmpty) return null;

    setState(() => _eligibilityLoading = true);
    try {
      final res = await ApiClient.instance.get(
        '/api/bookings/free-eligibility',
        queryParameters: {'email': trimmed},
      );
      final data = Map<String, dynamic>.from(res.data as Map);
      debugPrint('Free eligibility check: $data');
      if (mounted) {
        setState(() => _freeEligibility = data);
      }
      return data;
    } catch (e) {
      debugPrint('Eligibility check failed: $e');
      if (mounted) {
        setState(() => _freeEligibility = null);
      }
      return null;
    } finally {
      if (mounted) {
        setState(() => _eligibilityLoading = false);
      }
    }
  }

  List<int?> _buildCalendarGrid() {
    final firstDay = DateTime(_calendarYear, _calendarMonth, 1).weekday;
    final daysInMonth = DateTime(_calendarYear, _calendarMonth + 1, 0).day;
    final cells = <int?>[];

    for (int i = 0; i < firstDay; i++) cells.add(null);
    for (int d = 1; d <= daysInMonth; d++) cells.add(d);
    while (cells.length % 7 != 0) cells.add(null);

    return cells;
  }

  bool _isCellDisabled(int? day) {
    if (day == null) return true;
    final dateStr =
        '$_calendarYear-${_calendarMonth.toString().padLeft(2, '0')}-${day.toString().padLeft(2, '0')}';
    final todayStr = DateFormat('yyyy-MM-dd').format(_today);
    return dateStr.compareTo(todayStr) < 0;
  }

  /// Returns true if a slot should be blocked (not selectable).
  /// Blocked when: booked (available==false) OR today's date and slot time
  /// is at/before current IST device time.
  bool _isSlotBlocked(Map<String, dynamic> slot, bool isToday) {
    // If backend already marked the slot unavailable, block it.
    if (slot['available'] != true) return true;

    // Only compare time for today's date.
    if (isToday) {
      final timeStr = (slot['time'] as String? ?? '').trim();
      if (timeStr.isEmpty) return false;

      DateTime? parsed;

      // Try multiple possible time formats.
      for (final fmt in [
        'h:mm a',
        'hh:mm a',
        'h:mma',
        'hh:mma',
        'H:mm',
        'HH:mm',
      ]) {
        try {
          parsed = DateFormat(fmt, 'en_US').parse(timeStr);
          break;
        } catch (_) {}
      }

      // If parsing fails, do not block the slot.
      if (parsed == null) return false;

      // Force current time to IST (UTC + 5:30)
      final nowUtc = DateTime.now().toUtc();
      final now = nowUtc.add(const Duration(hours: 5, minutes: 30));

      // Build slot time for today's date in IST.
      final slotDt = DateTime(
        now.year,
        now.month,
        now.day,
        parsed.hour,
        parsed.minute,
      );

      // Block if slot start time is less than or equal to current IST time.
      return !slotDt.isAfter(now);
    }

    // Future dates are not blocked.
    return false;
  }

  void _selectDay(int? day) {
    if (day == null || _isCellDisabled(day)) return;
    final newDate =
        '$_calendarYear-${_calendarMonth.toString().padLeft(2, '0')}-${day.toString().padLeft(2, '0')}';
    setState(() => _selectedDate = newDate);
    // Prefetch slots immediately so Continue tap is instant
    if (newDate != _prefetchedDate) {
      _prefetchedDate = newDate;
      _fetchSlots(newDate);
    }
  }

  Future<void> _fetchSlots(String date) async {
    setState(() {
      _slotsLoading = true;
      _selectedSlotIndex = null;
      _error = '';
      _slots = [];
    });
    try {
      final res = await ApiClient.instance.get(
        '/api/bookings/available-slots',
        queryParameters: {'date': date},
      );
      // Backend automatically filters slots:
      // - Marks past times as available: false (for today, slots before current time)
      // - Marks booked times as available: false (existing bookings)
      // - Marks available slots as available: true (only bookable slots)
      setState(() {
        _slots = List<Map<String, dynamic>>.from(res.data['slots'] ?? []);
      });
    } catch (e) {
      setState(() => _error = 'Could not load slots. Try again.');
    } finally {
      setState(() => _slotsLoading = false);
    }
  }

  Future<void> _confirmBooking() async {
    if (_nameCtrl.text.isEmpty ||
        _emailCtrl.text.isEmpty ||
        _phoneCtrl.text.isEmpty) {
      setState(() => _error = 'Please fill in all details');
      return;
    }
    if (_selectedSlotIndex == null) {
      setState(() => _error = 'Please select a time slot');
      return;
    }

    // 1. Check if user is eligible for legacy free first session
    final eligibility = await _checkFreeEligibility(_emailCtrl.text.trim());
    if ((eligibility ?? _freeEligibility)?['eligible'] == true) {
      debugPrint('Legacy free booking eligible');
      await _finalizeBooking(isFreeBooking: true);
      return;
    }

    // 2. Membership path — backend EntitlementEngine is sole authority.
    // Client canAccess is UX only; server reserve/commit decrements credits.
    final manager = Provider.of<MembershipManager>(context, listen: false);
    final hasConsultationAccess = manager.canAccess(AppFeatures.consultation);

    if (hasConsultationAccess) {
      debugPrint('Membership credit path → book-consultation (engine)');
      await _finalizeMembershipBooking();
      return;
    }

    // 3. No free / no credits → membership purchase screen
    debugPrint('No access. Redirecting to Membership Screen.');
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => const MembershipScreen(
          recommendedPlanId: 'starter',
          lockedFeatureId: AppFeatures.consultation,
        ),
      ),
    );
  }

  /// Membership consultation: unified orchestrator + EntitlementEngine debit.
  Future<void> _finalizeMembershipBooking() async {
    setState(() {
      _bookingLoading = true;
      _error = '';
    });
    try {
      final slot = _slots[_selectedSlotIndex!];
      final res = await ApiClient.instance.post(
        '/api/bookings/book-consultation',
        data: {
          'path': 'membership',
          'date': _selectedDate,
          'time': slot['time'],
          'userName': _nameCtrl.text.trim(),
          'userEmail': _emailCtrl.text.trim(),
          'userPhone': _phoneCtrl.text.trim(),
        },
      );
      setState(() {
        _bookingResult = res.data['booking'];
        _step = 4;
        _bookingLoading = false;
      });
      // Refresh local membership usage after server debit
      if (mounted) {
        // ignore: unawaited_futures
        Provider.of<MembershipManager>(context, listen: false).refresh();
      }
    } catch (e) {
      setState(() {
        _error = extractErrorMessage(e);
        if (_error.isEmpty) {
          _error = 'Membership booking failed. Please try again.';
        }
        _bookingLoading = false;
      });
    }
  }

  Future<void> _finalizeBooking(
      {String? paymentId, bool isFreeBooking = false}) async {
    setState(() {
      _bookingLoading = true;
      _error = '';
    });
    try {
      final slot = _slots[_selectedSlotIndex!];
      // Free / paid go through unified entry (legacy book-session still works
      // but book-consultation is the single engine surface).
      final res = await ApiClient.instance.post(
        '/api/bookings/book-consultation',
        data: {
          'path': isFreeBooking ? 'free' : 'paid',
          'date': _selectedDate,
          'time': slot['time'],
          'userName': _nameCtrl.text.trim(),
          'userEmail': _emailCtrl.text.trim(),
          'userPhone': _phoneCtrl.text.trim(),
          if (paymentId != null) 'paymentId': paymentId,
          'amount': 599,
          'isFreeBooking': isFreeBooking,
        },
      );
      setState(() {
        _bookingResult = res.data['booking'];
        _step = 4;
        _bookingLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = isFreeBooking
            ? 'Booking failed. Please try again.'
            : 'Payment was successful but booking failed. Please contact support.';
        _bookingLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.92,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (_, ctrl) => Container(
        decoration: const BoxDecoration(
          color: AppTheme.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          children: [
            // Handle
            Padding(
              padding: const EdgeInsets.only(top: 12, bottom: 8),
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppTheme.borderLight,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),

            // Header
            Container(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: AppTheme.borderLight)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.gold.withOpacity(0.1),
                          border: Border.all(
                              color: AppTheme.gold.withOpacity(0.25),
                              width: 0.5),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 4,
                              height: 4,
                              decoration: BoxDecoration(
                                color: AppTheme.gold,
                                borderRadius: BorderRadius.circular(2),
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Text('BOOK SESSION',
                                style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w900,
                                    color: AppTheme.gold,
                                    letterSpacing: 0.5)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text('Counselling Session',
                          style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: AppTheme.textPrimary)),
                      const Text('1-hour private session',
                          style: TextStyle(
                              fontSize: 13,
                              color: AppTheme.textSecondary,
                              fontWeight: FontWeight.w600)),
                    ],
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close_rounded,
                        color: AppTheme.textSecondary, size: 20),
                    padding: EdgeInsets.zero,
                    constraints:
                        const BoxConstraints(minWidth: 32, minHeight: 32),
                  ),
                ],
              ),
            ),

            // Step indicators with lines
            if (_step < 4)
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _stepDot(1, 'Date'),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 6),
                        height: 1,
                        color: _step > 1
                            ? AppTheme.gold.withOpacity(0.4)
                            : AppTheme.borderLight,
                      ),
                    ),
                    _stepDot(2, 'Time'),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 6),
                        height: 1,
                        color: _step > 2
                            ? AppTheme.gold.withOpacity(0.4)
                            : AppTheme.borderLight,
                      ),
                    ),
                    _stepDot(3, 'Confirm'),
                  ],
                ),
              ),

            // Admin Badge
            if (_step < 4)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppTheme.gold.withOpacity(0.1),
                    border: Border.all(
                        color: AppTheme.gold.withOpacity(0.25), width: 0.5),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text('👤 Counselling with Admin',
                      style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.gold)),
                ),
              ),

            const SizedBox(height: 12),

            // Content
            Expanded(
              child: ListView(
                controller: ctrl,
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                children: [
                  if (_step == 1) _buildDatePicker(),
                  if (_step == 2) _buildSlotPicker(),
                  if (_step == 3) _buildDetailsForm(),
                  if (_step == 4) _buildConfirmation(),
                ],
              ),
            ),

            // Footer
            if (_step < 4)
              Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    if (_step > 1)
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => setState(() => _step--),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppTheme.borderLight),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                          ),
                          child: const Text('BACK',
                              style: TextStyle(
                                  color: AppTheme.textSecondary,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w900)),
                        ),
                      ),
                    if (_step > 1) const SizedBox(width: 10),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _getNextButtonAction(),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.gold,
                          foregroundColor: AppTheme.darkBrown,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12)),
                        ),
                        child: Text(
                          _bookingLoading
                              ? 'BOOKING...'
                              : _eligibilityLoading
                                  ? 'CHECKING...'
                                  : _step == 3
                                      ? (_isFreeEligible
                                          ? 'CONFIRM FREE BOOKING'
                                          : 'CONFIRM & PAY')
                                      : 'CONTINUE',
                          style: const TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 14,
                              letterSpacing: 0.5),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _stepDot(int step, String label) {
    final done = _step > step;
    final active = _step == step;
    return Column(
      children: [
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            color: done
                ? AppTheme.gold
                : active
                    ? Colors.transparent
                    : AppTheme.background,
            border: Border.all(
              color: active
                  ? AppTheme.gold
                  : done
                      ? AppTheme.gold
                      : AppTheme.borderLight,
              width: 1.5,
            ),
            borderRadius: BorderRadius.circular(50),
          ),
          child: Center(
            child: done
                ? const Icon(Icons.check_rounded,
                    color: AppTheme.darkBrown, size: 14)
                : Text(
                    step.toString(),
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      color: active ? AppTheme.gold : AppTheme.textSecondary,
                      fontSize: 13,
                    ),
                  ),
          ),
        ),
        const SizedBox(height: 3),
        Text(label,
            style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: AppTheme.textSecondary)),
      ],
    );
  }

  Widget _buildDatePicker() {
    final cells = _buildCalendarGrid();
    final monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    final dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('SELECT DATE',
            style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w900,
                color: AppTheme.textSecondary,
                letterSpacing: 0.5)),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppTheme.background.withOpacity(0.5),
            border: Border.all(color: AppTheme.borderLight),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    onPressed: () => setState(() {
                      if (_calendarMonth == 1) {
                        _calendarYear--;
                        _calendarMonth = 12;
                      } else {
                        _calendarMonth--;
                      }
                    }),
                    icon: const Icon(Icons.chevron_left, size: 20),
                    padding: EdgeInsets.zero,
                    constraints:
                        const BoxConstraints(minWidth: 32, minHeight: 32),
                  ),
                  Text('${monthNames[_calendarMonth - 1]} $_calendarYear',
                      style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.textPrimary)),
                  IconButton(
                    onPressed: () => setState(() {
                      if (_calendarMonth == 12) {
                        _calendarYear++;
                        _calendarMonth = 1;
                      } else {
                        _calendarMonth++;
                      }
                    }),
                    icon: const Icon(Icons.chevron_right, size: 20),
                    padding: EdgeInsets.zero,
                    constraints:
                        const BoxConstraints(minWidth: 32, minHeight: 32),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 7, mainAxisSpacing: 4, crossAxisSpacing: 4),
                itemCount: 7,
                itemBuilder: (_, i) => Center(
                  child: Text(dayNames[i],
                      style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.textSecondary)),
                ),
              ),
              const SizedBox(height: 8),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 7, mainAxisSpacing: 4, crossAxisSpacing: 4),
                itemCount: cells.length,
                itemBuilder: (_, i) {
                  final day = cells[i];
                  final disabled = _isCellDisabled(day);
                  final dateStr = day != null
                      ? '$_calendarYear-${_calendarMonth.toString().padLeft(2, '0')}-${day.toString().padLeft(2, '0')}'
                      : '';
                  final isSelected = dateStr == _selectedDate;
                  final todayStr = DateFormat('yyyy-MM-dd').format(_today);
                  final isToday = dateStr == todayStr;

                  return day == null
                      ? const SizedBox()
                      : GestureDetector(
                          onTap: () => _selectDay(day),
                          child: Container(
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? AppTheme.gold
                                  : isToday && !isSelected
                                      ? AppTheme.gold.withOpacity(0.1)
                                      : Colors.transparent,
                              border: Border.all(
                                color: isToday && !isSelected
                                    ? AppTheme.gold.withOpacity(0.3)
                                    : Colors.transparent,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Center(
                              child: Text(day.toString(),
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                    color: isSelected
                                        ? AppTheme.darkBrown
                                        : disabled
                                            ? AppTheme.textSecondary
                                                .withOpacity(0.3)
                                            : AppTheme.textPrimary,
                                  )),
                            ),
                          ),
                        );
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSlotPicker() {
    final todayStr = DateFormat('yyyy-MM-dd').format(_today);
    final isToday = _selectedDate == todayStr;
    // Always show ALL slots; blocked ones are dimmed and non-selectable
    final displaySlots = _slots;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('SELECT TIME',
            style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w900,
                color: AppTheme.textSecondary,
                letterSpacing: 0.5)),
        const SizedBox(height: 8),
        // Date info with emoji
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppTheme.background.withOpacity(0.5),
            border: Border.all(color: AppTheme.borderLight),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              const Text('📅', style: TextStyle(fontSize: 16)),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                      DateFormat('EEE, MMM d, yyyy')
                          .format(DateTime.parse(_selectedDate)),
                      style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.textPrimary)),
                  const Text('Select a preferred slot below',
                      style: TextStyle(
                          fontSize: 13, color: AppTheme.textSecondary)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),

        // Error message
        if (_error.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Text(_error,
                style: const TextStyle(color: Colors.red, fontSize: 14)),
          ),

        // Loading state
        if (_slotsLoading)
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 1.1,
            ),
            itemCount: 9,
            itemBuilder: (_, __) => Container(
              decoration: BoxDecoration(
                color: AppTheme.background.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          )

        // No slots available
        else if (displaySlots.isEmpty)
          Padding(
            padding: const EdgeInsets.all(20),
            child: Center(
              child: Column(
                children: [
                  const Text('⏰', style: TextStyle(fontSize: 32)),
                  const SizedBox(height: 8),
                  const Text('No slots available',
                      style: TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 13,
                          fontWeight: FontWeight.w600)),
                  const Text('Please select another date',
                      style: TextStyle(
                          color: AppTheme.textSecondary, fontSize: 14)),
                ],
              ),
            ),
          )

        // Slot grid — shows ALL slots; past/booked are blocked (dimmed, non-tappable)
        else
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              childAspectRatio: 1.0,
            ),
            itemCount: displaySlots.length,
            itemBuilder: (_, i) {
              final slot = displaySlots[i];
              // A slot is blocked if booked OR if today and its time has passed (IST)
              final isBlocked = _isSlotBlocked(slot, isToday);
              final isSelected = _selectedSlotIndex == i && !isBlocked;
              final startTime = (slot['time'] ?? '') as String;
              final isBooked = slot['available'] != true;
              final isPast =
                  !isBooked && isBlocked; // blocked because of past time today

              // Label shown under the time
              String subLabel;
              if (isBooked) {
                subLabel = 'Booked';
              } else if (isPast) {
                subLabel = 'Past';
              } else {
                subLabel = slot['endTime'] ?? '';
              }

              return GestureDetector(
                onTap: isBlocked
                    ? null
                    : () => setState(() => _selectedSlotIndex = i),
                child: Opacity(
                  opacity: isBlocked ? 0.35 : 1.0,
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSelected
                          ? AppTheme.gold
                          : isBlocked
                              ? AppTheme.background.withOpacity(0.3)
                              : AppTheme.background.withOpacity(0.6),
                      border: Border.all(
                        color: isSelected
                            ? AppTheme.gold
                            : isBlocked
                                ? AppTheme.borderLight.withOpacity(0.3)
                                : AppTheme.borderLight.withOpacity(0.5),
                        width: isSelected ? 2 : 1,
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Stack(
                      children: [
                        Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                startTime,
                                style: TextStyle(
                                  fontWeight: FontWeight.w900,
                                  color: isSelected
                                      ? AppTheme.darkBrown
                                      : isBlocked
                                          ? AppTheme.textSecondary
                                          : AppTheme.textPrimary,
                                  fontSize: 13,
                                  decoration: isBlocked
                                      ? TextDecoration.lineThrough
                                      : null,
                                  decorationColor: AppTheme.textSecondary,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                subLabel,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: isSelected
                                      ? AppTheme.darkBrown.withOpacity(0.6)
                                      : isBlocked
                                          ? Colors.redAccent.withOpacity(0.7)
                                          : AppTheme.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        // Lock icon on blocked slots
                        if (isBlocked)
                          Positioned(
                            top: 4,
                            right: 4,
                            child: Icon(
                              isBooked
                                  ? Icons.person_off_rounded
                                  : Icons.lock_clock,
                              size: 10,
                              color: AppTheme.textSecondary.withOpacity(0.5),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
      ],
    );
  }

  Widget _buildDetailsForm() {
    // _selectedSlotIndex is always an index into _slots directly
    final selectedSlot =
        _selectedSlotIndex != null ? _slots[_selectedSlotIndex!] : null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('YOUR DETAILS',
            style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w900,
                color: AppTheme.textSecondary,
                letterSpacing: 0.5)),
        const SizedBox(height: 12),
        // Summary
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppTheme.background.withOpacity(0.5),
            border: Border.all(color: AppTheme.borderLight),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Summary',
                  style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textSecondary)),
              const SizedBox(height: 6),
              Text(
                  DateFormat('EEE, MMM d, yyyy')
                      .format(DateTime.parse(_selectedDate)),
                  style: const TextStyle(
                      fontWeight: FontWeight.w900,
                      color: AppTheme.textPrimary,
                      fontSize: 14)),
              const SizedBox(height: 2),
              if (selectedSlot != null)
                Text('${selectedSlot['time']} – ${selectedSlot['endTime']}',
                    style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        color: AppTheme.gold,
                        fontSize: 14)),
            ],
          ),
        ),
        const SizedBox(height: 12),
        if (_isFreeEligible) ...[
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.08),
              border: Border.all(color: Colors.green.withOpacity(0.25)),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Row(
              children: [
                Icon(Icons.card_giftcard_rounded,
                    color: Colors.green, size: 18),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Your first session is free. No payment required.',
                    style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: Colors.green),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
        ] else if (_freeEligibility?['message'] != null) ...[
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.background.withOpacity(0.5),
              border: Border.all(color: AppTheme.borderLight),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              _freeEligibility!['message'].toString(),
              style: const TextStyle(
                  fontSize: 13,
                  color: AppTheme.textSecondary,
                  fontWeight: FontWeight.w700),
            ),
          ),
          const SizedBox(height: 12),
        ],
        // Name
        TextField(
          controller: _nameCtrl,
          style: const TextStyle(fontSize: 14),
          decoration: InputDecoration(
            hintText: 'Full Name',
            filled: true,
            fillColor: AppTheme.background.withOpacity(0.5),
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppTheme.borderLight)),
            enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppTheme.borderLight)),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          ),
        ),
        const SizedBox(height: 10),
        // Email
        TextField(
          controller: _emailCtrl,
          keyboardType: TextInputType.emailAddress,
          onSubmitted: (value) => _checkFreeEligibility(value),
          style: const TextStyle(fontSize: 14),
          decoration: InputDecoration(
            hintText: 'Email Address *',
            filled: true,
            fillColor: AppTheme.background.withOpacity(0.5),
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppTheme.borderLight)),
            enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppTheme.borderLight)),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          ),
        ),
        const SizedBox(height: 12),
        // Phone
        TextField(
          controller: _phoneCtrl,
          keyboardType: TextInputType.phone,
          style: const TextStyle(fontSize: 14),
          decoration: InputDecoration(
            hintText: 'Phone Number *',
            filled: true,
            fillColor: AppTheme.background.withOpacity(0.5),
            border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppTheme.borderLight)),
            enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: const BorderSide(color: AppTheme.borderLight)),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          ),
        ),
        const SizedBox(height: 12),
        // Price
        if (!_isFreeEligible) ...[
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppTheme.gold.withOpacity(0.08),
              border: Border.all(color: AppTheme.gold.withOpacity(0.2)),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Session Charge',
                    style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textSecondary)),
                const Text('Rs. 599',
                    style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color: AppTheme.gold)),
              ],
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Charges are fully adjustable in any service you opt for later.',
            style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
          ),
        ],
        if (_error.isNotEmpty) ...[
          const SizedBox(height: 10),
          Text(_error, style: const TextStyle(color: Colors.red, fontSize: 14)),
        ],
      ],
    );
  }

  Widget _buildConfirmation() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: 16),
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: AppTheme.gold.withOpacity(0.1),
            border: Border.all(color: AppTheme.gold.withOpacity(0.3)),
            borderRadius: BorderRadius.circular(28),
          ),
          child: const Center(
            child: Text('🎉', style: TextStyle(fontSize: 32)),
          ),
        ),
        const SizedBox(height: 12),
        const Text('Confirmed!',
            style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w900,
                color: AppTheme.textPrimary)),
        const SizedBox(height: 2),
        Text('Sent to ${_bookingResult?['userEmail'] ?? 'your email'}',
            style:
                const TextStyle(fontSize: 13, color: AppTheme.textSecondary)),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppTheme.background.withOpacity(0.5),
            border: Border.all(color: AppTheme.borderLight),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _summaryRow(
                  'Date',
                  DateFormat('EEE, MMM d, yyyy')
                      .format(DateTime.parse(_bookingResult?['date'] ?? ''))),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 6),
                child: Divider(height: 1, color: AppTheme.borderLight),
              ),
              _summaryRow('Time', _bookingResult?['time'] ?? ''),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 6),
                child: Divider(height: 1, color: AppTheme.borderLight),
              ),
              if (_bookingResult?['meetingId'] != null) ...[
                Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Meeting ID',
                          style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textSecondary)),
                      const SizedBox(height: 3),
                      Text(_bookingResult?['meetingId'] ?? '',
                          style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: AppTheme.gold,
                              fontFamily: 'monospace')),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 14),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.gold,
              foregroundColor: AppTheme.darkBrown,
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('DONE',
                style: TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 14,
                    letterSpacing: 0.5)),
          ),
        ),
      ],
    );
  }

  Widget _summaryRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: AppTheme.textSecondary)),
        Text(value,
            style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w900,
                color: AppTheme.textPrimary)),
      ],
    );
  }

  Future<void> _enterDetailsStep() async {
    if (_emailCtrl.text.trim().isNotEmpty) {
      await _checkFreeEligibility(_emailCtrl.text.trim());
    }
    if (mounted) {
      setState(() => _step = 3);
    }
  }

  VoidCallback? _getNextButtonAction() {
    if (_bookingLoading || _eligibilityLoading) return null;

    if (_step == 1) {
      // Slots are already being fetched (started on date tap), just navigate
      return _selectedDate.isNotEmpty ? () => setState(() => _step = 2) : null;
    } else if (_step == 2) {
      return _selectedSlotIndex != null ? () => _enterDetailsStep() : null;
    } else if (_step == 3) {
      return _confirmBooking;
    }
    return null;
  }
}
