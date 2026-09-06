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
  createBusinessImpactCalculator: () => createBusinessImpactCalculator,
  createHouseholdImpactCalculator: () => createHouseholdImpactCalculator
});
module.exports = __toCommonJS(business_impact_presets_exports);

// app/shared/utils/business-impact.ts
var IMPACT_COPY = {
  navLabel: "ROI",
  workloadStep: "Your workload",
  costStep: "Operating cost",
  valueStep: "Use the capacity",
  workloadIntro: "Start with the work, not a salary. Adjust this illustrative workload to your team.",
  costIntro: "Include the costs needed to run this workload. These are your estimates, not a Gabriel quote.",
  valueIntro: "What will you do with the returned hours? Select only outcomes you expect to realize.",
  sampleNotice: "Illustrative workload \xB7 not observed results",
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
  reviewMode: "Who handles the review?",
  teamReview: "Existing team",
  paidReview: "Additional paid reviewer",
  reviewNote: "Existing-team review uses returned capacity. Additional paid review is included in operating cost, not deducted again from team capacity.",
  totalMode: "Monthly budget",
  itemizedMode: "Cost breakdown",
  budgetNote: "The budget must include models/media, tools, infrastructure, Gabriel fees, and any additional paid review. Do not include unchanged payroll as new spending.",
  itemizedNote: "Enter zero for a cost that does not apply. Additional paid review is calculated from review hours and its actual rate.",
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
  notApplicable: "Not applicable",
  annual: "Annual view",
  annualNote: "The same monthly assumptions, without growth or compounding. Hiring savings last only for the entered period.",
  method: "How this is calculated",
  burdenHeading: "Repetitive work reduced",
  opportunityHeading: "Capacity for higher-value work",
  methodBody: "Operating burden removed (negative productivity) returns capacity. Higher-value work (potential positive productivity) creates economic value only if that capacity is used. Hours alone are not cash savings.",
  formulaLabel: "Economic value \xF7 operating cost = economic return multiple. Net benefit subtracts operating cost once.",
  allocationNote: "Each hour can be allocated once. Unallocated hours remain capacity, with no euro value.",
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

// app/shared/utils/business-impact-presets.ts
var FIELD_COPY = {
  volume: ["Work units each month", "Use a typical month, not a best-case peak."],
  minutes: ["Hands-on minutes per unit today", "Active work time, excluding waiting and elapsed calendar time."],
  automation: ["Share of that work reduced", "An illustrative assumption to validate in a pilot, not a performance promise."],
  review: ["Review minutes per unit", "Human checking still needed after automation."],
  budget: ["Estimated monthly operating budget", "Include all models/media, tools, infrastructure, Gabriel fees and additional paid review."],
  model_cost: ["Models and media generation", "Your monthly estimate, including images or video where applicable."],
  tools_cost: ["Tools and integrations", "Browser sessions, connectors and other metered services."],
  infrastructure_cost: ["Infrastructure", "Incremental hosting, storage and compute for this workload."],
  platform_cost: ["Gabriel fees", "Use your agreed fee or your own budget assumption; this is not a price quote."],
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
  days_after: ["Cycle time after, in days", "Shown as an operational change only, without an assumed euro value."]
};
function createBusinessImpactCalculator({
  pageName,
  workloadLabel = "Work units each month",
  defaults = { volume: 100, minutes: 30, automation: 50, review: 5 },
  burden = ["Repeated preparation", "Re-keying information", "Checking and correcting routine work"],
  opportunity = ["More capacity for customers", "Higher-value work", "Less paid overflow"],
  primaryTarget = "meet",
  primaryLabel = `Talk with ${pageName}`
}) {
  const fields = Object.fromEntries(Object.entries(FIELD_COPY).map(([id, [label, help]]) => [id, { label, help }]));
  fields.volume.label = workloadLabel;
  return {
    methodologyVersion: 2,
    enabled: true,
    kicker: "Business impact",
    heading: "ROI Calculator",
    subheading: "Start with capacity. Then decide what it could be worth.",
    disclaimer: "A scenario built from your assumptions, not observed results or guaranteed savings. Returned hours are capacity, not an automatic payroll reduction.",
    currency: "EUR",
    locale: "en-GB",
    inputs: [],
    metrics: [],
    businessImpact: {
      defaults,
      copy: { ...IMPACT_COPY },
      fields,
      burden,
      opportunity,
      outcomes: [
        { id: "higher_value", label: "Do higher-value work", help: "Use part of the capacity for work with incremental contribution." },
        { id: "throughput", label: "Handle more volume", help: "Match available capacity with actual expected demand." },
        { id: "cash", label: "Stop actual spending", help: "Reduce overtime, contractors or paid processing\u2014not unchanged salaries." },
        { id: "hiring", label: "Defer a planned hire", help: "Cover a specific, genuinely planned workload for a stated period." },
        { id: "error", label: "Avoid errors and rework", help: "Estimate distinct incidents and their incremental cost." },
        { id: "risk", label: "Reduce expected loss", help: "An optional, uncertain estimate with explicit probabilities and exposure." },
        { id: "cycle_time", label: "Finish sooner", help: "Show elapsed days improved without automatically attaching a euro value." }
      ]
    },
    cta: { primaryLabel, primaryTarget }
  };
}
function createHouseholdImpactCalculator(pageName = "KAI") {
  const result = createBusinessImpactCalculator({
    pageName,
    workloadLabel: "Grocery-planning sessions each month",
    defaults: { volume: 4, minutes: 45, automation: 50, review: 5 },
    burden: ["Checking the fridge and pantry", "Finding recipes and missing ingredients", "Comparing products and preparing a grocery list"],
    opportunity: ["More time for yourself and your household", "Meals built around food you already have", "A reviewed shopping list, with fewer duplicate purchases"],
    primaryTarget: "hero-chat",
    primaryLabel: `Try a grocery scan with ${pageName}`
  });
  Object.assign(result, {
    kicker: "Home impact",
    heading: "ROI Calculator",
    subheading: "Estimate time back for your household. Add food-waste and cost assumptions only if you want a money estimate.",
    disclaimer: "Illustrative household estimates, not guaranteed savings. Your time is not priced as a salary. Food value counts only if it replaces spending you would otherwise make; check prices, portions and dietary needs yourself."
  });
  const b = result.businessImpact;
  Object.assign(b.copy, {
    navLabel: "ROI",
    workloadStep: "Your routine",
    costStep: "Your KAI budget",
    valueStep: "Less food waste",
    workloadIntro: "Count time spent checking food, choosing recipes and preparing your grocery list\u2014not cooking, travel or time in the shop.",
    costIntro: "Use your own monthly budget for KAI and any extra services. Leave it blank to focus on time, or enter zero if no cost applies.",
    valueIntro: "Time back is yours to enjoy. Optionally estimate food you could use instead of wasting, without counting the same purchase twice.",
    sampleNotice: "Illustrative routine \xB7 adjust these numbers to your household",
    summary: "Your household estimate",
    volume: "Planning sessions",
    grossHours: "Planning time reduced",
    capacity: "Time back for you",
    retained: "Personal time, not priced in money",
    reviewMode: "Who checks the suggestions?",
    teamReview: "Me or my household",
    paidReview: "Someone I pay extra",
    reviewNote: "Checking portions, allergies, ingredients and the cart takes time. Household review is subtracted from time back. Extra paid help belongs in your KAI budget instead.",
    totalMode: "Monthly budget",
    itemizedMode: "Optional cost details",
    budgetNote: "Include KAI access, extra services and any extra paid help once. Do not include your usual grocery bill or put a price on your own time.",
    itemizedNote: "Use zero for anything that does not apply. Extra paid checking is counted at the rate you enter; do not also include it in another cost line.",
    paidReviewCost: "Extra paid checking",
    allInCost: "Your KAI running cost",
    expectedLoss: "Estimated food value retained",
    economicValue: "Modeled food value",
    netBenefit: "Food value minus KAI cost",
    multiple: "Food value / KAI cost",
    annualNote: "Twelve months using the same routine and food-waste assumptions. No growth, compounding or guaranteed savings.",
    methodBody: "Time back equals planning sessions \xD7 minutes per session \xD7 the share KAI could reduce, minus your checking time. Personal time stays separate from money. Optional food value equals portions you expect to stop wasting \xD7 their ingredient cost, only where using that food replaces a future purchase.",
    formulaLabel: "Food value minus KAI running cost = modeled net benefit. Food value divided by KAI running cost = the multiple; zero cost has no defined multiple.",
    burdenHeading: "Less grocery admin",
    opportunityHeading: "More room for everyday life",
    allocationNote: "All returned time remains personal time. It is never converted into wages, business revenue or cash savings.",
    overlapLabel: "These portions would otherwise be wasted, replace a future purchase, and are not also counted as a discount or another saving.",
    overlapNote: "Count only edible food you would safely use. Ingredient cost excludes your time and KAI fees. Do not count the same food as both a duplicate purchase avoided and waste prevented.",
    reviewedLabel: "I have reviewed my assumptions. If I leave food waste unselected, only my time estimate counts as a benefit.",
    assumptionsIncomplete: "You can keep this as a time estimate. Add a KAI budget and review optional food-waste assumptions to see the money comparison.",
    reviewError: "Checking takes longer than the planning time reduced. These assumptions do not return positive time.",
    overlapError: "Confirm the food value replaces spending and is not counted twice before including it."
  });
  Object.assign(b.fields, {
    volume: { label: "Grocery-planning sessions each month", help: "For example, four weekly plans. Count your whole household once, not once per person." },
    minutes: { label: "Planning minutes per session today", help: "Include fridge checks, recipe decisions, product comparison and list preparation. Exclude cooking and shopping travel." },
    automation: { label: "Share KAI could help reduce", help: "Your estimate, not a promised performance level. Start modestly and check against your actual routine." },
    review: { label: "Minutes to check each plan", help: "Allow time to verify ingredients, portions, allergies, current prices and the final shopping list." },
    budget: { label: "Your monthly KAI budget", help: "Your own estimate for access and extra services, not a price quote. Exclude the usual grocery bill." },
    platform_cost: { label: "KAI / Gabriel access", help: "Your actual subscription or planned budget; do not assume a price from this calculator." },
    model_cost: { label: "Extra AI usage", help: "Only usage charged separately from your subscription; otherwise enter zero." },
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
  createBusinessImpactCalculator,
  createHouseholdImpactCalculator
});
