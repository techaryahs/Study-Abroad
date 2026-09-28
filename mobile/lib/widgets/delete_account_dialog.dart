import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/api_client.dart';
import '../core/theme.dart';
import '../features/auth/auth_provider.dart';

/// Shows the delete-account confirmation dialog.
///
/// Navigation ownership:
/// - This dialog owns cancel / in-dialog error UI only.
/// - On success, [AuthProvider.deleteAccount] clears the session and
///   GoRouter's `refreshListenable` redirects to `/login`.
/// - No post-success [Navigator.pop] / [GoRouter.go] from callers.
Future<void> showDeleteAccountDialog(BuildContext context) {
  return showDialog<void>(
    context: context,
    barrierDismissible: false,
    builder: (_) => const DeleteAccountDialog(),
  );
}

class DeleteAccountDialog extends StatefulWidget {
  const DeleteAccountDialog({super.key});

  @override
  State<DeleteAccountDialog> createState() => _DeleteAccountDialogState();
}

class _DeleteAccountDialogState extends State<DeleteAccountDialog> {
  late final TextEditingController _textController;
  bool _isDeleteEnabled = false;
  bool _isDeleting = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _textController = TextEditingController();
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  Future<void> _confirmDelete() async {
    if (!_isDeleteEnabled || _isDeleting) return;

    setState(() {
      _isDeleting = true;
      _error = null;
    });

    try {
      // On success this clears the session. GoRouter alone navigates to Login.
      // Do not pop routes or call context.go here — that races the redirect.
      await context.read<AuthProvider>().deleteAccount();
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _isDeleting = false;
        _error = extractErrorMessage(e);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
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
          if (_isDeleting) ...[
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(vertical: 12),
                child: CircularProgressIndicator(color: Colors.redAccent),
              ),
            ),
            const SizedBox(height: 8),
            const Center(
              child: Text(
                'Deleting your account…',
                style: TextStyle(color: Colors.black54, fontSize: 13),
              ),
            ),
          ] else ...[
            TextField(
              controller: _textController,
              enabled: !_isDeleting,
              onChanged: (val) {
                setState(() {
                  _isDeleteEnabled = val.trim().toUpperCase() == 'DELETE';
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
            if (_error != null) ...[
              const SizedBox(height: 12),
              Text(
                _error!,
                style: const TextStyle(color: Colors.redAccent, fontSize: 12, height: 1.35),
              ),
            ],
          ],
        ],
      ),
      actions: [
        TextButton(
          onPressed: _isDeleting ? null : () => Navigator.of(context).pop(),
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
          onPressed: (_isDeleteEnabled && !_isDeleting) ? _confirmDelete : null,
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
    );
  }
}
