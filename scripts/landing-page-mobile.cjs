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

// shared/landing-page-mobile.ts
var landing_page_mobile_exports = {};
__export(landing_page_mobile_exports, {
  applyLandingMobileContent: () => applyLandingMobileContent,
  mobileCopyPathAllowed: () => mobileCopyPathAllowed,
  resolveLandingMobilePatch: () => resolveLandingMobilePatch,
  validateLandingMobileContent: () => validateLandingMobileContent
});
module.exports = __toCommonJS(landing_page_mobile_exports);
var record = (v) => !!v && typeof v === "object" && !Array.isArray(v);
var locked = /* @__PURE__ */ new Set(["__proto__", "accent", "accentColor", "actionId", "activeMode", "actor", "aspectRatio", "availability", "benefitMetricId", "brandMark", "capabilityPreview", "command", "commandId", "commandTrigger", "constructor", "costMetricId", "costMode", "countryCodes", "currency", "defaultLanguage", "defaultPackage", "defaultPeriod", "defaultScenarioId", "defaultThemeMode", "defaultValue", "design", "enabled", "family", "fieldKey", "fields", "financial", "format", "formula", "group", "icon", "id", "key", "kind", "layer", "layout", "locale", "localization", "max", "min", "mode", "months", "multiplier", "palette", "percentage", "periodToggle", "platform", "presetRevision", "primaryColor", "primaryTarget", "productivity", "profile", "profileIcon", "prototype", "resourceKey", "reviewMode", "role", "scalesWithPeriod", "scalesWithScenario", "secondaryColor", "secondaryTarget", "sectionId", "selected", "slug", "source", "sourceLanguage", "state", "status", "step", "target", "tone", "trackId", "trigger", "type", "valueClass", "variant", "visualKind", "wordmark", "workflowId"]);
var linkKey = /(?:url|href|image|video|poster|email|path|token|credential|provider|prompt|execution|approval|required|permission|binding|endpoint|color)$/i;
var url = /^(?:https?:|mailto:|tel:|\/|#)/i;
function at(page, path) {
  return path.split(".").reduce((value, key) => value != null && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : void 0, page);
}
function mobileCopyPathAllowed(page, path) {
  const parts = path.split(".");
  return parts.length <= 24 && parts.every((key) => /^[\w-]+$/.test(key) && !locked.has(key) && !linkKey.test(key)) && typeof at(page, path) === "string" && !url.test(at(page, path));
}
function validateLandingMobileContent(value, page) {
  const issues = [];
  const fail = (path, message) => issues.push({ path: `landingPage.localization.mobile${path}`, message });
  const language = /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
  if (!record(value)) {
    fail("", "Provide a mobile content object.");
    return issues;
  }
  if (typeof value.enabled !== "boolean") fail(".enabled", "Enable or disable mobile content explicitly.");
  if (JSON.stringify(value).length > 128e3) fail("", "Keep mobile overrides below 128 KB.");
  function patch(v, path, extra = []) {
    if (!record(v)) {
      fail(path, "Use a partial mobile copy object.");
      return;
    }
    for (const key of Object.keys(v)) if (!["copyOverrides", "chatWidget", ...extra].includes(key)) fail(`${path}.${key}`, "Only display copy and compact chat presentation are supported.");
    if (v.sourceLanguage !== void 0 && !language.test(v.sourceLanguage)) fail(`${path}.sourceLanguage`, "Use a BCP-47 source language.");
    if (v.copyOverrides !== void 0) {
      if (!record(v.copyOverrides) || Object.keys(v.copyOverrides).length > 250) fail(`${path}.copyOverrides`, "Use at most 250 existing copy paths.");
      else for (const [key, text] of Object.entries(v.copyOverrides)) if (!mobileCopyPathAllowed(page, key) || typeof text !== "string" || !text.trim() || text.length > 4e3 || url.test(text)) fail(`${path}.copyOverrides.${key}`, "Override an existing human-facing string, preserving runtime fields and links.");
    }
    if (v.chatWidget !== void 0) {
      if (!record(v.chatWidget) || Object.keys(v.chatWidget).some((key) => !["layout", "disclaimer"].includes(key))) fail(`${path}.chatWidget`, "Only compact layout and disclaimer copy are supported.");
      else {
        if (v.chatWidget.layout !== void 0 && v.chatWidget.layout !== "compact") fail(`${path}.chatWidget.layout`, "Use the compact mobile chat layout.");
        if (v.chatWidget.disclaimer !== void 0 && (typeof v.chatWidget.disclaimer !== "string" || !v.chatWidget.disclaimer.trim() || v.chatWidget.disclaimer.length > 500)) fail(`${path}.chatWidget.disclaimer`, "Use a short, nonempty safety notice (up to 500 characters).");
      }
    }
  }
  function translations(v, path) {
    if (v === void 0) return;
    if (!record(v) || Object.keys(v).length > 100) {
      fail(path, "Use a bounded map of language patches.");
      return;
    }
    for (const [lang, p] of Object.entries(v)) {
      if (!language.test(lang)) fail(`${path}.${lang}`, "Use a BCP-47 language key.");
      patch(p, `${path}.${lang}`);
    }
  }
  patch(value, "", ["enabled", "sourceLanguage", "translations", "countries"]);
  translations(value.translations, ".translations");
  if (value.countries !== void 0) {
    if (!record(value.countries) || Object.keys(value.countries).length > 250) fail(".countries", "Use a bounded ISO-country map.");
    else for (const [country, p] of Object.entries(value.countries)) {
      if (!/^[A-Z]{2}$/.test(country)) fail(`.countries.${country}`, "Use an uppercase ISO country code.");
      patch(p, `.countries.${country}`, ["sourceLanguage", "translations"]);
      if (record(p)) translations(p.translations, `.countries.${country}.translations`);
    }
  }
  return issues;
}
function translated(patches, language) {
  const keys = Object.keys(patches || {});
  const family = keys.find((key) => key.toLowerCase() === language.split("-")[0]);
  const exact = keys.find((key) => key.toLowerCase() === language);
  const base = family ? patches == null ? void 0 : patches[family] : void 0;
  const specific = exact ? patches == null ? void 0 : patches[exact] : void 0;
  if (!base) return specific;
  if (!specific) return base;
  return { copyOverrides: { ...base.copyOverrides, ...specific.copyOverrides }, chatWidget: { ...base.chatWidget, ...specific.chatWidget } };
}
function resolveLandingMobilePatch(config, { language = "en", countryCode, sourceLanguage = "en" } = {}) {
  var _a, _b;
  if (!(config == null ? void 0 : config.enabled)) return {};
  const selected = (language || sourceLanguage).toLowerCase();
  const same = (source) => selected === source.toLowerCase() || selected.split("-")[0] === source.toLowerCase();
  let result = { chatWidget: ((_a = config.chatWidget) == null ? void 0 : _a.layout) ? { layout: config.chatWidget.layout } : void 0 };
  const merge = (patch) => {
    if (!patch) return;
    result = { copyOverrides: { ...result.copyOverrides, ...patch.copyOverrides }, chatWidget: { ...result.chatWidget, ...patch.chatWidget } };
  };
  if (same(config.sourceLanguage || sourceLanguage)) merge(config);
  merge(translated(config.translations, selected));
  const country = (_b = config.countries) == null ? void 0 : _b[(countryCode || "").toUpperCase()];
  if (country) {
    if (same(country.sourceLanguage || config.sourceLanguage || sourceLanguage)) merge(country);
    merge(translated(country.translations, selected));
  }
  return result;
}
function applyLandingMobileContent(page, config, options) {
  if (!record(page) || !(config == null ? void 0 : config.enabled)) return page;
  const patch = resolveLandingMobilePatch(config, options);
  const clone = JSON.parse(JSON.stringify(page));
  if (options.isMobile) for (const [path, text] of Object.entries(patch.copyOverrides || {})) {
    if (!mobileCopyPathAllowed(clone, path) || typeof text !== "string" || !text.trim() || text.length > 4e3 || url.test(text)) continue;
    const keys = path.split(".");
    const last = keys.pop();
    let target = clone;
    for (const key of keys) target = target[key];
    target[last] = text;
  }
  clone.localization = { ...clone.localization, mobile: { enabled: true, sourceLanguage: options.language || config.sourceLanguage || options.sourceLanguage || "en", chatWidget: patch.chatWidget } };
  return clone;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  applyLandingMobileContent,
  mobileCopyPathAllowed,
  resolveLandingMobilePatch,
  validateLandingMobileContent
});
