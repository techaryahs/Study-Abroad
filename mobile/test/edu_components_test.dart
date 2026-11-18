import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:study_abroad/core/theme.dart';
import 'package:study_abroad/widgets/edu_components.dart';

void main() {
  group('EduLeader Shared Design System Components', () {
    testWidgets('EduBrandHeaderTitle renders logo and text', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light(),
          home: const Scaffold(
            body: EduBrandHeaderTitle(),
          ),
        ),
      );

      expect(find.text('EDULEADER GLOBAL'), findsOneWidget);
      expect(find.text('STUDY ABROAD'), findsOneWidget);
    });

    testWidgets('EduGoldButton renders label and handles tap', (tester) async {
      bool tapped = false;
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light(),
          home: Scaffold(
            body: EduGoldButton(
              label: 'Talk to an Expert',
              onPressed: () => tapped = true,
            ),
          ),
        ),
      );

      expect(find.text('TALK TO AN EXPERT'), findsOneWidget);
      await tester.tap(find.byType(EduGoldButton));
      expect(tapped, isTrue);
    });

    testWidgets('EduDestinationCard renders destination info', (tester) async {
      bool tapped = false;
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light(),
          home: Scaffold(
            body: EduDestinationCard(
              name: 'USA',
              countryCode: 'US',
              description: 'Ivy League pathways',
              onTap: () => tapped = true,
            ),
          ),
        ),
      );

      expect(find.text('USA'), findsOneWidget);
      expect(find.text('Ivy League pathways'), findsOneWidget);
      await tester.tap(find.byType(EduDestinationCard));
      expect(tapped, isTrue);
    });

    testWidgets('EduStatCard renders stat value and label', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light(),
          home: const Scaffold(
            body: EduStatCard(
              value: '1,500+',
              label: 'Top Universities',
              isDark: true,
            ),
          ),
        ),
      );

      expect(find.text('1,500+'), findsOneWidget);
      expect(find.text('TOP UNIVERSITIES'), findsOneWidget);
    });
  });
}
