// Builds the two downloads, hashes them and stamps the website with the result.
//
//   node scripts/release.mjs --version 0.1.0 --cli <path to devtools-cli> [--skill skill/devtools]
//                            [--skill-version x.y.z] [--date YYYY-MM-DD] [--out docs/download]
//                            [--page docs/index.html] [--changelog CHANGELOG.md] [--dry-run]
//   node scripts/release.mjs --check [--out docs/download] [--page docs/index.html]
//
// --cli is the packaged command-line folder (`npm run package` in the DevTools repo writes
// dist\package\devtools-cli) and --version is its version. The skill's version is the `version` in
// SKILL.md's frontmatter, or --skill-version. The zips get the folder names as their top folder,
// entries in name order and the release date as every time stamp, so the same input gives the same
// bytes. The skill zip leaves out evals/.
// The script stops before zipping when the command-line folder lacks its licence or its third-party
// notices, when the skill has no SKILL.md or no version, when CHANGELOG.md has no heading for
// --version, or when a file holds a path inside the current user's home folder.
// --check recomputes the size and SHA-256 of the zips in --out and compares them with the page.
// Paths given on the command line are relative to where you run it; defaults are relative to the repo.
//
// Node's standard library only: no package dependencies.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------- arguments ----------

function parseArgs(argv) {
  const flags = new Set(['dry-run', 'check', 'help']);
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith('--')) fail(`Unexpected argument: ${a}`);
    const key = a.slice(2);
    if (flags.has(key)) args[key] = true;
    else {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) fail(`--${key} needs a value.`);
      args[key] = value;
      i += 1;
    }
  }
  return args;
}

class ReleaseError extends Error {}

function fail(message) {
  throw new ReleaseError(message);
}

// ---------- checks ----------

const LICENCE_NAMES = /^LICEN[CS]E(\.(txt|md))?$/i;
const NOTICE_NAMES = /^(THIRD[-_ ]?PARTY[-_ ]?NOTICES?|NOTICES?)(\.(txt|md))?$/i;
const SKILL_EXCLUDE = new Set(['evals', 'node_modules', '__pycache__']);

function nonEmptyFile(dir, pattern) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .find((d) => d.isFile() && pattern.test(d.name) && fs.statSync(path.join(dir, d.name)).size > 0)?.name;
}

export function checkCliFolder(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) fail(`The command-line folder does not exist: ${dir}`);
  const problems = [];
  if (!fs.existsSync(path.join(dir, 'devtools.mjs'))) problems.push('devtools.mjs');
  const licence = nonEmptyFile(dir, LICENCE_NAMES);
  const notices = nonEmptyFile(dir, NOTICE_NAMES);
  if (!licence) problems.push('a licence file (LICENSE, LICENSE.txt or LICENSE.md)');
  if (!notices) problems.push('third-party notices (THIRD-PARTY-NOTICES, .txt or .md)');
  if (problems.length) {
    fail(
      `The command-line folder is missing ${problems.join(', ')}.\n` +
        `  Folder: ${dir}\n` +
        '  Rebuild it with `npm run package` in the DevTools repo; nothing was zipped.',
    );
  }
  return { licence, notices, readme: nonEmptyFile(dir, /^README(\.(txt|md))?$/i) };
}

export function checkSkillFolder(dir) {
  if (!fs.existsSync(path.join(dir, 'SKILL.md'))) fail(`The skill folder has no SKILL.md: ${dir}`);
}

export function checkChangelog(file, version) {
  if (!fs.existsSync(file)) fail(`No changelog at ${file}.`);
  const heading = new RegExp(`^## \\[?${version.replace(/\./g, '\\.')}\\]?(\\s|$)`, 'm');
  if (!heading.test(fs.readFileSync(file, 'utf8'))) {
    fail(`${path.basename(file)} has no "## ${version}" heading. Add the release notes first.`);
  }
}

// A path inside the current user's home folder must never ship. The name is read at run time and
// never written anywhere.
function homePatterns() {
  const name = os.userInfo().username;
  const home = os.homedir();
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const variants = new Set([home, home.replace(/\\/g, '/'), home.replace(/\\/g, '\\\\')]);
  const parts = [...variants].map(escape);
  if (name) parts.push(`(?:Users|home)[\\\\/]{1,2}${escape(name)}(?![\\w.-])`);
  return new RegExp(parts.join('|'), 'i');
}

export function scanForHomePaths(files) {
  const pattern = homePatterns();
  return files.filter((f) => pattern.test(f.data.toString('latin1'))).map((f) => f.name);
}

// ---------- zip (deterministic: sorted entries, fixed times) ----------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosDateTime(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return { time: 0, date: ((y - 1980) << 9) | (m << 5) | d };
}

export function collectFiles(dir, prefix, exclude = new Set()) {
  const out = [];
  const walk = (abs, rel) => {
    const entries = fs.readdirSync(abs, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1));
    for (const e of entries) {
      if (e.name.startsWith('.') || exclude.has(e.name)) continue;
      const a = path.join(abs, e.name);
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) walk(a, r);
      else if (e.isFile()) out.push({ name: r, data: fs.readFileSync(a) });
    }
  };
  walk(dir, prefix);
  return out;
}

export function buildZip(files, isoDate) {
  const { time, date } = dosDateTime(isoDate);
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const f of files) {
    const name = Buffer.from(f.name, 'utf8');
    const deflated = zlib.deflateRawSync(f.data, { level: 9 });
    const stored = deflated.length >= f.data.length;
    const body = stored ? f.data : deflated;
    const method = stored ? 0 : 8;
    const crc = crc32(f.data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(f.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, name, body);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(method, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(body.length, 20);
    central.writeUInt32LE(f.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);

    offset += local.length + name.length + body.length;
  }
  const cd = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cd.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, cd, end]);
}

// ---------- page ----------

export function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const FIELDS = ['date', 'cli.version', 'cli.size', 'cli.sha256', 'skill.version', 'skill.size', 'skill.sha256'];
const SEMVER = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;
const FIELD_RE = /(<(\w+)\b[^>]*\bdata-release="([\w.]+)"[^>]*>)([^<]*)(<\/\2>)/g;

export function readStamps(html) {
  const found = {};
  for (const m of html.matchAll(FIELD_RE)) (found[m[3]] ??= []).push(m[4]);
  return found;
}

export function stampPage(html, values) {
  const missing = FIELDS.filter((f) => !readStamps(html)[f]);
  if (missing.length) fail(`The page has no place for: ${missing.join(', ')} (data-release attributes).`);
  return html.replace(FIELD_RE, (all, open, tag, field, _text, close) => {
    if (!(field in values)) return all;
    let o = open;
    if (field === 'date' && /\bdatetime="/.test(o)) o = o.replace(/\bdatetime="[^"]*"/, `datetime="${values.date}"`);
    return `${o}${values[field]}${close}`;
  });
}

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

// ---------- commands ----------

// A path given on the command line is relative to where you run the script; a default is relative to
// the repository.
const where = (given, fallback) => (given ? path.resolve(given) : path.join(root, fallback));

function readOrFail(file, what) {
  if (!fs.existsSync(file)) fail(`No ${what} at ${file}.`);
  return fs.readFileSync(file);
}

function check(args) {
  const out = where(args.out, 'docs/download');
  const page = where(args.page, 'docs/index.html');
  const stamps = readStamps(readOrFail(page, 'page').toString('utf8'));
  const problems = [];
  for (const [key, file] of [['cli', 'devtools-cli.zip'], ['skill', 'devtools-skill.zip']]) {
    const data = readOrFail(path.join(out, file), 'download');
    const want = { [`${key}.sha256`]: sha256(data), [`${key}.size`]: formatSize(data.length) };
    for (const [field, value] of Object.entries(want)) {
      const shown = stamps[field] ?? [];
      if (!shown.length || shown.some((s) => s.trim() !== value)) {
        problems.push(`${field}: page shows ${shown.join(', ') || 'nothing'}, ${file} is ${value}`);
      }
    }
    console.log(`${file}  ${formatSize(data.length)}  sha256 ${want[`${key}.sha256`]}`);
  }
  for (const field of ['date', 'cli.version', 'skill.version']) {
    const shown = stamps[field] ?? [];
    if (!shown.length || !shown.every((s) => s.trim() && !/not stamped/i.test(s))) problems.push(`${field} is not stamped`);
  }
  if (problems.length) fail(`The page does not match the downloads:\n  ${problems.join('\n  ')}`);
  console.log(
    `The page matches both downloads (server ${stamps['cli.version'][0]}, skill ${stamps['skill.version'][0]}, ${stamps.date[0]}).`,
  );
}

function release(args) {
  const version = args.version;
  if (!version || !SEMVER.test(version)) fail('--version x.y.z (the server build) is required.');
  const date = args.date ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) fail(`--date must be YYYY-MM-DD: ${date}`);
  if (!args.cli) fail('--cli <path to the packaged devtools-cli folder> is required.');

  const cliDir = path.resolve(args.cli);
  const skillDir = where(args.skill, 'skill/devtools');
  const out = where(args.out, 'docs/download');
  const page = where(args.page, 'docs/index.html');
  const changelog = where(args.changelog, 'CHANGELOG.md');

  const cliInfo = checkCliFolder(cliDir);
  checkSkillFolder(skillDir);
  checkChangelog(changelog, version);
  if (!cliInfo.readme) console.warn('Note: the command-line folder has no README.');

  const skillMd = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8');
  const fromSkill = /^\s*version:\s*["']?([^"'\s]+)/m.exec(skillMd.split(/^---\s*$/m)[1] ?? '')?.[1];
  const skillVersion = args['skill-version'] ?? fromSkill;
  if (!skillVersion || !SEMVER.test(skillVersion)) {
    fail("The skill has no version: add `version` to SKILL.md's frontmatter or pass --skill-version x.y.z.");
  }
  if (fromSkill && args['skill-version'] && fromSkill !== args['skill-version']) {
    fail(`SKILL.md says version ${fromSkill}, but --skill-version is ${args['skill-version']}.`);
  }

  const cliFiles = collectFiles(cliDir, path.basename(cliDir));
  const skillFiles = collectFiles(skillDir, path.basename(skillDir), SKILL_EXCLUDE);
  const leaks = scanForHomePaths([...cliFiles, ...skillFiles]);
  if (leaks.length) fail(`These files hold a path inside your home folder:\n  ${leaks.join('\n  ')}`);

  const zips = {
    cli: { file: 'devtools-cli.zip', data: buildZip(cliFiles, date), count: cliFiles.length },
    skill: { file: 'devtools-skill.zip', data: buildZip(skillFiles, date), count: skillFiles.length },
  };
  const values = { date, 'cli.version': version, 'skill.version': skillVersion };
  for (const [key, z] of Object.entries(zips)) {
    values[`${key}.size`] = formatSize(z.data.length);
    values[`${key}.sha256`] = sha256(z.data);
    console.log(`${z.file}  ${z.count} files  ${values[`${key}.size`]}  sha256 ${values[`${key}.sha256`]}`);
  }
  const html = stampPage(readOrFail(page, 'page').toString('utf8'), values);

  if (args['dry-run']) {
    console.log('Dry run: nothing written.');
    return;
  }
  fs.mkdirSync(out, { recursive: true });
  for (const z of Object.values(zips)) fs.writeFileSync(path.join(out, z.file), z.data);
  fs.writeFileSync(page, html);
  console.log(`Wrote both zips to ${path.relative(root, out) || out} and stamped ${path.relative(root, page) || page}.`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\nimport ')[0]);
    return;
  }
  if (args.check) check(args);
  else release(args);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (e) {
    if (!(e instanceof ReleaseError)) throw e;
    console.error(`release: ${e.message}`);
    process.exitCode = 1;
  }
}
