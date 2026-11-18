import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:study_abroad/features/auth/auth_provider.dart';
import 'package:study_abroad/features/auth/login_screen.dart';
import 'package:study_abroad/features/auth/register_screen.dart';
import 'package:study_abroad/features/cart/cart_provider.dart';

void main() {
  testWidgets('LoginScreen renders brand promise and form correctly', (WidgetTester tester) async {
    final auth = AuthProvider();
    final cart = CartProvider();

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider<AuthProvider>.value(value: auth),
          ChangeNotifierProvider<CartProvider>.value(value: cart),
        ],
        child: const MaterialApp(
          home: LoginScreen(),
        ),
      ),
    );

    await tester.pumpAndSettle();

    // Verify brand promise
    expect(find.text('WELCOME BACK'), findsOneWidget);
    expect(find.text('EMAIL & PASSWORD'), findsOneWidget);
    expect(find.text('PHONE OTP LOGIN'), findsOneWidget);
    expect(find.text('SIGN IN'), findsOneWidget);
    expect(find.text('FORGOT PASSWORD?'), findsOneWidget);
    expect(find.text('REGISTER'), findsOneWidget);
    expect(find.textContaining('Register Now'), findsOneWidget);

    // Tap FORGOT PASSWORD? to open modal
    await tester.tap(find.text('FORGOT PASSWORD?'));
    await tester.pumpAndSettle();

    expect(find.text('RESET PASSWORD'), findsOneWidget);
    expect(find.text('REGISTERED EMAIL'), findsOneWidget);
    expect(find.text('SEND RESET CODE'), findsOneWidget);
  });

  testWidgets('RegisterScreen renders step 1 correctly', (WidgetTester tester) async {
    final auth = AuthProvider();

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider<AuthProvider>.value(value: auth),
        ],
        child: const MaterialApp(
          home: RegisterScreen(),
        ),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('STEP 1 OF 5'), findsOneWidget);
    expect(find.text('SEND VERIFICATION CODE'), findsOneWidget);
    expect(find.text('Student Email Verification'), findsOneWidget);
  });
}
