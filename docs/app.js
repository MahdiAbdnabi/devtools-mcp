// The repository that hosts this site, "owner/name". Set once; every link on the page derives from it.
const REPO = 'MahdiAbdnabi/devtools-mcp';

const repoUrl = `https://github.com/${REPO}`;

function wireLinks() {
  for (const a of document.querySelectorAll('[data-repo-link]')) a.href = repoUrl;
  for (const a of document.querySelectorAll('[data-repo-path]')) {
    const kind = a.getAttribute('data-repo-kind') ?? 'tree';
    a.href = `${repoUrl}/${kind}/main/${a.getAttribute('data-repo-path')}`;
  }
  for (const el of document.querySelectorAll('[data-repo-url]')) el.textContent = repoUrl;
}

function wireTabs() {
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const select = (tab) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    }
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const target = {
        ArrowRight: tabs[(i + 1) % tabs.length],
        ArrowLeft: tabs[(i + tabs.length - 1) % tabs.length],
        Home: tabs[0],
        End: tabs[tabs.length - 1],
      }[e.key];
      if (!target) return;
      e.preventDefault();
      select(target);
      target.focus();
    });
  });
}

// ---------- the path field: every command follows the folder the visitor typed ----------

const DEFAULT_DIR = 'C:\\Tools\\devtools-cli';

function cleanDir(raw) {
  let dir = raw.trim().replace(/^["']+|["']+$/g, '').trim();
  dir = dir.replace(/[\\/]+devtools\.mjs$/i, '');
  if (!/^[\\/]+$/.test(dir) && !/^[A-Za-z]:[\\/]$/.test(dir)) dir = dir.replace(/[\\/]+$/, '');
  return dir || DEFAULT_DIR;
}

function scriptPath(dir) {
  const sep = dir.includes('\\') || /^[A-Za-z]:/.test(dir) || !dir.includes('/') ? '\\' : '/';
  return dir.endsWith(sep) ? `${dir}devtools.mjs` : `${dir}${sep}devtools.mjs`;
}

// Quote for a terminal only when the path needs it.
const shellArg = (s) => (/[\s"'&|<>^%;()`$]/.test(s) ? `"${s.replace(/"/g, '\\"')}"` : s);

const COMMANDS = {
  'claude-code': (p) => `claude mcp add --scope user devtools -- node ${shellArg(p)} mcp`,
  'claude-desktop': (p) =>
    [
      '{',
      '  "mcpServers": {',
      '    "devtools": {',
      '      "command": "node",',
      `      "args": [${JSON.stringify(p)}, "mcp"]`,
      '    }',
      '  }',
      '}',
    ].join('\n'),
  other: (p) => `node ${shellArg(p)} mcp`,
};

function wirePathField() {
  const input = document.getElementById('cli-path');
  if (!input) return;
  const update = () => {
    const p = scriptPath(cleanDir(input.value));
    for (const code of document.querySelectorAll('[data-cmd]')) {
      const make = COMMANDS[code.getAttribute('data-cmd')];
      if (make) code.textContent = make(p);
    }
  };
  input.addEventListener('input', update);
  update();
}

// ---------- copy controls: one per code block ----------

function wireCopy() {
  const status = document.getElementById('copy-status');
  const say = (text) => {
    if (!status) return;
    status.textContent = '';
    setTimeout(() => (status.textContent = text), 50);
  };
  for (const button of document.querySelectorAll('.code .copy')) {
    const code = button.closest('.code').querySelector('pre');
    const label = button.textContent;
    let timer;
    button.addEventListener('click', async () => {
      clearTimeout(timer);
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = 'Copied';
        say('Copied to the clipboard.');
      } catch {
        // No clipboard access: select the text so the visitor can copy it, and say so.
        const range = document.createRange();
        range.selectNodeContents(code);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        button.textContent = 'Selected';
        say('Copying is blocked here. The text is selected, ready for you to copy.');
      }
      timer = setTimeout(() => (button.textContent = label), 2000);
    });
  }
}

// ---------- the catalog ----------

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  for (const c of children) node.append(c);
  return node;
};

function describeType(p) {
  if (p.enum) return p.enum.join(' | ');
  if (p.type === 'array') return 'list of text';
  return p.type ?? '';
}

const toolId = (name) => `tool-${name}`;

function renderTool(tool) {
  const [group] = tool.name.split('__');
  const [title, ...rest] = tool.description.split(': ');
  const detail = rest.join(': ');
  const schema = tool.inputSchema ?? {};
  const required = new Set(schema.required ?? []);
  const args = Object.entries(schema.properties ?? {}).map(([name, p]) => {
    const type = describeType(p);
    const dflt = p.default !== undefined && p.default !== '' ? `default ${JSON.stringify(p.default)}` : '';
    const about = p.description ?? p.title ?? '';
    return el(
      'div',
      { class: 'arg' },
      el(
        'dt',
        {},
        el('code', {}, name),
        ...(required.has(name) ? [' ', el('span', { class: 'req' }, 'required')] : []),
        ...(type || dflt ? [' ', el('span', { class: 'arg-type' }, [type, dflt].filter(Boolean).join(', '))] : []),
      ),
      ...(about ? [el('dd', {}, about)] : []),
    );
  });
  const id = toolId(tool.name);
  return el(
    'article',
    { class: 'tool', id, 'data-group': group, 'aria-labelledby': `${id}-h` },
    el('span', { class: 'group' }, group),
    el('h3', { id: `${id}-h` }, el('a', { href: `#${id}`, class: 'tool-link' }, tool.name)),
    el('p', { class: 'tool-title' }, el('strong', {}, title)),
    ...(detail ? [el('p', { class: 'tool-desc' }, detail)] : []),
    el(
      'details',
      {},
      el('summary', {}, args.length === 1 ? '1 argument' : `${args.length} arguments`),
      ...(detail ? [el('p', { class: 'tool-desc-sm' }, detail)] : []),
      el('dl', { class: 'args' }, ...args),
    ),
  );
}

async function renderCatalog() {
  const list = document.getElementById('tool-list');
  const chips = document.getElementById('tool-groups');
  const search = document.getElementById('tool-search');
  const status = document.getElementById('tool-status');
  let tools;
  try {
    tools = await (await fetch('data/tools.json')).json();
  } catch {
    list.append(el('p', { class: 'empty' }, 'The catalog could not be loaded.'));
    return;
  }
  const total = tools.length;
  for (const n of document.querySelectorAll('[data-tool-count]')) n.textContent = String(total);

  const cards = tools.map((t) => ({ tool: t, node: renderTool(t), hay: `${t.name} ${t.description}`.toLowerCase() }));
  list.append(...cards.map((c) => c.node));
  const empty = el('p', { class: 'empty', hidden: '' }, 'No tool matches. Try another word.');
  list.after(empty);

  const groups = ['all', ...new Set(tools.map((t) => t.name.split('__')[0]))];
  let active = 'all';
  const buttons = groups.map((g) => {
    const b = el('button', { type: 'button', 'aria-pressed': String(g === 'all') }, g);
    b.addEventListener('click', () => setGroup(g));
    return b;
  });
  chips.append(...buttons);

  function setGroup(g) {
    active = g;
    for (const x of buttons) x.setAttribute('aria-pressed', String(x.textContent === g));
    apply();
    announce();
  }

  let shown = total;
  const statusText = () => (shown === total ? `Showing all ${total}` : `Showing ${shown} of ${total}`) + '.';

  function apply() {
    const words = search.value.toLowerCase().split(/\s+/).filter(Boolean);
    shown = 0;
    for (const c of cards) {
      const visible =
        (active === 'all' || c.tool.name.startsWith(`${active}__`)) && words.every((w) => c.hay.includes(w));
      c.node.hidden = !visible;
      if (visible) shown += 1;
    }
    empty.hidden = shown > 0;
  }

  // One announcement per filter change: the status line is the only live region, and typing
  // updates it once the visitor pauses.
  let pending;
  function announce() {
    clearTimeout(pending);
    pending = undefined;
    status.textContent = statusText();
  }
  search.addEventListener('input', () => {
    apply();
    clearTimeout(pending);
    pending = setTimeout(announce, 600);
  });

  status.textContent = statusText();
  status.setAttribute('role', 'status');

  // Links to a single tool: #tool-<name>. Clear a filter that hides it, open it and bring it into view.
  function reveal() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id.startsWith('tool-')) return;
    const card = cards.find((c) => toolId(c.tool.name) === id);
    if (!card) return;
    if (card.node.hidden) {
      search.value = '';
      setGroup('all');
    }
    card.node.querySelector('details').open = true;
    card.node.scrollIntoView({ block: 'start', behavior: 'instant' });
    card.node.querySelector('.tool-link').focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', reveal);
  reveal();
}

wireLinks();
wireTabs();
wirePathField();
wireCopy();
renderCatalog();
