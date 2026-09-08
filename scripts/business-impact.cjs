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
  IMPACT_ALLOCATION_FIELDS: () => IMPACT_ALLOCATION_FIELDS,
  IMPACT_COPY: () => IMPACT_COPY,
  IMPACT_FIELDS: () => IMPACT_FIELDS,
  IMPACT_MONEY_FIELDS: () => IMPACT_MONEY_FIELDS,
  IMPACT_OUTCOMES: () => IMPACT_OUTCOMES,
  IMPACT_OUTCOME_FIELDS: () => IMPACT_OUTCOME_FIELDS,
  IMPACT_TOKEN_FIELDS: () => IMPACT_TOKEN_FIELDS,
  ROI_COST_COPY: () => ROI_COST_COPY,
  ROI_CURRENCY_COPY: () => ROI_CURRENCY_COPY,
  ROI_CURRENCY_NEUTRAL_COPY: () => ROI_CURRENCY_NEUTRAL_COPY,
  TOKEN_ECONOMICS: () => TOKEN_ECONOMICS,
  defaultImpactTabs: () => defaultImpactTabs,
  evaluateBusinessImpact: () => evaluateBusinessImpact,
  initialImpactState: () => initialImpactState,
  matchUsagePackage: () => matchUsagePackage,
  netCapacityHours: () => netCapacityHours,
  resolveImpactTabs: () => resolveImpactTabs,
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
  minutes: [0, 1e4, 1],
  automation: [0, 100, 1],
  review: [0, 1e4, 1],
  tokens_per_output: [0, 1e7, 100],
  budget: [0, 1e8, 1],
  model_cost: [0, 1e8, 1],
  tools_cost: [0, 1e8, 1],
  infrastructure_cost: [0, 1e8, 1],
  platform_cost: [0, 1e8, 1],
  review_rate: [0, 1e4, 1],
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
var IMPACT_MONEY_FIELDS = ["budget", "model_cost", "tools_cost", "infrastructure_cost", "platform_cost", "review_rate", "cash_baseline", "cash_avoided", "contribution_rate", "unit_margin", "hire_cost", "incident_cost", "loss"];
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
var PACKAGE_VALUE_KEYS = ["minutes", "automation", "review", "model_cost", "tools_cost", "infrastructure_cost", "higher_value_hours", "contribution_rate", "cash_hours", "cash_baseline", "cash_avoided", "incidents", "incident_cost", "probability_before", "probability_after", "loss"];
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
    usagePackage: packageId === "custom" ? "custom" : packageId
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
  selected.forEach((id) => IMPACT_OUTCOME_FIELDS[id]?.forEach((k) => used.add(k)));
  const grossHours = n("volume") * n("minutes") / 60 * n("automation") / 100;
  const reviewHours = n("volume") * n("review") / 60;
  const capacity = Math.max(0, grossHours - (state.reviewMode === "team" ? reviewHours : 0));
  if (state.reviewMode === "team" && reviewHours > grossHours) errors.push("reviewError");
  const allocated = selected.reduce((sum, id) => sum + (IMPACT_ALLOCATION_FIELDS.includes(`${id}_hours`) ? n(`${id}_hours`) : 0), 0);
  if (allocated > capacity + 1e-6) errors.push("allocationError");
  const costFields = state.costMode === "total" ? ["budget"] : usesTokens ? ["tokens_per_output", "model_cost", "tools_cost", "infrastructure_cost", "platform_cost", ...state.reviewMode === "paid" ? ["review_rate"] : []] : ["model_cost", "tools_cost", "infrastructure_cost", "platform_cost", ...state.reviewMode === "paid" ? ["review_rate"] : []];
  costFields.forEach((k) => used.add(k));
  if ([...used].some((k) => v[k] != null && !has(k))) errors.push("boundsError");
  const workloadReady = has("volume", "minutes", "automation", "review");
  const costReady = has(...costFields) && (state.costMode !== "itemized" || state.reviewMode !== "paid" || has("volume", "review"));
  const reviewCost = state.reviewMode === "paid" ? reviewHours * n("review_rate") : 0;
  const monthlyTokens = usesTokens ? n("volume") * n("tokens_per_output") : 0;
  const tokenCost = usesTokens ? tokenCostFromUsage({ volume: n("volume"), tokensPerOutput: n("tokens_per_output") }) : 0;
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
  const annualValue = (economicValue - hire) * 12 + hire * n("hire_months");
  return {
    volume: n("volume"),
    grossHours,
    reviewHours,
    reviewCost,
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
    tokenCost,
    monthlyTokens,
    economicValue,
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
  keys(value, ["methodologyVersion", "enabled", "heading", "subheading", "kicker", "disclaimer", "currency", "currencyCopy", "costCopy", "locale", "inputs", "metrics", "businessImpact", "cta"], path);
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
  keys(b, ["defaults", "copy", "fields", "outcomes", "burden", "opportunity", "usagePackages", "tabs", "hero", "selected", "reviewMode", "costMode", "confirmations", "defaultPackage"], bp);
  if (!record(b.defaults)) fail(`${bp}.defaults`, "Add workload defaults.");
  else {
    keys(b.defaults, Object.keys(IMPACT_FIELDS), `${bp}.defaults`);
    for (const k of ["volume", "minutes", "automation", "review"]) numberInRange(b.defaults[k], k, `${bp}.defaults.${k}`);
    Object.keys(b.defaults).forEach((k) => {
      if (IMPACT_FIELDS[k] && !["volume", "minutes", "automation", "review"].includes(k)) numberInRange(b.defaults[k], k, `${bp}.defaults.${k}`);
    });
  }
  if (!record(b.copy)) fail(`${bp}.copy`, "Localized interface copy is required.");
  else {
    keys(b.copy, Object.keys(IMPACT_COPY), `${bp}.copy`);
    Object.keys(IMPACT_COPY).forEach((k) => text(b.copy[k], `${bp}.copy.${k}`));
  }
  if (!record(b.fields)) fail(`${bp}.fields`, "Authored input labels and help are required.");
  else {
    keys(b.fields, Object.keys(IMPACT_FIELDS), `${bp}.fields`);
    Object.keys(IMPACT_FIELDS).forEach((k) => {
      const f = b.fields[k];
      if (!record(f)) fail(`${bp}.fields.${k}`, "Add label and help.");
      else {
        keys(f, ["label", "help"], `${bp}.fields.${k}`);
        text(f.label, `${bp}.fields.${k}.label`, 160);
        text(f.help, `${bp}.fields.${k}.help`);
      }
    });
  }
  const seen = /* @__PURE__ */ new Set();
  if (!Array.isArray(b.outcomes) || b.outcomes.length > 7 || !b.outcomes.length) fail(`${bp}.outcomes`, "Use one to seven supported outcomes.");
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
  return issues;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IMPACT_ALLOCATION_FIELDS,
  IMPACT_COPY,
  IMPACT_FIELDS,
  IMPACT_MONEY_FIELDS,
  IMPACT_OUTCOMES,
  IMPACT_OUTCOME_FIELDS,
  IMPACT_TOKEN_FIELDS,
  ROI_COST_COPY,
  ROI_CURRENCY_COPY,
  ROI_CURRENCY_NEUTRAL_COPY,
  TOKEN_ECONOMICS,
  defaultImpactTabs,
  evaluateBusinessImpact,
  initialImpactState,
  matchUsagePackage,
  netCapacityHours,
  resolveImpactTabs,
  tokenCostFromUsage,
  validateBusinessImpact,
  validateRoiCostCopy,
  validateRoiCurrencyCopy,
  valuesFromUsagePackage
});
