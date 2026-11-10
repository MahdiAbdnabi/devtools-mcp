// The repository that hosts this site, "owner/name". Set once; every link on the page derives from it.
const REPO = 'MahdiAbdnabi/devtools-mcp';

const repoUrl = `https://github.com/${REPO}`;

function wireLinks() {
  for (const a of document.querySelectorAll('[data-repo-link]')) a.href = repoUrl;
  for (const a of document.querySelectorAll('[data-repo-path]'))
    a.href = `${repoUrl}/tree/main/${a.getAttribute('data-repo-path')}`;
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
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next);
      next.focus();
    });
  });
}

function wireCopy() {
  for (const button of document.querySelectorAll('[data-copy-from]')) {
    button.addEventListener('click', async () => {
      const step = button.closest('.step');
      const pre = step?.querySelector(button.getAttribute('data-copy-from'));
      if (!pre) return;
      try {
        await navigator.clipboard.writeText(pre.textContent);
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Select and copy';
      }
      setTimeout(() => (button.textContent = 'Copy'), 1600);
    });
  }
}

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

function renderTool(tool) {
  const [group] = tool.name.split('__');
  const [title, ...rest] = tool.description.split(': ');
  const schema = tool.inputSchema ?? {};
  const required = new Set(schema.required ?? []);
  const rows = Object.entries(schema.properties ?? {}).map(([name, p]) =>
    el(
      'tr',
      {},
      el('td', {}, name, ...(required.has(name) ? [el('span', { class: 'req', title: 'required' }, ' *')] : [])),
      el('td', {}, describeType(p) + (p.default !== undefined && p.default !== '' ? ` (default ${JSON.stringify(p.default)})` : '')),
    ),
  );
  return el(
    'article',
    { class: 'tool', 'data-group': group },
    el('span', { class: 'group' }, group),
    el('h3', {}, tool.name),
    el('p', {}, el('strong', {}, title), rest.length ? `: ${rest.join(': ')}` : ''),
    el('details', {}, el('summary', {}, `${rows.length} arguments`), el('table', {}, el('tbody', {}, ...rows))),
  );
}

async function renderCatalog() {
  const list = document.getElementById('tool-list');
  const chips = document.getElementById('tool-groups');
  const search = document.getElementById('tool-search');
  let tools;
  try {
    tools = await (await fetch('data/tools.json')).json();
  } catch {
    list.append(el('p', { class: 'empty' }, 'The catalog could not be loaded.'));
    return;
  }
  for (const n of document.querySelectorAll('[data-tool-count]')) n.textContent = String(tools.length);

  const cards = tools.map((t) => ({ tool: t, node: renderTool(t), hay: `${t.name} ${t.description}`.toLowerCase() }));
  list.append(...cards.map((c) => c.node));
  const empty = el('p', { class: 'empty', hidden: '' }, 'No tool matches. Try another word.');
  list.after(empty);

  const groups = ['all', ...new Set(tools.map((t) => t.name.split('__')[0]))];
  let active = 'all';
  const buttons = groups.map((g) => {
    const b = el('button', { type: 'button', 'aria-pressed': String(g === 'all') }, g);
    b.addEventListener('click', () => {
      active = g;
      for (const x of buttons) x.setAttribute('aria-pressed', String(x === b));
      apply();
    });
    return b;
  });
  chips.append(...buttons);

  function apply() {
    const words = search.value.toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const c of cards) {
      const visible =
        (active === 'all' || c.tool.name.startsWith(`${active}__`)) && words.every((w) => c.hay.includes(w));
      c.node.hidden = !visible;
      if (visible) shown += 1;
    }
    empty.hidden = shown > 0;
  }
  search.addEventListener('input', apply);
}

wireLinks();
wireTabs();
wireCopy();
renderCatalog();
