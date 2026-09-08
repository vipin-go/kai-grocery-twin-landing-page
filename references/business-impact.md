# Business impact: author from first principles

Use this reference when adding or revising an economic calculator. It is an optional
business section, not a required financial claim for every persona. Preserve the
surrounding theme, character, marketing and demo behavior.

## Start with the work

Before choosing defaults, identify the persona's actual buyer, repetitive task,
monthly work unit, hands-on baseline, and required human review. Read its published
description, commands and landing-page content. Do not transplant another persona's
assumptions: restaurant campaigns are not tax forms; researched hiring signals are
not successful placements; a private introduction is not a property sale.

Ask what physically changes, then what the customer would do with that change.
Negative productivity means necessary operating burden reduced. Positive
productivity is the possible higher-value use of the resulting capacity. These are
not two savings to add together. Use plain-language headings for visitors and explain
these terms in the methodology disclosure.

## Live tabs, typical usage already filled

These are unnumbered live calculator tabs, not a stepper or submit workflow. Keep styled sliders and
editable numeric values beside the automatically updated summary (stacked on
mobile). There is no calculation submit button. Tab labels and fields are persona-authored
(`businessImpact.tabs`). Do not copy Form Operations tabs onto every page.

First paint must be complete: Base and Medium usage packages, token-per-output, platform
fee, selected outcomes and value fields are prefilled for a typical consumer of this
persona. Visitors may edit. Blank still means unknown if they clear a field; explicit
zero means none. Do not restore salary-based or automatic agency-fee savings.

Tokens drive operating cost: monthly tokens = volume × tokens per output. Model token
cost uses the platform mix (€2 input / €10 output per 1M, 20% output) unless a persona
adds a separate media line. Visitors see monthly tokens and all-in euros, not a
provider-pricing homework tab. Household pages use a consumer access fee, not the
operator platform fee.

Make the result panel cost-first: show the all-in operating estimate in a
collapsed-by-default cost disclosure. Its total must remain visible while closed;
expand to inspect token usage, extra models/media, tools, infrastructure, platform and
applicable paid review, plus an average per work unit. Keep the ICP output hero
(briefs, packs, campaigns, stores) directly under that cost, with hours as a secondary
line. Strike through only genuinely expected avoided spending; never style
contribution, capacity or risk estimates as cancelled invoices or AI discounts.
Author localized `costCopy` from the seed (`breakdown`, `perUnit`, `budgetOnly`,
`benefitNotice`, `remainder`, `allocation`) and preserve `{amount}` in every locale.

### Country currency is not translation

Author the calculator's `currency` as the base unit of every economic assumption.
If a regional page has independently sourced local estimates, record them in that
region's own base currency. Do not invent local wages, fees, tax savings or prices.
The platform maps the detected country to its current CLDR currency and applies
a dated reference FX rate to monetary inputs, limits and results. Hours, units,
percentages and return multiples never get an FX multiplier. User-entered amounts
remain in a stable underlying unit; neither language switches nor delayed country
detection may reinterpret existing numbers. Rate failure retains the base currency
with a visible notice, never a substituted symbol. FX is not local market research.

Add localized `currencyCopy` (`native`, `loading`, `unavailable`, `converted`,
`basis`) using the authoring seed. Preserve `{base}`, `{currency}`, `{date}` exactly.
Translate these notices in every configured locale, including static assets and
regional catalogues. The translation model must not convert numeric assumptions
or choose exchange rates. Runtime conversion works equally on static translations.
Deploy compatible currency support before publishing the additive notice contract.

1. **Workload (persona-labeled):** monthly volume, active minutes per unit, expected share reduced,
   review minutes and who performs review. Workload defaults must be explicitly
   typical, not observed performance. Waiting time is not hands-on time.
2. **Token usage:** tokens per ICP output, Gabriel platform or household access fee, and any extra
   media/tools. Base vs Medium reseeds volume and the token envelope. Do not ask visitors
   for provider list prices.
3. **Value (persona-labeled):** the outcomes that ICP actually has, already selected and filled.
   Unallocated capacity has no euro value. Do not keep a generic "Use the capacity / defer a hire"
   tab when the persona does not hire.

The renderer owns styled accessible sliders with direct numeric entry, keyboard
tabs, responsive two-column/stacked presentation, and a compact live summary.
Keep capacity, operating total and ready financial results visible. Put detailed
workload/value rows, field help, currency methodology and annual explanations
behind disclosures. Do not add fixed-height clipping or nested panel scrolling;
expanded details should grow the page naturally. Do not author
layout, CSS, React component names or formulas. Hide the return multiple until cost
and selected value assumptions are complete. A zero cost has no defined multiple;
negative net benefit must remain visible. Do not add arbitrary optimistic multipliers.

## Valuation rules

| Outcome | Valid basis | Do not claim |
|---|---|---|
| Capacity | Net hours after existing-team review | Hours × unchanged salary is cash saved |
| Cash avoided | Explicit paid work or spend that actually stops, bounded by current spend | The same hours again as both contractor invoices and hourly savings |
| Higher-value work | Allocated hours × incremental contribution, not gross revenue | Freed time is automatically sold |
| Throughput | Capacity-supported extra units, capped by demand, × contribution per unit | Capacity alone proves demand or revenue |
| Hiring | Genuinely planned hire, covered workload, entered deferral period | An automatic FTE or headcount-saving claim |
| Errors | Expected distinct avoided incidents × incremental loss | Labor or incidents counted elsewhere |
| Risk | Change in monthly event probability × exposure | A guarantee, compliance result or cash saving |
| Cycle time | Elapsed days improved, shown operationally | An invented value for speed |

Existing-team review reduces available capacity; extra paid review enters operating
cost instead. A total budget already includes paid review; do not add it again.
Contribution excludes the AI operating costs that the calculator subtracts once.
Require explicit non-overlap confirmation for financial outcomes and explicit
confirmation of a genuinely planned hire. This confirms assumptions, not their
truth: all outputs remain modeled, never independently verified customer results.

Economic value = cash avoided + contribution + separately identified expected loss
reduction. Net benefit = value − operating cost. Return multiple = value / cost.
Annualize the same assumptions without growth; hiring savings stop at the entered
month. Keep risk expectations separately visible in the breakdown.

## Authoring contract

Keep landing-page schema version 2. Add `roiCalculator.methodologyVersion: 2` with
heading, subheading, disclaimer, currency, locale, optional existing section CTA,
empty `inputs: []`, empty `metrics: []`, and `businessImpact`:

- `defaults`: required `volume`, `minutes`, `automation`, `review`, plus typical token,
  platform and value numbers so first paint is complete.
- `usagePackages.base` and `usagePackages.medium`: volume, tokensPerOutput, platform_cost
  and any extra lines. Default package is Medium (average consumer).
- `tabs`: one to four `{ id, label, intro, fields }` entries. Optional `showReview`,
  `showOutcomes`, `showPackage`.
- `hero`: `{ kind: "volume" | "capacity" | "money", label }` for the right-hand ICP figure.
- `selected` and `confirmations`: preselect the outcomes that belong in the typical story.
  Set `confirmations.hide` when those confirmations would only repeat Form Operations UX.
- `fields`: the supported input catalogue, each with `label` and `help`.
- `copy`: the complete localized interface catalogue, including `navLabel`.
  Use `navLabel: "ROI"` and `heading: "ROI Calculator"` in canonical English.
  Translate the section heading while keeping the compact ROI navigation acronym.
  Persona-specific explanations remain in the supporting copy and methodology.
- `outcomes`: one to seven unique `{ id, label, help }` entries selected from
  `cash`, `higher_value`, `throughput`, `hiring`, `error`, `risk`, `cycle_time`.
  Include only outcomes meaningful for this persona; no invented outcome IDs.
- `burden`, `opportunity`: one to four concrete, persona-specific examples each.

Generate the complete editable seed, rather than omitting required UI copy:

```bash
node scripts/create-business-impact.cjs --name "Example" --unit "Forms each month" --output /tmp/example-impact.json
```

Read and adapt the result to the persona before placing it in the canonical child
landing page. Prefer the persona factories in the marketplace (`business-impact-personas.ts`)
over cloning Form Operations. Never copy another persona's minutes, tokens or value story.
Preserve stable persona names and CTA targets. Legacy arithmetic fields are not a v2
escape hatch. Unsupported keys, missing labels, duplicate outcomes and authored formulas fail
the canonical validator, shared by the platform and standalone tooling. Typical financial
defaults are required.

## Localization and verification

### Household versus retail

For a Grocery Twin with two editions, keep `landingPage.roiCalculator` for Retail
and put the Home model in `landingPage.groceryTwin.homeRoiCalculator`. Both use the
same validated calculator contract; never clone retail assumptions into Home.
`createHouseholdImpactCalculator()` supplies an editable authoring seed, not a
runtime fallback. Home renders only its own enabled configuration.

Ground household volume in grocery/meal-planning sessions, not locations, staff,
orders or SKUs. Subtract time spent checking ingredients, allergies and the cart.
Never monetize personal time or imply cooking, shopping or travel are automated.
The optional `error` outcome can model edible food waste avoided as portions ×
ingredient cost, clearly labeled as a user estimate and counted only where using
the food replaces future spending. Do not also count the same food as discounts or
duplicate purchases avoided. Prefill a small household access fee and a modest food-waste
estimate so the right-hand column is not empty; visitors may zero them. Offer time for
everyday life, not contribution margin, staffing reductions or guaranteed savings.
Localize every label and keep this model separate from Retail in every locale.

All labels, help, notices and accessibility copy belong to the model and translate
with the landing page. IDs, currency, defaults and methodology version do not.
Changing language must preserve entered numbers and their currency. Preserve the
existing regional catalogue; do not replace market pages with a neutral clone.

Use the maintained incremental translation generator after authoring; mirror the
child, manifest and locale assets into the parent. Never invent translation hashes
or treat an English fallback as a completed locale. Do not publish v2 content to a
backend that lacks v2 validation/rendering support.

Verify a complete typical first paint, Base vs Medium, custom slider edits, Reset,
explicit zero, negative return, review treatment, allocation overflow, limited hiring
months, keyboard controls, RTL, language changes and mobile layout. Existing pages without
the v2 opt-in must retain their behavior. The calculator makes no model calls and
does not persist visitor assumptions or authorize any persona action.
