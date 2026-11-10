// Writes a deterministic, minified event export of 20,000 events to stdout.
// Amounts are written with two decimals (12.50) so that number text can be checked.
let seed = 20261101;
const next = () => (seed = (seed * 1103515245 + 12345) % 2147483648);
const types = ['order.created', 'order.paid', 'order.shipped', 'order.cancelled'];
const parts = [];
for (let i = 1; i <= 20000; i++) {
  const amount = (next() % 100000) / 100;
  const day = String(1 + (next() % 28)).padStart(2, '0');
  const sec = next() % 86400;
  const hh = String(Math.floor(sec / 3600)).padStart(2, '0');
  const mm = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  parts.push(
    '{"id":' + i + ',"type":"' + types[next() % 4] + '","at":"2026-10-' + day + 'T' + hh + ':' + mm + ':' + ss +
      'Z","user":"u-' + String(next() % 5000).padStart(4, '0') + '","amount":' + amount.toFixed(2) + '}'
  );
}
process.stdout.write('[' + parts.join(',') + ']\n');
