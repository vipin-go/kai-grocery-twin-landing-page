#!/usr/bin/env node
const fs = require('fs');
const nodePath = require('path');

const ALLOWED_ICONS = new Set([
  'heart', 'shield-check', 'sparkles', 'chat', 'users', 'lock', 'check', 'star',
  'search', 'lightbulb', 'user-plus', 'calendar', 'question-mark', 'envelope',
]);
const ALLOWED_ROLES = new Set(['user', 'assistant']);
const ALLOWED_DESIGN_VARIANTS = new Set(['default', 'signature', 'banking', 'form-operations', 'logistics-portal', 'cinematic-campaigns', 'recruiting-operations', 'grocery-twin', 'event-introductions', 'home-introductions']);
const ALLOWED_BRAND_MARKS = new Set(['heart', 'image', 'initial']);
const ALLOWED_NAV_TARGETS = new Set([
  'meet', 'about', 'capabilities', 'use-cases', 'trust',
  'how-it-works', 'stories', 'faq', 'contact',
]);
const GROCERY_TARGETS = new Set(['top', 'product', 'mobile', 'stories', 'features', 'about', 'contact', 'hero-chat']);
const EVENT_INTRODUCTION_TARGETS = new Set(['top', 'about', 'how-it-works', 'pairings', 'faqs', 'waitlist', 'closing', 'hero-chat']);
const HOME_INTRODUCTION_TARGETS = new Set(['top', 'audience', 'privacy', 'how-it-works', 'proposals', 'meet', 'hero-chat']);
const LOGISTICS_PORTAL_TARGETS = new Set(['top', 'edge', 'control', 'workflows', 'pilot', 'simulation']);
const ALLOWED_PALETTES = new Set(['coral', 'ocean', 'forest', 'purple', 'slate', 'research', 'maroon', 'stone', 'emerald', 'custom']);
const ALLOWED_THEME_COLORS = new Set(['purple', 'indigo', 'blue', 'green', 'orange', 'pink', 'red', 'teal', 'gray', 'slate', 'maroon', 'stone', 'emerald']);
const ALLOWED_THEME_MODES = new Set(['light', 'dark']);
const ALLOWED_BUILTIN_FONTS = new Set(['dm-sans', 'inter', 'system', 'roboto', 'poppins', 'outfit']);
const NORMALIZED_HEX = /^#[0-9a-f]{6}$/;
const SAFE_GOOGLE_FONT = /^[A-Za-z0-9][A-Za-z0-9 .'-]{0,79}$/;
const BRAND_COLOR_KEYS = ['canvas', 'surface', 'sidebar', 'text', 'accent', 'userBubble'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IMAGE_EXTENSION = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i;
const SAFE_APP_IMAGE_PATH = /^\/(?:assets|landing-pages)\/[a-z0-9][a-z0-9/_-]*\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i;
const REGION_KEY = /^[a-z0-9][a-z0-9-]{0,63}$/;
const COUNTRY_CODE = /^[A-Z]{2}$/;
const SOURCE_REVISION = /^[a-f0-9]{64}$/;
const LANGUAGE_CODES = new Set('aa ab ae af ak am an ar as av ay az ba be bg bh bi bm bn bo br bs ca ce ch co cr cs cu cv cy da de dv dz ee el en eo es et eu fa ff fi fj fo fr fy ga gd gl gn gu gv ha he hi ho hr ht hu hy hz ia id ie ig ii ik io is it iu ja jv ka kg ki kj kk kl km kn ko kr ks ku kv kw ky la lb lg li ln lo lt lu lv mg mh mi mk ml mn mr ms mt my na nb nd ne ng nl nn no nr nv ny oc oj om or os pa pi pl ps pt qu rm rn ro ru rw sa sc sd se sg sh si sk sl sm sn so sq sr ss st su sv sw ta te tg th ti tk tl tn to tr ts tt tw ty ug uk ur uz ve vi vo wa wo xh yi yo za zh zu'.split(' '));

function fail(message) {
  throw new Error(message);
}

function isDirectImageSource(value) {
  return typeof value === 'string'
    && IMAGE_EXTENSION.test(value)
    && (/^https:\/\//i.test(value) || SAFE_APP_IMAGE_PATH.test(value));
}

function validateIcon(icon, label, required = false) {
  if (icon === undefined) {
    if (required) fail(`${label} is required`);
    return;
  }
  if (!ALLOWED_ICONS.has(icon)) {
    fail(`${label} "${icon}" is not one of: ${[...ALLOWED_ICONS].join(', ')}`);
  }
}

function contrastRatio(first, second) {
  const luminance = (hex) => {
    const values = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
      .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return (0.2126 * values[0]) + (0.7152 * values[1]) + (0.0722 * values[2]);
  };
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function assertNoEmoji(value, path = 'landingPage') {
  if (typeof value === 'string') {
    if (/\p{Extended_Pictographic}/u.test(value.replace(/↔/g, '')) && !path.endsWith('.footer.copyright')) {
      fail(`${path} must not contain emoji; use a supported icon key instead`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoEmoji(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      if (key === 'emoji') fail(`${path}.emoji is no longer supported; use ${path}.icon`);
      assertNoEmoji(item, `${path}.${key}`);
    });
  }
}

function validateFormOperations(landingPage) {
  const root = landingPage.formOperations;
  if (!root || typeof root !== 'object' || Array.isArray(root)) {
    fail('landingPage.formOperations is required when design.variant is "form-operations"');
  }
  const get = (path) => path.split('.').reduce((value, key) => value && typeof value === 'object' ? value[key] : undefined, root);
  const requireString = (path) => {
    const value = get(path);
    if (typeof value !== 'string' || !value.trim()) fail(`landingPage.formOperations.${path} is required`);
  };
  const requireArray = (path, minimum = 1) => {
    const value = get(path);
    if (!Array.isArray(value) || value.length < minimum) {
      fail(`landingPage.formOperations.${path} must contain at least ${minimum} item${minimum === 1 ? '' : 's'}`);
    }
    return value;
  };
  [
    'heroDemo.sampleLabel', 'heroDemo.demoNote', 'heroDemo.openingReply',
    'heroDemo.greetingReply', 'heroDemo.instructionReply', 'heroDemo.reviewReply',
    'heroDemo.approvedReply', 'heroDemo.escalatedReply', 'heroDemo.fallbackReply',
    'heroDemo.trace.label', 'heroDemo.trace.status', 'heroDemo.trace.reviewLabel',
    'heroDemo.review.label', 'heroDemo.review.status', 'heroDemo.review.approveLabel', 'heroDemo.review.sendBackLabel',
    'heroDemo.results.approvedTitle', 'heroDemo.results.approvedBody',
    'heroDemo.results.escalatedTitle', 'heroDemo.results.escalatedBody',
    'principle.kicker', 'principle.heading', 'principle.body', 'principle.traceLabel',
    'principle.traceId', 'principle.traceBody', 'principle.guaranteesKicker', 'principle.guaranteesHeading',
    'impact.kicker', 'impact.heading', 'impact.body', 'process.kicker', 'process.heading', 'process.body',
    'useCases.kicker', 'useCases.heading', 'useCases.body', 'useCases.customIntake.heading',
    'useCases.customIntake.body', 'useCases.customIntake.ctaLabel', 'useCases.customIntake.note',
    'useCases.customIntake.successHeading', 'useCases.customIntake.successBody',
    'useCases.customIntake.editLabel', 'useCases.customIntake.emailSubject',
    'workedExample.kicker', 'workedExample.heading', 'workedExample.body', 'workedExample.before',
    'workedExample.after', 'workedExample.linkLabel', 'workedExample.emailSubject',
    'workedExample.card.label', 'workedExample.card.period', 'workedExample.card.status',
    'workedExample.card.summaryLabel', 'workedExample.card.summary', 'workedExample.card.actionLabel',
    'workedExample.card.actionNote', 'workedExample.card.note', 'control.kicker', 'control.heading',
    'control.body', 'control.boundary.label', 'control.boundary.approvalLabel',
    'control.boundary.executionLabel', 'control.boundary.sourceNote', 'control.boundary.guarantee',
    'leadCapture.kicker', 'leadCapture.heading', 'leadCapture.body', 'leadCapture.ctaLabel',
    'leadCapture.successHeading', 'leadCapture.successBody', 'leadCapture.emailLabel',
    'leadCapture.privacyNote', 'leadCapture.emailSubject', 'footer.tagline',
  ].forEach(requireString);

  requireArray('proofItems', 4);
  const traceSteps = requireArray('heroDemo.trace.steps');
  traceSteps.forEach((step, index) => {
    if (!step || !['done', 'active', 'pending'].includes(step.state)) {
      fail(`landingPage.formOperations.heroDemo.trace.steps[${index}].state must be done, active, or pending`);
    }
    for (const key of ['title', 'detail']) {
      if (!step[key] || !String(step[key]).trim()) fail(`landingPage.formOperations.heroDemo.trace.steps[${index}].${key} is required`);
    }
  });
  requireArray('heroDemo.review.fields').forEach((field, index) => {
    for (const key of ['label', 'value', 'sourceLabel']) {
      if (!field?.[key] || !String(field[key]).trim()) fail(`landingPage.formOperations.heroDemo.review.fields[${index}].${key} is required`);
    }
  });
  requireArray('principle.traceSteps').forEach((step, index) => {
    if (step?.state && !['done', 'active', 'pending'].includes(step.state)) {
      fail(`landingPage.formOperations.principle.traceSteps[${index}].state must be done, active, or pending`);
    }
  });
  requireArray('principle.guarantees', 6).forEach((item, index) => validateIcon(item?.icon, `landingPage.formOperations.principle.guarantees[${index}].icon`, true));
  requireArray('impact.items').forEach((item, index) => {
    validateIcon(item?.icon, `landingPage.formOperations.impact.items[${index}].icon`, true);
    item?.metric?.values?.forEach((value, valueIndex) => {
      if (!Number.isFinite(value) || value < 0 || value > 100) fail(`landingPage.formOperations.impact.items[${index}].metric.values[${valueIndex}] must be between 0 and 100`);
    });
  });
  requireArray('process.steps', 6).forEach((step, index) => {
    if (!['persona', 'human'].includes(step?.actor)) fail(`landingPage.formOperations.process.steps[${index}].actor must be persona or human`);
    validateIcon(step?.icon, `landingPage.formOperations.process.steps[${index}].icon`, true);
  });
  requireArray('useCases.items', 7).forEach((item, index) => {
    if (!['live', 'next', 'custom'].includes(item?.status)) fail(`landingPage.formOperations.useCases.items[${index}].status must be live, next, or custom`);
  });
  requireArray('workedExample.card.rows');
  requireArray('control.points').forEach((item, index) => validateIcon(item?.icon, `landingPage.formOperations.control.points[${index}].icon`, true));
  requireArray('control.boundary.badges');
  requireArray('control.boundary.steps');
  requireArray('footer.groups');
  const capture = get('heroDemo.captureAndFill');
  if (capture !== undefined) {
    if (!capture || typeof capture !== 'object' || Array.isArray(capture) || typeof capture.enabled !== 'boolean') {
      fail('landingPage.formOperations.heroDemo.captureAndFill.enabled must be true or false when configured');
    }
    if (typeof capture.commandTrigger !== 'string' || !/^\/?[a-z0-9][a-z0-9-]{0,63}$/.test(capture.commandTrigger.trim())) {
      fail('landingPage.formOperations.heroDemo.captureAndFill.commandTrigger must be a registered slash command trigger');
    }
  }
  if (!landingPage.contact?.email || !EMAIL.test(landingPage.contact.email)) {
    fail('landingPage.contact.email must be a valid email for the Form Operations handoff');
  }
  for (const [path, value] of [
    ['landingPage.header.logoImageUrl', landingPage.header?.logoImageUrl],
    ['landingPage.heroCharacterImage', landingPage.heroCharacterImage],
  ]) {
    if (!value || !/^https:\/\//i.test(value) || !/\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i.test(value)) {
      fail(`${path} must be a direct HTTPS image URL with a supported image extension`);
    }
  }
}

function validateLogisticsPortal(landingPage) {
  const root = landingPage.logisticsPortal;
  if (!root || typeof root !== 'object' || Array.isArray(root)) fail('landingPage.logisticsPortal is required when design.variant is "logistics-portal"');
  const get = (path) => path.split('.').reduce((value, key) => value && typeof value === 'object' ? value[key] : undefined, root);
  const requireString = (path) => { const value = get(path); if (typeof value !== 'string' || !value.trim()) fail(`landingPage.logisticsPortal.${path} is required`); };
  [
    'header.brandLabel', 'header.brandSuffix', 'header.logoImage', 'header.ctaLabel', 'hero.eyebrow', 'hero.heading',
    'hero.accentHeading', 'hero.body', 'hero.primaryCtaLabel', 'hero.secondaryCtaLabel', 'hero.characterImage',
    'hero.characterAlt', 'hero.chat.roleLabel', 'hero.chat.statusLabel', 'hero.chat.openingMessage', 'hero.chat.inputPlaceholder',
    'hero.rehearsal.commandTrigger', 'hero.rehearsal.sandboxLabel', 'hero.rehearsal.restartLabel', 'hero.rehearsal.demoNote',
    'hero.rehearsal.reviewHeading', 'hero.rehearsal.reviewBody', 'hero.rehearsal.reviewLabel', 'hero.rehearsal.approveLabel',
    'hero.rehearsal.escalateLabel', 'hero.rehearsal.approvedKicker', 'hero.rehearsal.approvedBody',
    'hero.rehearsal.escalatedKicker', 'hero.rehearsal.escalatedTitle', 'hero.rehearsal.escalatedBody',
    'hero.rehearsal.continueLabel', 'hero.rehearsal.loginNotice', 'edge.number', 'edge.kicker', 'edge.heading',
    'edge.accentHeading', 'edge.body', 'edge.governedLabel', 'edge.boundaryLabel', 'edge.operatorTitle',
    'edge.operatorBody', 'edge.externalLabel', 'platform.eyebrow', 'platform.heading', 'platform.accentHeading',
    'platform.body', 'platform.portalLabel', 'platform.checkpointLabel', 'process.number', 'process.eyebrow',
    'process.heading', 'process.body', 'process.failClosedTitle', 'process.failClosedBody', 'process.failClosedLabel',
    'workflows.number', 'workflows.kicker', 'workflows.heading', 'workflows.accentHeading', 'workflows.body',
    'workflows.moreLabel', 'pilot.eyebrow', 'pilot.heading', 'pilot.body', 'pilot.ctaLabel', 'pilot.email',
    'pilot.emailSubject', 'footer.brandLabel', 'footer.brandSuffix', 'footer.tagline', 'footer.copyright',
  ].forEach(requireString);
  const exact = {
    'header.navItems': 3, 'hero.proofItems': 3, 'hero.chat.suggestions': 3, 'hero.rehearsal.workflowTabs': 2,
    'hero.rehearsal.samples': 2, 'hero.rehearsal.intakeSteps': 4, 'hero.rehearsal.approvedChecks': 3,
    'edge.governedSystems': 4, 'edge.portals': 2, 'edge.comparison': 2, 'edge.capabilities': 4,
    'platform.fields': 3, 'platform.points': 4, 'process.steps': 6, 'workflows.primary': 2,
    'workflows.more': 4, 'pilot.steps': 3,
  };
  Object.entries(exact).forEach(([path, count]) => { if (!Array.isArray(get(path)) || get(path).length !== count) fail(`landingPage.logisticsPortal.${path} must contain exactly ${count} items`); });
  get('header.navItems').forEach((item, index) => { if (!LOGISTICS_PORTAL_TARGETS.has(item?.target)) fail(`landingPage.logisticsPortal.header.navItems[${index}].target must be a registered Logistics Portal target`); });
  if (get('hero.rehearsal.enabled') !== true) fail('landingPage.logisticsPortal.hero.rehearsal.enabled must be true');
  if (!/^\/?[a-z0-9][a-z0-9-]{0,63}$/.test(get('hero.rehearsal.commandTrigger'))) fail('landingPage.logisticsPortal.hero.rehearsal.commandTrigger must be a registered slash command trigger');
  [['header.logoImage', get('header.logoImage')], ['hero.characterImage', get('hero.characterImage')], ['hero.portraitImage', get('hero.portraitImage')]].forEach(([path, value]) => { if (path === 'hero.portraitImage' && value === undefined) return; if (!isDirectImageSource(value)) fail(`landingPage.logisticsPortal.${path} must be a direct HTTPS or bundled application image URL`); });
  get('hero.rehearsal.workflowTabs').forEach((item, index) => { if (!['customs', 'carrier'].includes(item?.id)) fail(`landingPage.logisticsPortal.hero.rehearsal.workflowTabs[${index}].id must be customs or carrier`); });
  get('hero.rehearsal.samples').forEach((item, index) => {
    if (!['customs', 'carrier'].includes(item?.id)) fail(`landingPage.logisticsPortal.hero.rehearsal.samples[${index}].id must be customs or carrier`);
    if (!Array.isArray(item?.exceptions) || item.exceptions.length !== 3) fail(`landingPage.logisticsPortal.hero.rehearsal.samples[${index}].exceptions must contain exactly 3 items`);
    if (item?.fields !== undefined) {
      if (!Array.isArray(item.fields) || item.fields.length !== 5) fail(`landingPage.logisticsPortal.hero.rehearsal.samples[${index}].fields must contain exactly 5 items`);
      item.fields.forEach((field, fieldIndex) => {
        if (typeof field?.label !== 'string' || !field.label.trim() || typeof field?.value !== 'string' || !field.value.trim()) fail(`landingPage.logisticsPortal.hero.rehearsal.samples[${index}].fields[${fieldIndex}] requires label and value`);
        if (!['verified', 'review'].includes(field?.state)) fail(`landingPage.logisticsPortal.hero.rehearsal.samples[${index}].fields[${fieldIndex}].state must be verified or review`);
      });
    }
    ['runReference', 'title', 'lane', 'source', 'destination', 'mapped', 'receipt'].forEach((key) => {
      if (typeof item?.[key] !== 'string' || !item[key].trim()) fail(`landingPage.logisticsPortal.hero.rehearsal.samples[${index}].${key} is required`);
    });
  });
  get('hero.rehearsal.intakeSteps').forEach((item, index) => { if (!['done', 'warning', 'pending'].includes(item?.state)) fail(`landingPage.logisticsPortal.hero.rehearsal.intakeSteps[${index}].state is unsupported`); });
  get('platform.fields').forEach((item, index) => { if (!['verified', 'review'].includes(item?.status)) fail(`landingPage.logisticsPortal.platform.fields[${index}].status is unsupported`); });
  if (!EMAIL.test(get('pilot.email'))) fail('landingPage.logisticsPortal.pilot.email must be valid');
  const forbidden = new Set(['component', 'componentName', 'javascript', 'script', 'css', 'tailwind', 'route', 'query', 'html']);
  const inspect = (value, path) => {
    if (Array.isArray(value)) return value.forEach((item, index) => inspect(item, `${path}[${index}]`));
    if (!value || typeof value !== 'object') return;
    Object.entries(value).forEach(([key, item]) => { if (forbidden.has(key)) fail(`${path}.${key} is executable or presentation code and is not allowed`); inspect(item, `${path}.${key}`); });
  };
  inspect(root, 'landingPage.logisticsPortal');
}

function validateGroceryTwin(landingPage) {
  const root = landingPage.groceryTwin;
  if (!root || typeof root !== 'object' || Array.isArray(root)) fail('landingPage.groceryTwin is required when design.variant is "grocery-twin"');
  const get = (path) => path.split('.').reduce((value, key) => value && typeof value === 'object' ? value[key] : undefined, root);
  const required = [
    'header.editionLabel', 'header.subtitle', 'header.secondaryEditionLabel', 'header.secondaryCtaLabel', 'header.primaryCtaLabel',
    'hero.ratingLabel', 'hero.heading', 'hero.body', 'hero.primaryCtaLabel', 'hero.secondaryCtaLabel',
    'hero.characterImage', 'hero.characterAlt', 'hero.chat.statusLabel', 'hero.chat.subtitle', 'hero.chat.openingMessage',
    'hero.chat.visitorMessage', 'hero.chat.assistantMessage', 'hero.chat.inputPlaceholder', 'hero.chat.demoNote',
    'hero.chat.sampleProduct.badge', 'hero.chat.sampleProduct.name', 'hero.chat.sampleProduct.detail',
    'hero.chat.sampleProduct.price', 'hero.chat.sampleProduct.actionLabel', 'hero.restockDemo.commandTrigger',
    'hero.restockDemo.uploadLabel', 'hero.restockDemo.uploadHint', 'hero.restockDemo.analyzingLabel',
    'hero.restockDemo.inventoryHeading', 'hero.restockDemo.inventoryBody', 'hero.restockDemo.itemNameLabel',
    'hero.restockDemo.quantityLabel', 'hero.restockDemo.unitLabel', 'hero.restockDemo.addItemLabel',
    'hero.restockDemo.removeItemLabel', 'hero.restockDemo.chatLabel', 'hero.restockDemo.voiceLabel',
    'hero.restockDemo.reviewLabel', 'hero.restockDemo.editLabel', 'hero.restockDemo.confirmationHeading',
    'hero.restockDemo.confirmationBody', 'hero.restockDemo.signInLabel', 'hero.restockDemo.signInNotice',
    'hero.restockDemo.expiryCopy', 'hero.restockDemo.errorCopy', 'product.kicker', 'product.heading', 'product.body',
    'mobile.kicker', 'mobile.heading', 'mobile.accentHeading', 'features.kicker', 'features.heading',
    'stories.kicker', 'stories.heading', 'about.kicker', 'about.heading', 'about.body', 'closing.kicker',
    'closing.heading', 'closing.body', 'closing.ctaLabel', 'footer.tagline', 'footer.copyright', 'footer.closingStatement',
  ];
  required.forEach((path) => {
    const value = get(path);
    if (typeof value !== 'string' || !value.trim()) fail(`landingPage.groceryTwin.${path} is required`);
  });
  [
    ['header.navItems', 5], ['hero.trustItems', 4], ['hero.chat.suggestions', 3],
    ['product.capabilityLabels', 6], ['product.cards', 3], ['mobile.items', 4],
    ['features.items', 3], ['stories.testimonials', 6], ['stories.articles', 3],
    ['about.capabilities', 9], ['footer.groups', 2],
  ].forEach(([path, count]) => {
    const value = get(path);
    if (!Array.isArray(value) || value.length !== count) fail(`landingPage.groceryTwin.${path} must contain exactly ${count} items`);
  });
  [...get('header.navItems'), ...get('footer.groups').flatMap((group) => group.links || [])].forEach((item, index) => {
    if (!GROCERY_TARGETS.has(item?.target)) fail(`landingPage.groceryTwin navigation item ${index + 1} must use a registered target`);
  });
  if (get('hero.restockDemo.enabled') !== true) fail('landingPage.groceryTwin.hero.restockDemo.enabled must be true');
  if (!/^\/?[a-z0-9][a-z0-9-]{0,63}$/.test(get('hero.restockDemo.commandTrigger'))) fail('landingPage.groceryTwin.hero.restockDemo.commandTrigger must be a registered slash command trigger');
  if (!/^https:\/\//i.test(get('hero.characterImage')) || !/\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i.test(get('hero.characterImage'))) fail('landingPage.groceryTwin.hero.characterImage must be a direct HTTPS image URL');
  get('features.items').forEach((item, index) => {
    if (!['purple', 'blue', 'lime'].includes(item?.accent)) fail(`landingPage.groceryTwin.features.items[${index}].accent must be purple, blue, or lime`);
  });
}

function validateCinematicCampaigns(landingPage) {
  const root = landingPage.cinematicCampaigns;
  if (!root || typeof root !== 'object' || Array.isArray(root)) {
    fail('landingPage.cinematicCampaigns is required when design.variant is "cinematic-campaigns"');
  }
  const get = (path) => path.split('.').reduce((value, key) => value && typeof value === 'object' ? value[key] : undefined, root);
  const requireString = (path) => {
    const value = get(path);
    if (typeof value !== 'string' || !value.trim()) fail(`landingPage.cinematicCampaigns.${path} is required`);
  };
  const requireExactArray = (path, count) => {
    const value = get(path);
    if (!Array.isArray(value) || value.length !== count) fail(`landingPage.cinematicCampaigns.${path} must contain exactly ${count} items`);
    return value;
  };
  [
    'hero.wordmark', 'hero.loginLabel', 'hero.meetLabel', 'hero.announcementLabel', 'hero.announcementTitle',
    'hero.mutedHeadingLine', 'hero.primaryCtaLabel', 'hero.secondaryCtaLabel', 'hero.backgroundVideo.src',
    'hero.backgroundVideo.poster', 'hero.chat.roleLabel', 'hero.chat.statusLabel', 'hero.chat.openingMessage',
    'hero.chat.inputPlaceholder', 'hero.guidedDemo.commandTrigger', 'hero.guidedDemo.heading', 'hero.guidedDemo.body',
    'hero.guidedDemo.urlLabel', 'hero.guidedDemo.urlPlaceholder', 'hero.guidedDemo.audienceLabel',
    'hero.guidedDemo.objectiveLabel', 'hero.guidedDemo.ctaLabel', 'hero.guidedDemo.durationLabel',
    'hero.guidedDemo.styleLabel', 'hero.guidedDemo.previewLabel', 'hero.guidedDemo.previewHeading',
    'hero.guidedDemo.campaignDirectionLabel', 'hero.guidedDemo.storyboardLabel',
    'hero.guidedDemo.deliverablesLabel', 'hero.guidedDemo.submitLabel', 'hero.guidedDemo.generateLabel',
    'hero.guidedDemo.voiceLabel', 'hero.guidedDemo.editLabel', 'hero.guidedDemo.disclaimer',
    'hero.guidedDemo.loginNotice', 'hero.guidedDemo.invalidUrlCopy', 'hero.guidedDemo.expiredCopy',
    'hero.guidedDemo.sampleDirection', 'hero.guidedDemo.sampleMessage', 'hero.guidedDemo.sampleTone',
    'hero.guidedDemo.sampleVisualLanguage', 'workflow.heading', 'workflow.mutedHeading', 'workflow.learnLabel',
    'capabilities.heading', 'capabilities.chipLabel', 'capabilities.mutedHeading', 'showcase.heading',
    'features.heading', 'features.body', 'features.ctaLabel', 'workspace.heading', 'workspace.accentHeading',
    'workspace.backgroundImage', 'workspace.bannerLabel', 'workspace.bannerTitle', 'workspace.bannerBody',
    'workspace.projectHeading', 'workspace.projectBody', 'meetArcher.kicker', 'meetArcher.heading',
    'meetArcher.mutedHeading', 'meetArcher.body', 'meetArcher.ctaLabel', 'meetArcher.characterImage',
    'meetArcher.statusTitle', 'meetArcher.statusBody', 'journal.heading', 'journal.body',
    'journal.allStoriesLabel', 'closing.heading', 'closing.ctaLabel', 'footer.tagline', 'footer.copyright',
    'footer.closingStatement', 'footer.contactEmail',
  ].forEach(requireString);
  [
    ['hero.navItems', 5], ['hero.headingLines', 2], ['hero.chat.suggestions', 3],
    ['hero.guidedDemo.storyboard', 4], ['hero.guidedDemo.deliverables', 3], ['workflow.acts', 3],
    ['capabilities.items', 8], ['showcase.items', 4], ['features.items', 7], ['workspace.projects', 3],
    ['workspace.benefits', 3], ['meetArcher.points', 3], ['journal.items', 2], ['closing.filmstrip', 5],
    ['footer.groups', 3],
  ].forEach(([path, count]) => requireExactArray(path, count));
  if (get('hero.guidedDemo.enabled') !== true) fail('landingPage.cinematicCampaigns.hero.guidedDemo.enabled must be true');
  if (!/^\/?[a-z0-9][a-z0-9-]{0,63}$/.test(get('hero.guidedDemo.commandTrigger'))) {
    fail('landingPage.cinematicCampaigns.hero.guidedDemo.commandTrigger must be a registered slash command trigger');
  }
  requireExactArray('workflow.acts', 3).forEach((act, index) => {
    if (!['write', 'generate', 'share'].includes(act?.visualKind)) fail(`landingPage.cinematicCampaigns.workflow.acts[${index}].visualKind must be write, generate, or share`);
  });
  requireExactArray('features.items', 7).forEach((item, index) => {
    if (!['metric', 'wide', 'feature', 'video'].includes(item?.kind)) fail(`landingPage.cinematicCampaigns.features.items[${index}].kind must be metric, wide, feature, or video`);
  });
  if (!EMAIL.test(get('footer.contactEmail'))) fail('landingPage.cinematicCampaigns.footer.contactEmail must be a valid email');
  const cinematicTargets = new Set(['product', 'showcase', 'capabilities', 'workspace', 'meet-archer', 'journal', 'start', 'hero-chat', 'contact']);
  for (const [path, items] of [['hero.navItems', get('hero.navItems')], ['journal.items', get('journal.items')]]) {
    items.forEach((item, index) => {
      if (!cinematicTargets.has(item?.target)) fail(`landingPage.cinematicCampaigns.${path}[${index}].target is not supported`);
    });
  }
  get('footer.groups').forEach((group, groupIndex) => group?.links?.forEach((link, index) => {
    if (!cinematicTargets.has(link?.target)) fail(`landingPage.cinematicCampaigns.footer.groups[${groupIndex}].links[${index}].target is not supported`);
  }));
  const mediaPaths = [
    ['hero.backgroundVideo.src', 'video'], ['hero.backgroundVideo.poster', 'image'],
    ['workspace.backgroundImage', 'image'], ['meetArcher.characterImage', 'image'],
  ];
  get('showcase.items').forEach((item, index) => { mediaPaths.push([`showcase.items.${index}.video`, 'video']); if (item.poster) mediaPaths.push([`showcase.items.${index}.poster`, 'image']); });
  get('workflow.acts').forEach((item, index) => {
    if (item.media?.src) mediaPaths.push([`workflow.acts.${index}.media.src`, 'image']);
    item.mediaItems?.forEach((mediaItem, mediaIndex) => mediaPaths.push([`workflow.acts.${index}.mediaItems.${mediaIndex}.src`, 'image']));
  });
  get('features.items').forEach((item, index) => mediaPaths.push([`features.items.${index}.media`, item.kind === 'video' ? 'video' : 'image']));
  get('workspace.projects').forEach((item, index) => mediaPaths.push([`workspace.projects.${index}.image`, 'image']));
  get('journal.items').forEach((item, index) => mediaPaths.push([`journal.items.${index}.image`, 'image']));
  get('closing.filmstrip').forEach((item, index) => mediaPaths.push([`closing.filmstrip.${index}.image`, 'image']));
  for (const [path, kind] of mediaPaths) {
    const value = get(path);
    const extension = kind === 'video' ? /\.(?:m4v|mov|mp4|webm)(?:[?#]|$)/i : /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i;
    if (typeof value !== 'string' || !/^https:\/\//i.test(value) || !extension.test(value)) fail(`landingPage.cinematicCampaigns.${path} must be a direct HTTPS ${kind} URL`);
  }
  const forbiddenKeys = new Set(['component', 'componentName', 'javascript', 'script', 'css', 'tailwind', 'route', 'query', 'html']);
  const inspect = (value, path) => {
    if (Array.isArray(value)) return value.forEach((item, index) => inspect(item, `${path}[${index}]`));
    if (!value || typeof value !== 'object') return;
    Object.entries(value).forEach(([key, item]) => {
      if (forbiddenKeys.has(key)) fail(`${path}.${key} is executable or presentation code and is not allowed`);
      inspect(item, `${path}.${key}`);
    });
  };
  inspect(root, 'landingPage.cinematicCampaigns');
}

function validateRecruitingOperations(landingPage) {
  const root = landingPage.recruitingOperations;
  if (!root || typeof root !== 'object' || Array.isArray(root)) fail('landingPage.recruitingOperations is required when design.variant is "recruiting-operations"');
  const get = (path) => path.split('.').reduce((value, key) => value && typeof value === 'object' ? value[key] : undefined, root);
  const requireString = (path) => { const value = get(path); if (typeof value !== 'string' || !value.trim()) fail(`landingPage.recruitingOperations.${path} is required`); };
  const requireExact = (path, count) => { const value = get(path); if (!Array.isArray(value) || value.length !== count) fail(`landingPage.recruitingOperations.${path} must contain exactly ${count} items`); return value; };
  [
    'hero.brandLabel', 'hero.navCtaLabel', 'hero.eyebrow', 'hero.heading', 'hero.subtitle',
    'hero.primaryCtaLabel', 'hero.voiceCtaLabel', 'hero.characterImage', 'hero.characterAlt', 'hero.statusLabel',
    'features.kicker', 'features.heading', 'features.body', 'features.ctaLabel',
    'workflow.kicker', 'workflow.body', 'workflow.ctaLabel', 'workflow.monitoringLabel',
    'comparison.kicker', 'comparison.manual.label', 'comparison.manual.duration', 'comparison.manual.durationUnit',
    'comparison.persona.label', 'comparison.persona.duration', 'comparison.persona.durationUnit',
    'comparison.approvalTitle', 'comparison.approvalBody', 'leads.kicker', 'leads.body', 'leads.boardTitle',
    'leads.liveLabel', 'leads.commandTrigger', 'leads.inputPlaceholder', 'leads.submitLabel',
    'leads.invalidUrlCopy', 'leads.loginNotice', 'pillars.kicker', 'pillars.heading',
    'principles.kicker', 'principles.heading', 'principles.body', 'faq.kicker', 'faq.heading', 'faq.body',
    'closing.kicker', 'closing.body', 'closing.ctaLabel', 'footer.tagline', 'footer.copyright',
  ].forEach(requireString);
  [
    ['hero.navItems', 4], ['hero.emphasizedWords', 2], ['hero.signals', 3], ['features.items', 4],
    ['workflow.headingLines', 2], ['workflow.activity', 4], ['comparison.headingLines', 2],
    ['comparison.manual.steps', 5], ['comparison.persona.steps', 4], ['leads.headingLines', 2],
    ['leads.columns', 4], ['leads.rows', 4], ['pillars.items', 5], ['principles.items', 3],
    ['faq.items', 5], ['closing.headingLines', 2], ['footer.links', 3],
  ].forEach(([path, count]) => requireExact(path, count));
  const targets = new Set(['top', 'workflow', 'use-cases', 'why-lina', 'faq', 'contact', 'leads']);
  [...get('hero.navItems'), ...get('footer.links')].forEach((item, index) => { if (!targets.has(item?.target)) fail(`landingPage.recruitingOperations navigation item ${index} has an unsupported target`); });
  get('features.items').forEach((item, index) => { if (!['signals', 'roles', 'integrations', 'approval'].includes(item?.visualKind)) fail(`landingPage.recruitingOperations.features.items[${index}].visualKind is not supported`); });
  get('workflow.activity').forEach((item, index) => { if (!['blue', 'green', 'amber', 'violet'].includes(item?.tone)) fail(`landingPage.recruitingOperations.workflow.activity[${index}].tone is not supported`); });
  get('leads.rows').forEach((row, index) => { if (!['new', 'draft-ready', 'approved', 'monitoring'].includes(row?.status)) fail(`landingPage.recruitingOperations.leads.rows[${index}].status is not supported`); });
  get('pillars.items').forEach((item, index) => validateIcon(item?.icon, `landingPage.recruitingOperations.pillars.items[${index}].icon`, true));
  get('principles.items').forEach((item, index) => validateIcon(item?.icon, `landingPage.recruitingOperations.principles.items[${index}].icon`, true));
  if (!/^\/?[a-z0-9][a-z0-9-]{0,63}$/.test(get('leads.commandTrigger'))) fail('landingPage.recruitingOperations.leads.commandTrigger must be a registered slash command trigger');
  if (!/^https:\/\//i.test(get('hero.characterImage')) || !/\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i.test(get('hero.characterImage'))) fail('landingPage.recruitingOperations.hero.characterImage must be a direct HTTPS image URL');
  const forbiddenKeys = new Set(['component', 'componentName', 'javascript', 'script', 'css', 'tailwind', 'route', 'query', 'html']);
  const inspect = (value, path) => {
    if (Array.isArray(value)) return value.forEach((item, index) => inspect(item, `${path}[${index}]`));
    if (!value || typeof value !== 'object') return;
    Object.entries(value).forEach(([key, item]) => { if (forbiddenKeys.has(key)) fail(`${path}.${key} is executable or presentation code and is not allowed`); inspect(item, `${path}.${key}`); });
  };
  inspect(root, 'landingPage.recruitingOperations');
}

function validateEventIntroductions(landingPage) {
  const root = landingPage.eventIntroductions;
  if (!root || typeof root !== 'object' || Array.isArray(root)) fail('landingPage.eventIntroductions is required when design.variant is "event-introductions"');
  const get = (path) => path.split('.').reduce((value, key) => value && typeof value === 'object' ? value[key] : undefined, root);
  const requireString = (path) => { const value = get(path); if (typeof value !== 'string' || !value.trim()) fail(`landingPage.eventIntroductions.${path} is required`); };
  const requireExact = (path, count) => { const value = get(path); if (!Array.isArray(value) || value.length !== count) fail(`landingPage.eventIntroductions.${path} must contain exactly ${count} items`); return value; };
  [
    'header.brandLabel', 'header.brandTagline', 'header.ctaLabel', 'event.name', 'event.shortName',
    'event.city', 'event.venue', 'event.neighborhood', 'event.dateRange', 'event.shortDateRange',
    'event.cardDate', 'event.availabilityLabel', 'event.confirmedLocation', 'event.disclaimer',
    'hero.eyebrow', 'hero.heading', 'hero.accentText', 'hero.body', 'hero.primaryCtaLabel',
    'hero.secondaryCtaLabel', 'hero.characterImage', 'hero.characterAlt', 'hero.chat.statusLabel',
    'hero.chat.operatorBadge', 'hero.chat.openingMessage', 'hero.chat.inputPlaceholder',
    'hero.briefDemo.commandTrigger', 'hero.briefDemo.introHeading', 'hero.briefDemo.introBody',
    'hero.briefDemo.trackLabel', 'hero.briefDemo.sideLabel', 'hero.briefDemo.voiceLabel',
    'hero.briefDemo.reviewLabel', 'hero.briefDemo.editLabel', 'hero.briefDemo.reviewHeading',
    'hero.briefDemo.reviewBody', 'hero.briefDemo.submitLabel', 'hero.briefDemo.loginNotice',
    'hero.briefDemo.expiryCopy', 'hero.briefDemo.privacyCopy', 'hero.briefDemo.errorCopy',
    'about.kicker', 'about.heading', 'about.body', 'about.scopeNote', 'process.kicker',
    'process.heading', 'process.body', 'pairing.kicker', 'pairing.heading', 'pairing.body',
    'pairing.fitLabel', 'pairing.statusHeading', 'pairing.statusBody', 'faq.kicker', 'faq.heading',
    'faq.characterImage', 'waitlist.kicker', 'waitlist.heading', 'waitlist.body', 'waitlist.nameLabel',
    'waitlist.emailLabel', 'waitlist.eventLabel', 'waitlist.cityLabel', 'waitlist.ctaLabel',
    'waitlist.loginNotice', 'closing.kicker', 'closing.heading', 'closing.body', 'closing.ctaLabel',
    'closing.note', 'closing.characterImage', 'closing.characterAlt', 'footer.tagline',
    'footer.disclaimer', 'footer.copyright',
  ].forEach(requireString);
  [
    ['header.navItems', 4], ['tracks', 3], ['hero.chat.suggestedPrompts', 3], ['hero.briefDemo.fields', 9],
    ['about.images', 3], ['about.principles', 3], ['process.steps', 4], ['pairing.images', 2],
    ['pairing.criteria', 3], ['pairing.cards', 3], ['faq.items', 6], ['footer.groups', 2],
  ].forEach(([path, count]) => requireExact(path, count));
  if (get('hero.briefDemo.enabled') !== true) fail('landingPage.eventIntroductions.hero.briefDemo.enabled must be true');
  if (!get('hero.heading').includes(get('hero.accentText'))) fail('landingPage.eventIntroductions.hero.accentText must be a substring of hero.heading');
  if (!/^\/?[a-z0-9][a-z0-9-]{0,63}$/.test(get('hero.briefDemo.commandTrigger'))) fail('landingPage.eventIntroductions.hero.briefDemo.commandTrigger must be a registered slash command trigger');
  const expectedTracks = new Set(['founder-investor', 'founder-cofounder', 'startup-startup']);
  const seenTracks = new Set();
  get('tracks').forEach((track, index) => {
    if (!expectedTracks.has(track?.id) || seenTracks.has(track.id)) fail(`landingPage.eventIntroductions.tracks[${index}].id must be a unique registered Lane track`);
    seenTracks.add(track.id);
    if (!Array.isArray(track?.sides) || track.sides.length !== 2 || track.sides.some((side) => typeof side !== 'string' || !side.trim())) fail(`landingPage.eventIntroductions.tracks[${index}].sides must contain exactly two non-empty sides`);
  });
  if (get('event.availability') !== null && !['available', 'limited', 'closed', 'unverified'].includes(get('event.availability'))) fail('landingPage.eventIntroductions.event.availability is not supported');
  const expectedFields = new Set(['organization', 'role', 'currentEvent', 'goal', 'offer', 'need', 'fitCriteria', 'availability', 'privateConstraints']);
  const seenFields = new Set();
  get('hero.briefDemo.fields').forEach((field, index) => {
    if (!expectedFields.has(field?.key) || seenFields.has(field.key)) fail(`landingPage.eventIntroductions.hero.briefDemo.fields[${index}].key must be a unique registered field`);
    seenFields.add(field.key);
    if (!['text', 'textarea'].includes(field?.type)) fail(`landingPage.eventIntroductions.hero.briefDemo.fields[${index}].type must be text or textarea`);
  });
  get('about.principles').forEach((item, index) => {
    validateIcon(item?.icon, `landingPage.eventIntroductions.about.principles[${index}].icon`, true);
    if (!['signal', 'iris', 'mint'].includes(item?.tone)) fail(`landingPage.eventIntroductions.about.principles[${index}].tone is not supported`);
  });
  get('pairing.cards').forEach((item, index) => { if (!['proposed', 'accepted', 'confirmed'].includes(item?.status)) fail(`landingPage.eventIntroductions.pairing.cards[${index}].status is not supported`); });
  [...get('header.navItems'), ...get('footer.groups').flatMap((group) => group?.links || [])].forEach((item, index) => { if (!EVENT_INTRODUCTION_TARGETS.has(item?.target)) fail(`landingPage.eventIntroductions navigation item ${index} has an unsupported target`); });
  const media = [
    ['hero.characterImage', get('hero.characterImage')], ['faq.characterImage', get('faq.characterImage')],
    ['closing.characterImage', get('closing.characterImage')],
    ...get('about.images').map((item, index) => [`about.images[${index}].image`, item?.image]),
    ...get('process.steps').map((item, index) => [`process.steps[${index}].image`, item?.image]),
    ...get('pairing.images').map((item, index) => [`pairing.images[${index}].image`, item?.image]),
  ];
  media.forEach(([path, value]) => { if (typeof value !== 'string' || !/^https:\/\//i.test(value) || !/\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i.test(value)) fail(`landingPage.eventIntroductions.${path} must be a direct HTTPS image URL`); });
  const forbiddenKeys = new Set(['component', 'componentName', 'javascript', 'script', 'css', 'tailwind', 'route', 'query', 'html']);
  const inspect = (value, path) => {
    if (Array.isArray(value)) return value.forEach((item, index) => inspect(item, `${path}[${index}]`));
    if (!value || typeof value !== 'object') return;
    Object.entries(value).forEach(([key, item]) => { if (forbiddenKeys.has(key)) fail(`${path}.${key} is executable or presentation code and is not allowed`); inspect(item, `${path}.${key}`); });
  };
  inspect(root, 'landingPage.eventIntroductions');
}

function validateHomeIntroductions(landingPage) {
  const root = landingPage.homeIntroductions;
  if (!root || typeof root !== 'object' || Array.isArray(root)) fail('landingPage.homeIntroductions is required when design.variant is "home-introductions"');
  const get = (path) => path.split('.').reduce((value, key) => value && typeof value === 'object' ? value[key] : undefined, root);
  const requireString = (path) => { const value = get(path); if (typeof value !== 'string' || !value.trim()) fail(`landingPage.homeIntroductions.${path} is required`); };
  const requireExact = (path, count) => { const value = get(path); if (!Array.isArray(value) || value.length !== count) fail(`landingPage.homeIntroductions.${path} must contain exactly ${count} items`); return value; };
  [
    'header.brandLabel', 'header.brandTagline', 'header.ctaLabel', 'header.mobileCtaLabel',
    'service.announcement', 'service.feeCopy', 'service.disclaimer', 'hero.eyebrow', 'hero.body',
    'hero.backgroundImage', 'hero.backgroundAlt', 'hero.primaryCtaLabel', 'hero.secondaryCtaLabel',
    'hero.privacyLine', 'hero.characterImage', 'hero.characterAlt', 'hero.chat.statusLabel',
    'hero.chat.privacyBadge', 'hero.chat.openingMessage', 'hero.chat.visitorMessage',
    'hero.chat.assistantMessage', 'hero.chat.inputPlaceholder', 'hero.briefDemo.commandTrigger',
    'hero.briefDemo.introHeading', 'hero.briefDemo.introBody', 'hero.briefDemo.chatLabel', 'hero.briefDemo.voiceLabel',
    'hero.briefDemo.reviewLabel', 'hero.briefDemo.editLabel', 'hero.briefDemo.reviewHeading',
    'hero.briefDemo.reviewBody', 'hero.briefDemo.submitLabel', 'hero.briefDemo.loginNotice',
    'hero.briefDemo.expiryCopy', 'hero.briefDemo.privacyCopy', 'hero.briefDemo.errorCopy',
    'audience.kicker', 'audience.heading', 'audience.body', 'audience.forHeading', 'audience.notForHeading',
    'privacy.kicker', 'privacy.heading', 'privacy.body', 'privacy.proposalLabel', 'privacy.proposalAreaLabel',
    'privacy.proposalArea', 'privacy.proposalNote', 'process.kicker', 'process.heading',
    'process.licensedAgentNote', 'proposals.kicker', 'proposals.heading', 'proposals.body',
    'meet.kicker', 'meet.heading', 'meet.body', 'meet.characterImage', 'meet.characterAlt',
    'meet.primaryCtaLabel', 'meet.secondaryCtaLabel', 'footer.brandLabel', 'footer.tagline',
    'footer.disclaimer', 'footer.eventDisclaimer', 'footer.copyright',
  ].forEach(requireString);
  [
    ['header.navItems', 3], ['service.configurations', 2], ['tracks', 2], ['hero.headingLines', 3],
    ['audience.forItems', 2], ['audience.notForItems', 3], ['privacy.stages', 3],
    ['proposals.cards', 2], ['meet.principles', 3], ['footer.groups', 2],
  ].forEach(([path, count]) => requireExact(path, count));
  if (get('hero.briefDemo.enabled') !== true) fail('landingPage.homeIntroductions.hero.briefDemo.enabled must be true');
  if (!/^\/?[a-z0-9][a-z0-9-]{0,63}$/.test(get('hero.briefDemo.commandTrigger'))) fail('landingPage.homeIntroductions.hero.briefDemo.commandTrigger must be a registered slash command trigger');
  if (!['event', 'city'].includes(get('service.activeMode'))) fail('landingPage.homeIntroductions.service.activeMode must be event or city');
  const configuredModes = new Set();
  get('service.configurations').forEach((item, index) => {
    if (!['event', 'city'].includes(item?.mode) || configuredModes.has(item.mode)) fail(`landingPage.homeIntroductions.service.configurations[${index}].mode must define event and city exactly once`);
    configuredModes.add(item.mode);
  });
  const allowedFields = new Set(['serviceMode', 'area', 'propertyType', 'propertyBrief', 'budgetOrPrice', 'mustHavesOrHighlights', 'dealbreakersOrBuyerCriteria', 'timing', 'readiness', 'privateConstraints']);
  const seenTracks = new Set();
  get('tracks').forEach((track, trackIndex) => {
    if (!['buying', 'selling'].includes(track?.id) || seenTracks.has(track.id)) fail(`landingPage.homeIntroductions.tracks[${trackIndex}].id must define buying and selling exactly once`);
    seenTracks.add(track.id);
    if (typeof track?.responseMessage !== 'string' || !track.responseMessage.trim()) fail(`landingPage.homeIntroductions.tracks[${trackIndex}].responseMessage is required`);
    if (!Array.isArray(track.processSteps) || track.processSteps.length !== 3) fail(`landingPage.homeIntroductions.tracks[${trackIndex}].processSteps must contain exactly 3 items`);
    track.processSteps.forEach((step, stepIndex) => {
      ['number', 'title', 'body', 'alt'].forEach((key) => {
        if (typeof step?.[key] !== 'string' || !step[key].trim()) fail(`landingPage.homeIntroductions.tracks[${trackIndex}].processSteps[${stepIndex}].${key} is required`);
      });
      if (!isDirectImageSource(step?.image)) fail(`landingPage.homeIntroductions.tracks[${trackIndex}].processSteps[${stepIndex}].image must be a direct HTTPS or bundled application image URL`);
    });
    if (!Array.isArray(track.briefFields) || track.briefFields.length < 5 || track.briefFields.length > 9) fail(`landingPage.homeIntroductions.tracks[${trackIndex}].briefFields must contain 5 to 9 fields`);
    const seenFields = new Set();
    track.briefFields.forEach((field, fieldIndex) => {
      if (!allowedFields.has(field?.key) || seenFields.has(field.key)) fail(`landingPage.homeIntroductions.tracks[${trackIndex}].briefFields[${fieldIndex}].key must be a unique registered field`);
      seenFields.add(field.key);
      if (!['text', 'textarea', 'select'].includes(field?.type)) fail(`landingPage.homeIntroductions.tracks[${trackIndex}].briefFields[${fieldIndex}].type is not supported`);
    });
  });
  [...get('privacy.stages'), ...get('proposals.cards')].forEach((item, index) => { if (!['proposed', 'accepted', 'confirmed'].includes(item?.status)) fail(`landingPage.homeIntroductions proposal status ${index} is not supported`); });
  get('proposals.cards').forEach((item, index) => { if (!['cream', 'terracotta'].includes(item?.tone)) fail(`landingPage.homeIntroductions.proposals.cards[${index}].tone is not supported`); });
  [...get('header.navItems'), ...get('footer.groups').flatMap((group) => group?.links || [])].forEach((item, index) => { if (!HOME_INTRODUCTION_TARGETS.has(item?.target)) fail(`landingPage.homeIntroductions navigation item ${index} has an unsupported target`); });
  [['hero.backgroundImage', get('hero.backgroundImage')], ['hero.characterImage', get('hero.characterImage')], ['meet.characterImage', get('meet.characterImage')]].forEach(([path, value]) => {
    if (!isDirectImageSource(value)) fail(`landingPage.homeIntroductions.${path} must be a direct HTTPS or bundled application image URL`);
  });
  const legal = `${get('service.disclaimer')} ${get('footer.disclaimer')}`.toLowerCase();
  [
    ['brokerage boundary', ['not a broker', 'not a licensed brokerage']],
    ['representation boundary', ['not a real estate agent', 'does not represent']],
    ['valuation boundary', ['not a valuer', 'does not value', 'does not provide valuation', 'value your home']],
    ['negotiation boundary', ['not a negotiator', 'does not negotiate', ', negotiate']],
  ].forEach(([label, alternatives]) => { if (!alternatives.some((copy) => legal.includes(copy))) fail(`landingPage.homeIntroductions must include the required real-estate ${label}`); });
  const forbiddenKeys = new Set(['component', 'componentName', 'javascript', 'script', 'css', 'tailwind', 'route', 'query', 'html']);
  const inspect = (value, path) => {
    if (Array.isArray(value)) return value.forEach((item, index) => inspect(item, `${path}[${index}]`));
    if (!value || typeof value !== 'object') return;
    Object.entries(value).forEach(([key, item]) => { if (forbiddenKeys.has(key)) fail(`${path}.${key} is executable or presentation code and is not allowed`); inspect(item, `${path}.${key}`); });
  };
  inspect(root, 'landingPage.homeIntroductions');
}

function validateCaptureCommand(landingPage, chatConfigPath) {
  const capture = landingPage?.formOperations?.heroDemo?.captureAndFill;
  if (capture?.enabled !== true || !chatConfigPath) return;
  const chatConfig = JSON.parse(fs.readFileSync(chatConfigPath, 'utf8'));
  const commands = chatConfig?.publishedConfig?.agentTopology?.slashCommands;
  if (!Array.isArray(commands)) {
    fail(`${chatConfigPath} must define publishedConfig.agentTopology.slashCommands for an enabled capture demo`);
  }
  const trigger = String(capture.commandTrigger || '').trim().replace(/^\/+/, '').toLowerCase();
  const command = commands.find((item) => item?.enabled !== false && String(item?.trigger || '').trim().replace(/^\/+/, '').toLowerCase() === trigger);
  const accepted = command?.attachmentInput?.acceptedMimeTypes;
  if (
    !command
    || command.execution?.type !== 'operator_action'
    || command.attachmentInput?.inputKey !== 'form_images'
    || command.attachmentInput?.maxFiles > 6
    || !Array.isArray(accepted)
    || accepted.length === 0
    || accepted.some((mime) => !['image/jpeg', 'image/png', 'image/webp'].includes(mime))
  ) {
    fail(`landingPage.formOperations.heroDemo.captureAndFill.commandTrigger must reference an enabled image-attachment operator command in ${chatConfigPath}`);
  }
}

function validateLogisticsPortalCommand(landingPage, chatConfigPath) {
  const demo = landingPage?.logisticsPortal?.hero?.rehearsal;
  if (demo?.enabled !== true || !chatConfigPath) return;
  const chatConfig = JSON.parse(fs.readFileSync(chatConfigPath, 'utf8'));
  const commands = chatConfig?.publishedConfig?.agentTopology?.slashCommands;
  if (!Array.isArray(commands)) fail(`${chatConfigPath} must define publishedConfig.agentTopology.slashCommands for Logistics Portal`);
  const trigger = String(demo.commandTrigger || '').trim().replace(/^\/+/, '').toLowerCase();
  const command = commands.find((item) => item?.enabled !== false && String(item?.trigger || '').trim().replace(/^\/+/, '').toLowerCase() === trigger);
  if (!command || command.execution?.type !== 'operator_action') fail(`landingPage.logisticsPortal.hero.rehearsal.commandTrigger must reference an enabled operator_action command in ${chatConfigPath}`);
  const workflowKey = String(command.execution?.workflowRef?.resourceKey || command.execution?.resourceKey || '');
  if (workflowKey && workflowKey !== 'workflow.emil.rehearse-filing') fail('The Emil rehearsal command must reference workflow.emil.rehearse-filing');
}

function validateCinematicCommand(landingPage, chatConfigPath) {
  const demo = landingPage?.cinematicCampaigns?.hero?.guidedDemo;
  if (demo?.enabled !== true || !chatConfigPath) return;
  const chatConfig = JSON.parse(fs.readFileSync(chatConfigPath, 'utf8'));
  const commands = chatConfig?.publishedConfig?.agentTopology?.slashCommands;
  if (!Array.isArray(commands)) fail(`${chatConfigPath} must define publishedConfig.agentTopology.slashCommands for an enabled cinematic demo`);
  const trigger = String(demo.commandTrigger || '').trim().replace(/^\/+/, '').toLowerCase();
  const command = commands.find((item) => item?.enabled !== false && String(item?.trigger || '').trim().replace(/^\/+/, '').toLowerCase() === trigger);
  if (!command || command.execution?.type !== 'operator_action') {
    fail(`landingPage.cinematicCampaigns.hero.guidedDemo.commandTrigger must reference an enabled operator_action command in ${chatConfigPath}`);
  }
}

function validateRecruitingCommand(landingPage, chatConfigPath) {
  const triggerValue = landingPage?.recruitingOperations?.leads?.commandTrigger;
  if (!triggerValue || !chatConfigPath) return;
  const chatConfig = JSON.parse(fs.readFileSync(chatConfigPath, 'utf8'));
  const commands = chatConfig?.publishedConfig?.agentTopology?.slashCommands;
  if (!Array.isArray(commands)) fail(`${chatConfigPath} must define publishedConfig.agentTopology.slashCommands for Recruiting Operations`);
  const trigger = String(triggerValue).trim().replace(/^\/+/, '').toLowerCase();
  const command = commands.find((item) => item?.enabled !== false && String(item?.trigger || '').trim().replace(/^\/+/, '').toLowerCase() === trigger);
  if (!command || command.execution?.type !== 'operator_action') fail(`landingPage.recruitingOperations.leads.commandTrigger must reference an enabled operator_action command in ${chatConfigPath}`);
}

function validateGroceryCommand(landingPage, chatConfigPath) {
  const demo = landingPage?.groceryTwin?.hero?.restockDemo;
  if (demo?.enabled !== true || !chatConfigPath) return;
  const chatConfig = JSON.parse(fs.readFileSync(chatConfigPath, 'utf8'));
  const commands = chatConfig?.publishedConfig?.agentTopology?.slashCommands;
  if (!Array.isArray(commands)) fail(`${chatConfigPath} must define publishedConfig.agentTopology.slashCommands for Grocery Twin`);
  const trigger = String(demo.commandTrigger || '').trim().replace(/^\/+/, '').toLowerCase();
  const command = commands.find((item) => item?.enabled !== false && String(item?.trigger || '').trim().replace(/^\/+/, '').toLowerCase() === trigger);
  const attachment = command?.attachmentInput;
  const accepted = attachment?.acceptedMimeTypes;
  if (
    !command
    || command.execution?.type !== 'operator_action'
    || attachment?.inputKey !== 'inventory_photos'
    || attachment?.multiple === false
    || attachment?.maxFiles > 6
    || attachment?.maxBytesPerFile > 10 * 1024 * 1024
    || typeof attachment?.resolverInstructions !== 'string'
    || !attachment.resolverInstructions.trim()
    || !Array.isArray(accepted)
    || accepted.length === 0
    || accepted.some((mime) => !['image/jpeg', 'image/png', 'image/webp', 'image/heic'].includes(mime))
  ) {
    fail(`landingPage.groceryTwin.hero.restockDemo.commandTrigger must reference the enabled, bounded /restock image-attachment operator command in ${chatConfigPath}`);
  }
}

function validateEventIntroductionCommand(landingPage, chatConfigPath) {
  const demo = landingPage?.eventIntroductions?.hero?.briefDemo;
  if (demo?.enabled !== true || !chatConfigPath) return;
  const chatConfig = JSON.parse(fs.readFileSync(chatConfigPath, 'utf8'));
  const commands = chatConfig?.publishedConfig?.agentTopology?.slashCommands;
  if (!Array.isArray(commands)) fail(`${chatConfigPath} must define publishedConfig.agentTopology.slashCommands for Event Introductions`);
  const trigger = String(demo.commandTrigger || '').trim().replace(/^\/+/, '').toLowerCase();
  const command = commands.find((item) => item?.enabled !== false && String(item?.trigger || '').trim().replace(/^\/+/, '').toLowerCase() === trigger);
  if (!command || command.execution?.type !== 'operator_action') fail(`landingPage.eventIntroductions.hero.briefDemo.commandTrigger must reference an enabled operator_action command in ${chatConfigPath}`);
}

function validateHomeIntroductionCommand(landingPage, chatConfigPath) {
  const demo = landingPage?.homeIntroductions?.hero?.briefDemo;
  if (demo?.enabled !== true || !chatConfigPath) return;
  const chatConfig = JSON.parse(fs.readFileSync(chatConfigPath, 'utf8'));
  const commands = chatConfig?.publishedConfig?.agentTopology?.slashCommands;
  if (!Array.isArray(commands)) fail(`${chatConfigPath} must define publishedConfig.agentTopology.slashCommands for Home Introductions`);
  const trigger = String(demo.commandTrigger || '').trim().replace(/^\/+/, '').toLowerCase();
  const command = commands.find((item) => item?.enabled !== false && String(item?.trigger || '').trim().replace(/^\/+/, '').toLowerCase() === trigger);
  if (!command || command.execution?.type !== 'operator_action') fail(`landingPage.homeIntroductions.hero.briefDemo.commandTrigger must reference an enabled operator_action command in ${chatConfigPath}`);
}

function validateLandingPageModel(landingPage, chatConfigPath, definitionFilePath) {
  if (!landingPage || typeof landingPage !== 'object') fail('landingPage object is required');
  if (!landingPage.headline || !String(landingPage.headline).trim()) fail('landingPage.headline is required');
  assertNoEmoji(landingPage);

  if (landingPage.localization !== undefined) {
    const localization = landingPage.localization;
    if (!localization || typeof localization !== 'object' || Array.isArray(localization)) fail('landingPage.localization must be an object');
    if (localization.translation !== undefined) {
      const translation = localization.translation;
      if (!translation || typeof translation !== 'object' || Array.isArray(translation)) fail('landingPage.localization.translation must be an object');
      if (typeof translation.enabled !== 'boolean') fail('landingPage.localization.translation.enabled must be a boolean');
      if (!LANGUAGE_CODES.has(translation.sourceLanguage || '')) fail('landingPage.localization.translation.sourceLanguage must come from the shared language catalogue');
      if (!LANGUAGE_CODES.has(translation.defaultLanguage || '')) fail('landingPage.localization.translation.defaultLanguage must come from the shared language catalogue');
      if (translation.autoDetectCountryLanguage !== undefined && typeof translation.autoDetectCountryLanguage !== 'boolean') fail('landingPage.localization.translation.autoDetectCountryLanguage must be a boolean');
      if (translation.generatedTranslations !== undefined) {
        if (!Array.isArray(translation.generatedTranslations)) fail('landingPage.localization.translation.generatedTranslations must be an array');
        const generatedKeys = new Set();
        const configuredRegionKeys = new Set(Array.isArray(localization.regionalPages) ? localization.regionalPages.map((region) => region?.key).filter(Boolean) : []);
        translation.generatedTranslations.forEach((generated, generatedIndex) => {
          const path = `landingPage.localization.translation.generatedTranslations[${generatedIndex}]`;
          if (!generated || typeof generated !== 'object' || Array.isArray(generated)) fail(`${path} must be an object`);
          if (!LANGUAGE_CODES.has(generated.language || '')) fail(`${path}.language must come from the shared language catalogue`);
          if (generated.regionKey !== undefined && generated.regionKey !== null && !REGION_KEY.test(generated.regionKey)) fail(`${path}.regionKey must be a regional key or null`);
          if (generated.regionKey && !configuredRegionKeys.has(generated.regionKey)) fail(`${path}.regionKey must reference an existing regional page`);
          const generatedKey = `${generated.regionKey || ''}:${generated.language}`;
          if (generatedKeys.has(generatedKey)) fail(`${path} duplicates a generated region/language pair`);
          generatedKeys.add(generatedKey);
          if (!SOURCE_REVISION.test(generated.sourceRevision || '')) fail(`${path}.sourceRevision must be a SHA-256 revision`);
          const hasInlinePage = Boolean(generated.page && typeof generated.page === 'object' && !Array.isArray(generated.page));
          const hasAssetPath = generated.assetPath !== undefined;
          const expectedAssetPath = `assets/landing-page${generated.regionKey ? `.${generated.regionKey}` : ''}.${String(generated.language || '').toLowerCase()}.json`;
          if (hasInlinePage && hasAssetPath) fail(`${path} must use either an inline legacy page or one language asset, not both`);
          if (hasAssetPath && generated.assetPath !== expectedAssetPath) fail(`${path}.assetPath must be ${expectedAssetPath}`);
          if (!hasInlinePage && !hasAssetPath) fail(`${path} must include a language asset path`);
          if (hasInlinePage && generated.page.localization !== undefined) fail(`${path}.page.localization is not allowed`);
          if (hasInlinePage && generated.chatEmbedConfig !== undefined && (!generated.chatEmbedConfig || typeof generated.chatEmbedConfig !== 'object' || Array.isArray(generated.chatEmbedConfig))) fail(`${path}.chatEmbedConfig must be an object`);
          if (generated.generatedAt !== undefined && (typeof generated.generatedAt !== 'string' || Number.isNaN(Date.parse(generated.generatedAt)))) fail(`${path}.generatedAt must be an ISO date string`);
          if (hasInlinePage) validateLandingPageModel(generated.page, chatConfigPath, definitionFilePath);
          if (hasAssetPath && definitionFilePath) {
            const assetFilePath = nodePath.join(nodePath.resolve(nodePath.dirname(definitionFilePath), '..'), generated.assetPath);
            if (!fs.existsSync(assetFilePath)) fail(`${path}.assetPath does not exist: ${generated.assetPath}`);
            const asset = JSON.parse(fs.readFileSync(assetFilePath, 'utf8'));
            if (asset.schemaVersion !== 1) fail(`${generated.assetPath}.schemaVersion must be 1`);
            if (asset.language !== generated.language || (asset.regionKey || null) !== (generated.regionKey || null) || asset.sourceRevision !== generated.sourceRevision) {
              fail(`${generated.assetPath} metadata must match ${path}`);
            }
            if (!asset.landingPage || typeof asset.landingPage !== 'object' || Array.isArray(asset.landingPage)) fail(`${generated.assetPath}.landingPage must be a complete page object`);
            if (asset.landingPage.localization !== undefined) fail(`${generated.assetPath}.landingPage.localization is not allowed`);
            if (asset.chatEmbedConfig !== undefined && (!asset.chatEmbedConfig || typeof asset.chatEmbedConfig !== 'object' || Array.isArray(asset.chatEmbedConfig))) fail(`${generated.assetPath}.chatEmbedConfig must be an object`);
            validateLandingPageModel(asset.landingPage, chatConfigPath, definitionFilePath);
          }
        });
      }
    }
    if (localization.regionalPages !== undefined) {
      if (!Array.isArray(localization.regionalPages)) fail('landingPage.localization.regionalPages must be an array');
      const regionKeys = new Set();
      const countryCodes = new Set();
      localization.regionalPages.forEach((region, regionIndex) => {
        const path = `landingPage.localization.regionalPages[${regionIndex}]`;
        if (!region || typeof region !== 'object' || Array.isArray(region)) fail(`${path} must be an object`);
        if (!REGION_KEY.test(region.key || '') || regionKeys.has(region.key)) fail(`${path}.key must be a unique lowercase key containing letters, numbers, and hyphens`);
        regionKeys.add(region.key);
        if (!region.label || !String(region.label).trim()) fail(`${path}.label is required`);
        if (!Array.isArray(region.countryCodes) || region.countryCodes.length === 0) fail(`${path}.countryCodes must contain at least one country`);
        const localCountries = new Set();
        region.countryCodes.forEach((countryCode, countryIndex) => {
          if (!COUNTRY_CODE.test(countryCode) || localCountries.has(countryCode) || countryCodes.has(countryCode)) fail(`${path}.countryCodes[${countryIndex}] must be a unique uppercase ISO country code`);
          localCountries.add(countryCode);
          countryCodes.add(countryCode);
        });
        if (!LANGUAGE_CODES.has(region.defaultLanguage || '')) fail(`${path}.defaultLanguage must come from the shared language catalogue`);
        if (!region.page || typeof region.page !== 'object' || Array.isArray(region.page)) fail(`${path}.page must be a complete landing page object`);
        if (region.page.localization !== undefined) fail(`${path}.page.localization is not allowed; regional pages cannot recursively localize`);
        validateLandingPageModel(region.page, chatConfigPath, definitionFilePath);
      });
    }
  }

  if (landingPage.design !== undefined) {
    const design = landingPage.design;
    if (!design || typeof design !== 'object') fail('landingPage.design must be an object');
    if (design.variant !== undefined && !ALLOWED_DESIGN_VARIANTS.has(design.variant)) {
      fail(`landingPage.design.variant must be one of: ${[...ALLOWED_DESIGN_VARIANTS].join(', ')}`);
    }
    if (design.defaultThemeMode !== undefined && !ALLOWED_THEME_MODES.has(design.defaultThemeMode)) {
      fail('landingPage.design.defaultThemeMode must be "light" or "dark"');
    }
    if (design.theme !== undefined) {
      const theme = design.theme;
      if (!theme || typeof theme !== 'object') fail('landingPage.design.theme must be an object');
      if (theme.palette !== undefined && !ALLOWED_PALETTES.has(theme.palette)) {
        fail(`landingPage.design.theme.palette must be one of: ${[...ALLOWED_PALETTES].join(', ')}`);
      }
      if (!ALLOWED_THEME_COLORS.has(theme.primaryColor)) {
        fail(`landingPage.design.theme.primaryColor must be one of: ${[...ALLOWED_THEME_COLORS].join(', ')}`);
      }
      for (const key of ['secondaryColor', 'accentColor']) {
        if (theme[key] !== undefined && !ALLOWED_THEME_COLORS.has(theme[key])) {
          fail(`landingPage.design.theme.${key} must be one of: ${[...ALLOWED_THEME_COLORS].join(', ')}`);
        }
      }
    }
    if (design.brand !== undefined) {
      const brand = design.brand;
      if (!brand || typeof brand !== 'object' || Array.isArray(brand)) fail('landingPage.design.brand must be an object');
      if (brand.presetRevision !== undefined && brand.presetRevision !== 1) {
        fail('landingPage.design.brand.presetRevision must be 1');
      }
      if (brand.colors !== undefined) {
        if (!brand.colors || typeof brand.colors !== 'object' || Array.isArray(brand.colors)) {
          fail('landingPage.design.brand.colors must be an object');
        }
        for (const mode of ['light', 'dark']) {
          const seeds = brand.colors[mode];
          if (seeds === undefined) continue;
          if (!seeds || typeof seeds !== 'object' || Array.isArray(seeds)) {
            fail(`landingPage.design.brand.colors.${mode} must be an object`);
          }
          for (const [key, value] of Object.entries(seeds)) {
            if (!BRAND_COLOR_KEYS.includes(key)) fail(`landingPage.design.brand.colors.${mode}.${key} is not a supported brand seed`);
            if (!NORMALIZED_HEX.test(value)) fail(`landingPage.design.brand.colors.${mode}.${key} must be normalized #rrggbb`);
          }
          if (seeds.text && seeds.surface && contrastRatio(seeds.text, seeds.surface) < 4.5) {
            fail(`landingPage.design.brand.colors.${mode}.text must have at least 4.5:1 contrast against surface`);
          }
          if (seeds.text && seeds.canvas && contrastRatio(seeds.text, seeds.canvas) < 4.5) {
            fail(`landingPage.design.brand.colors.${mode}.text must have at least 4.5:1 contrast against canvas`);
          }
          if (seeds.accent && seeds.surface && contrastRatio(seeds.accent, seeds.surface) < 3) {
            console.warn(`Warning: landingPage.design.brand.colors.${mode}.accent is below 3:1 contrast against surface`);
          }
        }
      }
      if (brand.typography !== undefined) {
        if (!brand.typography || typeof brand.typography !== 'object' || Array.isArray(brand.typography)) {
          fail('landingPage.design.brand.typography must be an object');
        }
        for (const [role, choice] of Object.entries(brand.typography)) {
          if (!['body', 'display', 'label'].includes(role)) fail(`landingPage.design.brand.typography.${role} is not supported`);
          if (!choice || typeof choice !== 'object' || Array.isArray(choice)) fail(`landingPage.design.brand.typography.${role} must be an object`);
          if (choice.source === 'builtin') {
            if (!ALLOWED_BUILTIN_FONTS.has(choice.family)) fail(`landingPage.design.brand.typography.${role}.family is not a supported built-in font`);
          } else if (choice.source === 'google') {
            if (typeof choice.family !== 'string' || !SAFE_GOOGLE_FONT.test(choice.family.trim())) {
              fail(`landingPage.design.brand.typography.${role}.family is not a safe Google Font family name`);
            }
          } else {
            fail(`landingPage.design.brand.typography.${role}.source must be "builtin" or "google"`);
          }
        }
      }
    }
  }
  if (landingPage.design?.variant === 'form-operations') validateFormOperations(landingPage);
  if (landingPage.design?.variant === 'logistics-portal') validateLogisticsPortal(landingPage);
  if (landingPage.design?.variant === 'cinematic-campaigns') validateCinematicCampaigns(landingPage);
  if (landingPage.design?.variant === 'recruiting-operations') validateRecruitingOperations(landingPage);
  if (landingPage.design?.variant === 'grocery-twin') validateGroceryTwin(landingPage);
  if (landingPage.design?.variant === 'event-introductions') validateEventIntroductions(landingPage);
  if (landingPage.design?.variant === 'home-introductions') validateHomeIntroductions(landingPage);

  if (landingPage.header !== undefined) {
    const header = landingPage.header;
    if (!header || typeof header !== 'object') fail('landingPage.header must be an object');
    if (header.brandMark !== undefined && !ALLOWED_BRAND_MARKS.has(header.brandMark)) {
      fail(`landingPage.header.brandMark must be one of: ${[...ALLOWED_BRAND_MARKS].join(', ')}`);
    }
    if (header.ctaLabel !== undefined && typeof header.ctaLabel !== 'string') {
      fail('landingPage.header.ctaLabel must be a string');
    }
    if (header.navItems !== undefined) {
      if (!Array.isArray(header.navItems)) fail('landingPage.header.navItems must be an array');
      const allowedHeaderTargets = landingPage.design?.variant === 'grocery-twin' ? GROCERY_TARGETS : ALLOWED_NAV_TARGETS;
      header.navItems.forEach((item, index) => {
        const label = `landingPage.header.navItems[${index}]`;
        if (!item || typeof item !== 'object') fail(`${label} must be an object`);
        if (!item.label || !String(item.label).trim()) fail(`${label}.label is required`);
        if (!allowedHeaderTargets.has(item.target)) {
          fail(`${label}.target must be one of: ${[...allowedHeaderTargets].join(', ')}`);
        }
      });
    }
  }

  for (const key of ['badge', 'headlineAccent', 'headlineLine2', 'subheadline', 'ctaLabel', 'secondaryCtaLabel']) {
    if (landingPage[key] !== undefined && typeof landingPage[key] !== 'string') {
      fail(`landingPage.${key} must be a string`);
    }
  }
  if (landingPage.headlineAccent && !landingPage.headline.includes(landingPage.headlineAccent)) {
    fail('landingPage.headlineAccent must be a substring of landingPage.headline');
  }

  if (landingPage.featureTags !== undefined) {
    if (!Array.isArray(landingPage.featureTags)) fail('landingPage.featureTags must be an array');
    landingPage.featureTags.forEach((tag, index) => {
      if (typeof tag !== 'string' || !tag.trim()) fail(`landingPage.featureTags[${index}] must be a non-empty string`);
    });
  }

  if (landingPage.demoConversation !== undefined) {
    if (!Array.isArray(landingPage.demoConversation)) fail('landingPage.demoConversation must be an array');
    landingPage.demoConversation.forEach((message, index) => {
      const label = `landingPage.demoConversation[${index}]`;
      if (!message || typeof message !== 'object') fail(`${label} must be an object`);
      if (!ALLOWED_ROLES.has(message.role)) fail(`${label}.role must be "user" or "assistant"`);
      if (!message.text || !String(message.text).trim()) fail(`${label}.text is required`);
    });
  }

  if (landingPage.heroChat !== undefined) {
    const heroChat = landingPage.heroChat;
    if (!heroChat || typeof heroChat !== 'object') fail('landingPage.heroChat must be an object');
    for (const key of ['statusLabel', 'inputPlaceholder']) {
      if (heroChat[key] !== undefined && typeof heroChat[key] !== 'string') {
        fail(`landingPage.heroChat.${key} must be a string`);
      }
    }
    if (heroChat.suggestedPrompts !== undefined) {
      if (!Array.isArray(heroChat.suggestedPrompts)) fail('landingPage.heroChat.suggestedPrompts must be an array');
      heroChat.suggestedPrompts.forEach((prompt, index) => {
        if (typeof prompt !== 'string' || !prompt.trim()) {
          fail(`landingPage.heroChat.suggestedPrompts[${index}] must be a non-empty string`);
        }
      });
    }
  }

  const features = landingPage.features;
  if (features !== undefined) {
    if (!Array.isArray(features)) fail('landingPage.features must be an array');
    features.forEach((feature, index) => {
      const label = `landingPage.features[${index}]`;
      if (!feature || typeof feature !== 'object') fail(`${label} must be an object`);
      if (!feature.title || !String(feature.title).trim()) fail(`${label}.title is required`);
      if (!feature.body || !String(feature.body).trim()) fail(`${label}.body is required`);
      validateIcon(feature.icon, `${label}.icon`);
    });
  }

  if (landingPage.gallery !== undefined) {
    const gallery = landingPage.gallery;
    if (!gallery || typeof gallery !== 'object') fail('landingPage.gallery must be an object');
    validateIcon(gallery.icon, 'landingPage.gallery.icon');
    if (!gallery.heading || !String(gallery.heading).trim()) fail('landingPage.gallery.heading is required');
    if (gallery.headingAccent !== undefined && typeof gallery.headingAccent !== 'string') {
      fail('landingPage.gallery.headingAccent must be a string');
    }
    if (gallery.headingAccent && !gallery.heading.includes(gallery.headingAccent)) {
      fail('landingPage.gallery.headingAccent must be a substring of landingPage.gallery.heading');
    }
    if (gallery.body !== undefined && typeof gallery.body !== 'string') fail('landingPage.gallery.body must be a string');
    if (!Array.isArray(gallery.items) || gallery.items.length === 0) fail('landingPage.gallery.items must be a non-empty array');
    gallery.items.forEach((item, index) => {
      const label = `landingPage.gallery.items[${index}]`;
      if (!item || typeof item !== 'object') fail(`${label} must be an object`);
      for (const key of ['image', 'alt', 'caption']) {
        if (!item[key] || !String(item[key]).trim()) fail(`${label}.${key} is required`);
      }
    });
  }

  if (landingPage.bento !== undefined) {
    const bento = landingPage.bento;
    if (!bento || typeof bento !== 'object') fail('landingPage.bento must be an object');
    for (const key of ['photoTall', 'photoWide']) {
      const photo = bento[key];
      if (!photo || typeof photo !== 'object') fail(`landingPage.bento.${key} must be an object`);
      for (const field of ['image', 'alt', 'name', 'meta']) {
        if (!photo[field] || !String(photo[field]).trim()) fail(`landingPage.bento.${key}.${field} is required`);
      }
    }
    for (const key of ['mainCard', 'ctaCard', 'smallCardA', 'smallCardB']) {
      const card = bento[key];
      if (!card || typeof card !== 'object') fail(`landingPage.bento.${key} must be an object`);
      validateIcon(card.icon, `landingPage.bento.${key}.icon`, true);
      for (const field of ['title', 'body']) {
        if (!card[field] || !String(card[field]).trim()) fail(`landingPage.bento.${key}.${field} is required`);
      }
    }
    if (!bento.ctaCard.ctaLabel || !String(bento.ctaCard.ctaLabel).trim()) {
      fail('landingPage.bento.ctaCard.ctaLabel is required');
    }
    if (bento.mainCard.tags !== undefined) {
      if (!Array.isArray(bento.mainCard.tags)) fail('landingPage.bento.mainCard.tags must be an array');
      bento.mainCard.tags.forEach((tag, index) => {
        if (typeof tag !== 'string' || !tag.trim()) fail(`landingPage.bento.mainCard.tags[${index}] must be a non-empty string`);
      });
    }
  }

  if (landingPage.statement !== undefined) {
    const statement = landingPage.statement;
    if (!statement || typeof statement !== 'object') fail('landingPage.statement must be an object');
    if (!statement.kicker || !String(statement.kicker).trim()) fail('landingPage.statement.kicker is required');
    if (!Array.isArray(statement.segments) || statement.segments.length === 0) {
      fail('landingPage.statement.segments must be a non-empty array');
    }
    statement.segments.forEach((segment, index) => {
      const label = `landingPage.statement.segments[${index}]`;
      if (!segment || typeof segment !== 'object') fail(`${label} must be an object`);
      if (!segment.text || !String(segment.text).trim()) fail(`${label}.text is required`);
      if (segment.tone !== undefined && !['strong', 'muted', 'iris', 'accent'].includes(segment.tone)) {
        fail(`${label}.tone must be one of: strong, muted, iris, accent`);
      }
    });
  }

  if (landingPage.deployment !== undefined) {
    const deployment = landingPage.deployment;
    if (!deployment || typeof deployment !== 'object') fail('landingPage.deployment must be an object');
    for (const key of ['kicker', 'heading', 'body', 'personaLabel', 'platformLabel', 'note']) {
      if (!deployment[key] || !String(deployment[key]).trim()) fail(`landingPage.deployment.${key} is required`);
    }
    if (!Array.isArray(deployment.items) || deployment.items.length === 0) {
      fail('landingPage.deployment.items must be a non-empty array');
    }
    deployment.items.forEach((item, index) => {
      const label = `landingPage.deployment.items[${index}]`;
      if (!item || typeof item !== 'object') fail(`${label} must be an object`);
      for (const key of ['code', 'title', 'body']) {
        if (!item[key] || !String(item[key]).trim()) fail(`${label}.${key} is required`);
      }
    });
    if (!Array.isArray(deployment.boundaryItems) || deployment.boundaryItems.length === 0) {
      fail('landingPage.deployment.boundaryItems must be a non-empty array');
    }
    deployment.boundaryItems.forEach((item, index) => {
      if (typeof item !== 'string' || !item.trim()) fail(`landingPage.deployment.boundaryItems[${index}] must be a non-empty string`);
    });
  }

  if (landingPage.useCases !== undefined) {
    const useCases = landingPage.useCases;
    if (!useCases || typeof useCases !== 'object') fail('landingPage.useCases must be an object');
    validateIcon(useCases.icon, 'landingPage.useCases.icon');
    if (!useCases.heading || !String(useCases.heading).trim()) fail('landingPage.useCases.heading is required');
    if (useCases.headingAccent !== undefined && typeof useCases.headingAccent !== 'string') {
      fail('landingPage.useCases.headingAccent must be a string');
    }
    if (useCases.headingAccent && !useCases.heading.includes(useCases.headingAccent)) {
      fail('landingPage.useCases.headingAccent must be a substring of landingPage.useCases.heading');
    }
    if (!Array.isArray(useCases.items) || useCases.items.length === 0) {
      fail('landingPage.useCases.items must be a non-empty array');
    }
    useCases.items.forEach((item, index) => {
      const label = `landingPage.useCases.items[${index}]`;
      if (!item || typeof item !== 'object') fail(`${label} must be an object`);
      if (!item.label || !String(item.label).trim()) fail(`${label}.label is required`);
      for (const key of ['number', 'mode', 'outcome', 'summary', 'inputSummary', 'outputSummary']) {
        if (item[key] !== undefined && typeof item[key] !== 'string') fail(`${label}.${key} must be a string`);
      }

      if (!Array.isArray(item.inputs) || item.inputs.length === 0) fail(`${label}.inputs must be a non-empty array`);
      item.inputs.forEach((input, i) => {
        const l = `${label}.inputs[${i}]`;
        if (!input || typeof input !== 'object') fail(`${l} must be an object`);
        for (const key of ['code', 'description']) {
          if (!input[key] || !String(input[key]).trim()) fail(`${l}.${key} is required`);
        }
      });

      if (!Array.isArray(item.capabilities) || item.capabilities.length === 0) fail(`${label}.capabilities must be a non-empty array`);
      item.capabilities.forEach((capability, i) => {
        const l = `${label}.capabilities[${i}]`;
        if (!capability || typeof capability !== 'object') fail(`${l} must be an object`);
        for (const key of ['modality', 'description']) {
          if (!capability[key] || !String(capability[key]).trim()) fail(`${l}.${key} is required`);
        }
      });

      if (!Array.isArray(item.outputs) || item.outputs.length === 0) fail(`${label}.outputs must be a non-empty array`);
      item.outputs.forEach((output, i) => {
        if (typeof output !== 'string' || !output.trim()) fail(`${label}.outputs[${i}] must be a non-empty string`);
      });

      if (!Array.isArray(item.workflow) || item.workflow.length === 0) fail(`${label}.workflow must be a non-empty array`);
      item.workflow.forEach((step, i) => {
        const l = `${label}.workflow[${i}]`;
        if (!step || typeof step !== 'object') fail(`${l} must be an object`);
        for (const key of ['stage', 'description']) {
          if (!step[key] || !String(step[key]).trim()) fail(`${l}.${key} is required`);
        }
      });

      if (!item.selfLearning || typeof item.selfLearning !== 'object') fail(`${label}.selfLearning must be an object`);
      for (const key of ['learns', 'neverChanges']) {
        if (!item.selfLearning[key] || !String(item.selfLearning[key]).trim()) fail(`${label}.selfLearning.${key} is required`);
      }
    });
  }

  if (landingPage.platform !== undefined) {
    const platform = landingPage.platform;
    if (!platform || typeof platform !== 'object') fail('landingPage.platform must be an object');
    for (const key of ['kicker', 'heading', 'body']) {
      if (!platform[key] || !String(platform[key]).trim()) fail(`landingPage.platform.${key} is required`);
    }
    if (!Array.isArray(platform.items) || platform.items.length === 0) fail('landingPage.platform.items must be a non-empty array');
    platform.items.forEach((item, index) => {
      const label = `landingPage.platform.items[${index}]`;
      if (!item || typeof item !== 'object') fail(`${label} must be an object`);
      for (const key of ['image', 'title', 'body']) {
        if (!item[key] || !String(item[key]).trim()) fail(`${label}.${key} is required`);
      }
      if (item.alt !== undefined && typeof item.alt !== 'string') fail(`${label}.alt must be a string`);
    });
  }

  if (landingPage.trust !== undefined) {
    const trust = landingPage.trust;
    if (!trust || typeof trust !== 'object') fail('landingPage.trust must be an object');
    for (const key of ['kicker', 'heading', 'body', 'statusLabel', 'statusValue', 'statusDetail']) {
      if (!trust[key] || !String(trust[key]).trim()) fail(`landingPage.trust.${key} is required`);
    }
    if (!Array.isArray(trust.controls) || trust.controls.length === 0) fail('landingPage.trust.controls must be a non-empty array');
    trust.controls.forEach((control, index) => {
      const label = `landingPage.trust.controls[${index}]`;
      if (!control || typeof control !== 'object') fail(`${label} must be an object`);
      for (const key of ['title', 'body']) {
        if (!control[key] || !String(control[key]).trim()) fail(`${label}.${key} is required`);
      }
    });
  }

  if (landingPage.footer !== undefined) {
    const footer = landingPage.footer;
    if (!footer || typeof footer !== 'object') fail('landingPage.footer must be an object');
    if (!footer.tagline || !String(footer.tagline).trim()) fail('landingPage.footer.tagline is required');
    for (const key of ['exploreLabel', 'useCasesLabel', 'getStartedLabel']) {
      if (footer[key] !== undefined && typeof footer[key] !== 'string') fail(`landingPage.footer.${key} must be a string`);
    }
    if (footer.useCaseLinks !== undefined) {
      if (!Array.isArray(footer.useCaseLinks)) fail('landingPage.footer.useCaseLinks must be an array');
      footer.useCaseLinks.forEach((label, index) => {
        if (typeof label !== 'string' || !label.trim()) fail(`landingPage.footer.useCaseLinks[${index}] must be a non-empty string`);
      });
    }
  }

  if (landingPage.howItWorks !== undefined) {
    const howItWorks = landingPage.howItWorks;
    if (!howItWorks || typeof howItWorks !== 'object') fail('landingPage.howItWorks must be an object');
    validateIcon(howItWorks.icon, 'landingPage.howItWorks.icon');
    for (const key of ['kicker', 'heading']) {
      if (!howItWorks[key] || !String(howItWorks[key]).trim()) fail(`landingPage.howItWorks.${key} is required`);
    }
    if (howItWorks.headingAccent !== undefined && typeof howItWorks.headingAccent !== 'string') {
      fail('landingPage.howItWorks.headingAccent must be a string');
    }
    if (howItWorks.headingAccent && !howItWorks.heading.includes(howItWorks.headingAccent)) {
      fail('landingPage.howItWorks.headingAccent must be a substring of landingPage.howItWorks.heading');
    }
    if (!Array.isArray(howItWorks.steps) || howItWorks.steps.length === 0) {
      fail('landingPage.howItWorks.steps must be a non-empty array');
    }
    howItWorks.steps.forEach((step, index) => {
      const label = `landingPage.howItWorks.steps[${index}]`;
      if (!step || typeof step !== 'object') fail(`${label} must be an object`);
      validateIcon(step.icon, `${label}.icon`, true);
      for (const key of ['title', 'body']) {
        if (!step[key] || !String(step[key]).trim()) fail(`${label}.${key} is required`);
      }
    });
  }

  if (landingPage.faqs !== undefined) {
    if (!Array.isArray(landingPage.faqs)) fail('landingPage.faqs must be an array');
    landingPage.faqs.forEach((faq, index) => {
      const label = `landingPage.faqs[${index}]`;
      if (!faq || typeof faq !== 'object') fail(`${label} must be an object`);
      if (!faq.question || !String(faq.question).trim()) fail(`${label}.question is required`);
      if (!faq.answer || !String(faq.answer).trim()) fail(`${label}.answer is required`);
    });
  }

  if (landingPage.stories !== undefined) {
    const stories = landingPage.stories;
    if (!stories || typeof stories !== 'object') fail('landingPage.stories must be an object');
    validateIcon(stories.icon, 'landingPage.stories.icon');
    for (const key of ['heading', 'quote', 'attribution']) {
      if (!stories[key] || !String(stories[key]).trim()) fail(`landingPage.stories.${key} is required`);
    }
    for (const key of ['kicker', 'meta']) {
      if (stories[key] !== undefined && typeof stories[key] !== 'string') {
        fail(`landingPage.stories.${key} must be a string`);
      }
    }
    if (stories.people !== undefined) {
      if (!Array.isArray(stories.people)) fail('landingPage.stories.people must be an array');
      stories.people.forEach((person, index) => {
        const label = `landingPage.stories.people[${index}]`;
        if (!person || typeof person !== 'object') fail(`${label} must be an object`);
        if (!person.image || !String(person.image).trim()) fail(`${label}.image is required`);
        if (!person.alt || !String(person.alt).trim()) fail(`${label}.alt is required`);
      });
    }
    if (stories.stats !== undefined) {
      if (!Array.isArray(stories.stats)) fail('landingPage.stories.stats must be an array');
      stories.stats.forEach((stat, index) => {
        const label = `landingPage.stories.stats[${index}]`;
        if (!stat || typeof stat !== 'object') fail(`${label} must be an object`);
        if (!stat.value || !String(stat.value).trim()) fail(`${label}.value is required`);
        if (!stat.label || !String(stat.label).trim()) fail(`${label}.label is required`);
        validateIcon(stat.icon, `${label}.icon`);
      });
    }
  }

  if (landingPage.faqIntro !== undefined) {
    const faqIntro = landingPage.faqIntro;
    if (!faqIntro || typeof faqIntro !== 'object') fail('landingPage.faqIntro must be an object');
    validateIcon(faqIntro.icon, 'landingPage.faqIntro.icon');
    if (!faqIntro.heading || !String(faqIntro.heading).trim()) fail('landingPage.faqIntro.heading is required');
    if (faqIntro.kicker !== undefined && typeof faqIntro.kicker !== 'string') {
      fail('landingPage.faqIntro.kicker must be a string');
    }
  }

  if (landingPage.contact !== undefined) {
    const contact = landingPage.contact;
    if (!contact || typeof contact !== 'object') fail('landingPage.contact must be an object');
    for (const key of ['heading', 'body', 'email']) {
      if (contact[key] !== undefined && typeof contact[key] !== 'string') {
        fail(`landingPage.contact.${key} must be a string`);
      }
    }
  }

  if (landingPage.backgroundVideo !== undefined) {
    const backgroundVideo = landingPage.backgroundVideo;
    if (!backgroundVideo || typeof backgroundVideo !== 'object') fail('landingPage.backgroundVideo must be an object');
    if (!backgroundVideo.src || !String(backgroundVideo.src).trim()) fail('landingPage.backgroundVideo.src is required');
    if (backgroundVideo.poster !== undefined && typeof backgroundVideo.poster !== 'string') {
      fail('landingPage.backgroundVideo.poster must be a string');
    }
  }

  if (landingPage.backgroundImage !== undefined) {
    const backgroundImage = landingPage.backgroundImage;
    if (!backgroundImage || typeof backgroundImage !== 'object') fail('landingPage.backgroundImage must be an object');
    if (!backgroundImage.src || !String(backgroundImage.src).trim()) fail('landingPage.backgroundImage.src is required');
    if (backgroundImage.alt !== undefined && typeof backgroundImage.alt !== 'string') {
      fail('landingPage.backgroundImage.alt must be a string');
    }
  }

  if (landingPage.seoImage !== undefined) {
    const seoImage = landingPage.seoImage;
    if (!seoImage || typeof seoImage !== 'object') fail('landingPage.seoImage must be an object');
    if (!seoImage.src || !String(seoImage.src).trim()) fail('landingPage.seoImage.src is required');
    if (seoImage.alt !== undefined && typeof seoImage.alt !== 'string') {
      fail('landingPage.seoImage.alt must be a string');
    }
  }

  if (landingPage.backgroundVideo !== undefined && landingPage.backgroundImage !== undefined) {
    fail('landingPage must use either backgroundVideo or backgroundImage, not both');
  }

  if (landingPage.closing !== undefined) {
    const closing = landingPage.closing;
    if (!closing || typeof closing !== 'object') fail('landingPage.closing must be an object');
    if (!closing.heading || !String(closing.heading).trim()) fail('landingPage.closing.heading is required');
    for (const key of ['kicker', 'body', 'ctaLabel']) {
      if (closing[key] !== undefined && typeof closing[key] !== 'string') {
        fail(`landingPage.closing.${key} must be a string`);
      }
    }
  }
  validateCaptureCommand(landingPage, chatConfigPath);
  validateLogisticsPortalCommand(landingPage, chatConfigPath);
  validateCinematicCommand(landingPage, chatConfigPath);
  validateRecruitingCommand(landingPage, chatConfigPath);
  validateGroceryCommand(landingPage, chatConfigPath);
  validateEventIntroductionCommand(landingPage, chatConfigPath);
  validateHomeIntroductionCommand(landingPage, chatConfigPath);
}

function validate(filePath, chatConfigPath) {
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (parsed.schemaVersion !== 2) fail('schemaVersion must be 2');
  if (!parsed.resourceKey || !String(parsed.resourceKey).trim()) fail('resourceKey is required');
  if (parsed.runtimeDataPolicy !== 'definitions_only') fail('runtimeDataPolicy must be "definitions_only"');
  validateLandingPageModel(parsed.landingPage, chatConfigPath, filePath);
}

const filePath = process.argv[2] || 'assets/landing-page.json';
const chatConfigPath = process.argv[3];
try {
  validate(filePath, chatConfigPath);
  console.log(`Valid landing page definition: ${filePath}${chatConfigPath ? ` (paired with ${chatConfigPath})` : ''}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
