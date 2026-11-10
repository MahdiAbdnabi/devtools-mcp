// Regenerates the skill's tool reference from docs/data/tools.json (the server's own tools/list output).
// Usage: node scripts/gen-catalog.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tools = JSON.parse(fs.readFileSync(path.join(root, 'docs/data/tools.json'), 'utf8'));

const groups = new Map();
for (const tool of tools) {
  const plugin = tool.name.split('__')[0];
  if (!groups.has(plugin)) groups.set(plugin, []);
  groups.get(plugin).push(tool);
}

const typeOf = (p) => {
  if (p.enum) return p.enum.map((v) => `\`${v}\``).join(' \\| ');
  if (p.type === 'array') return 'array of strings';
  return p.type ?? 'any';
};
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();

const lines = [
  '# DevTools MCP tool reference',
  '',
  `Generated from the server's \`tools/list\` (${tools.length} tools). Names are shown without the client prefix: Claude Code shows \`json-xml__format-json\` as \`mcp__devtools__json-xml__format-json\`.`,
  '',
  '## Contents',
  '',
  ...[...groups.keys()].map((g) => `- [${g}](#${g})`),
  '',
];
for (const [plugin, list] of groups) {
  lines.push(`## ${plugin}`, '');
  for (const tool of list) {
    const schema = tool.inputSchema ?? {};
    const required = new Set(schema.required ?? []);
    lines.push(`### \`${tool.name}\``, '', cell(tool.description), '');
    lines.push('| Argument | Type | Default | Notes |', '| --- | --- | --- | --- |');
    for (const [name, p] of Object.entries(schema.properties ?? {})) {
      const range = [p.minimum !== undefined ? `min ${p.minimum}` : '', p.maximum !== undefined ? `max ${p.maximum}` : '']
        .filter(Boolean)
        .join(', ');
      const notes = [required.has(name) ? '**required**' : '', range, cell(p.description)].filter(Boolean).join('; ');
      const def = p.default === undefined ? '' : `\`${JSON.stringify(p.default)}\``;
      lines.push(`| \`${name}\` | ${typeOf(p)} | ${def} | ${notes} |`);
    }
    lines.push('');
  }
}
fs.writeFileSync(path.join(root, 'skill/devtools/references/tools.md'), lines.join('\n'));
console.log(`wrote ${tools.length} tools in ${groups.size} groups`);
