"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateChakriLandingContent = validateChakriLandingContent;
const chakri_scrap_copy_schema_json_1 = __importDefault(require("../references/chakri-scrap-copy-schema.json"));
function validateChakriLandingContent(content) {
    const issues = [];
    const base = 'landingPage.scrapOperations';
    const record = (value, path, keys) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            issues.push({ path, message: 'Provide the complete Chakri content object.' });
            return false;
        }
        for (const key of Object.keys(value))
            if (!keys.includes(key))
                issues.push({ path: `${path}.${key}`, message: 'Only registered Chakri copy fields are allowed.' });
        return true;
    };
    const text = (value, path) => {
        if (typeof value !== 'string' || !value.trim() || value.length > 700)
            issues.push({ path, message: 'Provide non-empty copy up to 700 characters.' });
    };
    if (!record(content, base, chakri_scrap_copy_schema_json_1.default.roots))
        return issues;
    if (record(content.labels, `${base}.labels`, chakri_scrap_copy_schema_json_1.default.labels))
        for (const key of chakri_scrap_copy_schema_json_1.default.labels)
            text(content.labels[key], `${base}.labels.${key}`);
    const marketCodes = [...chakri_scrap_copy_schema_json_1.default.markets, ...chakri_scrap_copy_schema_json_1.default.optionalMarkets];
    if (record(content.markets, `${base}.markets`, marketCodes))
        for (const code of marketCodes.filter(code => chakri_scrap_copy_schema_json_1.default.markets.includes(code) || Object.prototype.hasOwnProperty.call(content.markets, code))) {
            const market = content.markets[code];
            if (record(market, `${base}.markets.${code}`, chakri_scrap_copy_schema_json_1.default.marketFields))
                for (const key of chakri_scrap_copy_schema_json_1.default.marketFields)
                    text(market[key], `${base}.markets.${code}.${key}`);
        }
    if (content.global !== undefined && record(content.global, `${base}.global`, chakri_scrap_copy_schema_json_1.default.marketFields))
        for (const key of chakri_scrap_copy_schema_json_1.default.marketFields)
            text(content.global[key], `${base}.global.${key}`);
    for (const [key, contract] of Object.entries(chakri_scrap_copy_schema_json_1.default.arrays)) {
        const values = content[key];
        if (!Array.isArray(values) || values.length !== contract.count) {
            issues.push({ path: `${base}.${key}`, message: `Provide exactly ${contract.count} entries.` });
            continue;
        }
        values.forEach((value, index) => { const path = `${base}.${key}[${index}]`; if (record(value, path, contract.fields))
            for (const field of contract.fields)
                text(value[field], `${path}.${field}`); });
    }
    if (content.business !== undefined) {
        const business = content.business;
        const path = `${base}.business`;
        const contract = chakri_scrap_copy_schema_json_1.default.business;
        if (record(business, path, contract.roots)) {
            if (business.defaultSelected !== undefined && typeof business.defaultSelected !== 'boolean')
                issues.push({ path: `${path}.defaultSelected`, message: 'Choose whether this audience defaults to Business.' });
            if (record(business.labels, `${path}.labels`, contract.labels))
                for (const key of contract.labels)
                    text(business.labels[key], `${path}.labels.${key}`);
            for (const [group, keys, fields] of [['sections', contract.sections, contract.sectionFields], ['materials', contract.materials, contract.materialFields]]) {
                const values = business[group];
                if (record(values, `${path}.${group}`, [...keys]))
                    for (const key of keys) {
                        const value = values[key];
                        if (record(value, `${path}.${group}.${key}`, [...fields]))
                            for (const field of fields)
                                text(value[field], `${path}.${group}.${key}.${field}`);
                    }
            }
            for (const [key, entry] of Object.entries(contract.arrays)) {
                const values = business[key];
                if (!Array.isArray(values) || values.length !== entry.count) {
                    issues.push({ path: `${path}.${key}`, message: `Provide exactly ${entry.count} entries.` });
                    continue;
                }
                values.forEach((value, index) => { const p = `${path}.${key}[${index}]`; if (record(value, p, entry.fields))
                    for (const field of entry.fields)
                        text(value[field], `${p}.${field}`); });
            }
            if (record(business.demo, `${path}.demo`, contract.demoFields)) {
                const threshold = business.demo.weightReviewThresholdPercent;
                if (typeof threshold !== 'number' || !Number.isFinite(threshold) || threshold < 0 || threshold > 100)
                    issues.push({ path: `${path}.demo.weightReviewThresholdPercent`, message: 'Provide a review threshold from 0 to 100 percent.' });
                if (![1, 3, 5].includes(business.demo.maxPickupDays))
                    issues.push({ path: `${path}.demo.maxPickupDays`, message: 'Choose a sample pickup window of 1, 3 or 5 days.' });
            }
        }
    }
    return issues;
}
