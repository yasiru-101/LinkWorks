// Member E: verify password visibility preserves form input and validates normally.
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:linkworks_common/linkworks_common.dart';

// Exercise the actual visibility callback and form validation together.
void main() {
  testWidgets('password toggle preserves text and validation', (tester) async {
    final form = GlobalKey<FormState>();
    final controller = TextEditingController();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Form(
            key: form,
            child: LinkWorksPasswordField(
              controller: controller,
              validator: (value) =>
                  value == null || value.isEmpty ? ErrorStrings.required : null,
            ),
          ),
        ),
      ),
    );
    expect(form.currentState!.validate(), isFalse);
    await tester.enterText(find.byType(TextFormField), 'sample-password');
    expect(
      tester.widget<EditableText>(find.byType(EditableText)).obscureText,
      isTrue,
    );
    await tester.tap(find.byTooltip('Show password'));
    await tester.pump();
    expect(
      tester.widget<EditableText>(find.byType(EditableText)).obscureText,
      isFalse,
    );
    expect(controller.text, 'sample-password');
    expect(form.currentState!.validate(), isTrue);
    await tester.tap(find.byTooltip('Hide password'));
    await tester.pump();
    expect(
      tester.widget<EditableText>(find.byType(EditableText)).obscureText,
      isTrue,
    );
  });
}
