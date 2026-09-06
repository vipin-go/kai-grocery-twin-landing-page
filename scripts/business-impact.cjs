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
  IMPACT_OUTCOMES: () => IMPACT_OUTCOMES,
  IMPACT_OUTCOME_FIELDS: () => IMPACT_OUTCOME_FIELDS,
  evaluateBusinessImpact: () => evaluateBusinessImpact,
  initialImpactState: () => initialImpactState,
  validateBusinessImpact: () => validateBusinessImpact
});
module.exports = __toCommonJS(business_impact_exports);
var IMPACT_OUTCOMES = ["cash", "higher_value", "throughput", "hiring", "error", "risk", "cycle_time"];
var IMPACT_FIELDS = {
  volume: [0, 1e6, 1],
  minutes: [0, 1e4, 1],
  automation: [0, 100, 1],
  review: [0, 1e4, 1],
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
function initialImpactState(config) {
  return { values: { ...config.defaults }, selected: [], reviewMode: "team", costMode: "total", overlapConfirmed: false, hiringConfirmed: false, outcomesReviewed: false };
}
function evaluateBusinessImpact(state) {
  const { values: v } = state;
  const selected = [...new Set(state.selected)].filter((id) => IMPACT_OUTCOMES.includes(id));
  const has = (...keys) => keys.every((k) => typeof v[k] === "number" && Number.isFinite(v[k]) && v[k] >= IMPACT_FIELDS[k][0] && v[k] <= IMPACT_FIELDS[k][1]);
  const n = (k) => has(k) ? v[k] : 0;
  const errors = [];
  const used = /* @__PURE__ */ new Set(["volume", "minutes", "automation", "review"]);
  selected.forEach((id) => IMPACT_OUTCOME_FIELDS[id]?.forEach((k) => used.add(k)));
  const grossHours = n("volume") * n("minutes") / 60 * n("automation") / 100;
  const reviewHours = n("volume") * n("review") / 60;
  const capacity = Math.max(0, grossHours - (state.reviewMode === "team" ? reviewHours : 0));
  if (state.reviewMode === "team" && reviewHours > grossHours) errors.push("reviewError");
  const allocated = selected.reduce((sum, id) => sum + (IMPACT_ALLOCATION_FIELDS.includes(`${id}_hours`) ? n(`${id}_hours`) : 0), 0);
  if (allocated > capacity + 1e-6) errors.push("allocationError");
  const costFields = state.costMode === "total" ? ["budget"] : ["model_cost", "tools_cost", "infrastructure_cost", "platform_cost", ...state.reviewMode === "paid" ? ["review_rate"] : []];
  costFields.forEach((k) => used.add(k));
  if ([...used].some((k) => v[k] != null && !has(k))) errors.push("boundsError");
  const workloadReady = has("volume", "minutes", "automation", "review");
  const costReady = has(...costFields) && (state.costMode !== "itemized" || state.reviewMode !== "paid" || has("volume", "review"));
  const reviewCost = state.reviewMode === "paid" ? reviewHours * n("review_rate") : 0;
  const cost = state.costMode === "total" ? n("budget") : n("model_cost") + n("tools_cost") + n("infrastructure_cost") + n("platform_cost") + reviewCost;
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
  if (!record(value)) return [{ path, message: "Expected a calculator object." }];
  keys(value, ["methodologyVersion", "enabled", "heading", "subheading", "kicker", "disclaimer", "currency", "locale", "inputs", "metrics", "businessImpact", "cta"], path);
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
  keys(b, ["defaults", "copy", "fields", "outcomes", "burden", "opportunity"], bp);
  if (!record(b.defaults)) fail(`${bp}.defaults`, "Add four workload defaults.");
  else {
    keys(b.defaults, ["volume", "minutes", "automation", "review"], `${bp}.defaults`);
    for (const k of ["volume", "minutes", "automation", "review"]) {
      const n = b.defaults[k];
      if (typeof n !== "number" || !Number.isFinite(n) || n < IMPACT_FIELDS[k][0] || n > IMPACT_FIELDS[k][1]) fail(`${bp}.defaults.${k}`, "Workload default is outside the supported range.");
    }
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
  return issues;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IMPACT_ALLOCATION_FIELDS,
  IMPACT_COPY,
  IMPACT_FIELDS,
  IMPACT_OUTCOMES,
  IMPACT_OUTCOME_FIELDS,
  evaluateBusinessImpact,
  initialImpactState,
  validateBusinessImpact
});
