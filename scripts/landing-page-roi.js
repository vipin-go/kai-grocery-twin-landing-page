const ROI_CALCULATOR_NAV_TARGET = 'roi-calculator';
const { validateBusinessImpact } = require('./business-impact.cjs');
const ROI_CALCULATOR_NAV_LABEL = 'ROI Calculator';
const ROI_CALCULATOR_SECTION_ID = 'persona-landing-roi-calculator';
const ROI_IDENTIFIER_PATTERN = /^[a-z][a-z0-9_]{0,47}$/;
const ROI_CURRENCY_PATTERN = /^[A-Z]{3}$/;
const ROI_BUILTIN_IDS = ['scenario', 'period_months', 'weeks_per_month'];
const ROI_MAX_FORMULA_LENGTH = 500;
const ROI_MAX_INPUTS = 24;
const ROI_MAX_METRICS = 32;
const ROI_MAX_SCENARIOS = 6;
const ROI_MAX_PRODUCES = 12;
const INPUT_TYPES = new Set(['slider', 'number', 'select']);
const VALUE_FORMATS = new Set(['number', 'integer', 'currency', 'hours', 'percent', 'multiplier', 'tokens']);
const INPUT_GROUPS = new Set(['profile', 'workload', 'economics', 'allocation']);
const METRIC_LAYERS = new Set(['economics', 'operations', 'value']);
const VALUE_CLASSES = new Set([
  'cost-elimination', 'capacity-creation', 'revenue-productivity', 'error-avoidance',
  'risk-reduction', 'throughput', 'hiring-avoidance', 'cycle-time',
]);
const PRODUCTIVITY = new Set(['negative', 'positive']);
const METRIC_KINDS = new Set([
  'card', 'breakdown-benefit', 'breakdown-cost', 'summary-cost', 'summary-roi', 'summary-benefit', 'hidden',
]);
const PERIODS = new Set(['monthly', 'yearly']);
const BUILTIN_SET = new Set(ROI_BUILTIN_IDS);

const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const finiteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

function isRoiCalculatorEnabled({ roiCalculator }) {
  return isRecord(roiCalculator) && roiCalculator.enabled !== false;
}

function tokenize({ formula }) {
  const tokens = [];
  let index = 0;
  while (index < formula.length) {
    const character = formula[index];
    if (/\s/.test(character)) { index += 1; continue; }
    if (character === '+') { tokens.push({ type: 'plus', value: character, index }); index += 1; continue; }
    if (character === '-') { tokens.push({ type: 'minus', value: character, index }); index += 1; continue; }
    if (character === '*') { tokens.push({ type: 'star', value: character, index }); index += 1; continue; }
    if (character === '/') { tokens.push({ type: 'slash', value: character, index }); index += 1; continue; }
    if (character === '(') { tokens.push({ type: 'lparen', value: character, index }); index += 1; continue; }
    if (character === ')') { tokens.push({ type: 'rparen', value: character, index }); index += 1; continue; }
    if (/[0-9.]/.test(character)) {
      const start = index;
      let dots = 0;
      while (index < formula.length && /[0-9.]/.test(formula[index])) {
        if (formula[index] === '.') dots += 1;
        index += 1;
      }
      const value = formula.slice(start, index);
      if (!value || dots > 1 || value === '.') throw new Error(`Invalid number at position ${start + 1}.`);
      tokens.push({ type: 'number', value, index: start });
      continue;
    }
    if (/[a-zA-Z_]/.test(character)) {
      const start = index;
      index += 1;
      while (index < formula.length && /[a-zA-Z0-9_]/.test(formula[index])) index += 1;
      tokens.push({ type: 'ident', value: formula.slice(start, index), index: start });
      continue;
    }
    throw new Error(`Unexpected character "${character}" at position ${index + 1}.`);
  }
  tokens.push({ type: 'eof', value: '', index: formula.length });
  return tokens;
}

function parseRoiFormula({ formula }) {
  const trimmed = String(formula || '').trim();
  if (!trimmed) throw new Error('Formula is required.');
  if (trimmed.length > ROI_MAX_FORMULA_LENGTH) throw new Error(`Keep formulas to ${ROI_MAX_FORMULA_LENGTH} characters or fewer.`);
  const tokens = tokenize({ formula: trimmed });
  let current = 0;
  const identifiers = [];
  const peek = () => tokens[current];
  const consume = (type) => {
    const token = tokens[current];
    if (type && token.type !== type) {
      throw new Error(token.type === 'eof' ? 'Unexpected end of formula.' : `Unexpected token "${token.value}".`);
    }
    current += 1;
    return token;
  };
  const parseExpression = () => parseAdd();
  const parseAdd = () => {
    parseMul();
    while (peek().type === 'plus' || peek().type === 'minus') { consume(); parseMul(); }
  };
  const parseMul = () => {
    parseUnary();
    while (peek().type === 'star' || peek().type === 'slash') { consume(); parseUnary(); }
  };
  const parseUnary = () => {
    if (peek().type === 'minus') { consume(); parseUnary(); return; }
    parsePrimary();
  };
  const parsePrimary = () => {
    const token = peek();
    if (token.type === 'number') { consume(); return; }
    if (token.type === 'ident') {
      if (!ROI_IDENTIFIER_PATTERN.test(token.value)) throw new Error(`"${token.value}" is not a valid formula identifier.`);
      identifiers.push(token.value);
      consume();
      return;
    }
    if (token.type === 'lparen') { consume(); parseExpression(); consume('rparen'); return; }
    throw new Error(token.type === 'eof' ? 'Unexpected end of formula.' : `Unexpected token "${token.value}".`);
  };
  parseExpression();
  if (peek().type !== 'eof') throw new Error(`Unexpected token "${peek().value}".`);
  return { identifiers: [...new Set(identifiers)] };
}

function topologicalMetricOrder({ metrics }) {
  const ids = new Set(metrics.map((metric) => metric.id));
  const dependencies = new Map();
  metrics.forEach((metric) => {
    let refs = [];
    try {
      refs = parseRoiFormula({ formula: metric.formula }).identifiers.filter((id) => ids.has(id) && id !== metric.id);
    } catch {
      refs = [];
    }
    dependencies.set(metric.id, refs);
  });
  const visiting = new Set();
  const visited = new Set();
  const order = [];
  const cycles = [];
  const visit = (id) => {
    if (visited.has(id)) return true;
    if (visiting.has(id)) { cycles.push(id); return false; }
    visiting.add(id);
    const acyclic = (dependencies.get(id) || []).every((ref) => visit(ref));
    visiting.delete(id);
    visited.add(id);
    order.push(id);
    return acyclic;
  };
  metrics.forEach((metric) => visit(metric.id));
  return { order, cycles: [...new Set(cycles)] };
}

function validateIdentifier({ value, path, issues, used }) {
  if (typeof value !== 'string' || !ROI_IDENTIFIER_PATTERN.test(value)) {
    issues.push({ path, message: 'Use a lowercase identifier starting with a letter.' });
    return null;
  }
  if (BUILTIN_SET.has(value)) {
    issues.push({ path, message: `"${value}" is reserved by the calculator.` });
    return null;
  }
  if (used.has(value)) {
    issues.push({ path, message: 'Keep identifiers unique across inputs and metrics.' });
    return null;
  }
  used.add(value);
  return value;
}

function validateRoiCalculator({ roiCalculator, pathPrefix = 'landingPage.roiCalculator' }) {
  if (roiCalculator === undefined) return [];
  if (isRecord(roiCalculator) && roiCalculator.methodologyVersion !== undefined) return validateBusinessImpact(roiCalculator, pathPrefix);
  if (!isRecord(roiCalculator)) return [{ path: pathPrefix, message: 'ROI calculator must be an object.' }];
  const issues = [];
  ['heading', 'disclaimer', 'currency'].forEach((key) => {
    if (typeof roiCalculator[key] !== 'string' || !roiCalculator[key].trim()) {
      issues.push({ path: `${pathPrefix}.${key}`, message: 'This ROI field is required.' });
    }
  });
  if (typeof roiCalculator.currency === 'string' && roiCalculator.currency && !ROI_CURRENCY_PATTERN.test(roiCalculator.currency)) {
    issues.push({ path: `${pathPrefix}.currency`, message: 'Use a 3-letter ISO currency code such as EUR or USD.' });
  }
  if (roiCalculator.locale !== undefined) {
    try {
      if (typeof roiCalculator.locale !== 'string' || new Intl.Locale(roiCalculator.locale).toString() !== roiCalculator.locale) throw new Error();
    } catch {
      issues.push({ path: `${pathPrefix}.locale`, message: 'Use a canonical BCP-47 locale such as en-GB.' });
    }
  }
  if (roiCalculator.enabled !== undefined && typeof roiCalculator.enabled !== 'boolean') {
    issues.push({ path: `${pathPrefix}.enabled`, message: 'Enablement must be true or false.' });
  }
  if (roiCalculator.periodToggle !== undefined && typeof roiCalculator.periodToggle !== 'boolean') {
    issues.push({ path: `${pathPrefix}.periodToggle`, message: 'Period toggle must be true or false.' });
  }
  if (roiCalculator.defaultPeriod !== undefined && !PERIODS.has(roiCalculator.defaultPeriod)) {
    issues.push({ path: `${pathPrefix}.defaultPeriod`, message: 'Choose monthly or yearly.' });
  }
  if (roiCalculator.headingAccent && typeof roiCalculator.heading === 'string' && !roiCalculator.heading.includes(String(roiCalculator.headingAccent))) {
    issues.push({ path: `${pathPrefix}.headingAccent`, message: 'Accent text must be an exact substring of the heading.' });
  }

  const usedIds = new Set();
  const inputIds = new Set();
  if (!Array.isArray(roiCalculator.inputs) || roiCalculator.inputs.length === 0) {
    issues.push({ path: `${pathPrefix}.inputs`, message: 'Add at least one ROI input.' });
  } else if (roiCalculator.inputs.length > ROI_MAX_INPUTS) {
    issues.push({ path: `${pathPrefix}.inputs`, message: `Use at most ${ROI_MAX_INPUTS} inputs.` });
  } else {
    roiCalculator.inputs.forEach((input, index) => {
      const inputPath = `${pathPrefix}.inputs[${index}]`;
      if (!isRecord(input)) { issues.push({ path: inputPath, message: 'Each input must be an object.' }); return; }
      const id = validateIdentifier({ value: input.id, path: `${inputPath}.id`, issues, used: usedIds });
      if (id) inputIds.add(id);
      if (typeof input.label !== 'string' || !input.label.trim()) issues.push({ path: `${inputPath}.label`, message: 'Add an input label.' });
      if (!INPUT_TYPES.has(input.type)) issues.push({ path: `${inputPath}.type`, message: 'Choose slider, number, or select.' });
      if (input.format !== undefined && !VALUE_FORMATS.has(input.format)) issues.push({ path: `${inputPath}.format`, message: 'Choose a supported value format.' });
      if (input.group !== undefined && !INPUT_GROUPS.has(input.group)) issues.push({ path: `${inputPath}.group`, message: 'Choose profile, workload, economics, or allocation.' });
      if (!finiteNumber(input.defaultValue)) issues.push({ path: `${inputPath}.defaultValue`, message: 'Set a numeric default.' });
      ['min', 'max', 'step'].forEach((key) => {
        if (input[key] !== undefined && !finiteNumber(input[key])) issues.push({ path: `${inputPath}.${key}`, message: 'Use a finite number.' });
      });
      if (finiteNumber(input.min) && finiteNumber(input.max) && input.min > input.max) {
        issues.push({ path: `${inputPath}.max`, message: 'Maximum must be greater than or equal to minimum.' });
      }
      if (finiteNumber(input.defaultValue) && finiteNumber(input.min) && input.defaultValue < input.min) {
        issues.push({ path: `${inputPath}.defaultValue`, message: 'Default must be within the input range.' });
      }
      if (finiteNumber(input.defaultValue) && finiteNumber(input.max) && input.defaultValue > input.max) {
        issues.push({ path: `${inputPath}.defaultValue`, message: 'Default must be within the input range.' });
      }
      if (input.type === 'select') {
        if (!Array.isArray(input.options) || input.options.length === 0) {
          issues.push({ path: `${inputPath}.options`, message: 'Select inputs need at least one option.' });
        } else {
          const optionValues = new Set();
          input.options.forEach((option, optionIndex) => {
            const optionPath = `${inputPath}.options[${optionIndex}]`;
            if (!isRecord(option)) { issues.push({ path: optionPath, message: 'Each option must be an object.' }); return; }
            if (!finiteNumber(option.value)) issues.push({ path: `${optionPath}.value`, message: 'Option values must be numbers.' });
            if (typeof option.label !== 'string' || !option.label.trim()) issues.push({ path: `${optionPath}.label`, message: 'Add an option label.' });
            if (finiteNumber(option.value)) {
              if (optionValues.has(option.value)) issues.push({ path: `${optionPath}.value`, message: 'Keep option values unique.' });
              optionValues.add(option.value);
            }
          });
          if (finiteNumber(input.defaultValue) && !optionValues.has(input.defaultValue)) {
            issues.push({ path: `${inputPath}.defaultValue`, message: 'Default must match one of the option values.' });
          }
        }
      }
    });
  }

  const scenarioIds = new Set();
  if (roiCalculator.scenarios !== undefined) {
    if (!Array.isArray(roiCalculator.scenarios)) {
      issues.push({ path: `${pathPrefix}.scenarios`, message: 'Scenarios must be an array.' });
    } else if (roiCalculator.scenarios.length > ROI_MAX_SCENARIOS) {
      issues.push({ path: `${pathPrefix}.scenarios`, message: `Use at most ${ROI_MAX_SCENARIOS} scenarios.` });
    } else {
      roiCalculator.scenarios.forEach((scenario, index) => {
        const scenarioPath = `${pathPrefix}.scenarios[${index}]`;
        if (!isRecord(scenario)) { issues.push({ path: scenarioPath, message: 'Each scenario must be an object.' }); return; }
        if (typeof scenario.id !== 'string' || !ROI_IDENTIFIER_PATTERN.test(scenario.id)) {
          issues.push({ path: `${scenarioPath}.id`, message: 'Use a lowercase scenario identifier.' });
        } else if (scenarioIds.has(scenario.id)) {
          issues.push({ path: `${scenarioPath}.id`, message: 'Keep scenario identifiers unique.' });
        } else scenarioIds.add(scenario.id);
        if (typeof scenario.label !== 'string' || !scenario.label.trim()) issues.push({ path: `${scenarioPath}.label`, message: 'Add a scenario label.' });
        if (!finiteNumber(scenario.multiplier) || scenario.multiplier <= 0) {
          issues.push({ path: `${scenarioPath}.multiplier`, message: 'Use a positive scenario multiplier.' });
        }
      });
    }
  }
  if (roiCalculator.defaultScenarioId !== undefined) {
    if (typeof roiCalculator.defaultScenarioId !== 'string' || (scenarioIds.size > 0 && !scenarioIds.has(roiCalculator.defaultScenarioId))) {
      issues.push({ path: `${pathPrefix}.defaultScenarioId`, message: 'Default scenario must match a configured scenario.' });
    }
  }

  const metricIds = new Set();
  const metricsForGraph = [];
  if (!Array.isArray(roiCalculator.metrics) || roiCalculator.metrics.length === 0) {
    issues.push({ path: `${pathPrefix}.metrics`, message: 'Add at least one calculated metric.' });
  } else if (roiCalculator.metrics.length > ROI_MAX_METRICS) {
    issues.push({ path: `${pathPrefix}.metrics`, message: `Use at most ${ROI_MAX_METRICS} metrics.` });
  } else {
    const allowedRefs = new Set([...inputIds, ...BUILTIN_SET]);
    roiCalculator.metrics.forEach((metric, index) => {
      const metricPath = `${pathPrefix}.metrics[${index}]`;
      if (!isRecord(metric)) { issues.push({ path: metricPath, message: 'Each metric must be an object.' }); return; }
      const id = validateIdentifier({ value: metric.id, path: `${metricPath}.id`, issues, used: usedIds });
      if (id) { metricIds.add(id); allowedRefs.add(id); }
      if (typeof metric.label !== 'string' || !metric.label.trim()) issues.push({ path: `${metricPath}.label`, message: 'Add a metric label.' });
      if (!VALUE_FORMATS.has(metric.format)) issues.push({ path: `${metricPath}.format`, message: 'Choose a supported value format.' });
      if (!METRIC_KINDS.has(metric.kind)) issues.push({ path: `${metricPath}.kind`, message: 'Choose a supported metric kind.' });
      if (metric.layer !== undefined && !METRIC_LAYERS.has(metric.layer)) issues.push({ path: `${metricPath}.layer`, message: 'Choose economics, operations, or value.' });
      if (metric.valueClass !== undefined && !VALUE_CLASSES.has(metric.valueClass)) issues.push({ path: `${metricPath}.valueClass`, message: 'Choose a supported economic-value class.' });
      if (metric.productivity !== undefined && !PRODUCTIVITY.has(metric.productivity)) issues.push({ path: `${metricPath}.productivity`, message: 'Choose negative or positive productivity.' });
      if (metric.scalesWithPeriod !== undefined && typeof metric.scalesWithPeriod !== 'boolean') {
        issues.push({ path: `${metricPath}.scalesWithPeriod`, message: 'Period scaling must be true or false.' });
      }
      if (metric.scalesWithScenario !== undefined && typeof metric.scalesWithScenario !== 'boolean') {
        issues.push({ path: `${metricPath}.scalesWithScenario`, message: 'Scenario scaling must be true or false.' });
      }
      if (typeof metric.formula !== 'string' || !metric.formula.trim()) {
        issues.push({ path: `${metricPath}.formula`, message: 'Add an arithmetic formula.' });
      } else if (id) {
        metricsForGraph.push({ id, formula: metric.formula });
        try {
          parseRoiFormula({ formula: metric.formula }).identifiers.forEach((ref) => {
            if (!allowedRefs.has(ref) && !metricIds.has(ref) && !inputIds.has(ref) && !BUILTIN_SET.has(ref)) {
              issues.push({ path: `${metricPath}.formula`, message: `Unknown formula reference "${ref}".` });
            }
          });
        } catch (error) {
          issues.push({ path: `${metricPath}.formula`, message: error instanceof Error ? error.message : 'Formula could not be parsed.' });
        }
      }
    });
  }

  const { cycles } = topologicalMetricOrder({ metrics: metricsForGraph });
  if (cycles.length > 0) {
    issues.push({ path: `${pathPrefix}.metrics`, message: `Formulas contain a cycle involving ${cycles.join(', ')}.` });
  }

  if (roiCalculator.produces !== undefined) {
    if (!Array.isArray(roiCalculator.produces)) {
      issues.push({ path: `${pathPrefix}.produces`, message: 'Produces must be an array of strings.' });
    } else if (roiCalculator.produces.length > ROI_MAX_PRODUCES) {
      issues.push({ path: `${pathPrefix}.produces`, message: `Use at most ${ROI_MAX_PRODUCES} produced outputs.` });
    } else {
      roiCalculator.produces.forEach((item, index) => {
        if (typeof item !== 'string' || !item.trim()) {
          issues.push({ path: `${pathPrefix}.produces[${index}]`, message: 'Each produced output must be a non-empty string.' });
        }
      });
    }
  }

  if (roiCalculator.projection !== undefined) {
    if (!isRecord(roiCalculator.projection)) {
      issues.push({ path: `${pathPrefix}.projection`, message: 'Projection must be an object.' });
    } else {
      const months = roiCalculator.projection.months;
      if (!finiteNumber(months) || months < 1 || months > 36 || !Number.isInteger(months)) {
        issues.push({ path: `${pathPrefix}.projection.months`, message: 'Projection months must be a whole number from 1 to 36.' });
      }
      ['costMetricId', 'benefitMetricId'].forEach((key) => {
        const value = roiCalculator.projection[key];
        if (typeof value !== 'string' || !metricIds.has(value)) {
          issues.push({ path: `${pathPrefix}.projection.${key}`, message: 'Projection metrics must reference a configured metric.' });
        }
      });
    }
  }

  if (roiCalculator.cta !== undefined) {
    if (!isRecord(roiCalculator.cta)) issues.push({ path: `${pathPrefix}.cta`, message: 'CTA must be an object.' });
    else if (typeof roiCalculator.cta.primaryLabel !== 'string' || !roiCalculator.cta.primaryLabel.trim()) {
      issues.push({ path: `${pathPrefix}.cta.primaryLabel`, message: 'Add a primary CTA label.' });
    }
  }

  const allocationTotal = (Array.isArray(roiCalculator.inputs) ? roiCalculator.inputs : [])
    .filter((input) => isRecord(input) && input.group === 'allocation' && input.format === 'percent' && finiteNumber(input.defaultValue))
    .reduce((sum, input) => sum + input.defaultValue, 0);
  if (allocationTotal > 100.0001) {
    issues.push({ path: `${pathPrefix}.inputs`, message: 'Allocation percentages must add up to 100 or less. The remainder is unused capacity.' });
  }

  return issues;
}

module.exports = {
  ROI_CALCULATOR_NAV_TARGET,
  ROI_CALCULATOR_NAV_LABEL,
  ROI_CALCULATOR_SECTION_ID,
  parseRoiFormula,
  validateRoiCalculator,
  isRoiCalculatorEnabled,
};
