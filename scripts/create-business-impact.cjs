#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { createBusinessImpactCalculator } = require('./business-impact-presets.cjs');
const { validateBusinessImpact } = require('./business-impact.cjs');
const args = process.argv.slice(2);
const option = key => { const i = args.indexOf(key); return i >= 0 ? args[i + 1] : undefined; };
const pageName = option('--name');
if (!pageName || pageName.startsWith('--')) throw new Error('Supply --name "Persona name".');
const calculator = createBusinessImpactCalculator({ pageName, workloadLabel: option('--unit') });
const issues = validateBusinessImpact(calculator);
if (issues.length) throw new Error(JSON.stringify(issues));
const output = JSON.stringify(calculator, null, 2) + '\n';
const destination = option('--output');
if (destination) fs.writeFileSync(path.resolve(destination), output, { flag: 'wx' });
else process.stdout.write(output);
