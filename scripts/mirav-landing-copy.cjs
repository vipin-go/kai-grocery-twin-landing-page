// Generated structural validator; all persona display content remains in its model repository.
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMiravPreviewIconPath = void 0;
exports.validateMiravLandingCopy = validateMiravLandingCopy;
exports.miravPrompt = miravPrompt;
const mirav_copy_keys_json_1 = __importDefault(require("./mirav-copy-keys.json"));
const record = (value) => !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value) => typeof value === 'string' && !!value.trim() && value.length <= 4000;
/** These are literal glyphs in illustrative app pins, separate from platform icon keys. */
const isMiravPreviewIconPath = (path) => /^landingPage\.mirav\.(?:activities\.(?:neighborhood|schools)|workshops)(?:\[\d+\]|\.\d+)\.icon$/.test(path);
exports.isMiravPreviewIconPath = isMiravPreviewIconPath;
function validateMiravLandingCopy(value) {
    const issues = [];
    const fail = (path) => issues.push({ path: `landingPage.mirav.${path}`, message: 'Provide the complete authored Mirav presentation field.' });
    if (!record(value) || value.schemaVersion !== 1) {
        fail('schemaVersion');
        return issues;
    }
    if (!record(value.brand) || !text(value.brand.name))
        fail('brand.name');
    if (!record(value.ui) || Object.keys(value.ui).length > 500)
        fail('ui');
    else
        for (const key of mirav_copy_keys_json_1.default)
            if (!text(value.ui[key]))
                fail(`ui.${key}`);
    if (!record(value.media) || !text(value.media.portraitImage) || !/^https:\/\/[^\s]+\.(png|webp|jpe?g)(\?[^\s]*)?$/i.test(value.media.portraitImage))
        fail('media.portraitImage');
    for (const field of ['logoImage', 'mapImage'])
        if (!text(value.media?.[field]) || !/^https:\/\/[^\s]+\.(png|webp|jpe?g|svg)(\?[^\s]*)?$/i.test(value.media[field]))
            fail(`media.${field}`);
    const rows = (input, path, fields, min = 1, max = 12) => {
        if (!Array.isArray(input) || input.length < min || input.length > max) {
            fail(path);
            return;
        }
        const ids = new Set();
        input.forEach((item, i) => {
            if (!record(item)) {
                fail(`${path}.${i}`);
                return;
            }
            for (const field of fields)
                if (!text(item[field]))
                    fail(`${path}.${i}.${field}`);
            if ('id' in item) {
                if (ids.has(item.id))
                    fail(`${path}.${i}.id`);
                ids.add(item.id);
            }
        });
    };
    for (const audience of ['neighborhood', 'schools']) {
        const activities = value.activities?.[audience];
        rows(activities, `activities.${audience}`, ['id', 'icon', 'title', 'interest', 'timeLabel', 'venue', 'people', 'age']);
        if (Array.isArray(activities))
            activities.forEach((item, i) => {
                if (!record(item))
                    return;
                if (typeof item.icon !== 'string' || [...item.icon].length > 8)
                    fail(`activities.${audience}.${i}.icon`);
                for (const coordinate of ['x', 'y'])
                    if (!Number.isFinite(item[coordinate]) || item[coordinate] < 0 || item[coordinate] > 100)
                        fail(`activities.${audience}.${i}.${coordinate}`);
            });
        const steps = value.process?.[audience];
        rows(steps, `process.${audience}`, ['id', 'body'], 3, 3);
        if (Array.isArray(steps))
            steps.forEach((step, i) => { if (!Array.isArray(step?.headingLines) || !step.headingLines.length || step.headingLines.some((line) => !text(line)))
                fail(`process.${audience}.${i}.headingLines`); });
    }
    rows(value.workshops, 'workshops', ['id', 'icon', 'title', 'body', 'color', 'outcome']);
    if (Array.isArray(value.workshops))
        value.workshops.forEach((item, i) => { if (typeof item?.icon !== 'string' || [...item.icon].length > 8)
            fail(`workshops.${i}.icon`); });
    for (const [path, choices] of [['cohorts', value.cohorts], ['form.roles', value.form?.roles], ['form.delivery', value.form?.delivery], ['form.funding', value.form?.funding]]) {
        rows(choices, path, ['id', 'label']);
        if (!Array.isArray(choices) || !choices.some(item => item?.selected === true))
            fail(`${path}.selected`);
    }
    for (const key of ['neighborhoodPlan', 'neighborhoodFind', 'schoolPlan', 'schoolProgramme', 'schoolSolution'])
        if (!text(value.actions?.[key]?.command))
            fail(`actions.${key}.command`);
    rows(value.previewPeople, 'previewPeople', ['id', 'code'], 3, 3);
    rows(value.schoolsFaqs, 'schoolsFaqs', ['question', 'answer'], 1, 12);
    rows(value.fundingSources, 'fundingSources', ['id', 'url'], 3, 3);
    if (Array.isArray(value.fundingSources))
        value.fundingSources.forEach((source, i) => { if (!/^https:\/\/[^\s]+$/.test(source?.url || ''))
            fail(`fundingSources.${i}.url`); });
    rows(value.metrics, 'metrics', ['id', 'label'], 3, 3);
    if (Array.isArray(value.metrics))
        value.metrics.forEach((metric, i) => { if (!Number.isFinite(metric?.value) || metric.value < 0)
            fail(`metrics.${i}.value`); });
    if (!text(value.schoolAccount?.code))
        fail('schoolAccount.code');
    if (!text(value.form?.websitePlaceholder))
        fail('form.websitePlaceholder');
    if (!text(value.deviceTimeLabel))
        fail('deviceTimeLabel');
    return issues;
}
/** Literal substitution only; authored prompt templates never execute code. */
function miravPrompt(template, values) {
    return template.replace(/%([a-z]+)%/g, (token, key) => values[key] ?? token);
}
