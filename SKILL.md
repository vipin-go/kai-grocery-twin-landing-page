---
name: landing-page-builder
description: >
  Build, validate, and maintain the Git-backed marketing landing page for a
  Gabriel Operator Persona's public /chat/:agentId page by editing
  assets/landing-page.json. Use this skill when the user wants to write or
  update a persona's landing page copy (headline, subheadline, feature
  highlights, call-to-action label), including when generating that copy
  from within ChatGPT Sites, Claude Design, or any other AI site builder.
metadata:
  author: gabriel-operator
  version: "1.2"
  compatibility: Requires Node.js 16+ for the validation script.
---

# Landing Page Builder

## What this actually renders

A persona's public page at `/chat/:agentId` shows this content as a real,
built-in marketing landing page: a model-driven header (persona name, brand
mark, authored same-page nav items, and an optional CTA), a two-column hero (headline/subheadline/CTAs
on the left, a chat-window mockup with a scripted sample conversation and a
real, functional message input on the right), a feature card grid, optional
How It Works and Stories/testimonial sections, a "Meet {name}" section, an FAQ accordion, and a Contact section — with a floating
chat widget in the bottom-right corner. Sending a message from the hero
mockup's input, any CTA button, or the floating widget all expand into the
persona's full chat experience. There is no separate rendering step to run;
once the content below reaches the persona's `chat-config.json` (see
**Getting content live**), the app renders it automatically. If a persona has
no `landingPage` content configured, its `/chat/:agentId` page falls back to
a plain hero-form chat entry instead — this skill is what turns that on.

The FAQ and Contact sections only render when you provide
`landingPage.faqs`/`landingPage.contact`. Header links are authored separately
through `landingPage.header.navItems`; a link whose target section is absent
is hidden automatically.

The only thing on this page that is **not** configurable from this file is
the "Made using Gabriel Operator" attribution footer — that's hardcoded in
the page's source component on purpose, so it can't be edited or removed
through content. Every other section, including FAQ and Contact, is driven
entirely by this JSON.

Every field below is optional except `headline` — omit anything you don't
want and the page renders sensible defaults (e.g. no badge pill, one CTA
button instead of two, a generic opening line in the hero mockup).

## Portable Git contract (schema v2)

```json
{
  "schemaVersion": 2,
  "resourceKey": "landing_page.example",
  "runtimeDataPolicy": "definitions_only",
  "landingPage": {
    "design": {
      "variant": "signature",
      "theme": { "palette": "forest", "primaryColor": "green", "secondaryColor": "teal", "accentColor": "orange" }
    },
    "localization": {
      "translation": {
        "enabled": true,
        "sourceLanguage": "en",
        "defaultLanguage": "en",
        "autoDetectCountryLanguage": true,
        "generatedTranslations": []
      },
      "regionalPages": []
    },
    "header": {
      "brandMark": "heart",
      "navItems": [
        { "label": "About", "target": "about" },
        { "label": "How it works", "target": "how-it-works" },
        { "label": "Stories", "target": "stories" },
        { "label": "FAQs", "target": "faq" }
      ],
      "ctaLabel": "Meet the persona"
    },
    "badge": "Optional pill above the headline",
    "headline": "One line, the whole pitch",
    "headlineAccent": "the whole pitch",
    "headlineLine2": "an optional second line",
    "subheadline": "One or two sentences of supporting context",
    "ctaLabel": "Talk to the persona",
    "secondaryCtaLabel": "Optional second button",
    "featureTags": ["Short tag one", "Short tag two"],
    "demoConversation": [
      { "role": "assistant", "text": "Sample opening line in the hero chat mockup." },
      { "role": "user", "text": "Sample reply." }
    ],
    "heroChat": {
      "statusLabel": "Online · usually replies instantly",
      "inputPlaceholder": "Type a message…",
      "suggestedPrompts": ["Suggested question one", "Suggested question two"]
    },
    "features": [
      { "icon": "heart", "title": "Feature title", "body": "One or two sentences." }
    ],
    "howItWorks": {
      "icon": "envelope",
      "kicker": "How it works",
      "heading": "A clear path from start to finish.",
      "steps": [
        { "icon": "chat", "title": "Start a conversation", "body": "Describe the first step." },
        { "icon": "search", "title": "Review the possibilities", "body": "Describe the second step." },
        { "icon": "user-plus", "title": "Make the connection", "body": "Describe the third step." }
      ]
    },
    "faqs": [
      { "question": "Sample question?", "answer": "Sample answer." }
    ],
    "stories": {
      "icon": "chat",
      "heading": "A model-authored social-proof heading.",
      "quote": "A concise testimonial or success story.",
      "attribution": "A person or couple",
      "stats": [
        { "icon": "star", "value": "A value", "label": "A short metric label" }
      ]
    },
    "faqIntro": { "kicker": "Good questions", "heading": "Everything worth asking." },
    "contact": {
      "heading": "Optional heading",
      "body": "Optional supporting line.",
      "email": "optional@example.com"
    },
    "backgroundImage": {
      "src": "https://raw.githubusercontent.com/<owner>/<this-repo>/main/assets/media/background.jpg",
      "alt": ""
    },
    "seoImage": {
      "src": "https://raw.githubusercontent.com/<owner>/<this-repo>/main/assets/media/seo-banner.jpg",
      "alt": "A share preview of the persona"
    },
    "closing": { "kicker": "Ready when you are", "heading": "An authored closing line.", "ctaLabel": "Talk to the persona" }
  },
  "commitMessage": "Update landing page content"
}
```

- Never commit `pageId`, `userId`, or any runtime/analytics data — this file is authored copy only, nothing execution-related.
- Keep `resourceKey` stable once published; change it only when intentionally forking the content for a different persona.

## Fields

- `landingPage.design` (optional, object) — explicitly selects the renderer's visual treatment; presentation is never inferred from the persona name.
  - `variant` (optional, `default`, `signature`, `banking`, `form-operations`, `logistics-portal`, `cinematic-campaigns`, `recruiting-operations`, `grocery-twin`, `event-introductions`, or `home-introductions`) — each non-default variant selects one registered, versioned presentation and requires its bounded content object. `logistics-portal` enables Emil's governed logistics portal-twin presentation, and `home-introductions` enables Nest's private buyer/seller introduction presentation.
  - `defaultThemeMode` (optional, `light` or `dark`) — initial mode for the landing page and matching chat/embed; a visitor's explicit mode selection still wins.
  - `theme` (optional, theme object) — authored `palette`, required `primaryColor`, and optional `secondaryColor`/`accentColor` used by the landing page.
  - `brand` (optional, object) — bounded exact brand seeds shared by landing, chat, embed, and portalled dialogs. This is the model-generated branding surface; never generate CSS or Tailwind classes.
    - `presetRevision` (optional, currently `1`) — pins the persona to the immutable revision of its selected `variant`.
    - `colors.light` / `colors.dark` (optional objects) — each accepts normalized six-digit lowercase hex values for `canvas`, `surface`, `sidebar`, `text`, `accent`, and `userBubble`. Dependent hover, muted, border, and contrast-safe foreground tokens are derived by the renderer.
    - `typography.body` / `typography.display` / `typography.label` (optional objects) — either `{ "source": "builtin", "family": "inter" }` using `dm-sans`, `inter`, `system`, `roboto`, `poppins`, or `outfit`; or `{ "source": "google", "family": "TASA Orbiter" }` using a safe Google Font family name.
    - Normal text must reach WCAG AA contrast against both `canvas` and `surface`. Low decorative-accent contrast is reported as a warning.
- `landingPage.localization` (required on every new landing page; optional only for backward-compatible reads of legacy pages) — public translation and IP-country routing. This is an additive schema-version-2 field; do not bump the landing-page schema version. New pages must set `translation.enabled: true`, `sourceLanguage: "en"`, `defaultLanguage: "en"`, `autoDetectCountryLanguage: true`, `generatedTranslations: []`, and `regionalPages: []` before authored regions or generated variants are added. Do not disable it during creation.
  - `translation` (optional object) — `{ "enabled": boolean, "sourceLanguage": "en", "defaultLanguage": "en", "autoDetectCountryLanguage": true, "generatedTranslations": [] }`. Languages must use shared-catalogue ids. Enabling it adds the language selector to every registered landing-page header. `autoDetectCountryLanguage` defaults to true and uses the server-resolved request-IP country plus CLDR likely-language data; an explicit matched regional default still wins. The platform—not authored JSON—enforces a maximum of three newly translated target languages per visitor and page in each rolling 24-hour window.
  - `translation.generatedTranslations` is a compact platform-owned Git manifest. New entries contain `language`, nullable `regionKey`, a 64-character `sourceRevision`, `assetPath`, and optional `generatedAt`. The complete translated page lives in `assets/landing-page.<language>.json`; regional filenames are `assets/landing-page.<regionKey>.<language>.json`. Runtime fetches only the selected file before quota reservation or LLM generation. Legacy inline `page` entries remain readable during migration, but new writers must not create them. Never invent a revision or asset path: generate entries through the platform translation flow or repository tooling.
  - `regionalPages` (optional array) — each item requires a unique lowercase `key`, an author-facing `label`, one or more unique uppercase ISO alpha-2 `countryCodes`, a catalogue `defaultLanguage`, and `page`.
  - Each regional `page` is a complete landing-page clone without `localization`; it may select any registered `design.variant`. Never nest localization or reuse a country in another region.
  - Runtime matching uses the server-resolved request-IP country only. A visitor language preference changes translation, never region selection. Matching regional content replaces the base page before theme, SEO, header, CTA, widget, and embed presentation are derived.
- `landingPage.header` (optional, object) — authored header content. When present, only configured items render; no menu labels are generated from persona-specific code.
  - `brandMark` (optional, `heart`, `image`, or `initial`).
  - `navItems` (optional, array of `{ label, target }`) — `target` is one of `meet`, `about`, `capabilities`, `use-cases`, `trust`, `how-it-works`, `stories`, `faq`, or `contact`. Items whose target section is absent are hidden automatically.
  - `ctaLabel` (optional, string) — separate right-side meet CTA. Omit when the nav already contains a meet item.
- `landingPage.headline` (required, string) — the hero headline (first line).
- `landingPage.headlineAccent` (optional, string) — a substring of `headline`, rendered in the persona's accent color. Must exactly match a substring of `headline` or it's ignored.
- `landingPage.headlineLine2` (optional, string) — a second headline line, rendered plain (no accent) below the first.
- `landingPage.badge` (optional, string) — a small pill shown above the headline, e.g. "Custom AI matchmaking".
- `landingPage.subheadline` (optional, string) — one or two supporting sentences below the headline.
- `landingPage.ctaLabel` (optional, string) — the primary button label, used on the hero CTA, the hero mockup's send button (implicitly, via the arrow icon), the closing CTA, and the floating widget's launcher. Falls back to "Talk to {persona name}" if omitted.
- `landingPage.secondaryCtaLabel` (optional, string) — an outlined second hero button next to the primary CTA. Omit for a single-button hero.
- `landingPage.featureTags` (optional, string array) — a short caption line under the hero buttons, rendered joined with " · ", e.g. `["No swiping", "Mutual consent only"]`.
- `landingPage.demoConversation` (optional, array of `{ role: "user" | "assistant", text }`) — the scripted messages shown above the (real, functional) input in the hero chat mockup. Keep it to 2–4 short lines that show what talking to this persona actually feels like. Falls back to one generic opening line if omitted.
- `landingPage.heroChat` (optional, object) — authored chat-preview microcopy: `statusLabel`, `inputPlaceholder`, and `suggestedPrompts` (a short string array).
- `landingPage.formOperations` (required when `design.variant` is `form-operations`) — the bounded model for the hero demonstration, four-step proof strip, simulation principle and six guarantees, impact cards and percentage bars, six-step process, seven use-case tabs, worked example, controlled-autonomy boundary, local-only lead capture, and footer. `heroDemo.captureAndFill` may opt into the platform-owned public image-preview runtime using only an enabled registered `commandTrigger`; models may author copy but cannot raise upload, analysis, chat, voice, or expiry limits. The validator checks the trigger syntax, `done|active|pending` trace states, `persona|human` actors, `live|next|custom` use-case statuses, percentages from 0–100, supported icons, contact email, media, fonts, colors, accessibility, and the no-emoji rule (with the copyright symbol permitted in `footer.copyright`). Footer `poweredBy`, `closingStatement`, and `copyright` are optional. This object controls copy and repeated data only; it never accepts CSS, Tailwind classes, layout, animation, or executable code.
- `landingPage.logisticsPortal` (required when `design.variant` is `logistics-portal`) — bounded copy and repeated data for Emil's fixed black/lime logistics presentation: header, hero, proof items, hero chat, local customs/carrier rehearsal, edge architecture, platform twin, six-step fail-closed process, workflows, pilot, and footer. `hero.rehearsal.commandTrigger` must reference an enabled `operator_action` command and, for the portable Emil model, `workflow.emil.rehearse-filing`. The renderer owns all CSS, layout, motion, authentication handoff, and simulation authority. Models cannot add routes, code, credentials, external queries, or live portal actions.
- `landingPage.cinematicCampaigns` (required when `design.variant` is `cinematic-campaigns`) — bounded copy and media for Archer's hero, Product Explainer guided preview, three workflow acts, capability marquee, four-film showcase, seven campaign features, workspace specimen, three director principles, two journal cards, five-frame closing strip, and footer. `hero.guidedDemo.commandTrigger` must reference an enabled `operator_action`; the anonymous preview never fetches the supplied URL or runs workflows. Media must be direct HTTPS image/video URLs. Exact array counts preserve the registered source layout. This object never accepts components, JavaScript, CSS, Tailwind classes, routes, executable queries, or runtime limits.
- `landingPage.recruitingOperations` (required when `design.variant` is `recruiting-operations`) — bounded copy and repeated data for Lina's particle hero, four recruiter-control feature cards, monitored activity timeline, manual-versus-Lina comparison, four-row lead board, five recruiting pillars, three approval guardrails, five FAQs, closing section, and footer. `leads.commandTrigger` must reference an enabled `operator_action`; the renderer accepts only public HTTP(S) hiring-signal URLs and never executes model-provided code. Exact array counts preserve the registered source layout. The object cannot contain components, JavaScript, CSS, Tailwind classes, routes, executable queries, or runtime limits.
- `landingPage.homeIntroductions` (required when `design.variant` is `home-introductions`) — bounded copy and media for Nest's editorial hero, event/city configurations, buyer and seller tracks, privacy sequence, three-step process, proposal specimens, guarantee, Meet Nest section, legal disclaimers, and footer. `hero.briefDemo.commandTrigger` must reference an enabled `operator_action`. Anonymous visitors may edit only the trusted visible brief fields for at most ten chat turns or one five-minute voice session; the runtime cannot search participants, create proposals, reveal exact addresses/contact details, or persist participant data before authentication. The model cannot author code, CSS, routes, queries, security limits, or executable behavior.
- `landingPage.features` (optional, array, keep it to 3–6 entries) — rendered as a card grid below the hero. Each entry:
  - `title` (required, string) — a few words.
  - `body` (required, string) — one or two sentences.
  - `icon` (optional) — a supported icon-library key. The full set is `heart`, `shield-check`, `sparkles`, `chat`, `users`, `lock`, `check`, `star`, `search`, `lightbulb`, `user-plus`, `calendar`, `question-mark`, and `envelope`.
- `landingPage.gallery.icon` (optional) and each `landingPage.bento.*Card.icon` (required when the bento section is present) use the same icon-library keys. Decorative emoji fields are not supported.
- `landingPage.howItWorks` (optional, object) — renders the numbered process section and enables the `how-it-works` header target. Requires `kicker`, `heading`, and a non-empty `steps` array; each step requires `icon`, `title`, and `body`. Optional `icon` adds an icon beside the kicker and optional `headingAccent` highlights an exact substring of the heading.
- `landingPage.statement` (optional, object) — an editorial domain statement with a required `kicker` and non-empty `segments`. Each segment has `text` and an optional `tone`: `strong`, `muted`, `iris`, or `accent`.
- `landingPage.deployment` (optional, object) — describes supported delivery modes and the governed platform/bank boundary. Requires `kicker`, `heading`, `body`, non-empty `items` (`code`, `title`, `body`), `personaLabel`, `platformLabel`, non-empty `boundaryItems`, and `note`.
- `landingPage.useCases` (optional, object) — a tabbed section with one vertical tab per workflow domain (best for personas that cover several distinct business functions, e.g. one per department or vertical). Requires `heading` and a non-empty `items` array. Optional `icon`/`kicker` add an eyebrow above the heading; optional `headingAccent` highlights an exact substring of the heading; optional `subheading` adds supporting copy. Each `items[]` entry requires:
  - `label` (required, string) — the tab's short name, e.g. "KYC & Onboarding".
  - `number`, `mode`, `outcome`, `summary`, `inputSummary`, `outputSummary` (optional strings) — compact presentation copy used by structured domain themes.
  - `inputs` (required, non-empty array of `{ code, description }`) — the read-scoped data this workflow draws on, e.g. `{ "code": "BUREAU_READ", "description": "Credit bureau score, tradelines, and repayment history." }`.
  - `capabilities` (required, non-empty array of `{ modality, description }`) — which multimodal capabilities are used and how, e.g. `{ "modality": "Vision", "description": "Reads payslips and bank statements." }`. Modality is free text (typically Vision, Camera, Voice, Chat, or System).
  - `outputs` (required, non-empty array of strings) — the artifacts this workflow prepares for review.
  - `workflow` (required, non-empty array of `{ stage, description }`) — the ordered approval pipeline, e.g. `{ "stage": "REVIEW", "description": "Show mismatches and the proposed record." }`. `stage` is typically one of START, RUN (may repeat), REVIEW, APPROVE, EXECUTE, MONITOR.
  - `selfLearning` (required, object with `learns` and `neverChanges`, both required strings) — what the workflow's self-learning loop adapts from, and what stays under human/policy control regardless.
- `landingPage.platform` (optional, object) — multimodal surfaces shown as image cards. Requires `kicker`, `heading`, `body`, and non-empty `items` containing `image`, optional `alt`, `title`, and `body`.
- `landingPage.trust` (optional, object) — operational governance evidence. Requires `kicker`, `heading`, `body`, `statusLabel`, `statusValue`, `statusDetail`, and non-empty `controls` (`title`, `body`).
- `landingPage.footer` (optional, object) — authored footer copy for full-layout domain themes. Requires `tagline`; optional fields are `exploreLabel`, `useCasesLabel`, `getStartedLabel`, and `useCaseLinks` (short display labels that link back to the use-case section).
- `landingPage.faqs` (optional, array) — rendered as an accordion. Add its header link explicitly through `landingPage.header.navItems`; omit the FAQ array to leave the section out. Each entry:
  - `question` (required, string)
  - `answer` (required, string)
- `landingPage.stories` (optional, object) — renders a social-proof/testimonial section and enables a `stories` header target. Requires `heading`, `quote`, and `attribution`; optional fields are `icon`, `kicker`, `meta`, `people` (`image`/`alt`), and `stats` (`icon`/`value`/`label`).
- `landingPage.faqIntro` (optional, object) — authored `heading` plus optional `icon` and `kicker` for the FAQ section. Newlines in `heading` are preserved.
- Do not put emoji characters anywhere in `landingPage`. Use the supported icon-library keys for decorative or semantic symbols; the validator rejects emoji characters and legacy `emoji` fields.
- `landingPage.contact` (optional, object) — adds a Contact section. Add its header link explicitly through `landingPage.header.navItems`; omit the object to leave the section out.
  - `heading` (optional, string) — falls back to "Get in touch with {persona name}".
  - `body` (optional, string) — one or two sentences.
  - `email` (optional, string) — rendered as a `mailto:` button next to the chat CTA. Omit to show only the chat CTA.
- `landingPage.backgroundImage` (optional, object) — a static hero background. `src` is required and `alt` is optional; use an empty `alt` for a purely decorative image. Use this when the opening visual should remain fixed instead of moving with scroll.
- `landingPage.seoImage` (optional, object) — Open Graph / SEO share image for the public landing page only. `src` is required and `alt` is optional. Commit the file under `assets/media/` and use a public URL, the same way as `backgroundImage`. Chat and embed keep using the persona banner; omit this field to fall back to that banner (then the landing hero background, then other share candidates). Do not reuse this image as the chat embed banner.
- `landingPage.backgroundVideo` (optional, object) — a full-page video background whose current frame tracks scroll position (scrubbed, never autoplayed/looped — it only moves when the visitor scrolls). Omit entirely for the plain page background.
  - `src` (required, string) — a direct video URL. Commit the actual video file to this repo under `assets/media/` and reference it via `https://raw.githubusercontent.com/<owner>/<this-repo>/<branch>/assets/media/<file>.mp4` — **this only works if the repo is public**; a private repo's raw URL 404s/403s for anonymous visitors. If the repo must stay private, host the video elsewhere (e.g. through the platform's own media upload) and put that URL here instead.
  - `poster` (optional, string) — an image URL shown before the video has loaded enough to scrub. Same public-URL requirement as `src` if hosted in this repo.
  - When set, every other section's background becomes translucent so the video reads through continuously as the visitor scrolls — this is automatic, nothing else to configure.
  - `backgroundImage` and `backgroundVideo` are mutually exclusive; choose one.
- `landingPage.closing` (optional, object) — authored final-section `heading`, optional `kicker`/`body`, and optional `ctaLabel`. Newlines in `heading` are preserved.

Write in the persona's own voice — read `assets/chat-config.json`'s
`publishedConfig.systemPrompt`/`name`/`description` first so the headline and
features actually match what the persona does, rather than generic SaaS copy.

## Git-backed landing page repositories

When this skill is materialized as a Git repository for one persona's landing
page, the repo contains this scaffold plus `assets/landing-page.json`. Edit
that file directly — there is no separate runtime-data file for this
resource kind; the whole thing is authored copy, same principle as a List's
schema (never commit rows) but here there is no separate row-bearing side at
all.

### Inside a Persona workspace

This repository is usually a **git submodule** of an AI Persona repository, at
`references/landing-pages/<resource-key>/`, exactly like `references/lists/<key>/`
or `references/pipelines/<key>/`. `publishedConfig.landingPageRef: { "resourceKey": "..." }`
on the parent persona's `chat-config.json` records which landing-page repo is
the source of truth, mirroring how a slash command carries a `workflowRef`.

If the parent persona's `scripts/publish-workspace.js` does not yet recognize
`landing_page` as a kind (older personas won't), add it before running
`status`/`publish`:

```js
// In KIND_DIRECTORY and PRIMARY_ASSET:
landing_page: 'landing-pages',              // KIND_DIRECTORY
landing_page: 'assets/landing-page.json',   // PRIMARY_ASSET
// In CHILD_VALIDATORS:
landing_page: [
  { script: 'scripts/validate-landing-page.js', run: ['node'], asset: 'assets/landing-page.json' },
],
```

Then add a resolution block in `buildLocalManifest` that reads
`published.landingPageRef.resourceKey`, matches it against
`references/landing-pages/<dir>/assets/landing-page.json`'s own `resourceKey`,
and adds a `persona -> landing_page` edge — mirror the existing slash-command
→ workflow-ref block for the exact pattern. This is an **authoring-graph**
reference (like `team_agent`), not a strict portable `registry.json` entry —
it does not change the "exactly one workflow/pipeline/list" contract.

### Getting content live

Unlike Pipeline/List/Workflow, there is currently no automated import step
for this resource kind — the persona's live page does not read this
submodule directly. **After changing `assets/landing-page.json` here, commit
and push this repo, then copy the updated `landingPage` object into the
parent persona's own `assets/chat-config.json` under
`publishedConfig.landingPage` (keep `publishedConfig.landingPageRef` pointing
at this repo's `resourceKey`), and commit + push the parent too.** The
persona's live page is served through the same git-backed runtime resolver
that already serves `systemPrompt`/`firstMessage` — once
`publishedConfig.landingPage` is pushed on the parent's default branch, it's
live within seconds, no separate publish/import action needed. The two repos
are kept in sync by hand (or by whichever agent is editing them); there is no
CI step that does this automatically yet.

Public translation is the exception for the live parent projection: after a
safe translation succeeds, the platform appends the source-revisioned result
to its database projection and schedules the existing parent Persona Git sync.
That writer externalizes the complete page to the matching language JSON file
and leaves only its manifest entry in `chat-config.json`. Later visitors fetch
that one file without another model call or visitor-quota reservation. When
pre-generating variants in a landing-page-builder child repository, mirror the
compact manifest and every referenced language file into the parent.

### Pre-generating cached language variants

For every newly created landing page, finish and validate the authored English copy,
then read `../landing-page-translations/SKILL.md` and run its maintained generator with
the default 37-language catalogue before the initial Git handoff. That skill owns bulk
language selection, safe-string extraction, provider authorization, source revisions,
resumable generation, validation, and child-to-parent mirroring. Prefer its private
on-device Chrome provider; external providers still require explicit authorization.
Do not hand-author `generatedTranslations` or invent source revisions in this skill.

After generation, run the generator's `--check`, commit and push a linked child first,
then commit and push the parent Persona projection. If a provider is unavailable, leave
dynamic translation and country detection enabled and report which cache languages are
missing; never turn localization off to make creation appear complete.

## Validation

Run:

```bash
node scripts/validate-landing-page.js assets/landing-page.json
```

When `formOperations.heroDemo.captureAndFill.enabled` is true, also pass the
parent persona config so the validator can prove that the selected trigger is
an enabled, bounded image-attachment operator command:

```bash
node scripts/validate-landing-page.js assets/landing-page.json ../../../assets/chat-config.json
```

The validator rejects a missing `headline`, a feature missing `title`/`body`,
and an `icon` outside the allowed set.

## Using this skill in coding agents

Gabriel Operator skills are designed for Claude Code, Codex, ChatGPT/Claude
site builders, and any agent that supports skill packs or can read raw
markdown from a URL. This is the skill to reach for when an author asks
ChatGPT Sites, Claude Design, Replit, or similar to "build my persona's
landing page" — have that agent read this file, then edit
`assets/landing-page.json` and sync it into the parent persona's
`chat-config.json` as described above, instead of generating a bespoke static
site (the platform already renders this content as a real, scroll-animated
landing page with a working chat widget — a generated static site would not
get either of those for free).

| Agent | Install |
|-------|---------|
| **Claude Code** | `npx skills add go-code-bot/landing-page-builder` |
| **Codex** | `codex plugin marketplace add Gabriel-Operator/gabriel-operator-coding-agent-plugin --sparse .agents/plugins` then install the Gabriel Operator plugin |
| **ChatGPT Sites / Claude Design / any agent that can fetch a URL** | Fetch this file's raw URL directly and follow it — no install step needed to just read and apply the instructions. |
| **Gabriel Operator monorepo** | `cp -R server/skills/landing-page-builder ./your-git-repo/` |

Alternative curl installer:

```bash
curl -fsSL https://raw.githubusercontent.com/go-code-bot/landing-page-builder/main/install.sh | bash
```

### Modify with your coding agent

1. Open the git-backed landing-page repository (or the persona repo it's submoduled into).
2. Tell your agent: *"Read `SKILL.md` and update `assets/landing-page.json` for \<describe the change\>, then sync it into the parent persona's chat-config.json."*
3. Validate before committing: `node scripts/validate-landing-page.js assets/landing-page.json`
4. Commit and push both repos (child first, then parent).

**Example prompts:**
- *"Write landing page copy for this persona based on its systemPrompt — 3 features, a punchy headline."*
- *"Change the CTA label to 'Book a demo' and rewrite the subheadline to be shorter."*
