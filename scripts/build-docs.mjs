// Builds the documentation pages of the website from the DevTools documentation data.
//
//   node scripts/build-docs.mjs --from <documentation data folder> [--out docs/documentation]
//
// --from is a folder with index.json, tools/, plugins/, guides/ and fixtures/ (schemaVersion 1), as
// written by the DevTools documentation export. Every example on the pages is copied from that data:
// nothing is typed here. The output is plain HTML that works without JavaScript; docs.js only adds
// filtering. Files this script wrote last time are listed in <out>/.generated.txt and replaced.
//
// Node's standard library only: no package dependencies.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://mahdiabdnabi.github.io/devtools-mcp/';
const REPO_URL = 'https://github.com/MahdiAbdnabi/devtools-mcp';
const MANIFEST = '.generated.txt';

class BuildError extends Error {}
const fail = (m) => {
  throw new BuildError(m);
};

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith('--')) fail(`Unexpected argument: ${a}`);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) fail(`${a} needs a value.`);
    args[a.slice(2)] = value;
    i += 1;
  }
  return args;
}

// ---------- reading the data ----------

function readJson(file) {
  if (!fs.existsSync(file)) fail(`Missing ${file}`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (data.schemaVersion !== 1) fail(`${file}: schemaVersion ${data.schemaVersion} is not supported (expected 1).`);
  return data;
}

function load(from) {
  const index = readJson(path.join(from, 'index.json'));
  const tools = new Map(index.tools.map((t) => [t.id, readJson(path.join(from, 'tools', `${t.id}.json`))]));
  const plugins = new Map(index.plugins.map((p) => [p.id, readJson(path.join(from, 'plugins', `${p.id}.json`))]));
  const guides = new Map(index.guides.map((g) => [g.id, readJson(path.join(from, 'guides', `${g.id}.json`))]));
  for (const t of tools.values()) if (!plugins.has(t.plugin)) fail(`${t.id}: unknown plugin ${t.plugin}`);
  return { index, tools, plugins, guides, fixtures: index.fixtures ?? [] };
}

// ---------- HTML helpers ----------

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const code = (s) => `<code>${esc(s)}</code>`;
const slug = (s) => String(s).replace(/[^A-Za-z0-9_-]+/g, '-');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\r' && text[i + 1] === '\n') {
      // CRLF ends a record; the \n is handled next
    } else if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function block(text, label) {
  const long = text.split('\n').length > 24 || text.length > 2400;
  return long
    ? `<pre class="doc-pre doc-pre-long" tabindex="0" role="region" aria-label="${esc(label)}"><code>${esc(text)}</code></pre>`
    : `<pre class="doc-pre"><code>${esc(text)}</code></pre>`;
}

// A meaning that is only a character or two (a delimiter such as , or |) reads better as code.
const meaning = (m) => (/^\W{1,2}$/.test(m.trim()) ? code(m) : esc(m));

function valueText(v) {
  if (typeof v === 'string') return v === '' ? '(empty)' : v;
  return JSON.stringify(v);
}

// ---------- page frame ----------

function frame({ depth, title, description, canonical, crumbs, side, body }) {
  const up = '../'.repeat(depth);
  const docs = `${up}documentation/`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${SITE}${canonical}" />
    <link rel="icon" href="${up}assets/icon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="${up}styles.css" />
  </head>
  <body class="doc-page">
    <a class="skip" href="#doc-main">Skip to content</a>
    <header class="topbar">
      <div class="wrap topbar-inner">
        <a class="brand" href="${up}index.html" aria-label="DevTools MCP home">
          <img src="${up}assets/icon.svg" alt="" width="24" height="24" />
          <span>DevTools MCP</span>
        </a>
        <nav class="nav" aria-label="Sections">
          <a href="${up}index.html#start">Get started</a>
          <a href="${up}index.html#skill">Skill</a>
          <a href="${up}index.html#tools">Tools</a>
          <a href="${docs}index.html" aria-current="true">Docs</a>
          <a href="${up}index.html#safety">Safety</a>
          <a href="${REPO_URL}" class="nav-gh">GitHub</a>
        </nav>
      </div>
    </header>
    <div class="wrap doc-layout">
      ${side}
      <main id="doc-main" class="doc-main" tabindex="-1">
        <nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs
          .map((c, i) => (i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.label)}</li>` : c.href ? `<li><a href="${c.href}">${esc(c.label)}</a></li>` : `<li>${esc(c.label)}</li>`))
          .join('')}</ol></nav>
${body}
      </main>
    </div>
    <footer class="footer">
      <div class="wrap footer-inner">
        <span>DevTools MCP documentation · Examples generated by the DevTools server and checked against it</span>
        <span><a href="${up}index.html">Home</a> · <a href="${REPO_URL}">Repository</a></span>
      </div>
    </footer>
    <script src="${up}docs.js" defer></script>
  </body>
</html>
`;
}

// The side navigation: every page of the documentation, with a filter (docs.js) and a disclosure that
// docs.js closes on narrow screens.
function sideNav(data, depth, current) {
  const docs = `${'../'.repeat(depth)}documentation/`;
  const link = (href, label, id, hay, cls = '') =>
    `<li data-doc-item data-hay="${esc(`${label} ${hay}`.toLowerCase())}"><a href="${docs}${href}"${cls}${
      id === current ? ' aria-current="page"' : ''
    }>${esc(label)}</a></li>`;
  const groups = data.index.plugins
    .map((p) => {
      const tools = data.index.tools.filter((t) => t.plugin === p.id);
      return `<li class="doc-side-group"><span class="doc-side-h">${esc(p.title)}</span><ul>${link(
        `plugins/${p.id}.html`,
        `About ${p.title}`,
        `plugin:${p.id}`,
        p.id,
      )}${tools.map((t) => link(`tools/${t.id}.html`, t.title, `tool:${t.id}`, toolHay(data, t.id))).join('')}</ul></li>`;
    })
    .join('');
  return `<aside class="doc-side">
        <details class="doc-browse" open>
          <summary>Browse the documentation</summary>
          <label class="doc-filter">
            <span class="visually-hidden">Filter pages</span>
            <input type="search" placeholder="Filter pages" autocomplete="off" data-doc-filter="side" />
          </label>
          <p class="hint doc-filter-status" data-doc-status="side"></p>
          <ul class="doc-side-list" data-doc-list="side">
            ${link('index.html', 'Overview', 'index', 'documentation start')}
            <li class="doc-side-group"><span class="doc-side-h">Guides</span><ul>${data.index.guides
              .map((g) => link(`guides/${g.id}.html`, g.title, `guide:${g.id}`, g.summary))
              .join('')}</ul></li>
            ${groups}
          </ul>
        </details>
      </aside>`;
}

// ---------- rendering calls and results ----------

function renderCall(call, inputIds, label) {
  const args = call.arguments ?? {};
  const inputs = Object.entries(args).filter(([k]) => inputIds.has(k));
  const options = Object.entries(args).filter(([k]) => !inputIds.has(k));
  const parts = [];
  parts.push(`<p class="doc-k">Tool ${code(call.name)}</p>`);
  for (const [k, v] of inputs) {
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        parts.push(`<p class="doc-arg">${code(k)} [${i + 1}]</p>${block(String(item), `${k} ${i + 1}`)}`);
      });
    } else parts.push(`<p class="doc-arg">${code(k)}</p>${block(valueText(v), k)}`);
  }
  if (options.length) {
    parts.push(
      `<p class="doc-arg">Options</p><ul class="doc-opts">${options
        .map(([k, v]) => `<li>${code(k)} ${code(valueText(v))}</li>`)
        .join('')}</ul>`,
    );
  }
  parts.push(
    `<details class="doc-raw"><summary>${esc(label)} as the MCP call</summary>${block(
      JSON.stringify({ name: call.name, arguments: args }, null, 2),
      'MCP call',
    )}</details>`,
  );
  return parts.join('\n');
}

function renderTable(text, label) {
  const rows = parseCsv(text);
  if (!rows.length) return block(text, label);
  const [head, ...body] = rows;
  return `<div class="table-scroll doc-table" tabindex="0" role="region" aria-label="${esc(label)}"><table class="result-table">
<thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
<tbody>${body.map((r) => `<tr>${r.map((c, i) => `<td data-label="${esc(head[i] ?? '')}">${esc(c)}</td>`).join('')}</tr>`).join('\n')}</tbody>
</table></div>
<details class="doc-raw"><summary>CSV as sent</summary>${block(text, `${label} as CSV`)}</details>`;
}

function renderResult(result, volatile) {
  const parts = [];
  if (result.isError) parts.push('<p class="doc-flag">Error result</p>');
  const outputs = result.outputs ?? [];
  for (const o of outputs) {
    const label = `${o.id} (${o.kind === 'table' ? 'table' : o.kind})`;
    parts.push(`<p class="doc-arg">Output ${code(o.id)} <span class="doc-kind">${esc(o.kind)}</span></p>`);
    parts.push(o.kind === 'table' ? renderTable(o.text, label) : block(o.text, label));
  }
  if (!outputs.length && !(result.diagnostics ?? []).length) parts.push('<p>No output.</p>');
  if ((result.diagnostics ?? []).length) {
    // The diagnostics item exactly as the server sent it: always the last content item.
    const last = result.content[result.content.length - 1]?.text ?? '';
    parts.push(`<p class="doc-arg">Diagnostics</p>${block(last, 'Diagnostics')}`);
  }
  if (volatile?.length) {
    const why = [...new Set(volatile.map((v) => v.why))];
    parts.push(`<p class="note doc-volatile">This result changes from run to run: ${esc(why.join(' '))} The text above was recorded once.</p>`);
  }
  return parts.join('\n');
}

function fixtureLinks(names, depth, fixtureText) {
  if (!names?.length) return '';
  const up = '../'.repeat(depth);
  return `<div class="doc-fixtures"><p class="doc-arg">Files it reads</p><ul>${names
    .map((n) => {
      const text = fixtureText.get(n);
      const link = `<a href="${up}documentation/fixtures/${encodeURIComponent(n)}">${esc(n)}</a>`;
      return text === undefined
        ? `<li>${link}</li>`
        : `<li>${link}<details class="doc-raw"><summary>Show ${esc(n)}</summary>${block(text, n)}</details></li>`;
    })
    .join('')}</ul></div>`;
}

function inputIdsOf(tool) {
  const ids = new Set();
  for (const i of tool.inputs ?? []) {
    ids.add(i.id);
    if (i.fileArgument) ids.add(i.fileArgument);
    ids.add(`${i.id}File`);
    ids.add(`${i.id}Files`);
  }
  return ids;
}

// Words a search should find a tool by, beyond its title and summary.
function toolHay(data, id) {
  const t = data.tools.get(id);
  if (!t) return '';
  return [
    t.id,
    t.mcpName,
    t.category,
    ...(t.whenToUse ?? []),
    ...(t.inputs ?? []).flatMap((i) => [i.id, i.label]),
    ...(t.options ?? []).flatMap((o) => [o.id, o.label]),
    ...(t.diagnostics ?? []).map((d) => d.code),
  ].join(' ');
}

// ---------- pages ----------

function toolPage(data, tool, fixtureText) {
  const depth = 2;
  const docs = '../';
  const plugin = data.plugins.get(tool.plugin);
  const toolLink = (id) => {
    const t = data.tools.get(id);
    return t ? `<a href="${id}.html">${esc(t.title)}</a> (${code(t.mcpName)})` : code(id);
  };
  const inputIds = inputIdsOf(tool);
  const sections = [];

  sections.push(`<section aria-labelledby="use-h"><h2 id="use-h">When to use it</h2>
<ul>${(tool.whenToUse ?? []).map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
${
  tool.whenNotToUse?.length
    ? `<h3>When another tool fits better</h3><ul>${tool.whenNotToUse
        .map((w) => `<li>${toolLink(w.tool)}: ${esc(w.why)}</li>`)
        .join('')}</ul>`
    : ''
}</section>`);

  sections.push(`<section aria-labelledby="in-h"><h2 id="in-h">Inputs</h2>
<dl class="args doc-dl">${(tool.inputs ?? [])
    .map(
      (i) => `<div class="arg"><dt>${code(i.id)}${i.required ? ' <span class="req">required</span>' : ''} <span class="arg-type">${esc(
        i.kind,
      )}</span> <span class="doc-label">${esc(i.label)}</span></dt>
<dd>${esc(i.description)}${i.fileArgument ? ` A file path can be given in ${code(i.fileArgument)} instead.` : ''}${
        i.note ? `<br />${esc(i.note)}` : ''
      }${i.example ? `<br />Example: ${code(i.example)}` : ''}</dd></div>`,
    )
    .join('\n')}</dl></section>`);

  if (tool.options?.length) {
    sections.push(`<section aria-labelledby="opt-h"><h2 id="opt-h">Options</h2>
<dl class="args doc-dl">${tool.options
      .map((o) => {
        const range = [
          o.minimum !== undefined ? `minimum ${o.minimum}` : '',
          o.maximum !== undefined ? `maximum ${o.maximum}` : '',
          o.minLength !== undefined ? `at least ${o.minLength} characters` : '',
          o.maxLength !== undefined ? `at most ${o.maxLength} characters` : '',
        ].filter(Boolean);
        const values = o.values?.length
          ? `<ul class="doc-values">${o.values
              .map((v) => `<li>${code(v)}${o.valueMeanings?.[v] ? `: ${meaning(o.valueMeanings[v])}` : ''}</li>`)
              .join('')}</ul>`
          : '';
        return `<div class="arg"><dt>${code(o.id)} <span class="arg-type">${esc(o.type)}, default ${esc(
          valueText(o.default),
        )}</span> <span class="doc-label">${esc(o.label)}</span></dt>
<dd>${esc(o.description)}${range.length ? ` (${esc(range.join(', '))})` : ''}${o.note ? `<br />${esc(o.note)}` : ''}${
          o.example !== undefined ? `<br />Example: ${code(valueText(o.example))}` : ''
        }${values}</dd></div>`;
      })
      .join('\n')}</dl></section>`);
  } else {
    sections.push('<section aria-labelledby="opt-h"><h2 id="opt-h">Options</h2><p>This tool has no options.</p></section>');
  }

  sections.push(`<section aria-labelledby="out-h"><h2 id="out-h">Outputs</h2>
<dl class="args doc-dl">${(tool.outputs ?? [])
    .map(
      (o) => `<div class="arg"><dt>${code(o.id)} <span class="arg-type">${esc(o.kind)}</span></dt><dd>${esc(o.description)}${
        o.onlyWith ? ` Only with ${code(o.onlyWith)}.` : ''
      }</dd></div>`,
    )
    .join('\n')}</dl></section>`);

  sections.push(`<section aria-labelledby="diag-h"><h2 id="diag-h">Diagnostics</h2>
<p>Messages the tool can return, last in the result, as <code>severity CODE: message (line, column)</code>. Codes that any tool can return are listed in the <a href="${docs}index.html#common">overview</a>.</p>
${tool.diagnostics?.length ? '' : '<p>This tool has no diagnostics of its own.</p>'}
<dl class="args doc-dl">${(tool.diagnostics ?? [])
    .map(
      (d) => `<div class="arg"><dt>${code(d.code)} <span class="arg-type">${esc(d.severity)}</span>${
        d.shownInExamples ? ' <span class="doc-label">in an example below</span>' : ''
      }</dt><dd>${esc(d.meaning)}</dd></div>`,
    )
    .join('\n')}</dl></section>`);

  if (tool.limits?.length) {
    sections.push(`<section aria-labelledby="lim-h"><h2 id="lim-h">Limits</h2><ul>${tool.limits
      .map((l) => `<li>${esc(l)}</li>`)
      .join('')}</ul></section>`);
  }
  if (tool.notes?.length) {
    sections.push(`<section aria-labelledby="notes-h"><h2 id="notes-h">Notes</h2><ul>${tool.notes
      .map((l) => `<li>${esc(l)}</li>`)
      .join('')}</ul></section>`);
  }

  sections.push(`<section aria-labelledby="ex-h"><h2 id="ex-h">Examples</h2>
${tool.examples
  .map(
    (e) => `<article class="doc-ex" id="${slug(e.id)}" aria-labelledby="${slug(e.id)}-h">
<h3 id="${slug(e.id)}-h">${esc(e.title)}</h3>
<p>${esc(e.purpose)}</p>
<div class="doc-ex-grid">
<div class="doc-ex-call"><p class="doc-k">You send</p>
${renderCall(e.mcpCall, inputIds, 'This call')}
${fixtureLinks(e.fixtures, depth, fixtureText)}</div>
<div class="doc-ex-result"><p class="doc-k">DevTools returns</p>
${renderResult(e.expected, e.volatile)}</div>
</div>
</article>`,
  )
  .join('\n')}</section>`);

  sections.push(`<details class="doc-raw doc-server"><summary>What the server tells AI clients about this tool</summary>${block(
    tool.serverDescription,
    'Server description',
  )}</details>`);

  const toc = [
    ['use-h', 'When to use it'],
    ['in-h', 'Inputs'],
    ['opt-h', 'Options'],
    ['out-h', 'Outputs'],
    ['diag-h', 'Diagnostics'],
    ...(tool.limits?.length ? [['lim-h', 'Limits']] : []),
    ['ex-h', `Examples (${tool.examples.length})`],
  ];
  const ro = tool.annotations?.readOnlyHint ? ' · read-only' : '';
  const body = `<h1>${esc(tool.title)}</h1>
<p class="lede">${esc(tool.summary)}</p>
<p class="doc-meta">MCP name ${code(tool.mcpName)} · tool id ${code(tool.id)} · <a href="../plugins/${tool.plugin}.html">${esc(
    plugin.title,
  )}</a>${ro}</p>
<nav class="doc-toc" aria-label="On this page"><ul>${toc.map(([id, l]) => `<li><a href="#${id}">${esc(l)}</a></li>`).join('')}</ul></nav>
${sections.join('\n')}`;
  return frame({
    depth,
    title: `${tool.title} (${tool.mcpName}) · DevTools MCP documentation`,
    description: tool.summary,
    canonical: `documentation/tools/${tool.id}.html`,
    crumbs: [
      { label: 'Documentation', href: `${docs}index.html` },
      { label: plugin.title, href: `../plugins/${plugin.id}.html` },
      { label: tool.title },
    ],
    side: sideNav(data, depth, `tool:${tool.id}`),
    body,
  });
}

function pluginPage(data, plugin) {
  const depth = 2;
  const toolLink = (id) => {
    const t = data.tools.get(id);
    return t ? `<a href="../tools/${id}.html">${esc(t.title)}</a>` : code(id);
  };
  const parts = [];
  parts.push(`<h1>${esc(plugin.title)}</h1><p class="lede">${esc(plugin.summary)}</p><p>${esc(plugin.intro)}</p>`);
  parts.push(`<section aria-labelledby="tools-h"><h2 id="tools-h">Tools</h2><ul class="doc-cards">${plugin.tools
    .map((id) => {
      const t = data.tools.get(id);
      return `<li class="card"><a href="../tools/${id}.html"><strong>${esc(t.title)}</strong></a><br />${code(t.mcpName)}<p>${esc(
        t.summary,
      )}</p></li>`;
    })
    .join('')}</ul></section>`);
  if (plugin.howTheyDiffer?.length) {
    parts.push(`<section aria-labelledby="diff-h"><h2 id="diff-h">How they differ</h2><ul>${plugin.howTheyDiffer
      .map((l) => `<li>${esc(l)}</li>`)
      .join('')}</ul></section>`);
  }
  if (plugin.closeCalls?.length) {
    parts.push(`<section aria-labelledby="close-h"><h2 id="close-h">Close calls</h2><ul>${plugin.closeCalls
      .map((c) => `<li>${c.tools.map(toolLink).join(' or ')}: ${esc(c.how)}</li>`)
      .join('')}</ul></section>`);
  }
  if (plugin.ruleSet) {
    const r = plugin.ruleSet;
    parts.push(`<section aria-labelledby="rules-h"><h2 id="rules-h">Rule-set reference</h2>
<p>A rule set is a JSON text with this shape:</p>${block(r.shape, 'Rule-set shape')}
<h3>Rule fields</h3><dl class="args doc-dl">${r.rule
      .map((f) => `<div class="arg"><dt>${code(f.field)}</dt><dd>${esc(f.meaning)}</dd></div>`)
      .join('')}</dl>
<h3>Strategies</h3><dl class="args doc-dl">${r.strategies
      .map(
        (s) => `<div class="arg"><dt>${code(s.type)} <span class="arg-type">short form: ${esc(s.shorthand)}</span></dt><dd>${esc(
          s.effect,
        )}<br />Settings: ${esc(s.settings)}</dd></div>`,
      )
      .join('')}</dl>
<h3>Which rule wins</h3><ol>${r.precedence.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
<h3>Limits</h3><ul>${r.limits.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></section>`);
  }
  return frame({
    depth,
    title: `${plugin.title} · DevTools MCP documentation`,
    description: plugin.summary,
    canonical: `documentation/plugins/${plugin.id}.html`,
    crumbs: [{ label: 'Documentation', href: '../index.html' }, { label: plugin.title }],
    side: sideNav(data, depth, `plugin:${plugin.id}`),
    body: parts.join('\n'),
  });
}

function guidePage(data, guide, fixtureText) {
  const depth = 2;
  const parts = [];
  parts.push(`<h1>${esc(guide.title)}</h1><p class="lede">${esc(guide.summary)}</p>`);
  if (guide.before) parts.push(`<p class="note"><strong>Before you start.</strong> ${esc(guide.before)}</p>`);
  if (guide.fixtures?.length) parts.push(fixtureLinks(guide.fixtures, depth, fixtureText));
  parts.push(
    guide.steps
      .map((s) => {
        const tool = data.tools.get(s.tool);
        return `<section class="doc-ex" id="step-${s.step}" aria-labelledby="step-${s.step}-h">
<h2 id="step-${s.step}-h">Step ${s.step}: ${esc(s.title)}</h2>
<p>${esc(s.explanation)}</p>
<p class="doc-meta">Tool: ${tool ? `<a href="../tools/${tool.id}.html">${esc(tool.title)}</a>` : code(s.tool)}${
          s.usesOutputOf ? ` · uses the output of <a href="#step-${s.usesOutputOf}">step ${s.usesOutputOf}</a>` : ''
        }</p>
<div class="doc-ex-grid">
<div class="doc-ex-call"><p class="doc-k">You send</p>${renderCall(s.mcpCall, tool ? inputIdsOf(tool) : new Set(), 'This step')}</div>
<div class="doc-ex-result"><p class="doc-k">DevTools returns</p>${renderResult(s.expected, s.volatile)}</div>
</div>
${s.after ? `<p class="note">${esc(s.after)}</p>` : ''}
</section>`;
      })
      .join('\n'),
  );
  if (guide.takeaways?.length) {
    parts.push(`<section aria-labelledby="take-h"><h2 id="take-h">Takeaways</h2><ul>${guide.takeaways
      .map((t) => `<li>${esc(t)}</li>`)
      .join('')}</ul></section>`);
  }
  return frame({
    depth,
    title: `${guide.title} · DevTools MCP documentation`,
    description: guide.summary,
    canonical: `documentation/guides/${guide.id}.html`,
    crumbs: [{ label: 'Documentation', href: '../index.html' }, { label: 'Guides' }, { label: guide.title }],
    side: sideNav(data, depth, `guide:${guide.id}`),
    body: parts.join('\n'),
  });
}

function indexPage(data) {
  const depth = 1;
  const item = (href, title, sub, hay) =>
    `<li class="card" data-doc-item data-hay="${esc(`${title} ${sub} ${hay}`.toLowerCase())}"><a href="${href}"><strong>${esc(
      title,
    )}</strong></a><p>${esc(sub)}</p></li>`;
  const body = `<h1>Documentation</h1>
<p class="lede">Every DevTools tool, what it is for, its inputs, options and outputs, and worked examples. Each example shows the exact call and the exact result of the DevTools server ${esc(
    data.index.server.version,
  )}.</p>
<label class="search doc-search">
  <span class="visually-hidden">Search the documentation</span>
  <input type="search" placeholder="Search, e.g. csv, jwt, seed, records…" autocomplete="off" data-doc-filter="main" />
</label>
<p class="hint" data-doc-status="main"></p>
<div data-doc-list="main">
<section aria-labelledby="guides-h"><h2 id="guides-h">Guides</h2>
<p>Tasks from start to finish, one real call per step.</p>
<ul class="doc-cards">${data.index.guides
    .map((g) => item(`guides/${g.id}.html`, g.title, g.summary, g.tools.join(' ')))
    .join('')}</ul></section>
${data.index.plugins
  .map((p) => {
    const tools = data.index.tools.filter((t) => t.plugin === p.id);
    return `<section aria-labelledby="p-${p.id}"><h2 id="p-${p.id}"><a href="plugins/${p.id}.html">${esc(p.title)}</a></h2>
<p>${esc(p.summary)}</p>
<ul class="doc-cards">${tools.map((t) => item(`tools/${t.id}.html`, t.title, t.summary, `${p.title} ${toolHay(data, t.id)}`)).join('')}</ul></section>`;
  })
  .join('\n')}
</div>
<p class="empty" data-doc-empty="main" hidden>Nothing matches. Try another word.</p>
<section id="common" aria-labelledby="common-h"><h2 id="common-h">Diagnostics any tool can return</h2>
<dl class="args doc-dl">${data.index.commonDiagnostics
    .map((d) => `<div class="arg"><dt>${code(d.code)} <span class="arg-type">${esc(d.severity)}</span></dt><dd>${esc(d.meaning)}</dd></div>`)
    .join('\n')}</dl></section>`;
  return frame({
    depth,
    title: 'Documentation · DevTools MCP',
    description: 'Reference and worked examples for the 50 DevTools tools: inputs, options, outputs, diagnostics, limits and exact results.',
    canonical: 'documentation/index.html',
    crumbs: [{ label: 'Documentation' }],
    side: sideNav(data, depth, 'index'),
    body,
  });
}

// ---------- main ----------

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.from) fail('--from <documentation data folder> is required.');
  const from = path.resolve(args.from);
  const out = args.out ? path.resolve(args.out) : path.join(root, 'docs', 'documentation');
  const data = load(from);

  const fixtureText = new Map();
  for (const name of data.fixtures) {
    const buf = fs.readFileSync(path.join(from, 'fixtures', name));
    const text = buf.toString('utf8');
    if (!text.includes('�') && !/[\x00-\x08\x0E-\x1F]/.test(text)) fixtureText.set(name, text);
  }

  const files = new Map();
  files.set('index.html', indexPage(data));
  for (const t of data.tools.values()) files.set(`tools/${t.id}.html`, toolPage(data, t, fixtureText));
  for (const p of data.plugins.values()) files.set(`plugins/${p.id}.html`, pluginPage(data, p));
  for (const g of data.guides.values()) files.set(`guides/${g.id}.html`, guidePage(data, g, fixtureText));

  // Replace what this script wrote last time, and nothing else.
  const manifest = path.join(out, MANIFEST);
  if (fs.existsSync(manifest)) {
    for (const rel of fs.readFileSync(manifest, 'utf8').split('\n').filter(Boolean)) {
      const abs = path.join(out, rel);
      if (abs.startsWith(out + path.sep) && fs.existsSync(abs)) fs.unlinkSync(abs);
    }
  }
  const written = [];
  for (const [rel, html] of files) {
    fs.mkdirSync(path.dirname(path.join(out, rel)), { recursive: true });
    fs.writeFileSync(path.join(out, rel), html);
    written.push(rel);
  }
  fs.mkdirSync(path.join(out, 'fixtures'), { recursive: true });
  for (const name of data.fixtures) {
    fs.copyFileSync(path.join(from, 'fixtures', name), path.join(out, 'fixtures', name));
    written.push(`fixtures/${name}`);
  }
  fs.writeFileSync(manifest, `${written.sort().join('\n')}\n`);
  const examples = [...data.tools.values()].reduce((n, t) => n + t.examples.length, 0);
  console.log(
    `Wrote ${files.size} pages (${data.tools.size} tools, ${data.plugins.size} plugins, ${data.guides.size} guides, 1 overview), ` +
      `${examples} examples and ${data.fixtures.length} fixture files to ${path.relative(root, out) || out}.`,
  );
}

try {
  main();
} catch (e) {
  if (!(e instanceof BuildError)) throw e;
  console.error(`build-docs: ${e.message}`);
  process.exitCode = 1;
}
