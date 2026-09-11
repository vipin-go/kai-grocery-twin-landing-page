"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// app/shared/utils/business-impact-presets.ts
var business_impact_presets_exports = {};
__export(business_impact_presets_exports, {
  catalogueFields: () => catalogueFields,
  createBusinessImpactCalculator: () => createBusinessImpactCalculator,
  createHouseholdImpactCalculator: () => createHouseholdImpactCalculator,
  createStoreOpsImpactCalculator: () => createStoreOpsImpactCalculator,
  roundHours: () => roundHours,
  usagePackageFromWorkload: () => usagePackageFromWorkload
});
module.exports = __toCommonJS(business_impact_presets_exports);

// app/shared/utils/business-impact.ts
var TIME_SHARE = 0.5;
var CHECK_MIN = 5;
var WASTE_PER_PERSON_YEAR = 100;
var WASTE_SOURCE = "Netherlands Nutrition Centre (Voedingscentrum), 2025 measurement, report May 2026: 25.5 kg per person a year";
var SMART_SHARE = 0.03;
var SPEND_BY_SIZE = { "1": 275, "2": 500, "3": 565, "4": 630, "5": 695, "6": 760, "7": 825, "8": 890 };
var SPEND_SOURCE = "Nibud reference minimums for healthy food (via Knab, 2026); sizes 5 to 8 extrapolated";
var FEATURE_SMART_SHOPPING = false;
var PRICE_TIERS = [{ upTo: 4, price: 6.99 }, { upTo: 8, price: 10.99 }, { upTo: 12, price: 14.99 }];
var HOUSEHOLD_STARTING_VALUES = { volume: 4, minutes: 45, people: 2 };
var HOUSEHOLD_PEOPLE_DEFAULT = HOUSEHOLD_STARTING_VALUES.people;
var HOUSEHOLD_INPUT_FIELDS = ["volume", "minutes", "people"];
var HOUSEHOLD_COPY = {
  // Whole-sentence templates: translating "About" or "back a month" as separate fragments produced wrong copy.
  timeBackMonthly: "About {duration} back a month",
  timeBackYearly: "About {duration} back a year",
  // A published average shown beside the price for comparison, never described as a saving.
  wasteLabel: "Food your household throws away",
  wasteNote: "Dutch average for a household your size (Voedingscentrum, 2025 measurement).",
  wasteMonthly: "about {amount} a month",
  wasteYearly: "about {amount} a year",
  smartLabel: "Smarter shopping, when offers and price checks are on",
  // Consumer law: whenever this line shows, it carries its "potential estimate ... depends on" wording.
  smartNote: "A potential estimate. It depends on the offers available and on following KAI's suggestions.",
  smartMonthly: "about {amount} a month",
  smartYearly: "about {amount} a year",
  priceLabel: "KAI",
  priceMonthly: "{amount} a month",
  priceYearly: "{amount} a year",
  kaiNote: "KAI helps you cook from what is already in the fridge, so less of it ends up in the bin.",
  fixedAssumptionsHeading: "Fixed assumptions, not inputs",
  estimatesNote: "The shares and checking minutes are working estimates until KAI measures them with real households.",
  offloadRateLabel: "Share of planning time KAI takes on",
  reviewMinutesLabel: "Minutes still spent checking each session",
  foodWasteReferenceLabel: "Food wasted per person each year",
  smartShareLabel: "Saving on food spend with offers and price checks",
  smartShareNote: "Used only when offers and price checks are live, and only if you follow KAI's suggestions.",
  smartOffNote: "Smarter shopping is not included yet. It is added once offers and price checks are live.",
  spendHeading: "Monthly food spend by household size",
  householdSize: "Household of {people}",
  tiersHeading: "KAI price by planning sessions a month",
  tierRange: "{from} to {to} sessions",
  sourceLabel: "Source",
  timeBackFormula: "Time back = sessions \xD7 planning minutes \xD7 the share KAI takes on, minus sessions \xD7 checking minutes, never below zero.",
  wasteFormula: "Food your household throws away = food wasted per person each year \xF7 12 \xD7 people in your household, shown to one decimal below \u20AC10.",
  smartFormula: "Smarter shopping = monthly food spend for your household size \xD7 the offers saving \xD7 sessions \xF7 4.",
  priceNote: "Prices include VAT. The KAI price depends only on how many sessions you plan each month; minutes and household size never change it.",
  yearlyNote: "The yearly view is twelve times the monthly figures."
};
var SHARE_HANDLED = 0.5;
var REVIEW_MIN_PER_STORE_CYCLE = 30;
var LOSS_RATE = 0.0121;
var PRICE_PER_STORE = 250;
var LOSS_RATE_SOURCE_DEFAULT = "Wageningen University & Research, supermarket food-loss monitor (2024 data)";
var STORE_OPS_STARTING_VALUES = { volume: 1, cycles_per_unit: 13, minutes: 150, purchases_per_store: 1e5 };
var STORE_OPS_INPUT_FIELDS = ["volume", "cycles_per_unit", "minutes", "purchases_per_store"];
var STORE_OPS_COPY = {
  lossLabelOne: "Food your {stores} store loses to expiry and spoilage",
  lossLabelOther: "Food your {stores} stores lose to expiry and spoilage",
  lossInfo: "Average for Dutch supermarkets: about 1.2% of food bought is lost, mostly to expiry and loss of freshness (Wageningen University & Research, 2024 data). Your own write-offs may be higher or lower.",
  lossMonthly: "about {amount} a month",
  lossYearly: "about {amount} a year",
  priceLabelOne: "KAI for {stores} store",
  priceLabelOther: "KAI for {stores} stores",
  priceMonthly: "{amount} a month ({perStore} per store)",
  priceYearly: "{amount} a year ({perStore} per store a month)",
  breakEven: "KAI pays for itself if it prevents about {percent} of that loss.",
  breakEvenOver: "At this purchase volume, KAI costs more than the average food loss.",
  hoursMonthly: "About {duration} of ordering work back a month",
  hoursYearly: "About {duration} of ordering work back a year",
  noTimeSaved: "No net time saved at this prep time: review takes about as long as KAI saves.",
  fixedAssumptionsHeading: "Fixed assumptions, not inputs",
  shareHandledLabel: "Share of order preparation KAI handles",
  reviewMinutesLabel: "Review minutes per store per cycle",
  lossRateLabel: "Food lost as a share of purchases",
  pricePerStoreLabel: "KAI price per store per month",
  sourceLabel: "Source",
  hoursFormula: "Hours back = stores \xD7 cycles per store \xD7 (preparation minutes \xD7 share KAI handles \u2212 review minutes) \xF7 60, rounded.",
  lossFormula: "Food loss = stores \xD7 monthly food purchases per store \xD7 loss rate, rounded to whole euros.",
  priceFormula: "KAI price = stores \xD7 price per store.",
  breakEvenFormula: "Break-even share = KAI price \xF7 food loss \xD7 100, rounded.",
  yearlyNote: "The yearly view multiplies hours, food loss and price by 12. The break-even share stays the same.",
  lossRateNote: "The loss rate is measured by weight at participating chains and used here as a share of spend."
};
var ROI_CURRENCY_COPY = {
  native: "Amounts in {currency}.",
  loading: "Checking the local currency. Amounts remain in {currency} until a rate is available.",
  unavailable: "A current local exchange rate is unavailable. Amounts remain in {currency}.",
  converted: "Amounts converted from {base} to {currency} using the reference rate dated {date}.",
  basis: "Currency conversion is not local cost research. Enter your own local costs and contribution assumptions. Language changes do not change amounts."
};
var ROI_COST_COPY = {
  breakdown: "How the all-in AI cost is built",
  perUnit: "{amount} per work unit (average)",
  budgetOnly: "This is your total budget. Switch to Cost breakdown to itemize it; no split has been assumed.",
  benefitNotice: "Modeled benefits, not charges. Crossed-out amounts are spending you expect to avoid, not discounts on the AI bill.",
  remainder: "Other included operating costs",
  allocation: "Returned hours are capacity, not automatic savings. Only the portions you assign to actual spending reductions or additional contribution receive a monetary value."
};
var IMPACT_COPY = {
  navLabel: "ROI",
  workloadStep: "Your workload",
  costStep: "Token usage",
  valueStep: "What you get",
  workloadIntro: "Start with a typical month of work this persona would run. Adjust the illustrative defaults to your team.",
  costIntro: "Typical token consumption and the platform fee are prefilled for an average user. Edit them if your usage differs.",
  valueIntro: "This is the modeled output and capacity for that typical usage. Edit the assumptions if they do not match your work.",
  sampleNotice: "Typical usage \xB7 not observed results",
  monthly: "Monthly",
  yearly: "Yearly",
  next: "Continue",
  back: "Back",
  reset: "Reset assumptions",
  summary: "Your modeled impact",
  volume: "Work units modeled",
  grossHours: "Repetitive work reduced",
  capacity: "Net capacity returned",
  retained: "Capacity kept available",
  hours: "hours",
  days: "days",
  percent: "%",
  minutes: "minutes",
  tokens: "tokens",
  monthlyTokens: "Monthly tokens",
  tokenCost: "Token usage",
  packageLabel: "Usage package",
  packageBase: "Base",
  packageMedium: "Medium",
  packageCustom: "Custom",
  reviewMode: "Who handles the review?",
  teamReview: "Existing team",
  paidReview: "Additional paid reviewer",
  reviewNote: "Existing-team review uses returned capacity. Additional paid review is included in operating cost, not deducted again from team capacity.",
  totalMode: "Monthly budget",
  itemizedMode: "Cost breakdown",
  budgetNote: "The budget must include models/media, tools, infrastructure, Gabriel fees and additional paid review. Do not include unchanged payroll as new spending.",
  itemizedNote: "Token usage is calculated from volume \xD7 tokens per output. Extra media, tools and infrastructure stay at zero unless they apply. Additional paid review is calculated from review hours and its rate.",
  paidReviewCost: "Additional paid review cost",
  allInCost: "Operating cost",
  missing: "Add your assumptions",
  currentPreparation: "Current preparation hours",
  reviewHours: "Human review hours",
  reworkHours: "Avoided or added rework hours",
  capacityValue: "Modeled capacity value",
  acceptedUnits: "Accepted units",
  attendedUnits: "Attended units",
  costPerAttended: "Cost per attended unit",
  cashValue: "Cash spending avoided",
  contribution: "Expected contribution",
  expectedLoss: "Expected loss reduction",
  riskValue: "Uncertain risk value included",
  economicValue: "Modeled economic value",
  netBenefit: "Net modeled benefit",
  multiple: "Economic return multiple",
  customerBenefit: "Modeled customer benefit",
  customerRoi: "Customer ROI",
  benefitCost: "Benefit-cost multiple",
  firstYearCost: "First-year cost",
  firstYearRoi: "First-year ROI",
  payback: "Setup-fee payback",
  paybackOutsideTerm: "Not recovered within the modeled term",
  months: "months",
  notApplicable: "Not applicable",
  annual: "Annual view",
  annualNote: "The same monthly assumptions, without growth or compounding. Hiring savings last only for the entered period.",
  method: "How this is calculated",
  burdenHeading: "Repetitive work reduced",
  opportunityHeading: "Capacity for higher-value work",
  methodBody: "Operating burden removed (negative productivity) returns capacity. Higher-value work (potential positive productivity) creates economic value only if that capacity is used. Hours alone are not cash savings. Token cost uses a modeled input/output mix, not a provider quote.",
  formulaLabel: "Economic value \xF7 operating cost = economic return multiple. Net benefit subtracts operating cost once.",
  allocationNote: "Each hour can be allocated once. Unallocated hours remain capacity, with no monetary value.",
  overlapLabel: "These benefits are distinct; I have excluded costs and losses already counted elsewhere.",
  overlapNote: "Error and risk estimates exclude labor savings and the same incident must not appear in both categories. Contribution excludes AI costs, which are deducted separately.",
  hiringLabel: "This hire was genuinely planned and the allocated capacity can cover the work.",
  reviewedLabel: "I have reviewed my outcomes; unselected outcomes have no financial value in this estimate.",
  cycleResult: "Cycle-time improvement",
  throughputResult: "Additional work supported by capacity and demand",
  assumptionsIncomplete: "Complete the selected assumptions to calculate financial value.",
  allocationError: "Allocated hours exceed the net capacity available. Reduce the allocations.",
  reviewError: "Review takes more time than the work reduced. No positive capacity is available at these assumptions.",
  cashError: "Avoided spending cannot exceed current spending or have positive value with no hours allocated.",
  hiringError: "Allocated capacity must cover the planned hire hours. Confirm the planned hire and its duration.",
  riskError: "The after probability cannot exceed the before probability for a loss-reduction estimate.",
  overlapError: "Confirm the benefits do not overlap before including them in the financial result.",
  boundsError: "Use values within the displayed limits.",
  rangeLabel: "Adjust value",
  noCurrencyChange: "Language changes formatting, not your currency or assumptions."
};
var HOUSEHOLD_IMPACT_COPY_KEYS = [
  "summary",
  "reset",
  "monthly",
  "yearly",
  "annual",
  "rangeLabel",
  "missing",
  "method",
  "methodBody",
  "burdenHeading",
  "opportunityHeading",
  "noCurrencyChange",
  "reviewError"
];
var STORE_OPS_IMPACT_COPY_KEYS = [
  "summary",
  "reset",
  "monthly",
  "yearly",
  "annual",
  "rangeLabel",
  "missing",
  "method",
  "methodBody",
  "burdenHeading",
  "opportunityHeading",
  "noCurrencyChange"
];
function netCapacityHours({ volume, minutes, automation, review, reviewMode = "team" }) {
  const grossHours = volume * minutes / 60 * automation / 100;
  const reviewHours = volume * review / 60;
  return Math.max(0, grossHours - (reviewMode === "team" ? reviewHours : 0));
}

// app/shared/utils/business-impact-presets.ts
var FIELD_COPY = {
  volume: ["Work units each month", "Use a typical month, not a best-case peak."],
  people: ["People in your household", "Used only for the food-waste comparison."],
  purchases_per_store: ["Monthly food purchases per store", "Example figure. Use your own supplier spend."],
  accepted_rate: ["Expected acceptance rate", "Optional modeled share of prepared outputs accepted by the recipient. This is not a guarantee or observed result."],
  attendance_rate: ["Expected attendance rate", "Modeled share of accepted meetings expected to happen. Replace this with verified event records after a pilot."],
  minutes: ["Hands-on minutes per unit today", "Active work time, excluding waiting and elapsed calendar time."],
  automation: ["Share of that work reduced", "An illustrative assumption to validate in a pilot, not a performance promise."],
  review: ["Review minutes per unit", "Human checking still needed after automation."],
  correction_rate_before: ["Current correction rate", "Share of work units that currently require a correction or rework cycle."],
  correction_rate_after: ["Correction rate with assistance", "Expected or observed share requiring correction after assistance. Leave blank until supported."],
  correction_minutes_before: ["Current minutes per correction", "Hands-on time required for one current correction or rework cycle."],
  correction_minutes_after: ["Minutes per correction with assistance", "Hands-on time for one correction or abstention after assistance. Leave blank until supported."],
  cycles_per_unit: ["Cycles per unit each month", "How many recurring order, review or processing cycles each unit runs in a typical month."],
  tokens_per_output: ["Tokens to produce one unit", "Modeled tokens consumed to prepare one typical output, not a provider meter reading."],
  budget: ["Estimated monthly operating budget", "Include token usage, models/media, tools, infrastructure, Gabriel fees and additional paid review."],
  model_cost: ["Extra models and media", "Only image, video or other generation charged separately from token usage. Enter zero if none."],
  tools_cost: ["Tools and integrations", "Browser sessions, connectors and other metered services. Enter zero if none."],
  infrastructure_cost: ["Infrastructure", "Incremental hosting, storage and compute for this workload. Enter zero if none."],
  platform_cost: ["Other delivery and support cost", "Modeled hosting, storage, monitoring and support cost, separate from the customer price."],
  customer_price: ["Customer price", "The proposed customer-facing price, separate from KAI delivery cost. Treat it as a hypothesis until paid evidence exists."],
  personal_value_per_hour: ["Optional value you assign to an hour", "An optional personal comparison only. This is not salary, wages or guaranteed cash savings."],
  capacity_value_per_hour: ["Capacity value per hour", "Customer-supported value for one hour of specialist capacity. This is not automatic payroll savings."],
  included_volume: ["Included monthly volume", "Work units included in the recurring base price."],
  overage_price: ["Price per additional unit", "Customer price for each eligible unit above the included monthly volume."],
  setup_fee: ["One-time setup fee", "One-time mapping and onboarding fee. It is counted once in the contract comparison."],
  contract_months: ["Contract comparison period", "Number of months used for the contract economics comparison."],
  review_rate: ["Additional paid review per hour", "Actual extra reviewer spending, not the salary of an unchanged employee."],
  cash_hours: ["Hours that remove paid work", "Allocate only work whose overtime, contractor or processing spend will actually stop."],
  cash_baseline: ["Current monthly spending on that work", "The cash budget from which the reduction will come."],
  cash_avoided: ["Monthly spending you would stop", "One explicit amount, not hours multiplied by salary; exclude any planned-hire saving entered separately."],
  higher_value_hours: ["Hours used for higher-value work", "Hours you can realistically redirect, not the entire capacity by default."],
  contribution_rate: ["Incremental contribution per hour", "Revenue less incremental delivery costs, excluding AI costs counted separately. Not salary or gross revenue."],
  throughput_hours: ["Hours used for additional volume", "This allocation cannot also be used for advisory work or spending reductions."],
  extra_minutes: ["Team minutes per additional unit", "The remaining human effort, including review, needed to deliver one more unit."],
  demand: ["Additional units with expected demand", "Capacity alone is not demand. Enter the extra monthly work you expect to take on."],
  unit_margin: ["Contribution per additional unit", "Incremental revenue less delivery costs; AI operating costs are deducted separately."],
  hiring_hours: ["Hours covering the planned hire", "Allocate capacity to specific planned work, not a generic full-time-equivalent estimate."],
  planned_hours: ["Monthly hours the planned hire would cover", "The allocated capacity must cover this entire workload."],
  hire_cost: ["Monthly hire cost actually deferred", "Use the cost of a genuinely planned hire, not the salary of someone already employed."],
  hire_months: ["Months that hire is deferred", "One to twelve months; the annual estimate stops counting savings after this period."],
  incidents: ["Expected avoided errors per month", "Use your baseline and expected reduction. Exclude incidents also counted as risk reduction."],
  incident_cost: ["Incremental cost per error", "Exclude labor, refunds or other losses already included elsewhere."],
  probability_before: ["Monthly loss probability before", "Your estimate, not a guaranteed risk assessment."],
  probability_after: ["Monthly loss probability after", "Use the same event and monthly time horizon as the baseline."],
  loss: ["Loss exposure for that event", "Exclude error incidents and spending already counted. This is uncertain expected value, not cash saved."],
  days_before: ["Cycle time before, in days", "Elapsed time from start to completion, separate from hands-on effort."],
  days_after: ["Cycle time after, in days", "Shown as an operational change only, without an assumed monetary value."]
};
function roundHours({ hours }) {
  return Math.max(0, Math.floor(hours * 10) / 10);
}
function catalogueFields() {
  return Object.fromEntries(Object.entries(FIELD_COPY).map(([id, [label, help]]) => [id, { label, help }]));
}
function usagePackageFromWorkload({
  volume,
  minutes,
  automation,
  review,
  tokensPerOutput,
  platformCost,
  modelCost = 0,
  contributionRate,
  cyclesPerUnit,
  customerPrice,
  extras = {}
}) {
  const multiplier = cyclesPerUnit || 1;
  const hours = roundHours({ hours: netCapacityHours({ volume: volume * multiplier, minutes, automation, review }) });
  return {
    volume,
    tokensPerOutput,
    platform_cost: platformCost,
    minutes,
    automation,
    review,
    model_cost: modelCost,
    tools_cost: 0,
    infrastructure_cost: 0,
    higher_value_hours: hours,
    contribution_rate: contributionRate,
    ...extras,
    ...cyclesPerUnit ? { cycles_per_unit: cyclesPerUnit } : {},
    ...customerPrice !== void 0 ? { customer_price: customerPrice } : {}
  };
}
function createBusinessImpactCalculator({
  pageName,
  workloadLabel = "Work units each month",
  defaults = { volume: 100, minutes: 30, automation: 50, review: 5 },
  burden = ["Repeated preparation", "Re-keying information", "Checking and correcting routine work"],
  opportunity = ["More capacity for customers", "Higher-value work", "Less paid overflow"],
  primaryTarget = "meet",
  primaryLabel = `Talk with ${pageName}`,
  tokensPerOutput = 5e3,
  contributionRate = 120,
  mediumPlatform = 1500,
  basePlatform = 990
}) {
  const fields = catalogueFields();
  fields.volume.label = workloadLabel;
  const medium = usagePackageFromWorkload({
    ...defaults,
    tokensPerOutput,
    platformCost: mediumPlatform,
    contributionRate
  });
  const baseVolume = Math.max(1, Math.round(defaults.volume / 2));
  const base = usagePackageFromWorkload({
    ...defaults,
    volume: baseVolume,
    tokensPerOutput,
    platformCost: basePlatform,
    contributionRate
  });
  const hours = medium.higher_value_hours || 0;
  return {
    methodologyVersion: 2,
    enabled: true,
    kicker: "Business impact",
    heading: "ROI Calculator",
    subheading: "A typical month of usage, already filled. Change the package or the sliders if your work looks different.",
    disclaimer: "A scenario built from typical usage assumptions, not observed results or guaranteed savings. Returned hours are capacity, not an automatic payroll reduction.",
    currency: "EUR",
    currencyCopy: { ...ROI_CURRENCY_COPY },
    costCopy: { ...ROI_COST_COPY },
    locale: "en-GB",
    inputs: [],
    metrics: [],
    businessImpact: {
      defaults: {
        ...defaults,
        tokens_per_output: tokensPerOutput,
        model_cost: 0,
        tools_cost: 0,
        infrastructure_cost: 0,
        platform_cost: mediumPlatform,
        higher_value_hours: hours,
        contribution_rate: contributionRate
      },
      copy: { ...IMPACT_COPY },
      fields,
      burden,
      opportunity,
      usagePackages: { base, medium },
      defaultPackage: "medium",
      costMode: "itemized",
      reviewMode: "team",
      selected: ["higher_value"],
      confirmations: { overlap: true, hiring: true, outcomes: true, hide: true },
      hero: { kind: "volume", label: workloadLabel.replace(/ each month$/i, "") },
      outcomes: [
        { id: "higher_value", label: "Do higher-value work", help: "Use part of the capacity for work with incremental contribution." },
        { id: "throughput", label: "Handle more volume", help: "Match available capacity with actual expected demand." },
        { id: "cash", label: "Stop actual spending", help: "Reduce overtime, contractors or paid processing\u2014not unchanged salaries." },
        { id: "hiring", label: "Defer a planned hire", help: "Cover a specific, genuinely planned workload for a stated period." },
        { id: "error", label: "Avoid errors and rework", help: "Estimate distinct incidents and their incremental cost." },
        { id: "risk", label: "Reduce expected loss", help: "An optional, uncertain estimate with explicit probabilities and exposure." },
        { id: "cycle_time", label: "Finish sooner", help: "Show elapsed days improved without automatically attaching a monetary value." }
      ]
    },
    cta: { primaryLabel, primaryTarget }
  };
}
function createHouseholdImpactCalculator(pageName = "KAI") {
  const shown = {
    ...Object.fromEntries(HOUSEHOLD_IMPACT_COPY_KEYS.map((key) => [key, IMPACT_COPY[key]])),
    summary: "Your household estimate",
    reset: "Reset values",
    missing: "Enter a value",
    methodBody: `${pageName} takes on part of the planning work: checking what is already at home, choosing recipes and preparing the list. Checking each session still takes some of your time, so it is subtracted. The food-waste figure is the published Dutch average for a household your size, shown beside the ${pageName} price for comparison, not a saving ${pageName} promises.`,
    burdenHeading: "Less grocery admin",
    opportunityHeading: "More room for everyday life",
    reviewError: `Checking takes longer than the planning time ${pageName} takes on. At these values there is no time back.`
  };
  const intro = "Count time spent checking food, choosing recipes and preparing your grocery list, not cooking, travel or time in the shop.";
  return {
    methodologyVersion: 2,
    enabled: true,
    kicker: "Home impact",
    heading: "Time & Friction Estimator",
    subheading: `See how much planning time ${pageName} could give back. Adjust the three values to match your household.`,
    disclaimer: "Estimates from your inputs, not guaranteed savings. Amounts in euros, including VAT.",
    currency: "EUR",
    currencyCopy: { ...ROI_CURRENCY_COPY },
    locale: "en-GB",
    inputs: [],
    metrics: [],
    businessImpact: {
      defaults: {
        ...HOUSEHOLD_STARTING_VALUES,
        // Mirrors of the fixed assumptions below; the validator keeps them equal. The price lives only in pricing.tiers.
        automation: TIME_SHARE * 100,
        review: CHECK_MIN
      },
      fixedAssumptions: {
        offloadRate: TIME_SHARE,
        reviewMinutes: CHECK_MIN,
        foodWastePerPersonYear: WASTE_PER_PERSON_YEAR,
        foodWasteSource: WASTE_SOURCE,
        smartShopping: FEATURE_SMART_SHOPPING,
        smartShare: SMART_SHARE,
        spendBySize: { ...SPEND_BY_SIZE },
        spendSource: SPEND_SOURCE,
        userEditable: false
      },
      householdCopy: { ...HOUSEHOLD_COPY },
      // Household estimators store only the interface copy and input labels they display.
      copy: shown,
      fields: {
        volume: { label: "Grocery-planning sessions each month", help: "How many times a month you sit down to plan groceries." },
        minutes: { label: "Planning minutes per session today", help: "Time spent checking food, choosing recipes and preparing your list. Not cooking, travel or time in the shop." },
        people: { label: "People in your household", help: "Everyone you regularly shop and cook for." }
      },
      outcomes: [],
      burden: ["Checking the fridge and pantry", "Finding recipes and missing ingredients", "Comparing products and preparing a grocery list"],
      opportunity: ["More time for yourself and your household", "Meals built around food you already have", "A reviewed shopping list, with fewer duplicate purchases"],
      tabs: [{ id: "routine", label: "Your routine", intro, fields: [...HOUSEHOLD_INPUT_FIELDS] }],
      pricing: { basis: "tiered", tiers: PRICE_TIERS.map((tier) => ({ ...tier })), label: "Pricing", help: `The ${pageName} price depends only on how many planning sessions you have each month. Prices include VAT.` }
    },
    cta: {
      primaryLabel: `Try a grocery scan with ${pageName}`,
      primaryTarget: "hero-chat",
      privacyNote: "Your estimates stay in this calculator. Nothing is ordered or saved from these inputs."
    }
  };
}
function createStoreOpsImpactCalculator(pageName = "KAI") {
  const shown = {
    ...Object.fromEntries(STORE_OPS_IMPACT_COPY_KEYS.map((key) => [key, IMPACT_COPY[key]])),
    summary: "Your estimate",
    reset: "Reset values",
    missing: "Enter a value",
    methodBody: `${pageName} prepares vendor-ready orders from counts, photos and invoices, and a named approver still reviews each one, so review time is subtracted. The food-loss figure is a published supermarket average shown beside the ${pageName} price for comparison, not a measured or promised saving.`,
    burdenHeading: "Less ordering admin",
    opportunityHeading: "More time on the floor"
  };
  return {
    methodologyVersion: 2,
    enabled: true,
    kicker: "Retail impact",
    heading: "Store-ops capacity estimate",
    subheading: "Model vendor-ready order preparation for a multi-store operator. One named human approver remains responsible for every consequential order.",
    disclaimer: `Estimates from your inputs and published averages, not measured results. ${pageName} prepares orders; a named approver decides what is placed.`,
    currency: "EUR",
    currencyCopy: { ...ROI_CURRENCY_COPY },
    locale: "en-GB",
    inputs: [],
    metrics: [],
    businessImpact: {
      defaults: {
        ...STORE_OPS_STARTING_VALUES,
        // Mirrors of the fixed assumptions below; the validator keeps them equal.
        automation: SHARE_HANDLED * 100,
        review: REVIEW_MIN_PER_STORE_CYCLE,
        customer_price: PRICE_PER_STORE
      },
      storeOpsAssumptions: {
        shareHandled: SHARE_HANDLED,
        reviewMinutesPerStoreCycle: REVIEW_MIN_PER_STORE_CYCLE,
        lossRate: LOSS_RATE,
        lossRateSource: LOSS_RATE_SOURCE_DEFAULT,
        userEditable: false
      },
      storeOpsCopy: { ...STORE_OPS_COPY },
      // Store-ops estimators store only the interface copy and input labels they display.
      copy: shown,
      fields: {
        volume: { label: "Stores in scope", help: "Count locations that would actually run this inventory loop, not every banner in the group." },
        cycles_per_unit: { label: "Replenishment cycles per store each month", help: "A modelled monthly cadence. Thirteen cycles is about three order cycles per week; replace it with your real cadence." },
        minutes: { label: "Preparation minutes per store per cycle", help: "Hands-on count, reconciliation and vendor-order preparation time for one store in one cycle." },
        purchases_per_store: { label: "Monthly food purchases per store", help: "Example figure. Use your own supplier spend." }
      },
      outcomes: [],
      burden: ["Checking live inventory across stores", "Building vendor-ready orders by hand"],
      opportunity: ["Floor time for exceptions", "Vendor-ready orders without a night of spreadsheets"],
      tabs: [{ id: "stores", label: "Stores and cycles", intro: "Model the locations and replenishment cycles that actually use this stock and vendor-order loop.", fields: [...STORE_OPS_INPUT_FIELDS] }],
      pricing: { basis: "per_volume", label: "Pricing", help: `${pageName} is priced per store per month. Only the number of stores changes the price.` }
    },
    cta: { primaryLabel: "Request a four-week pilot", primaryTarget: "pilot-form", secondaryLabel: `Talk with ${pageName}`, secondaryTarget: "meet" }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  catalogueFields,
  createBusinessImpactCalculator,
  createHouseholdImpactCalculator,
  createStoreOpsImpactCalculator,
  roundHours,
  usagePackageFromWorkload
});
