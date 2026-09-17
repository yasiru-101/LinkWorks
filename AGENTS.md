# LinkWorks collaboration instructions

## Implementation authorization

The user is implementing this application step by step. Do not start a new feature,
continue unfinished feature work, or change app behavior without instructions for
that step. Preserve the existing scaffold unless the user asks to change it.

## Required code explanations

The user requires comments for each code block, not for each individual line.
This requirement applies to future additions and edits. Leave existing comments
unchanged unless the associated code is edited or the user requests a cleanup.

- Add a comment before each logical code block explaining its purpose and any
  important assumptions so the user can understand and change it later.
- Explain relevant values, conditions, callbacks, and returns at the block level
  when needed to understand their role in LinkWorks. Avoid line-by-line comments
  and comments that only repeat the code.
- Give each source file an ownership/purpose comment and identify where related
  changes belong. Clearly label placeholder behavior and incomplete integrations.
- Keep comments synchronized whenever the associated code changes.
- Keep syntax valid. For JSON and other formats without comments, use a sibling
  `README_<filename>_BLOCKS.md` with block-level explanations. For XML, put comments
  before complete elements, never inside an opening tag or attribute value.
- Generated project source must identify its editable source and regeneration
  command. Preserve/reapply explanatory comments after regeneration; do not change
  generated logic manually. External dependencies, build output, caches, binary
  assets, and local IDE files are not project implementation code to annotate.
- When a task requests comments only, preserve all non-comment code. Verify that
  behavior has not changed; do not use the task as permission to implement or fix features.

## Ownership and documentation

Keep the A-E folder allocation. Shared app bootstrap, dependencies, and reusable
code remain shared. Do not rename the member directories without instructions.

All README files and the original project planning/description documents must
remain ignored by Git for now. The user will request the final project README later.
Do not commit or push changes merely because GitHub is connected.

## Authentication and budget constraints

Use email and password sign-in only. Do not add Google sign-in or phone/SMS OTP.
Keep this project free: do not enable billing, upgrade to Blaze, or activate services
that require a payment account. Use Firebase emulators for local Auth, Firestore and
Storage development. Decide on a free live alternative before implementing uploads,
maps or backend functions that would otherwise require billing.
