# Model-owned persona presentation

Write persona display content into the bound landing child's `assets/landing-page.json`
and mirror the exact `landingPage` into the parent's `assets/chat-config.json`.
Use stable structural keys and IDs. Do not put persona English defaults, images,
fictional names, workshop lists, form options, sample activities or chat prompts in
the platform renderer. A changed model must change the rendered page without a
platform code edit. Layout, event handlers and execution/access rules stay in code.

Mirav's `community-connections` renderer requires `landingPage.mirav.schemaVersion: 1`.
Its `ui` dictionary contains display strings keyed by the renderer contract;
`brand`, `media`, `activities`, `workshops`, `cohorts`, `process`, `form`,
`schoolsFaqs`, `metrics`, `fundingSources` and preview data are authored model content.
The scaffold's `scripts/mirav-landing-copy.cjs` validates the complete presentation.
The same structural validator runs in the platform's edit/publish and translation paths.
Illustrative activity/workshop `icon` fields contain bounded literal pin glyphs;
they are distinct from the platform icon-library fields and are never translated.

Keep Select option IDs and selected cohort/workshop IDs unchanged across languages.
Translate labels, headings, descriptions, time labels and accessibility text.
Initiation messages and literal substitution templates live under `actions.*.command`;
they are excluded from display translation. Substitute declared tokens literally,
never evaluate them as JavaScript or expand them into browser/terminal commands.
Use styled Select/Input/Textarea controls. Model the portrait separately from the
brand logo: AI chat headings use the persona portrait, while app/page branding can
use its logo. Use the shared attribution component and language control.

Before generating languages, inventory the whole rendered experience: header and
mobile menu, both tabs, hero, prototype chat/map/details, school palette and brief,
confirmation/error states, FAQ and footer. Ensure every displayed persona string
is projected into translation assets. Check that structural-name collisions such
as `ui.profile` are translated as copy while runtime `id`, `role` and `command`
fields remain unchanged.

Generate split assets with the landing-page-translations skill. Validate current
source revisions, indexed coverage, complete model schema, and child/parent byte
mirroring. Test a second language and an RTL language, both tabs, mobile header
overflow, portrait loading, deep-link persistence, and stable submitted option IDs.
Use test-only fixtures; illustrative activity screens must make no live creation,
participation, co-host or notification calls. Test that a changed model value
appears and that incomplete authored content is rejected instead of silently
falling back to English. Push only within the user's authorization, child first
and then the parent's exact immutable pin. Repository pushes do not authorize
platform deployment, live persona activation or store rollout.

## Brand interactions

Author light and dark colors in `landingPage.design.brand.colors`. Use `accent` for
primary/selected controls and optional `accentHover` for their hover tone; these
are normalized hex seeds, never CSS. Chat, voice launchers, focus borders and
signed-in navigation must consume the same resolved model palette. Do not spread
a default palette and replace only its accent: that retains unrelated hover,
border and soft-selection colors. The renderer derives contrast-safe normal and
hover foregrounds. Mirror these seeds into `branding.theme.colors` in
`assets/persona-app-config.json` for native and desktop builds.
