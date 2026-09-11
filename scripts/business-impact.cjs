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

// app/shared/utils/business-impact.ts
var business_impact_exports = {};
__export(business_impact_exports, {
  ESTIMATOR_COPY_TEMPLATES: () => ESTIMATOR_COPY_TEMPLATES,
  FOOD_WASTE_PER_PERSON_YEAR_DEFAULT: () => FOOD_WASTE_PER_PERSON_YEAR_DEFAULT,
  FOOD_WASTE_SOURCE_DEFAULT: () => FOOD_WASTE_SOURCE_DEFAULT,
  HOUSEHOLD_COPY: () => HOUSEHOLD_COPY,
  HOUSEHOLD_COPY_TEMPLATES: () => HOUSEHOLD_COPY_TEMPLATES,
  HOUSEHOLD_IMPACT_COPY_KEYS: () => HOUSEHOLD_IMPACT_COPY_KEYS,
  HOUSEHOLD_INPUT_FIELDS: () => HOUSEHOLD_INPUT_FIELDS,
  HOUSEHOLD_PEOPLE_DEFAULT: () => HOUSEHOLD_PEOPLE_DEFAULT,
  IMPACT_ALLOCATION_FIELDS: () => IMPACT_ALLOCATION_FIELDS,
  IMPACT_COPY: () => IMPACT_COPY,
  IMPACT_FIELDS: () => IMPACT_FIELDS,
  IMPACT_MONEY_FIELDS: () => IMPACT_MONEY_FIELDS,
  IMPACT_OUTCOMES: () => IMPACT_OUTCOMES,
  IMPACT_OUTCOME_FIELDS: () => IMPACT_OUTCOME_FIELDS,
  IMPACT_TOKEN_FIELDS: () => IMPACT_TOKEN_FIELDS,
  INTERNAL_COST_FIELDS: () => INTERNAL_COST_FIELDS,
  LOSS_RATE: () => LOSS_RATE,
  LOSS_RATE_SOURCE_DEFAULT: () => LOSS_RATE_SOURCE_DEFAULT,
  OFFLOAD_RATE_DEFAULT: () => OFFLOAD_RATE_DEFAULT,
  PRICE_PER_STORE: () => PRICE_PER_STORE,
  REVIEW_MINUTES_DEFAULT: () => REVIEW_MINUTES_DEFAULT,
  REVIEW_MIN_PER_STORE_CYCLE: () => REVIEW_MIN_PER_STORE_CYCLE,
  ROI_COST_COPY: () => ROI_COST_COPY,
  ROI_CURRENCY_COPY: () => ROI_CURRENCY_COPY,
  ROI_CURRENCY_NEUTRAL_COPY: () => ROI_CURRENCY_NEUTRAL_COPY,
  SHARE_HANDLED: () => SHARE_HANDLED,
  STORE_OPS_COPY: () => STORE_OPS_COPY,
  STORE_OPS_COPY_TEMPLATES: () => STORE_OPS_COPY_TEMPLATES,
  STORE_OPS_IMPACT_COPY_KEYS: () => STORE_OPS_IMPACT_COPY_KEYS,
  STORE_OPS_INPUT_FIELDS: () => STORE_OPS_INPUT_FIELDS,
  STORE_OPS_STARTING_VALUES: () => STORE_OPS_STARTING_VALUES,
  TOKEN_ECONOMICS: () => TOKEN_ECONOMICS,
  defaultImpactTabs: () => defaultImpactTabs,
  evaluateBusinessImpact: () => evaluateBusinessImpact,
  evaluateHouseholdEstimate: () => evaluateHouseholdEstimate,
  evaluateStoreOpsEstimate: () => evaluateStoreOpsEstimate,
  householdStartingValues: () => householdStartingValues,
  initialImpactState: () => initialImpactState,
  isCopyTemplate: () => isCopyTemplate,
  matchUsagePackage: () => matchUsagePackage,
  netCapacityHours: () => netCapacityHours,
  resolveHouseholdAssumptions: () => resolveHouseholdAssumptions,
  resolveImpactTabs: () => resolveImpactTabs,
  resolveStoreOpsAssumptions: () => resolveStoreOpsAssumptions,
  storeOpsStartingValues: () => storeOpsStartingValues,
  tokenCostFromUsage: () => tokenCostFromUsage,
  validateBusinessImpact: () => validateBusinessImpact,
  validateRoiCostCopy: () => validateRoiCostCopy,
  validateRoiCurrencyCopy: () => validateRoiCurrencyCopy,
  valuesFromUsagePackage: () => valuesFromUsagePackage
});
module.exports = __toCommonJS(business_impact_exports);
var IMPACT_OUTCOMES = ["cash", "higher_value", "throughput", "hiring", "error", "risk", "cycle_time"];
var IMPACT_FIELDS = {
  volume: [0, 1e6, 1],
  people: [1, 8, 1],
  accepted_rate: [0, 100, 1],
  attendance_rate: [0, 100, 1],
  minutes: [0, 1e4, 1],
  automation: [0, 100, 1],
  review: [0, 1e4, 1],
  correction_rate_before: [0, 100, 0.1],
  correction_rate_after: [0, 100, 0.1],
  correction_minutes_before: [0, 1e4, 0.1],
  correction_minutes_after: [0, 1e4, 0.1],
  cycles_per_unit: [1, 1e3, 1],
  purchases_per_store: [1e4, 5e5, 5e3],
  tokens_per_output: [0, 1e7, 100],
  budget: [0, 1e8, 1],
  model_cost: [0, 1e8, 1],
  tools_cost: [0, 1e8, 1],
  infrastructure_cost: [0, 1e8, 1],
  platform_cost: [0, 1e8, 1],
  review_rate: [0, 1e4, 1],
  customer_price: [0, 1e8, 0.01],
  personal_value_per_hour: [0, 1e6, 0.01],
  capacity_value_per_hour: [0, 1e6, 0.01],
  included_volume: [0, 1e6, 1],
  overage_price: [0, 1e6, 0.01],
  setup_fee: [0, 1e8, 0.01],
  contract_months: [1, 120, 1],
  cash_hours: [0, 1e8, 0.5],
  cash_avoided: [0, 1e8, 1],
  cash_baseline: [0, 1e8, 1],
  higher_value_hours: [0, 1e8, 0.5],
  contribution_rate: [0, 1e6, 1],
  throughput_hours: [0, 1e8, 0.5],
  extra_minutes: [0.1, 1e4, 0.1],
  demand: [0, 1e6, 1],
  unit_margin: [0, 1e6, 1],
  hiring_hours: [0, 1e8, 0.5],
  planned_hours: [0.5, 1e4, 0.5],
  hire_cost: [0, 1e7, 1],
  hire_months: [1, 12, 1],
  incidents: [0, 1e6, 0.1],
  incident_cost: [0, 1e8, 1],
  probability_before: [0, 100, 0.1],
  probability_after: [0, 100, 0.1],
  loss: [0, 1e8, 1],
  days_before: [0, 3650, 0.1],
  days_after: [0, 3650, 0.1]
};
var OFFLOAD_RATE_DEFAULT = 0.5;
var REVIEW_MINUTES_DEFAULT = 5;
var FOOD_WASTE_PER_PERSON_YEAR_DEFAULT = 100;
var FOOD_WASTE_SOURCE_DEFAULT = "Netherlands Nutrition Centre (Voedingscentrum), 2026 report using 2025 data";
var HOUSEHOLD_PEOPLE_DEFAULT = 2;
var HOUSEHOLD_INPUT_FIELDS = ["volume", "minutes", "people"];
function isCopyTemplate(text, tokens) {
  let rest = text;
  for (const token of tokens) {
    const parts = rest.split(`{${token}}`);
    if (parts.length !== 2) return false;
    rest = parts.join("");
  }
  return !/[{}]/.test(rest);
}
var HOUSEHOLD_COPY = {
  // Whole-sentence templates: translating "About" or "back a month" as separate fragments produced wrong copy.
  timeBackMonthly: "About {duration} back a month",
  timeBackYearly: "About {duration} back a year",
  wasteLabel: "Food a household your size throws away",
  wasteInfo: "Dutch average from the Netherlands Nutrition Centre (2026), about \u20AC100 per person a year. Your household may waste more or less.",
  wasteMonthly: "about {amount} a month",
  wasteYearly: "about {amount} a year",
  priceLabel: "KAI",
  priceMonthly: "{amount} a month",
  priceYearly: "{amount} a year",
  fixedAssumptionsHeading: "Fixed assumptions, not inputs",
  offloadRateLabel: "Share of planning time KAI takes on",
  reviewMinutesLabel: "Minutes to check each plan",
  foodWasteReferenceLabel: "Food wasted per person each year",
  sourceLabel: "Source",
  timeBackFormula: "Time back = sessions \xD7 planning minutes per session \xD7 the share KAI takes on, minus sessions \xD7 minutes to check each plan.",
  wasteFormula: "Food-waste comparison = food wasted per person each year \xF7 12 \xD7 people in your household, rounded to whole euros.",
  priceNote: "The KAI price is fixed. None of these inputs change it."
};
var HOUSEHOLD_COPY_TEMPLATES = {
  timeBackMonthly: ["duration"],
  timeBackYearly: ["duration"],
  wasteMonthly: ["amount"],
  wasteYearly: ["amount"],
  priceMonthly: ["amount"],
  priceYearly: ["amount"]
};
var SHARE_HANDLED = 0.5;
var REVIEW_MIN_PER_STORE_CYCLE = 30;
var LOSS_RATE = 0.0121;
var PRICE_PER_STORE = 250;
var LOSS_RATE_SOURCE_DEFAULT = "Wageningen University & Research, supermarket food-loss monitor (2024 data)";
var STORE_OPS_STARTING_VALUES = { volume: 6, cycles_per_unit: 13, minutes: 150, purchases_per_store: 1e5 };
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
var STORE_OPS_COPY_TEMPLATES = {
  lossLabelOne: ["stores"],
  lossLabelOther: ["stores"],
  lossMonthly: ["amount"],
  lossYearly: ["amount"],
  priceLabelOne: ["stores"],
  priceLabelOther: ["stores"],
  priceMonthly: ["amount", "perStore"],
  priceYearly: ["amount", "perStore"],
  breakEven: ["percent"],
  hoursMonthly: ["duration"],
  hoursYearly: ["duration"]
};
var ESTIMATOR_COPY_TEMPLATES = {
  householdCopy: HOUSEHOLD_COPY_TEMPLATES,
  storeOpsCopy: STORE_OPS_COPY_TEMPLATES
};
var INTERNAL_COST_FIELDS = ["tokens_per_output", "platform_cost", "model_cost", "tools_cost", "infrastructure_cost", "budget", "review_rate"];
var IMPACT_MONEY_FIELDS = ["budget", "model_cost", "tools_cost", "infrastructure_cost", "platform_cost", "review_rate", "customer_price", "purchases_per_store", "personal_value_per_hour", "capacity_value_per_hour", "overage_price", "setup_fee", "cash_baseline", "cash_avoided", "contribution_rate", "unit_margin", "hire_cost", "incident_cost", "loss"];
var IMPACT_TOKEN_FIELDS = ["tokens_per_output"];
var ROI_CURRENCY_COPY = {
  native: "Amounts in {currency}.",
  loading: "Checking the local currency. Amounts remain in {currency} until a rate is available.",
  unavailable: "A current local exchange rate is unavailable. Amounts remain in {currency}.",
  converted: "Amounts converted from {base} to {currency} using the reference rate dated {date}.",
  basis: "Currency conversion is not local cost research. Enter your own local costs and contribution assumptions. Language changes do not change amounts."
};
var ROI_CURRENCY_NEUTRAL_COPY = {
  cycleHelp: "Shown as an operational change only, without an assumed monetary value.",
  cycleOutcome: "Show elapsed days improved without automatically attaching a monetary value.",
  privacy: "Your data stays private. Hours are capacity. Financial amounts are modeled estimates, not observed results."
};
var ROI_COST_COPY = {
  breakdown: "How the all-in AI cost is built",
  perUnit: "{amount} per work unit (average)",
  budgetOnly: "This is your total budget. Switch to Cost breakdown to itemize it; no split has been assumed.",
  benefitNotice: "Modeled benefits, not charges. Crossed-out amounts are spending you expect to avoid, not discounts on the AI bill.",
  remainder: "Other included operating costs",
  allocation: "Returned hours are capacity, not automatic savings. Only the portions you assign to actual spending reductions or additional contribution receive a monetary value."
};
var TOKEN_ECONOMICS = {
  inputPricePerMillion: 2,
  outputPricePerMillion: 10,
  outputShare: 0.2
};
function validateRoiCurrencyCopy(value, path) {
  return validateRoiNoticeCopy(value, path, ROI_CURRENCY_COPY);
}
function validateRoiCostCopy(value, path) {
  return validateRoiNoticeCopy(value, path, ROI_COST_COPY);
}
function validateRoiNoticeCopy(value, path, defaults) {
  if (value === void 0) return [];
  if (!value || typeof value !== "object" || Array.isArray(value)) return [{ path, message: "Expected localized currency notices." }];
  const record = value;
  const issues = [];
  for (const key of /* @__PURE__ */ new Set([...Object.keys(record), ...Object.keys(defaults)])) {
    const text = record[key];
    const original = defaults[key];
    if (!original || typeof text !== "string" || !text.trim() || text.length > 900) issues.push({ path: `${path}.${key}`, message: "Use bounded localized currency notice copy." });
    else if (JSON.stringify((text.match(/\{[a-z]+\}/g) || []).sort()) !== JSON.stringify((original.match(/\{[a-z]+\}/g) || []).sort())) issues.push({ path: `${path}.${key}`, message: "Preserve the currency notice placeholders." });
  }
  return issues;
}
var IMPACT_OUTCOME_FIELDS = {
  cash: ["cash_hours", "cash_baseline", "cash_avoided"],
  higher_value: ["higher_value_hours", "contribution_rate"],
  throughput: ["throughput_hours", "extra_minutes", "demand", "unit_margin"],
  hiring: ["hiring_hours", "planned_hours", "hire_cost", "hire_months"],
  error: ["incidents", "incident_cost"],
  risk: ["probability_before", "probability_after", "loss"],
  cycle_time: ["days_before", "days_after"]
};
var IMPACT_ALLOCATION_FIELDS = ["cash_hours", "higher_value_hours", "throughput_hours", "hiring_hours"];
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
var PACKAGE_VALUE_KEYS = ["cycles_per_unit", "customer_price", "personal_value_per_hour", "capacity_value_per_hour", "included_volume", "overage_price", "setup_fee", "contract_months", "minutes", "automation", "review", "correction_rate_before", "correction_rate_after", "correction_minutes_before", "correction_minutes_after", "model_cost", "tools_cost", "infrastructure_cost", "higher_value_hours", "contribution_rate", "cash_hours", "cash_baseline", "cash_avoided", "incidents", "incident_cost", "probability_before", "probability_after", "loss"];
function tokenCostFromUsage({ volume, tokensPerOutput }) {
  const monthlyTokens = Math.max(0, volume) * Math.max(0, tokensPerOutput);
  const mix = (1 - TOKEN_ECONOMICS.outputShare) * TOKEN_ECONOMICS.inputPricePerMillion + TOKEN_ECONOMICS.outputShare * TOKEN_ECONOMICS.outputPricePerMillion;
  return monthlyTokens * mix / 1e6;
}
function netCapacityHours({ volume, minutes, automation, review, reviewMode = "team" }) {
  const grossHours = volume * minutes / 60 * automation / 100;
  const reviewHours = volume * review / 60;
  return Math.max(0, grossHours - (reviewMode === "team" ? reviewHours : 0));
}
function valuesFromUsagePackage({ pack }) {
  const values = {
    volume: pack.volume,
    tokens_per_output: pack.tokensPerOutput,
    platform_cost: pack.platform_cost
  };
  for (const key of PACKAGE_VALUE_KEYS) {
    const amount = pack[key];
    if (typeof amount === "number") values[key] = amount;
  }
  return values;
}
function matchUsagePackage({ config, values }) {
  if (!config.usagePackages) return "custom";
  const matches = (pack) => {
    const expected = valuesFromUsagePackage({ pack });
    return Object.keys(expected).every((key) => values[key] === expected[key]);
  };
  if (matches(config.usagePackages.medium)) return "medium";
  if (matches(config.usagePackages.base)) return "base";
  return "custom";
}
function defaultImpactTabs({ copy }) {
  return [
    { id: "workload", label: copy.workloadStep, intro: copy.workloadIntro, fields: ["volume", "minutes", "automation", "review"], showReview: true, showPackage: true },
    { id: "cost", label: copy.costStep, intro: copy.costIntro, fields: ["tokens_per_output", "model_cost", "tools_cost", "infrastructure_cost", "platform_cost"], showPackage: true },
    { id: "value", label: copy.valueStep, intro: copy.valueIntro, fields: [], showOutcomes: true }
  ];
}
function resolveImpactTabs({ config }) {
  return config.tabs?.length ? config.tabs : defaultImpactTabs({ copy: config.copy });
}
function initialImpactState(config) {
  const packageId = config.defaultPackage && config.usagePackages ? config.defaultPackage : config.usagePackages ? "medium" : "custom";
  const packaged = packageId !== "custom" && config.usagePackages ? { ...config.defaults, ...valuesFromUsagePackage({ pack: config.usagePackages[packageId] }) } : { ...config.defaults };
  return {
    values: packaged,
    selected: config.selected?.length ? [...config.selected] : [],
    reviewMode: config.reviewMode || "team",
    costMode: config.costMode || "itemized",
    overlapConfirmed: config.confirmations?.overlap ?? false,
    hiringConfirmed: config.confirmations?.hiring ?? false,
    outcomesReviewed: config.confirmations?.outcomes ?? false,
    usagePackage: packageId === "custom" ? "custom" : packageId,
    workloadMultiplierField: config.workloadMultiplierField,
    pricingBasis: config.pricing?.basis,
    annualBasePrice: config.pricing?.annualPrice,
    minimumMargin: config.pricing?.minimumMargin,
    financialPresentation: config.presentation?.financial
  };
}
function evaluateBusinessImpact(state) {
  const { values: v } = state;
  const selected = [...new Set(state.selected)].filter((id) => IMPACT_OUTCOMES.includes(id));
  const has = (...keys) => keys.every((k) => typeof v[k] === "number" && Number.isFinite(v[k]) && v[k] >= IMPACT_FIELDS[k][0] && v[k] <= IMPACT_FIELDS[k][1]);
  const n = (k) => has(k) ? v[k] : 0;
  const errors = [];
  const usesTokens = has("tokens_per_output");
  const used = /* @__PURE__ */ new Set(["volume", "minutes", "automation", "review"]);
  if (v.accepted_rate != null) used.add("accepted_rate");
  if (v.attendance_rate != null) used.add("attendance_rate");
  if (state.workloadMultiplierField) used.add(state.workloadMultiplierField);
  if (state.pricingBasis && v.customer_price != null) used.add("customer_price");
  if (state.pricingBasis === "tiered") {
    ["included_volume", "overage_price", "setup_fee", "contract_months"].forEach((k) => used.add(k));
  }
  if (v.personal_value_per_hour != null) used.add("personal_value_per_hour");
  if (v.capacity_value_per_hour != null) used.add("capacity_value_per_hour");
  const correctionFields = ["correction_rate_before", "correction_rate_after", "correction_minutes_before", "correction_minutes_after"];
  const correctionProvided = correctionFields.some((k) => v[k] != null);
  correctionFields.filter((k) => v[k] != null).forEach((k) => used.add(k));
  selected.forEach((id) => IMPACT_OUTCOME_FIELDS[id]?.forEach((k) => used.add(k)));
  const workloadMultiplier = state.workloadMultiplierField ? n(state.workloadMultiplierField) : 1;
  const generatedUnits = n("volume") * workloadMultiplier;
  const acceptanceRate = has("accepted_rate") ? n("accepted_rate") : 100;
  const attendanceRate = has("attendance_rate") ? n("attendance_rate") : 100;
  const workUnits = generatedUnits * acceptanceRate / 100;
  const attendedUnits = workUnits * attendanceRate / 100;
  const currentPreparationHours = workUnits * n("minutes") / 60;
  const grossHours = currentPreparationHours * n("automation") / 100;
  const reviewHours = workUnits * n("review") / 60;
  const correctionReady = has(...correctionFields);
  const currentReworkHours = correctionReady ? workUnits * n("correction_rate_before") / 100 * n("correction_minutes_before") / 60 : null;
  const assistedReworkHours = correctionReady ? workUnits * n("correction_rate_after") / 100 * n("correction_minutes_after") / 60 : null;
  const reworkHours = correctionReady ? currentReworkHours - assistedReworkHours : null;
  const preparationCapacity = grossHours - (state.reviewMode === "team" ? reviewHours : 0);
  const rawCapacity = preparationCapacity + (reworkHours || 0);
  const capacity = Math.max(0, rawCapacity);
  if (state.reviewMode === "team" && reviewHours > grossHours) errors.push("reviewError");
  const allocated = selected.reduce((sum, id) => sum + (IMPACT_ALLOCATION_FIELDS.includes(`${id}_hours`) ? n(`${id}_hours`) : 0), 0);
  if (allocated > capacity + 1e-6) errors.push("allocationError");
  const costFields = state.costMode === "total" ? ["budget"] : usesTokens ? ["tokens_per_output", "model_cost", "tools_cost", "infrastructure_cost", "platform_cost", ...state.reviewMode === "paid" ? ["review_rate"] : []] : ["model_cost", "tools_cost", "infrastructure_cost", "platform_cost", ...state.reviewMode === "paid" ? ["review_rate"] : []];
  costFields.forEach((k) => used.add(k));
  if ([...used].some((k) => v[k] != null && !has(k))) errors.push("boundsError");
  const workloadReady = has("volume", "minutes", "automation", "review") && (v.accepted_rate == null || has("accepted_rate")) && (v.attendance_rate == null || has("attendance_rate")) && (!state.workloadMultiplierField || has(state.workloadMultiplierField));
  const costReady = has(...costFields) && (state.costMode !== "itemized" || state.reviewMode !== "paid" || has("volume", "review"));
  const reviewCost = state.reviewMode === "paid" ? reviewHours * n("review_rate") : 0;
  const monthlyTokens = usesTokens ? generatedUnits * n("tokens_per_output") : 0;
  const tokenCost = usesTokens ? tokenCostFromUsage({ volume: generatedUnits, tokensPerOutput: n("tokens_per_output") }) : 0;
  const cost = state.costMode === "total" ? n("budget") : tokenCost + n("model_cost") + n("tools_cost") + n("infrastructure_cost") + n("platform_cost") + reviewCost;
  const cash = selected.includes("cash") ? n("cash_avoided") : 0;
  if (selected.includes("cash") && (cash > n("cash_baseline") || cash > 0 && n("cash_hours") === 0)) errors.push("cashError");
  const extraUnits = selected.includes("throughput") && n("extra_minutes") > 0 ? Math.min(n("throughput_hours") * 60 / n("extra_minutes"), n("demand")) : 0;
  const contribution = (selected.includes("higher_value") ? n("higher_value_hours") * n("contribution_rate") : 0) + extraUnits * n("unit_margin");
  const hire = selected.includes("hiring") ? n("hire_cost") : 0;
  if (selected.includes("hiring") && (!state.hiringConfirmed || n("hiring_hours") < n("planned_hours") || !Number.isInteger(n("hire_months")))) errors.push("hiringError");
  const errorValue = selected.includes("error") ? n("incidents") * n("incident_cost") : 0;
  const riskValue = selected.includes("risk") ? Math.max(0, n("probability_before") - n("probability_after")) / 100 * n("loss") : 0;
  if (selected.includes("risk") && n("probability_after") > n("probability_before")) errors.push("riskError");
  if (selected.some((id) => id !== "cycle_time") && !state.overlapConfirmed) errors.push("overlapError");
  const valueReady = state.outcomesReviewed && selected.every((id) => has(...IMPACT_OUTCOME_FIELDS[id])) && errors.length === 0 && workloadReady;
  const ready = valueReady && costReady;
  const economicValue = cash + hire + contribution + errorValue + riskValue;
  const personalTimeValue = has("personal_value_per_hour") ? capacity * n("personal_value_per_hour") : 0;
  const capacityValue = has("capacity_value_per_hour") && workloadReady ? rawCapacity * n("capacity_value_per_hour") : 0;
  const capacityValueReady = has("capacity_value_per_hour") && workloadReady;
  const customerBenefit = economicValue + personalTimeValue + capacityValue;
  const baseCustomerPrice = has("customer_price") ? state.pricingBasis === "per_volume" ? n("customer_price") * n("volume") : n("customer_price") : null;
  const usagePricing = state.pricingBasis === "usage";
  const serviceCost = cost - reviewCost;
  const marginReady = typeof state.minimumMargin === "number" && Number.isFinite(state.minimumMargin) && state.minimumMargin >= 0 && state.minimumMargin < 1;
  const tieredPricing = state.pricingBasis === "tiered";
  const pricingReady = tieredPricing ? has("customer_price", "included_volume", "overage_price", "setup_fee", "contract_months") : !usagePricing || costReady && has("volume", "tokens_per_output") && (!state.workloadMultiplierField || has(state.workloadMultiplierField)) && marginReady;
  const tieredOverage = tieredPricing && pricingReady && has("volume") ? Math.max(0, n("volume") - n("included_volume")) * n("overage_price") : 0;
  const recurringCustomerPrice = baseCustomerPrice === null || !pricingReady ? null : baseCustomerPrice + tieredOverage;
  const annualBasePrice = typeof state.annualBasePrice === "number" && Number.isFinite(state.annualBasePrice) && state.annualBasePrice >= 0 ? state.annualBasePrice * (state.pricingBasis === "per_volume" ? n("volume") : 1) : recurringCustomerPrice === null ? null : recurringCustomerPrice * 12;
  const roundPriceUp = (amount) => Math.ceil((amount - 1e-9) * 100) / 100;
  const usagePrice = usagePricing && pricingReady ? serviceCost / (1 - state.minimumMargin) : 0;
  const customerPrice = recurringCustomerPrice === null || !pricingReady ? null : usagePricing ? roundPriceUp(Math.max(recurringCustomerPrice, usagePrice)) : recurringCustomerPrice;
  const annualCustomerPrice = annualBasePrice === null || !pricingReady ? null : (usagePricing ? roundPriceUp(Math.max(annualBasePrice, usagePrice * 12)) : annualBasePrice) + (tieredPricing ? n("setup_fee") : 0);
  const customerBenefitReady = workloadReady && errors.length === 0 && (valueReady || selected.length === 0 && (capacityValueReady || personalTimeValue > 0)) && (!usagePricing || costReady);
  const customerExpense = customerPrice === null ? null : customerPrice + (usagePricing ? reviewCost : 0);
  const customerNet = customerBenefitReady && customerExpense !== null ? customerBenefit - customerExpense : null;
  const customerRoi = customerBenefitReady && customerPrice !== null && customerPrice > 0 ? (customerBenefit - customerExpense) / customerExpense : null;
  const customerMultiple = customerBenefitReady && customerExpense !== null && customerExpense > 0 ? customerBenefit / customerExpense : null;
  const setupFee = tieredPricing && has("setup_fee") ? n("setup_fee") : 0;
  const contractMonths = tieredPricing && has("contract_months") ? n("contract_months") : 12;
  const paybackMonths = customerNet !== null && customerNet > 0 ? setupFee / customerNet : null;
  const paybackWithinTerm = paybackMonths !== null && paybackMonths <= contractMonths;
  const contributionMargin = customerPrice !== null && costReady ? customerPrice - (usagePricing ? serviceCost : cost) : null;
  const annualValue = (economicValue - hire) * 12 + hire * n("hire_months");
  const annualCustomerBenefit = annualValue + (personalTimeValue + capacityValue) * 12;
  const annualCustomerExpense = annualCustomerPrice === null ? null : annualCustomerPrice + (usagePricing ? reviewCost * 12 : 0);
  const annualCustomerNet = customerBenefitReady && annualCustomerExpense !== null ? annualCustomerBenefit - annualCustomerExpense : null;
  const annualCustomerRoi = annualCustomerNet !== null && annualCustomerExpense > 0 ? annualCustomerNet / annualCustomerExpense : null;
  const annualCustomerMultiple = customerBenefitReady && annualCustomerExpense !== null && annualCustomerExpense > 0 ? annualCustomerBenefit / annualCustomerExpense : null;
  return {
    volume: n("volume"),
    generatedUnits,
    workUnits,
    acceptedUnits: workUnits,
    attendedUnits,
    acceptanceRate,
    attendanceRate,
    currentPreparationHours,
    grossHours,
    reviewHours,
    reviewCost,
    correctionProvided,
    correctionReady,
    currentReworkHours,
    assistedReworkHours,
    reworkHours,
    preparationCapacity,
    rawCapacity,
    capacity,
    allocated,
    retained: Math.max(0, capacity - allocated),
    workloadReady,
    costReady,
    valueReady,
    ready,
    errors,
    cash: cash + hire,
    contribution,
    expectedLoss: errorValue + riskValue,
    riskValue,
    cost,
    serviceCost,
    tokenCost,
    monthlyTokens,
    costPerAcceptedMeeting: workUnits > 0 ? cost / workUnits : null,
    costPerAttendedMeeting: attendedUnits > 0 ? cost / attendedUnits : null,
    economicValue,
    personalTimeValue,
    capacityValue,
    capacityValueReady,
    customerBenefit,
    customerBenefitReady,
    baseCustomerPrice,
    tieredOverage,
    customerPrice,
    customerRoi,
    customerMultiple,
    customerNet,
    setupFee,
    contractMonths,
    paybackMonths,
    paybackWithinTerm,
    contributionMargin,
    annualCustomerPrice,
    annualCustomerBenefit,
    annualCustomerNet,
    annualCustomerRoi,
    annualCustomerMultiple,
    net: ready ? economicValue - cost : null,
    multiple: ready && cost > 0 ? economicValue / cost : null,
    annualCost: cost * 12,
    annualValue,
    annualNet: ready ? annualValue - cost * 12 : null,
    annualMultiple: ready && cost > 0 ? annualValue / (cost * 12) : null,
    extraUnits,
    cycleDays: selected.includes("cycle_time") && has("days_before", "days_after") ? n("days_before") - n("days_after") : null
  };
}
var finiteNumber = (value) => typeof value === "number" && Number.isFinite(value);
function resolveHouseholdAssumptions(config) {
  const fixed = config.fixedAssumptions || {};
  const { automation, review, customer_price: price } = config.defaults || {};
  const annual = config.pricing?.annualPrice;
  const monthlyPrice = finiteNumber(price) && price >= 0 ? price : null;
  const annualPrice = finiteNumber(annual) && annual >= 0 ? annual : monthlyPrice === null ? null : Math.round(monthlyPrice * 1200) / 100;
  return {
    offloadRate: finiteNumber(fixed.offloadRate) ? fixed.offloadRate : finiteNumber(automation) && automation >= 0 && automation <= 100 ? automation / 100 : OFFLOAD_RATE_DEFAULT,
    reviewMinutes: finiteNumber(fixed.reviewMinutes) ? fixed.reviewMinutes : finiteNumber(review) && review >= 0 ? review : REVIEW_MINUTES_DEFAULT,
    foodWastePerPersonYear: finiteNumber(fixed.foodWastePerPersonYear) ? fixed.foodWastePerPersonYear : FOOD_WASTE_PER_PERSON_YEAR_DEFAULT,
    foodWasteSource: typeof fixed.foodWasteSource === "string" && fixed.foodWasteSource.trim() ? fixed.foodWasteSource : FOOD_WASTE_SOURCE_DEFAULT,
    userEditable: false,
    monthlyPrice,
    annualPrice,
    migrated: !config.fixedAssumptions
  };
}
function householdStartingValues(config) {
  const { volume, minutes, people } = config.defaults || {};
  return {
    volume: finiteNumber(volume) ? volume : null,
    minutes: finiteNumber(minutes) ? minutes : null,
    people: finiteNumber(people) && Number.isInteger(people) && people >= 1 && people <= 8 ? people : HOUSEHOLD_PEOPLE_DEFAULT
  };
}
function evaluateHouseholdEstimate({ assumptions, sessions, minutes, people }) {
  const inRange = (value, field) => finiteNumber(value) && value >= IMPACT_FIELDS[field][0] && value <= IMPACT_FIELDS[field][1];
  const timeReady = inRange(sessions, "volume") && inRange(minutes, "minutes");
  const rawMinutesBack = timeReady ? sessions * minutes * assumptions.offloadRate - sessions * assumptions.reviewMinutes : 0;
  const minutesBack = Math.max(0, rawMinutesBack);
  const wasteReady = inRange(people, "people") && Number.isInteger(people);
  return {
    timeReady,
    rawMinutesBack,
    minutesBack,
    minutesBackYearly: minutesBack * 12,
    reviewExceedsSaving: timeReady && rawMinutesBack < 0,
    wasteReady,
    wasteMonthly: wasteReady ? Math.round(assumptions.foodWastePerPersonYear / 12 * people) : null,
    wasteYearly: wasteReady ? assumptions.foodWastePerPersonYear * people : null,
    priceMonthly: assumptions.monthlyPrice,
    priceYearly: assumptions.annualPrice
  };
}
function resolveStoreOpsAssumptions(config) {
  const fixed = config.storeOpsAssumptions || {};
  const { automation, review, customer_price: price } = config.defaults || {};
  return {
    shareHandled: finiteNumber(fixed.shareHandled) ? fixed.shareHandled : finiteNumber(automation) && automation > 0 && automation <= 100 ? automation / 100 : SHARE_HANDLED,
    reviewMinutesPerStoreCycle: finiteNumber(fixed.reviewMinutesPerStoreCycle) ? fixed.reviewMinutesPerStoreCycle : finiteNumber(review) && review >= 0 ? review : REVIEW_MIN_PER_STORE_CYCLE,
    lossRate: finiteNumber(fixed.lossRate) ? fixed.lossRate : LOSS_RATE,
    lossRateSource: typeof fixed.lossRateSource === "string" && fixed.lossRateSource.trim() ? fixed.lossRateSource : LOSS_RATE_SOURCE_DEFAULT,
    userEditable: false,
    pricePerStore: finiteNumber(price) && price >= 0 ? price : config.storeOpsAssumptions ? null : PRICE_PER_STORE,
    migrated: !config.storeOpsAssumptions
  };
}
function storeOpsStartingValues(config) {
  const values = config.defaults || {};
  const pick = (field) => {
    const value = values[field];
    return finiteNumber(value) && value >= IMPACT_FIELDS[field][0] && value <= IMPACT_FIELDS[field][1] ? value : STORE_OPS_STARTING_VALUES[field];
  };
  const stores = pick("volume");
  return { volume: stores >= 1 ? Math.round(stores) : STORE_OPS_STARTING_VALUES.volume, cycles_per_unit: pick("cycles_per_unit"), minutes: pick("minutes"), purchases_per_store: pick("purchases_per_store") };
}
function evaluateStoreOpsEstimate({ assumptions, stores, cyclesPerStore, prepMinutes, purchasesPerStore }) {
  const inRange = (value, field) => finiteNumber(value) && value >= IMPACT_FIELDS[field][0] && value <= IMPACT_FIELDS[field][1];
  const storesReady = finiteNumber(stores) && Number.isInteger(stores) && stores >= 1 && stores <= IMPACT_FIELDS.volume[1];
  const timeReady = storesReady && inRange(cyclesPerStore, "cycles_per_unit") && inRange(prepMinutes, "minutes");
  const cycles = timeReady ? stores * cyclesPerStore : 0;
  const netMinutes = timeReady ? cycles * (prepMinutes * assumptions.shareHandled - assumptions.reviewMinutesPerStoreCycle) : 0;
  const hoursBack = Math.round(netMinutes / 60);
  const lossReady = storesReady && inRange(purchasesPerStore, "purchases_per_store");
  const foodLoss = lossReady ? Math.round(stores * purchasesPerStore * assumptions.lossRate) : null;
  const priceReady = storesReady && assumptions.pricePerStore !== null;
  const price = priceReady ? stores * assumptions.pricePerStore : null;
  const breakEvenPct = foodLoss !== null && foodLoss > 0 && price !== null ? Math.round(price / foodLoss * 100) : null;
  return {
    storesReady,
    timeReady,
    cycles,
    netMinutes,
    timeSaved: timeReady && netMinutes > 0,
    hoursBack,
    hoursBackYearly: hoursBack * 12,
    lossReady,
    foodLoss,
    foodLossYearly: foodLoss === null ? null : foodLoss * 12,
    price,
    priceYearly: price === null ? null : price * 12,
    breakEvenPct,
    breakEvenOver: breakEvenPct !== null && breakEvenPct > 100
  };
}
function validateBusinessImpact(value, path = "landingPage.roiCalculator") {
  const issues = [];
  const fail = (p, message) => issues.push({ path: p, message });
  const record = (v) => !!v && typeof v === "object" && !Array.isArray(v);
  const keys = (v, allowed, p) => Object.keys(v).forEach((k) => {
    if (!allowed.includes(k)) fail(`${p}.${k}`, "Unsupported business-impact field.");
  });
  const text = (v, p, max = 600) => {
    if (typeof v !== "string" || !v.trim() || v.length > max) fail(p, `Use non-empty text up to ${max} characters.`);
  };
  const numberInRange = (n, field, p) => {
    if (typeof n !== "number" || !Number.isFinite(n) || n < IMPACT_FIELDS[field][0] || n > IMPACT_FIELDS[field][1]) fail(p, "Value is outside the supported range.");
  };
  if (!record(value)) return [{ path, message: "Expected a calculator object." }];
  keys(value, ["methodologyVersion", "enabled", "heading", "subheading", "kicker", "disclaimer", "currency", "currencyCopy", "costCopy", "locale", "periodToggle", "inputs", "metrics", "businessImpact", "cta"], path);
  issues.push(...validateRoiCurrencyCopy(value.currencyCopy, `${path}.currencyCopy`));
  issues.push(...validateRoiCostCopy(value.costCopy, `${path}.costCopy`));
  if (value.methodologyVersion !== 2) fail(`${path}.methodologyVersion`, "Supported methodology version is 2.");
  if (value.enabled !== void 0 && typeof value.enabled !== "boolean") fail(`${path}.enabled`, "Expected a boolean.");
  ["heading", "disclaimer"].forEach((k) => text(value[k], `${path}.${k}`));
  ["subheading", "kicker"].forEach((k) => {
    if (value[k] !== void 0) text(value[k], `${path}.${k}`);
  });
  if (typeof value.currency !== "string" || !/^[A-Z]{3}$/.test(value.currency)) fail(`${path}.currency`, "Use an ISO currency code.");
  if (value.locale !== void 0) {
    try {
      if (typeof value.locale !== "string") throw new Error();
      new Intl.Locale(value.locale);
    } catch {
      fail(`${path}.locale`, "Use a valid locale.");
    }
  }
  ["inputs", "metrics"].forEach((k) => {
    if (!Array.isArray(value[k]) || value[k].length) fail(`${path}.${k}`, "Version 2 uses platform calculations; keep this compatibility array empty.");
  });
  if (value.cta !== void 0) {
    if (!record(value.cta)) fail(`${path}.cta`, "Expected CTA copy.");
    else {
      keys(value.cta, ["primaryLabel", "primaryTarget", "secondaryLabel", "secondaryTarget", "privacyNote"], `${path}.cta`);
      text(value.cta.primaryLabel, `${path}.cta.primaryLabel`);
      ["secondaryLabel", "privacyNote"].forEach((k) => {
        if (value.cta && record(value.cta) && value.cta[k] !== void 0) text(value.cta[k], `${path}.cta.${k}`);
      });
      for (const key of ["primaryTarget", ...value.cta.secondaryLabel !== void 0 ? ["secondaryTarget"] : []]) {
        if (typeof value.cta[key] !== "string" || !/^[a-z][a-z-]{0,60}$/.test(value.cta[key])) fail(`${path}.cta.${key}`, "Use a section target, never a URL.");
      }
    }
  }
  const b = value.businessImpact;
  if (!record(b)) return [...issues, { path: `${path}.businessImpact`, message: "Business impact content is required." }];
  const bp = `${path}.businessImpact`;
  keys(b, ["defaults", "fixedAssumptions", "householdCopy", "storeOpsAssumptions", "storeOpsCopy", "copy", "fields", "outcomes", "burden", "opportunity", "usagePackages", "tabs", "hero", "selected", "reviewMode", "costMode", "confirmations", "defaultPackage", "workloadMultiplierField", "pricing", "presentation"], bp);
  const household = b.fixedAssumptions !== void 0;
  const storeOps = b.storeOpsAssumptions !== void 0;
  const estimator = household || storeOps;
  if (household && storeOps) fail(`${bp}.storeOpsAssumptions`, "Use either household or store-ops fixed assumptions, not both.");
  if (!record(b.defaults)) fail(`${bp}.defaults`, "Add workload defaults.");
  else {
    const defaults = b.defaults;
    keys(defaults, Object.keys(IMPACT_FIELDS), `${bp}.defaults`);
    for (const k of ["volume", "minutes", "automation", "review"]) {
      if (defaults[k] !== null) numberInRange(defaults[k], k, `${bp}.defaults.${k}`);
    }
    Object.keys(defaults).forEach((k) => {
      if (IMPACT_FIELDS[k] && !["volume", "minutes", "automation", "review"].includes(k) && !(household && k === "people") && defaults[k] !== null) numberInRange(defaults[k], k, `${bp}.defaults.${k}`);
    });
    if (!household && defaults.people != null && !Number.isInteger(defaults.people)) fail(`${bp}.defaults.people`, "Use a whole number of people.");
  }
  const estimatorDefaults = record(b.defaults) ? b.defaults : {};
  const oneInputPanel = (inputFields, label) => {
    if (!Array.isArray(b.tabs) || b.tabs.length !== 1) return fail(`${bp}.tabs`, "Use exactly one input panel.");
    if (!record(b.tabs[0])) return;
    const tab = b.tabs[0];
    const fields = Array.isArray(tab.fields) ? tab.fields : [];
    const exposed = fields.filter((field) => !inputFields.includes(field));
    if (exposed.length) fail(`${bp}.tabs[0].fields`, `Fixed assumptions, cost and money-comparison fields cannot be public inputs: ${exposed.join(", ")}.`);
    else if (fields.length !== inputFields.length || inputFields.some((field) => !fields.includes(field))) fail(`${bp}.tabs[0].fields`, `Show exactly ${label}.`);
    ["showReview", "showOutcomes", "showPackage"].forEach((flag) => {
      if (tab[flag]) fail(`${bp}.tabs[0].${flag}`, "Estimators show only their input panel.");
    });
  };
  const templatedCopy = (key, english, templates) => {
    const cp = `${bp}.${key}`;
    const copy = b[key];
    if (!record(copy)) return fail(cp, "Add the result copy.");
    keys(copy, Object.keys(english), cp);
    Object.keys(english).forEach((k) => {
      text(copy[k], `${cp}.${k}`);
      if (typeof copy[k] !== "string") return;
      const tokens = templates[k];
      if (tokens && !isCopyTemplate(copy[k], tokens)) fail(`${cp}.${k}`, `Include ${tokens.map((token) => `{${token}}`).join(" and ")} exactly once and no other template fields.`);
      else if (!tokens && /[{}]/.test(copy[k])) fail(`${cp}.${k}`, "Only the result sentences can contain a template field.");
    });
  };
  if (estimator) {
    INTERNAL_COST_FIELDS.forEach((field) => {
      if (estimatorDefaults[field] != null) fail(`${bp}.defaults.${field}`, "Internal cost values cannot be part of a public estimator.");
    });
    if (b.usagePackages !== void 0 || b.defaultPackage !== void 0) fail(`${bp}.usagePackages`, "Usage packages would change the estimator price.");
    if (Array.isArray(b.selected) && b.selected.length) fail(`${bp}.selected`, "Estimators have no money-comparison outcomes.");
  }
  if (household) {
    const fp = `${bp}.fixedAssumptions`;
    const fixed = b.fixedAssumptions;
    const defaults = estimatorDefaults;
    if (!record(fixed)) fail(fp, "Expected fixed assumptions.");
    else {
      keys(fixed, ["offloadRate", "reviewMinutes", "foodWastePerPersonYear", "foodWasteSource", "userEditable"], fp);
      const { offloadRate, reviewMinutes, foodWastePerPersonYear } = fixed;
      if (!finiteNumber(offloadRate) || offloadRate <= 0 || offloadRate > 1) fail(`${fp}.offloadRate`, "Use a share above 0 and at most 1 (0.5 means 50%).");
      else if (defaults.automation !== Math.round(offloadRate * 1e4) / 100) fail(`${bp}.defaults.automation`, "Keep automation equal to the fixed offload rate as a percentage.");
      numberInRange(reviewMinutes, "review", `${fp}.reviewMinutes`);
      if (finiteNumber(reviewMinutes) && defaults.review !== reviewMinutes) fail(`${bp}.defaults.review`, "Keep review equal to the fixed review minutes.");
      if (!finiteNumber(foodWastePerPersonYear) || foodWastePerPersonYear < 0 || foodWastePerPersonYear > 1e5) fail(`${fp}.foodWastePerPersonYear`, "Use a non-negative yearly amount per person.");
      text(fixed.foodWasteSource, `${fp}.foodWasteSource`);
      if (fixed.userEditable !== false) fail(`${fp}.userEditable`, "Set userEditable to false. Visitors can never change fixed assumptions.");
    }
    const { people, customer_price: price } = defaults;
    if (!finiteNumber(people) || !Number.isInteger(people) || people < 1 || people > 8) fail(`${bp}.defaults.people`, "Use a whole household size from 1 to 8.");
    ["volume", "minutes"].forEach((k) => {
      if (defaults[k] == null) fail(`${bp}.defaults.${k}`, "Add a starting value.");
    });
    if (!finiteNumber(price) || price < 0) fail(`${bp}.defaults.customer_price`, "Add the fixed monthly price.");
    if (!record(b.pricing) || b.pricing.basis !== "fixed") fail(`${bp}.pricing.basis`, "Household estimates use a fixed price that no input can change.");
    else {
      if (!finiteNumber(b.pricing.annualPrice) || b.pricing.annualPrice < 0) fail(`${bp}.pricing.annualPrice`, "Add the fixed annual price.");
      if (b.pricing.minimumMargin !== void 0) fail(`${bp}.pricing.minimumMargin`, "Fixed household pricing has no usage margin.");
    }
    oneInputPanel(HOUSEHOLD_INPUT_FIELDS, "sessions, minutes and people");
    templatedCopy("householdCopy", HOUSEHOLD_COPY, HOUSEHOLD_COPY_TEMPLATES);
  } else if (b.householdCopy !== void 0) fail(`${bp}.householdCopy`, "Household copy requires fixed assumptions.");
  if (storeOps) {
    const sp = `${bp}.storeOpsAssumptions`;
    const fixed = b.storeOpsAssumptions;
    const defaults = estimatorDefaults;
    if (!record(fixed)) fail(sp, "Expected store-ops fixed assumptions.");
    else {
      keys(fixed, ["shareHandled", "reviewMinutesPerStoreCycle", "lossRate", "lossRateSource", "userEditable"], sp);
      const { shareHandled, reviewMinutesPerStoreCycle, lossRate } = fixed;
      if (!finiteNumber(shareHandled) || shareHandled <= 0 || shareHandled > 1) fail(`${sp}.shareHandled`, "Use a share above 0 and at most 1 (0.5 means 50%).");
      else if (defaults.automation !== Math.round(shareHandled * 1e4) / 100) fail(`${bp}.defaults.automation`, "Keep automation equal to the fixed share handled as a percentage.");
      numberInRange(reviewMinutesPerStoreCycle, "review", `${sp}.reviewMinutesPerStoreCycle`);
      if (finiteNumber(reviewMinutesPerStoreCycle) && defaults.review !== reviewMinutesPerStoreCycle) fail(`${bp}.defaults.review`, "Keep review equal to the fixed review minutes per store cycle.");
      if (!finiteNumber(lossRate) || lossRate <= 0 || lossRate >= 1) fail(`${sp}.lossRate`, "Use a share above 0 and below 1 (0.0121 means 1.21%).");
      text(fixed.lossRateSource, `${sp}.lossRateSource`);
      if (fixed.userEditable !== false) fail(`${sp}.userEditable`, "Set userEditable to false. Visitors can never change fixed assumptions.");
    }
    const { volume: stores, customer_price: price } = defaults;
    if (!finiteNumber(stores) || !Number.isInteger(stores) || stores < 1) fail(`${bp}.defaults.volume`, "Use a whole number of stores, at least 1.");
    ["cycles_per_unit", "minutes", "purchases_per_store"].forEach((k) => {
      if (defaults[k] == null) fail(`${bp}.defaults.${k}`, "Add a starting value.");
    });
    if (!finiteNumber(price) || price < 0) fail(`${bp}.defaults.customer_price`, "Add the fixed price per store per month.");
    if (!record(b.pricing) || b.pricing.basis !== "per_volume") fail(`${bp}.pricing.basis`, "Store-ops estimates price per store; only the store count changes the price.");
    else {
      if (b.pricing.annualPrice !== void 0) fail(`${bp}.pricing.annualPrice`, "The yearly price is the monthly price \xD7 12.");
      if (b.pricing.minimumMargin !== void 0) fail(`${bp}.pricing.minimumMargin`, "Store-ops pricing has no usage margin.");
    }
    oneInputPanel(STORE_OPS_INPUT_FIELDS, "stores, cycles per store, preparation minutes and food purchases per store");
    templatedCopy("storeOpsCopy", STORE_OPS_COPY, STORE_OPS_COPY_TEMPLATES);
  } else if (b.storeOpsCopy !== void 0) fail(`${bp}.storeOpsCopy`, "Store-ops copy requires store-ops fixed assumptions.");
  if (!record(b.copy)) fail(`${bp}.copy`, "Localized interface copy is required.");
  else {
    const copy = b.copy;
    keys(copy, Object.keys(IMPACT_COPY), `${bp}.copy`);
    const required = household ? [...HOUSEHOLD_IMPACT_COPY_KEYS] : storeOps ? [...STORE_OPS_IMPACT_COPY_KEYS] : Object.keys(IMPACT_COPY);
    Object.keys(IMPACT_COPY).forEach((k) => {
      if (required.includes(k) || copy[k] !== void 0) text(copy[k], `${bp}.copy.${k}`);
    });
  }
  if (!record(b.fields)) fail(`${bp}.fields`, "Authored input labels and help are required.");
  else {
    keys(b.fields, Object.keys(IMPACT_FIELDS), `${bp}.fields`);
    for (const k of Object.keys(b.fields)) {
      const f = b.fields[k];
      if (!IMPACT_FIELDS[k]) fail(`${bp}.fields.${k}`, "Use a supported input field.");
      else if (!record(f)) fail(`${bp}.fields.${k}`, "Add label and help.");
      else {
        keys(f, ["label", "help"], `${bp}.fields.${k}`);
        text(f.label, `${bp}.fields.${k}.label`, 160);
        text(f.help, `${bp}.fields.${k}.help`);
      }
    }
  }
  const seen = /* @__PURE__ */ new Set();
  if (!Array.isArray(b.outcomes) || b.outcomes.length > 7 || !b.outcomes.length && !estimator) fail(`${bp}.outcomes`, "Use one to seven supported outcomes.");
  else b.outcomes.forEach((o, i) => {
    if (!record(o)) return fail(`${bp}.outcomes[${i}]`, "Expected an outcome.");
    keys(o, ["id", "label", "help"], `${bp}.outcomes[${i}]`);
    if (!IMPACT_OUTCOMES.includes(o.id) || seen.has(o.id)) fail(`${bp}.outcomes[${i}].id`, "Use a unique supported outcome.");
    seen.add(o.id);
    text(o.label, `${bp}.outcomes[${i}].label`, 160);
    text(o.help, `${bp}.outcomes[${i}].help`);
  });
  ["burden", "opportunity"].forEach((k) => {
    const list = b[k];
    if (!Array.isArray(list) || !list.length || list.length > 4) fail(`${bp}.${k}`, "Use one to four concise examples.");
    else list.forEach((v, i) => text(v, `${bp}.${k}[${i}]`, 240));
  });
  if (b.selected !== void 0) {
    if (!Array.isArray(b.selected) || b.selected.some((id) => !seen.has(id))) fail(`${bp}.selected`, "Preselected outcomes must be included in outcomes.");
  }
  if (b.reviewMode !== void 0 && b.reviewMode !== "team" && b.reviewMode !== "paid") fail(`${bp}.reviewMode`, "Use team or paid review.");
  if (b.costMode !== void 0 && b.costMode !== "total" && b.costMode !== "itemized") fail(`${bp}.costMode`, "Use total or itemized cost.");
  if (b.defaultPackage !== void 0 && b.defaultPackage !== "base" && b.defaultPackage !== "medium") fail(`${bp}.defaultPackage`, "Use base or medium.");
  if (b.confirmations !== void 0) {
    if (!record(b.confirmations)) fail(`${bp}.confirmations`, "Expected confirmation flags.");
    else {
      keys(b.confirmations, ["overlap", "hiring", "outcomes", "hide"], `${bp}.confirmations`);
      for (const key of ["overlap", "hiring", "outcomes", "hide"]) {
        if (b.confirmations[key] !== void 0 && typeof b.confirmations[key] !== "boolean") fail(`${bp}.confirmations.${key}`, "Expected a boolean.");
      }
    }
  }
  if (b.hero !== void 0) {
    if (!record(b.hero)) fail(`${bp}.hero`, "Expected a hero metric.");
    else {
      keys(b.hero, ["kind", "label"], `${bp}.hero`);
      if (b.hero.kind !== "volume" && b.hero.kind !== "capacity" && b.hero.kind !== "money") fail(`${bp}.hero.kind`, "Use volume, capacity or money.");
      text(b.hero.label, `${bp}.hero.label`, 160);
    }
  }
  if (b.tabs !== void 0) {
    if (!Array.isArray(b.tabs) || !b.tabs.length || b.tabs.length > 4) fail(`${bp}.tabs`, "Use one to four tabs.");
    else b.tabs.forEach((tab, i) => {
      if (!record(tab)) return fail(`${bp}.tabs[${i}]`, "Expected a tab.");
      keys(tab, ["id", "label", "intro", "fields", "showReview", "showOutcomes", "showPackage"], `${bp}.tabs[${i}]`);
      if (typeof tab.id !== "string" || !/^[a-z][a-z0-9-]{0,40}$/.test(tab.id)) fail(`${bp}.tabs[${i}].id`, "Use a compact tab id.");
      text(tab.label, `${bp}.tabs[${i}].label`, 80);
      text(tab.intro, `${bp}.tabs[${i}].intro`);
      if (!Array.isArray(tab.fields) || tab.fields.some((field) => !IMPACT_FIELDS[field])) fail(`${bp}.tabs[${i}].fields`, "Use supported input fields.");
      for (const flag of ["showReview", "showOutcomes", "showPackage"]) {
        if (tab[flag] !== void 0 && typeof tab[flag] !== "boolean") fail(`${bp}.tabs[${i}].${flag}`, "Expected a boolean.");
      }
    });
  }
  if (b.usagePackages !== void 0) {
    if (!record(b.usagePackages)) fail(`${bp}.usagePackages`, "Expected base and medium packages.");
    else {
      keys(b.usagePackages, ["base", "medium"], `${bp}.usagePackages`);
      for (const name of ["base", "medium"]) {
        const pack = b.usagePackages[name];
        const pp = `${bp}.usagePackages.${name}`;
        if (!record(pack)) fail(pp, "Expected a usage package.");
        else {
          keys(pack, ["volume", "tokensPerOutput", "platform_cost", ...PACKAGE_VALUE_KEYS], pp);
          numberInRange(pack.volume, "volume", `${pp}.volume`);
          numberInRange(pack.tokensPerOutput, "tokens_per_output", `${pp}.tokensPerOutput`);
          numberInRange(pack.platform_cost, "platform_cost", `${pp}.platform_cost`);
          for (const key of PACKAGE_VALUE_KEYS) {
            if (pack[key] !== void 0) numberInRange(pack[key], key, `${pp}.${key}`);
          }
        }
      }
    }
  }
  if (b.workloadMultiplierField !== void 0 && b.workloadMultiplierField !== "cycles_per_unit") fail(`${bp}.workloadMultiplierField`, "Use cycles_per_unit when configuring recurring workload cycles.");
  if (b.pricing !== void 0) {
    if (!record(b.pricing)) fail(`${bp}.pricing`, "Expected pricing metadata.");
    else {
      keys(b.pricing, ["basis", "annualPrice", "minimumMargin", "label", "help"], `${bp}.pricing`);
      if (!["fixed", "per_volume", "usage", "tiered"].includes(b.pricing.basis)) fail(`${bp}.pricing.basis`, "Use fixed, per_volume, usage or tiered.");
      text(b.pricing.label, `${bp}.pricing.label`, 160);
      text(b.pricing.help, `${bp}.pricing.help`);
      if (b.pricing.annualPrice !== void 0) numberInRange(b.pricing.annualPrice, "customer_price", `${bp}.pricing.annualPrice`);
      if (b.pricing.basis === "usage" || b.pricing.minimumMargin !== void 0) {
        if (typeof b.pricing.minimumMargin !== "number" || !Number.isFinite(b.pricing.minimumMargin) || b.pricing.minimumMargin < 0 || b.pricing.minimumMargin >= 1) fail(`${bp}.pricing.minimumMargin`, "Use a margin from 0 (inclusive) to 1 (exclusive).");
      }
    }
  }
  if (b.presentation !== void 0) {
    if (!record(b.presentation)) fail(`${bp}.presentation`, "Expected presentation metadata.");
    else {
      keys(b.presentation, ["financial", "showCustomerEconomics", "hideEconomicMultiple", "costFocus", "showTokenUsage", "showInternalCost"], `${bp}.presentation`);
      if (!["capacity_only", "optional", "required"].includes(b.presentation.financial)) fail(`${bp}.presentation.financial`, "Use capacity_only, optional or required.");
      if (b.presentation.showCustomerEconomics !== void 0 && typeof b.presentation.showCustomerEconomics !== "boolean") fail(`${bp}.presentation.showCustomerEconomics`, "Expected a boolean.");
      if (b.presentation.hideEconomicMultiple !== void 0 && typeof b.presentation.hideEconomicMultiple !== "boolean") fail(`${bp}.presentation.hideEconomicMultiple`, "Expected a boolean.");
      if (b.presentation.costFocus !== void 0 && !["delivery", "customer"].includes(b.presentation.costFocus)) fail(`${bp}.presentation.costFocus`, "Use delivery or customer.");
      if (b.presentation.showTokenUsage !== void 0 && typeof b.presentation.showTokenUsage !== "boolean") fail(`${bp}.presentation.showTokenUsage`, "Expected a boolean.");
      if (b.presentation.showInternalCost !== void 0 && typeof b.presentation.showInternalCost !== "boolean") fail(`${bp}.presentation.showInternalCost`, "Expected a boolean.");
    }
  }
  return issues;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ESTIMATOR_COPY_TEMPLATES,
  FOOD_WASTE_PER_PERSON_YEAR_DEFAULT,
  FOOD_WASTE_SOURCE_DEFAULT,
  HOUSEHOLD_COPY,
  HOUSEHOLD_COPY_TEMPLATES,
  HOUSEHOLD_IMPACT_COPY_KEYS,
  HOUSEHOLD_INPUT_FIELDS,
  HOUSEHOLD_PEOPLE_DEFAULT,
  IMPACT_ALLOCATION_FIELDS,
  IMPACT_COPY,
  IMPACT_FIELDS,
  IMPACT_MONEY_FIELDS,
  IMPACT_OUTCOMES,
  IMPACT_OUTCOME_FIELDS,
  IMPACT_TOKEN_FIELDS,
  INTERNAL_COST_FIELDS,
  LOSS_RATE,
  LOSS_RATE_SOURCE_DEFAULT,
  OFFLOAD_RATE_DEFAULT,
  PRICE_PER_STORE,
  REVIEW_MINUTES_DEFAULT,
  REVIEW_MIN_PER_STORE_CYCLE,
  ROI_COST_COPY,
  ROI_CURRENCY_COPY,
  ROI_CURRENCY_NEUTRAL_COPY,
  SHARE_HANDLED,
  STORE_OPS_COPY,
  STORE_OPS_COPY_TEMPLATES,
  STORE_OPS_IMPACT_COPY_KEYS,
  STORE_OPS_INPUT_FIELDS,
  STORE_OPS_STARTING_VALUES,
  TOKEN_ECONOMICS,
  defaultImpactTabs,
  evaluateBusinessImpact,
  evaluateHouseholdEstimate,
  evaluateStoreOpsEstimate,
  householdStartingValues,
  initialImpactState,
  isCopyTemplate,
  matchUsagePackage,
  netCapacityHours,
  resolveHouseholdAssumptions,
  resolveImpactTabs,
  resolveStoreOpsAssumptions,
  storeOpsStartingValues,
  tokenCostFromUsage,
  validateBusinessImpact,
  validateRoiCostCopy,
  validateRoiCurrencyCopy,
  valuesFromUsagePackage
});
