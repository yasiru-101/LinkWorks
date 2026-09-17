// Reusable UI components for all five members, coordinated by Member E.
// Change a component here only when its behavior should change across every screen using it.
// Pass feature-specific labels, validation, and actions from the owning member package.
// These widgets do not read or write Firebase and do not perform navigation themselves.

// Explains: Import Material widgets, layout types, icons, and theme APIs used to describe the UI.
import 'package:flutter/material.dart';
// Shared fallback messages are maintained with the other app constants.
import '../constants/app_constants.dart';

// Explains: Define a reusable widget whose appearance is determined by its constructor inputs.
class PrimaryButton extends StatelessWidget {
  // Disable repeated submissions while busy; the caller owns the async action/state.
  // Explains: Declare widget inputs; super.key preserves identity when Flutter updates the widget tree.
  const PrimaryButton({super.key, required this.label, this.onPressed, this.busy = false});
  // Explains: Declare/configure label: the text or accessibility label shown by the control.
  final String label;
  // Explains: Declare/configure onPressed: the action supplied by the owning screen.
  final VoidCallback? onPressed;
  // Explains: Store whether the caller currently has an action in progress; the button does not manage this state itself.
  final bool busy;
  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Explains: Describe the widget tree for the current inputs/state; Flutter calls this during rebuilds.
  Widget build(BuildContext context) => FilledButton(
    // Explains: Disable the button while busy; otherwise invoke the caller callback, with null also meaning disabled.
    onPressed: busy ? null : onPressed,
    // Explains: Choose the loading indicator while an action is in progress, otherwise show the button label.
    child: busy
        // Explains: Select this value/widget when the condition on the preceding line is true.
        ? const SizedBox.square(dimension: 20, child: CircularProgressIndicator(strokeWidth: 2))
        // Explains: Select this alternative value/widget when the preceding condition is false.
        : Text(label),
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Define a reusable widget whose appearance is determined by its constructor inputs.
class SecondaryButton extends StatelessWidget {
  // Lower-emphasis action using the global outlined-button theme.
  // Explains: Declare widget inputs; super.key preserves identity when Flutter updates the widget tree.
  const SecondaryButton({super.key, required this.label, this.onPressed});
  // Explains: Declare/configure label: the text or accessibility label shown by the control.
  final String label;
  // Explains: Declare/configure onPressed: the action supplied by the owning screen.
  final VoidCallback? onPressed;
  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Explains: Describe the widget tree for the current inputs/state; Flutter calls this during rebuilds.
  Widget build(BuildContext context) => OutlinedButton(onPressed: onPressed, child: Text(label));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Define a reusable widget whose appearance is determined by its constructor inputs.
class LinkWorksTextField extends StatelessWidget {
  // The caller owns and disposes the controller, and supplies feature validation.
  // Password inputs remain one line even if a larger maxLines value is supplied.
  // Explains: Declare widget inputs; super.key preserves identity when Flutter updates the widget tree.
  const LinkWorksTextField({super.key, required this.label, this.controller, this.validator,
    // Explains: Default to visible single-line input; allow the caller to request password masking and a suitable keyboard.
    this.obscureText = false, this.keyboardType, this.maxLines = 1});
  // Explains: Declare/configure label: the text or accessibility label shown by the control.
  final String label;
  // Explains: Declare/configure controller: the input controller owned by the calling screen.
  final TextEditingController? controller;
  // Explains: Declare/configure validator: the validation callback supplied by the feature.
  final FormFieldValidator<String>? validator;
  // Explains: Declare/configure obscureText: whether the field hides its characters.
  final bool obscureText;
  // Explains: Declare/configure keyboardType: the keyboard suited to the input.
  final TextInputType? keyboardType;
  // Explains: Declare/configure maxLines: the permitted input height in text lines.
  final int maxLines;
  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Explains: Describe the widget tree for the current inputs/state; Flutter calls this during rebuilds.
  Widget build(BuildContext context) => TextFormField(
    // Explains: Supply controller: the input controller owned by the calling screen; the expression on this line determines its current value.
    controller: controller,
    // Explains: Supply validator: the validation callback supplied by the feature; the expression on this line determines its current value.
    validator: validator,
    // Explains: Supply obscureText: whether the field hides its characters; the expression on this line determines its current value.
    obscureText: obscureText,
    // Explains: Supply keyboardType: the keyboard suited to the input; the expression on this line determines its current value.
    keyboardType: keyboardType,
    // Explains: Keep masked/password input to a single line; respect the requested line count for ordinary text.
    maxLines: obscureText ? 1 : maxLines,
    // Explains: Display the caller label inside the input using the shared input-decoration theme.
    decoration: InputDecoration(labelText: label),
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Define a reusable widget whose appearance is determined by its constructor inputs.
class AvatarImage extends StatelessWidget {
  // Use a person icon when the URL is absent or fails to load.
  // Explains: Declare widget inputs; super.key preserves identity when Flutter updates the widget tree.
  const AvatarImage({super.key, required this.name, this.url});
  // Explains: Declare/configure name: the display name shown to other users.
  final String name;
  // Explains: Declare/configure url: the optional remote image address.
  final String? url;
  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Explains: Describe the widget tree for the current inputs/state; Flutter calls this during rebuilds.
  Widget build(BuildContext context) => Semantics(
    // Explains: Supply label: the text or accessibility label shown by the control; the expression on this line determines its current value.
    label: '$name profile photo',
    // Explains: Reserve the stated space or fixed dimensions in the layout.
    child: ClipOval(child: SizedBox.square(
      // Explains: Reserve a 48 by 48 logical-pixel square for the circular avatar.
      dimension: 48,
      // Explains: Use the built-in person placeholder when there is no remote avatar URL.
      child: url == null
          // Explains: Select this value/widget when the condition on the preceding line is true.
          ? const ColoredBox(color: Color(0xFFD8EDE6), child: Icon(Icons.person_outline))
          // Explains: Select this alternative value/widget when the preceding condition is false.
          : Image.network(url!, fit: BoxFit.cover,
              // Explains: Display the visual symbol for this action or state.
              errorBuilder: (_, _, _) => const Icon(Icons.person_outline)),
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    )),
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Define a reusable widget whose appearance is determined by its constructor inputs.
class EmptyState extends StatelessWidget {
  // Reusable message for empty lists; an optional action is supplied by the screen.
  // Explains: Declare widget inputs; super.key preserves identity when Flutter updates the widget tree.
  const EmptyState({super.key, required this.title, required this.message,
    // Explains: Default the empty-state symbol to an inbox and allow an optional caller-owned action button.
    this.icon = Icons.inbox_outlined, this.action});
  // Explains: Declare/configure title: the visible title.
  final String title;
  // Explains: Declare/configure message: the text displayed or sent for this item.
  final String message;
  // Explains: Declare/configure icon: the icon used to represent this item.
  final IconData icon;
  // Explains: Declare/configure action: the optional button shown below the message.
  final Widget? action;
  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Explains: Describe the widget tree for the current inputs/state; Flutter calls this during rebuilds.
  Widget build(BuildContext context) => Center(child: Padding(
    // Explains: Inset content by the stated logical-pixel spacing.
    padding: const EdgeInsets.all(24),
    // Explains: Arrange the following children vertically.
    child: Column(mainAxisSize: MainAxisSize.min, children: [
      // Explains: Display the visual symbol for this action or state.
      Icon(icon, size: 48, color: Theme.of(context).colorScheme.primary),
      // Explains: Reserve the stated space or fixed dimensions in the layout.
      const SizedBox(height: 16),
      // Explains: Display the supplied user-facing text using the chosen style.
      Text(title, style: Theme.of(context).textTheme.titleLarge, textAlign: TextAlign.center),
      // Explains: Reserve the stated space or fixed dimensions in the layout.
      const SizedBox(height: 8),
      // Explains: Display the supplied user-facing text using the chosen style.
      Text(message, textAlign: TextAlign.center),
      // Explains: Add spacing and the optional caller-provided action only when it exists; the null check makes action! safe.
      if (action != null) ...[const SizedBox(height: 24), action!],
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    ]),
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Define a reusable widget whose appearance is determined by its constructor inputs.
class ErrorState extends StatelessWidget {
  // Show a user-readable error and forward retry to the owning feature.
  // Explains: Declare widget inputs; super.key preserves identity when Flutter updates the widget tree.
  const ErrorState({super.key, required this.onRetry});
  // Explains: Declare/configure onRetry: the callback that starts another attempt.
  final VoidCallback onRetry;
  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Explains: Describe the widget tree for the current inputs/state; Flutter calls this during rebuilds.
  Widget build(BuildContext context) => EmptyState(
    // Explains: Supply title: the visible title; the expression on this line determines its current value.
    title: ErrorStrings.title,
    // Explains: Supply message: the text displayed or sent for this item; the expression on this line determines its current value.
    message: ErrorStrings.connection,
    // Explains: Supply icon: the icon used to represent this item; the expression on this line determines its current value.
    icon: Icons.cloud_off_outlined,
    // Explains: Supply action: the optional button shown below the message; the expression on this line determines its current value.
    action: PrimaryButton(label: 'Try again', onPressed: onRetry),
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Define a reusable widget whose appearance is determined by its constructor inputs.
class LoadingState extends StatelessWidget {
  // Generic startup/loading indicator; list skeletons can be added later.
  // Explains: Declare widget inputs; super.key preserves identity when Flutter updates the widget tree.
  const LoadingState({super.key});
  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Build an accessible loading state; Semantics requires a non-const parent expression.
  Widget build(BuildContext context) => Center(
    // Explains: Supply a spoken label or accessibility grouping for assistive technology.
    child: Semantics(label: 'Loading', child: const CircularProgressIndicator()),
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Define a reusable widget whose appearance is determined by its constructor inputs.
class SectionHeader extends StatelessWidget {
  // Standard heading spacing and typography for grouped screen content.
  // Explains: Declare widget inputs; super.key preserves identity when Flutter updates the widget tree.
  const SectionHeader({super.key, required this.title});
  // Explains: Declare/configure title: the visible title.
  final String title;
  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Explains: Describe the widget tree for the current inputs/state; Flutter calls this during rebuilds.
  Widget build(BuildContext context) => Padding(
    // Explains: Inset content by the stated logical-pixel spacing.
    padding: const EdgeInsets.symmetric(vertical: 16),
    // Explains: Display the supplied user-facing text using the chosen style.
    child: Text(title, style: Theme.of(context).textTheme.titleLarge),
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Define a reusable widget whose appearance is determined by its constructor inputs.
class ChipRow extends StatelessWidget {
  // Display-only chips that wrap on narrow screens; this is not a filter control.
  // Explains: Declare widget inputs; super.key preserves identity when Flutter updates the widget tree.
  const ChipRow({super.key, required this.labels});
  // Explains: Declare/configure labels: the display-only chip text values.
  final List<String> labels;
  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Explains: Describe the widget tree for the current inputs/state; Flutter calls this during rebuilds.
  Widget build(BuildContext context) => Wrap(
    // Explains: Set horizontal spacing between adjacent wrapped chips.
    spacing: 8,
    // Explains: Set spacing between rows when chips wrap.
    runSpacing: 4,
    // Explains: Display the supplied user-facing text using the chosen style.
    children: labels.map((label) => Chip(label: Text(label))).toList(),
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Define a reusable widget whose appearance is determined by its constructor inputs.
class RatingStars extends StatelessWidget {
  // Display-only rating with half-star visuals and one accessible spoken label.
  // Explains: Declare widget inputs; super.key preserves identity when Flutter updates the widget tree.
  const RatingStars({super.key, required this.rating});
  // Explains: Receive the displayed rating from the caller; this widget does not save reviews or calculate averages.
  final double rating;
  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Explains: Describe the widget tree for the current inputs/state; Flutter calls this during rebuilds.
  Widget build(BuildContext context) => Semantics(
    // Explains: Supply label: the text or accessibility label shown by the control; the expression on this line determines its current value.
    label: '${rating.clamp(0, 5).toStringAsFixed(1)} out of 5 stars',
    // Explains: Arrange the following children horizontally.
    child: ExcludeSemantics(child: Row(mainAxisSize: MainAxisSize.min,
      // Explains: Display the visual symbol for this action or state.
      children: List.generate(5, (index) => Icon(
        // Explains: For each of five positions, choose a full star for a complete point, a half star for at least half a point, otherwise an outline.
        rating >= index + 1 ? Icons.star : rating >= index + 0.5 ? Icons.star_half : Icons.star_border,
        // Explains: Choose the color used for this visual element.
        color: const Color(0xFF956000), size: 20,
      // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
      )),
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    )),
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Member E: reusable password entry; authentication rules remain in Member A.
class LinkWorksPasswordField extends StatefulWidget {
  const LinkWorksPasswordField({super.key, this.controller, this.validator});
  final TextEditingController? controller;
  final FormFieldValidator<String>? validator;

  // Keep visibility local to this field so changing it does not reset the form.
  @override
  State<LinkWorksPasswordField> createState() => _LinkWorksPasswordFieldState();
}

// Toggling visibility preserves the controller and validation supplied by the form.
class _LinkWorksPasswordFieldState extends State<LinkWorksPasswordField> {
  bool obscured = true;

  // Disable suggestions and expose a labelled toggle for accessibility.
  @override
  Widget build(BuildContext context) => TextFormField(
    controller: widget.controller,
    validator: widget.validator,
    obscureText: obscured,
    enableSuggestions: false,
    autocorrect: false,
    decoration: InputDecoration(
      labelText: 'Password',
      suffixIcon: IconButton(
        tooltip: obscured ? 'Show password' : 'Hide password',
        onPressed: () => setState(() => obscured = !obscured),
        icon: Icon(obscured ? Icons.visibility : Icons.visibility_off),
      ),
    ),
  );
}
