// Member A: initial welcome layout and wording.
// This is a preview screen, not an implemented authentication flow.
// The root app supplies onPreview in debug builds; null removes the preview button.
// Implement future sign-in and onboarding in Member A without putting backend logic in this layout.

// Explains: Import Material widgets, layout types, icons, and theme APIs used to describe the UI.
import 'package:flutter/material.dart';
// Explains: Import shared model contracts, constants, theme, and reusable UI components.
import 'package:linkworks_common/linkworks_common.dart';

// Explains: Define a reusable widget whose appearance is determined by its constructor inputs.
class WelcomeScreen extends StatelessWidget {
  // Explains: Declare widget inputs; super.key preserves identity when Flutter updates the widget tree.
  const WelcomeScreen({super.key, this.onPreview});
  // Explains: Declare/configure onPreview: the debug-only navigation callback.
  final VoidCallback? onPreview;
  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Explains: Describe the widget tree for the current inputs/state; Flutter calls this during rebuilds.
  Widget build(BuildContext context) => Scaffold(
    // Explains: Keep content away from device cutouts and system bars.
    body: SafeArea(child: Center(child: SingleChildScrollView(
      // Explains: Inset content by the stated logical-pixel spacing.
      padding: const EdgeInsets.all(32),
      // Explains: Limit content width so the layout stays readable on larger screens.
      child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 480),
        // Explains: Arrange the following children vertically.
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          // Explains: Display the visual symbol for this action or state.
          Icon(Icons.handshake_outlined, size: 64, color: Theme.of(context).colorScheme.primary),
          // Explains: Reserve the stated space or fixed dimensions in the layout.
          const SizedBox(height: 32),
          // Explains: Display the supplied user-facing text using the chosen style.
          Text('LinkWorks', style: Theme.of(context).textTheme.headlineLarge?.copyWith(fontWeight: FontWeight.bold)),
          // Explains: Reserve the stated space or fixed dimensions in the layout.
          const SizedBox(height: 16),
          // Explains: Display the supplied user-facing text using the chosen style.
          Text('Local skills.\nTrusted connections.', style: Theme.of(context).textTheme.headlineMedium),
          // Explains: Reserve the stated space or fixed dimensions in the layout.
          const SizedBox(height: 16),
          // Explains: Display the supplied user-facing text using the chosen style.
          const Text('Find skilled help nearby, compare quotes, and get the job done.'),
          // Explains: Reserve the stated space or fixed dimensions in the layout.
          const SizedBox(height: 32),
          // Explains: Display the provided category labels as wrapping, noninteractive chips.
          const ChipRow(labels: ['Carpentry', 'Plumbing', 'Electrical']),
          // Explains: Insert the debug preview button and explanatory notice only when a callback is available.
          if (onPreview != null) ...[
            // Explains: Reserve the stated space or fixed dimensions in the layout.
            const SizedBox(height: 32),
            // Explains: Display the shared primary action and delegate behavior to its callback.
            PrimaryButton(label: 'Preview app screens', onPressed: onPreview),
            // Explains: Reserve the stated space or fixed dimensions in the layout.
            const SizedBox(height: 8),
            // Explains: Display the supplied user-facing text using the chosen style.
            const Text('Design preview • accounts and job actions are not connected yet.'),
          // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
          ],
        // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
        ]),
      // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
      ),
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    ))),
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
