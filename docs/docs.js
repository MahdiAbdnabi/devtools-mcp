// Filtering for the documentation pages. Every page works without it: all links are in the HTML.

for (const input of document.querySelectorAll('[data-doc-filter]')) {
  const key = input.getAttribute('data-doc-filter');
  const list = document.querySelector(`[data-doc-list="${key}"]`);
  const status = document.querySelector(`[data-doc-status="${key}"]`);
  const empty = document.querySelector(`[data-doc-empty="${key}"]`);
  if (!list) continue;
  const items = [...list.querySelectorAll('[data-doc-item]')];
  const groups = [...list.querySelectorAll('.doc-side-group, section')];
  let shown = items.length;

  const apply = () => {
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    shown = 0;
    for (const item of items) {
      const hay = item.getAttribute('data-hay') ?? '';
      const visible = words.every((w) => hay.includes(w));
      item.hidden = !visible;
      if (visible) shown += 1;
    }
    for (const g of groups) g.hidden = !g.querySelector('[data-doc-item]:not([hidden])');
    if (empty) empty.hidden = shown > 0;
  };

  // One announcement per change: the status line is a live region updated when typing pauses.
  let timer;
  const announce = () => {
    if (!status) return;
    status.textContent = input.value.trim()
      ? `${shown} of ${items.length} ${items.length === 1 ? 'page' : 'pages'} match.`
      : '';
  };
  if (status) status.setAttribute('role', 'status');
  input.addEventListener('input', () => {
    apply();
    clearTimeout(timer);
    timer = setTimeout(announce, 600);
  });
}

// The page list starts closed on narrow screens, so the page itself comes first.
const browse = document.querySelector('.doc-browse');
if (browse && window.matchMedia('(max-width: 960px)').matches) browse.open = false;
