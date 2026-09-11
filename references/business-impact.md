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
orders or SKUs. Never monetize personal time or imply cooking, shopping or travel
are automated. Offer time for everyday life, not contribution margin, staffing
reductions or guaranteed savings. Localize every label and keep this model separate
from Retail in every locale.

### Household estimator (fixed assumptions)

A Home calculator with `businessImpact.fixedAssumptions` is a household estimator.
Grocery Twin renders it with its own three-input panel, never the generic tabs:

- **Visitor inputs (exactly three, one panel):** `defaults.volume` (planning sessions
  each month, a whole number from 1 to 12), `defaults.minutes` (planning minutes per
  session, 10 to 90, slider step 5) and `defaults.people` (a whole household size from
  1 to 8). `tabs` holds one tab whose `fields` are exactly `["volume", "minutes", "people"]`,
  with no review, outcome or package panels.
- **Fixed assumptions (model-owned, never inputs):** `offloadRate` (0.5), `reviewMinutes`
  (5), `foodWastePerPersonYear` (EUR 100) with `foodWasteSource`,
  `smartShopping` (false until price comparison and offers are verified live),
  `smartShare` (0.03), `spendBySize` (EUR a month for households `"1"` to `"8"`) with
  `spendSource`, and `userEditable: false`. Keep `defaults.automation = offloadRate × 100`
  and `defaults.review = reviewMinutes`. The shares and checking minutes are placeholders
  until measured; they are outputs KAI measures, never visitor inputs.
- **Price:** `pricing.basis: "tiered"` with `pricing.tiers` of `{ upTo, price }`: monthly
  prices including VAT by planning sessions (1 to 4 = 6.99, 5 to 8 = 10.99, 9 to 12 =
  14.99; a boundary uses the lower tier). The last tier ends at 12. Only sessions change
  the price. Yearly = monthly × 12; `pricing.annualPrice` and `defaults.customer_price`
  are rejected, as are usage packages and margins. A real annual price may only be added
  later as a genuine offer, never as a struck-through reference.
- **Formulas (monthly):** time back = max(0, sessions × minutes × offloadRate − sessions ×
  reviewMinutes); food thrown away = foodWastePerPersonYear ÷ 12 × people (the published
  average, shown beside the price, never as a saving); smart back = smartShopping ?
  spendBySize[people] × smartShare × sessions ÷ 4 : 0. There is no combined money back and
  no ratio. Estimated amounts show one decimal below €10 (one person: €8.3) and whole euros
  above; prices keep their cents. The yearly view multiplies every figure by 12.
- **Result panel:** the time hero; "Food your household throws away" with its "Dutch
  average for a household your size (Voedingscentrum, 2025 measurement)." small print; the
  smarter-shopping line only while `smartShopping` is true, always with its "A potential
  estimate. It depends on..." small print; the KAI price; then the `kaiNote` sentence ("KAI
  helps you cook from what is already in the fridge, so less of it ends up in the bin.").
  The waste figure and the price sit side by side only: no ratio, and the waste figure is
  never called a saving. One footnote: "Estimates from your inputs, not guaranteed savings.
  Amounts in euros, including VAT." The food-waste amount (value only, never its label)
  is struck through; nothing else is. No currency conversion, "was/now" or discount anywhere.
- **Copy:** `householdCopy` holds every result label as whole-sentence templates so every
  language can reorder them: `timeBack*` contain `{duration}`; `waste*`, `smart*` and
  `price*` contain `{amount}`; `householdSize` contains `{people}`; `tierRange` contains
  `{from}` and `{to}`, each exactly
  once. No other household copy may contain braces. Never split a sentence into fragments
  such as "About" + "back a month"; translated alone they lose their meaning. `copy` holds
  only the interface keys the estimator shows. `outcomes` stays empty.

Estimators never carry delivery-cost values. The validator rejects non-null
`tokens_per_output`, `platform_cost`, `model_cost`, `tools_cost`,
`infrastructure_cost`, `budget` and `review_rate` defaults and any unknown fixed
assumption (such as a per-session cost), because the model is public page data. The
per-session delivery cost and VAT maths live server-side only, in
`server/src/services/kai-home-unit-economics.ts`; app code must never import them. Older
Home assets still render with safe migration defaults (the constants above, session tiers,
and default result copy whenever the model's copy lacks a current key) until they are migrated.
Publish-modal saves write this model through the revision-checked landing-page API.

### Store-ops estimator (fixed assumptions)

A Grocery Twin retail calculator (`landingPage.roiCalculator` on a `grocery-twin`
page) with `businessImpact.storeOpsAssumptions` is a store-ops estimator. The retail
edition renders it with one four-input panel:

- **Visitor inputs:** `defaults.volume` (stores in scope, a whole number of at least 1),
  `defaults.cycles_per_unit` (replenishment cycles per store each month),
  `defaults.minutes` (preparation minutes per store per cycle) and
  `defaults.purchases_per_store` (monthly food purchases per store, €10,000 to €500,000
  in €5,000 steps; always labelled as an example figure). `tabs` holds exactly these four.
- **Fixed assumptions:** `shareHandled` (0–1), `reviewMinutesPerStoreCycle`,
  `lossRate` (0–1; 0.0121 is the WUR supermarket food-loss monitor, 2024 data),
  `lossRateSource` and `userEditable: false`. Mirror `defaults.automation = shareHandled × 100`
  and `defaults.review = reviewMinutesPerStoreCycle`. Share handled and review minutes
  are placeholders until pilots measure them.
- **Price:** `defaults.customer_price` is the price per store per month with
  `pricing.basis: "per_volume"`; price = stores × price per store. No `annualPrice`:
  yearly figures are monthly × 12.
- **Results:** hours back = round(stores × cycles × (minutes × shareHandled −
  reviewMinutesPerStoreCycle) ÷ 60); food loss = round(stores × purchases × lossRate);
  break-even = round(price ÷ food loss × 100). Stores move hours, loss and price;
  cycles and minutes move only hours; purchases move only loss and break-even.
  Above 100% the page says KAI costs more than the average loss. At zero or negative net
  minutes it says no net time is saved.
- **Copy:** `storeOpsCopy` holds whole-sentence templates. `{stores}` appears in the
  `…One`/`…Other` label pairs (singular and plural), `{amount}` in the loss and price
  amounts, `{perStore}` in the price amounts, `{percent}` in `breakEven` and
  `{duration}` in the hours sentences. KAI Retail strikes through the food-loss
  amount only (never its label) to show the loss KAI works against; the price row is never
  struck through, and there is no "was/now" or discount percentage. Use British "modelled".

Keep one footnote ("Estimates from your inputs and published averages, not measured
results…"). Older retail assets without `storeOpsAssumptions` render with the same
fallbacks until the publish-modal Calculator tab or the authoring script migrates them.

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
