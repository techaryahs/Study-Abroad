import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:study_abroad/widgets/edu_loaders.dart';
import 'package:study_abroad/core/theme.dart';

void main() {
  group('EduLoading System Tests', () {
    testWidgets('AppLoadingIndicator renders spinner and optional message', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: AppLoadingIndicator(
              message: 'Connecting to EduLeader...',
              size: 28,
            ),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.text('Connecting to EduLeader...'), findsOneWidget);
    });

    testWidgets('LoadingButton triggers tap when not loading', (tester) async {
      int tapCount = 0;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LoadingButton.gold(
              label: 'Proceed',
              onPressed: () => tapCount++,
              isLoading: false,
            ),
          ),
        ),
      );

      expect(find.text('PROCEED'), findsOneWidget);
      expect(find.byType(CircularProgressIndicator), findsNothing);

      await tester.tap(find.text('PROCEED'));
      await tester.pump();
      expect(tapCount, 1);
    });

    testWidgets('LoadingButton shows spinner and disables clicks when isLoading is true', (tester) async {
      int tapCount = 0;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LoadingButton.gold(
              label: 'Proceed',
              onPressed: () => tapCount++,
              isLoading: true,
            ),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      expect(find.text('PROCEED'), findsNothing);

      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      expect(tapCount, 0, reason: 'Button must not invoke callback while loading');
    });

    testWidgets('FullScreenLoader renders title, subtitle, and branded spinner', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: FullScreenLoader(
            title: 'INSTITUTION DIRECTORY',
            subtitle: 'Searching accredited universities worldwide...',
          ),
        ),
      );

      expect(find.text('INSTITUTION DIRECTORY'), findsOneWidget);
      expect(find.text('Searching accredited universities worldwide...'), findsOneWidget);
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('InlineLoader renders compact section spinner with message', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: InlineLoader(
              message: 'Retrieving scholarship funds...',
            ),
          ),
        ),
      );

      expect(find.text('Retrieving scholarship funds...'), findsOneWidget);
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('LoadingOverlay absorbs pointer events and shows activity card', (tester) async {
      int tapCount = 0;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: LoadingOverlay(
              isLoading: true,
              message: 'Verifying credentials...',
              child: ElevatedButton(
                onPressed: () => tapCount++,
                child: const Text('Background Button'),
              ),
            ),
          ),
        ),
      );

      expect(find.text('Verifying credentials...'), findsOneWidget);
      expect(
        find.byWidgetPredicate((w) => w is AbsorbPointer && w.absorbing),
        findsOneWidget,
      );

      await tester.tap(find.text('Background Button'), warnIfMissed: false);
      await tester.pump();
      expect(tapCount, 0, reason: 'Underlying button must be shielded while loading overlay is active');
    });
  });
}
