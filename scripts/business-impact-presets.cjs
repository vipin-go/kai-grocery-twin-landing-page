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
  roundHours: () => roundHours,
  usagePackageFromWorkload: () => usagePackageFromWorkload
});
module.exports = __toCommonJS(business_impact_presets_exports);

// app/shared/utils/business-impact.ts
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
  cashValue: "Cash spending avoided",
  contribution: "Expected contribution",
  expectedLoss: "Expected loss reduction",
  riskValue: "Uncertain risk value included",
  economicValue: "Modeled economic value",
  netBenefit: "Net modeled benefit",
  multiple: "Economic return multiple",
  customerBenefit: "Modelled customer benefit",
  customerRoi: "Customer ROI",
  payback: "Customer payback period",
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
function netCapacityHours({ volume, minutes, automation, review, reviewMode = "team" }) {
  const grossHours = volume * minutes / 60 * automation / 100;
  const reviewHours = volume * review / 60;
  return Math.max(0, grossHours - (reviewMode === "team" ? reviewHours : 0));
}

// app/shared/utils/business-impact-presets.ts
var FIELD_COPY = {
  volume: ["Work units each month", "Use a typical month, not a best-case peak."],
  accepted_rate: ["Expected acceptance rate", "Optional modeled share of prepared outputs accepted by the recipient. This is not a guarantee or observed result."],
  minutes: ["Hands-on minutes per unit today", "Active work time, excluding waiting and elapsed calendar time."],
  automation: ["Share of that work reduced", "An illustrative assumption to validate in a pilot, not a performance promise."],
  review: ["Review minutes per unit", "Human checking still needed after automation."],
  cycles_per_unit: ["Cycles per unit each month", "How many recurring order, review or processing cycles each unit runs in a typical month."],
  tokens_per_output: ["Tokens to produce one unit", "Modeled tokens consumed to prepare one typical output, not a provider meter reading."],
  budget: ["Estimated monthly operating budget", "Include token usage, models/media, tools, infrastructure, Gabriel fees and additional paid review."],
  model_cost: ["Extra models and media", "Only image, video or other generation charged separately from token usage. Enter zero if none."],
  tools_cost: ["Tools and integrations", "Browser sessions, connectors and other metered services. Enter zero if none."],
  infrastructure_cost: ["Infrastructure", "Incremental hosting, storage and compute for this workload. Enter zero if none."],
  platform_cost: ["Other delivery and support cost", "Modeled hosting, storage, monitoring and support cost, separate from the customer price."],
  customer_price: ["Customer price", "The proposed customer-facing price, separate from KAI delivery cost. Treat it as a hypothesis until paid evidence exists."],
  personal_value_per_hour: ["Optional value you assign to an hour", "An optional personal comparison only. This is not salary, wages or guaranteed cash savings."],
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
  const defaults = { volume: 4, minutes: 45, automation: 50, review: 5 };
  const result = createBusinessImpactCalculator({
    pageName,
    workloadLabel: "Grocery-planning sessions each month",
    defaults,
    burden: ["Checking the fridge and pantry", "Finding recipes and missing ingredients", "Comparing products and preparing a grocery list"],
    opportunity: ["More time for yourself and your household", "Meals built around food you already have", "A reviewed shopping list, with fewer duplicate purchases"],
    primaryTarget: "hero-chat",
    primaryLabel: `Try a grocery scan with ${pageName}`,
    tokensPerOutput: 15e3,
    contributionRate: 0,
    mediumPlatform: 0.75,
    basePlatform: 0.5
  });
  Object.assign(result, {
    kicker: "Home impact",
    heading: "Time & Friction Estimator",
    subheading: "Estimate your planning time and KAI price from how often you use it. Adjust the starting values to match your household.",
    disclaimer: "Modelled household estimates, not guaranteed savings. Personal time is not treated as salary. Food value counts only if it replaces spending you would otherwise make; check prices, portions and dietary needs yourself."
  });
  const b = result.businessImpact;
  const mediumFood = { incidents: 8, incident_cost: 3.8 };
  delete b.usagePackages;
  delete b.defaultPackage;
  b.defaults = {
    ...defaults,
    tokens_per_output: 15e3,
    model_cost: 0,
    tools_cost: 0,
    infrastructure_cost: 0,
    platform_cost: 0.75,
    customer_price: 6.99,
    personal_value_per_hour: null,
    higher_value_hours: 0,
    contribution_rate: 0,
    ...mediumFood
  };
  b.selected = [];
  b.confirmations = { overlap: false, hiring: false, outcomes: false, hide: false };
  b.hero = { kind: "volume", label: "Checked plans / shopping lists" };
  b.pricing = { basis: "usage", annualPrice: 59, minimumMargin: 0, label: "Pricing", help: "Light usage stays at the base price. When the modelled service cost exceeds that base, the estimated price increases with usage. Switch Monthly or Yearly to see one total for that period." };
  b.presentation = { financial: "optional", showCustomerEconomics: true, hideEconomicMultiple: true };
  result.costCopy = { ...result.costCopy, breakdown: "Pricing details", perUnit: "{amount} per planning session (average)" };
  b.tabs = [
    { id: "routine", label: "Your routine", intro: "Count time spent checking food, choosing recipes and preparing your grocery list\u2014not cooking, travel or time in the shop.", fields: ["volume", "minutes", "automation", "review"], showReview: true },
    { id: "food", label: "Optional money comparison", intro: "Time back is yours to enjoy. Add food-waste value or a personal hourly value if you want to compare it with your KAI price.", fields: ["personal_value_per_hour"], showOutcomes: true }
  ];
  Object.assign(b.copy, {
    navLabel: "Impact estimate",
    workloadStep: "Your routine",
    costStep: "Your KAI usage",
    valueStep: "Optional money comparison",
    workloadIntro: "Count time spent checking food, choosing recipes and preparing your grocery list\u2014not cooking, travel or time in the shop.",
    costIntro: "Your estimated KAI price follows your planning sessions, with a base price for light usage and an increase for additional usage.",
    valueIntro: "Time back is yours to enjoy. Add an explicit food-waste or personal-value assumption if you want a money comparison.",
    sampleNotice: "Typical household usage \xB7 adjust these numbers to your kitchen",
    summary: "Your household estimate",
    volume: "Planning sessions",
    grossHours: "Planning time reduced",
    capacity: "Time back for you",
    retained: "Personal time, not priced in money",
    reviewMode: "Who checks the suggestions?",
    teamReview: "Me or my household",
    paidReview: "Someone I pay extra",
    reviewNote: "Checking portions, allergies, ingredients and the cart takes time. Household review is subtracted from time back. Help you pay for separately is an extra expense in the optional money comparison; it is not part of the KAI price.",
    totalMode: "Monthly budget",
    itemizedMode: "Optional cost details",
    budgetNote: "Include KAI access, extra services and any extra paid help once. Do not include your usual grocery bill or put a price on your own time.",
    itemizedNote: "Token usage is calculated from your plans. Extra services stay at zero unless you pay for them separately.",
    paidReviewCost: "Extra paid checking",
    allInCost: "Pricing",
    expectedLoss: "Estimated food value retained",
    economicValue: "Modeled optional value",
    netBenefit: "Estimated value minus your costs",
    multiple: "Food value / KAI cost",
    annualNote: "Twelve months using the same routine and food-waste assumptions. No growth, compounding or guaranteed savings.",
    methodBody: "Hours back equals planning sessions \xD7 minutes per session \xD7 the share KAI could reduce, minus your checking time. Personal time stays separate from money unless you explicitly enter a comparison value. Optional food value equals portions you expect to stop wasting \xD7 their ingredient cost, only where using that food replaces a future purchase.",
    formulaLabel: "Estimated net benefit subtracts your KAI price and any separately paid checking from the optional value you enter. Unpriced personal time is shown in hours only.",
    burdenHeading: "Less grocery admin",
    opportunityHeading: "More room for everyday life",
    allocationNote: "All returned time remains personal time. It is never converted into wages, business revenue or cash savings.",
    overlapLabel: "These portions would otherwise be wasted, replace a future purchase, and are not also counted as a discount or another saving.",
    overlapNote: "Count only edible food you would safely use. Ingredient cost excludes your time and KAI fees. Do not count the same food as both a duplicate purchase avoided and waste prevented.",
    reviewedLabel: "I have reviewed my assumptions. If I leave food waste unselected, only my time estimate counts as a benefit.",
    assumptionsIncomplete: "You can keep this as a time estimate. Add and review optional value assumptions to compare them with your KAI price.",
    reviewError: "Checking takes longer than the planning time reduced. These assumptions do not return positive time.",
    overlapError: "Confirm the food value replaces spending and is not counted twice before including it."
  });
  Object.assign(b.fields, {
    volume: { label: "Grocery-planning sessions each month", help: "For example, four weekly plans. Count your whole household once, not once per person." },
    minutes: { label: "Planning minutes per session today", help: "Include fridge checks, recipe decisions, product comparison and list preparation. Exclude cooking and shopping travel." },
    automation: { label: "Share KAI could help reduce", help: "Your estimate, not a promised performance level. Start modestly and check against your actual routine." },
    review: { label: "Minutes to check each plan", help: "Allow time to verify ingredients, portions, allergies, current prices and the final shopping list." },
    tokens_per_output: { label: "Tokens to build one plan", help: "Modeled tokens to turn a fridge or receipt scan into a checked plan. Shown so you can see usage; you do not need a provider price." },
    customer_price: { label: "Base price", help: "The minimum price for the selected period. Your estimated total increases when usage exceeds the included allowance." },
    personal_value_per_hour: { label: "Optional value you assign to one hour", help: "Use only for a personal comparison. This is not salary, wages or guaranteed savings." },
    budget: { label: "Your monthly KAI budget", help: "Your own estimate for access and extra services, not a price quote. Exclude the usual grocery bill." },
    platform_cost: { label: "Modelled service cost", help: "Internal token, model, hosting, storage and support cost used to estimate the displayed KAI price." },
    model_cost: { label: "Additional usage", help: "The amount above the base price needed to cover your estimated usage." },
    tools_cost: { label: "Extra connected services", help: "Only additional service charges needed for KAI, not ordinary food purchases." },
    infrastructure_cost: { label: "Extra hosting or storage", help: "Enter zero unless you pay for this separately." },
    review_rate: { label: "Extra paid checking per hour", help: "Use actual additional spending on help, never an hourly value for your own time." },
    incidents: { label: "Food portions you could stop wasting each month", help: "Enter a realistic reduction from what you currently throw away. Count only food you would safely use instead of buying a replacement." },
    incident_cost: { label: "Ingredient cost per avoided wasted portion", help: "Use the average cost of the ingredients, not a restaurant price or the value of your cooking time." }
  });
  b.outcomes = [{ id: "error", label: "Use more of the food I buy", help: "Optional: estimate fewer wasted portions. KAI does not guarantee lower grocery spending." }];
  result.cta.privacyNote = "Your estimates stay in this calculator. Nothing is ordered or saved from these inputs.";
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  catalogueFields,
  createBusinessImpactCalculator,
  createHouseholdImpactCalculator,
  roundHours,
  usagePackageFromWorkload
});
