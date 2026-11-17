// Extracts _('...') calls from src/**/*.ts into locales/outline.pot.
// Usage: node scripts/extract-pot.js [--check]
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const potFile = path.join(rootDir, 'locales', 'outline.pot');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return d.name === 'locales' || d.name === 'katex' ? [] : walk(p);
    return /\.ts$/.test(d.name) && !/\.test\.ts$/.test(d.name) ? [p] : [];
  });
}

const escapePo = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');

const msgids = new Map();
for (const file of walk(srcDir)) {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, idx) => {
    const re = /\b_\(\s*'((?:[^'\\]|\\.)*)'/g;
    let m = re.exec(line);
    while (m) {
      const msgid = m[1].replace(/\\'/g, "'");
      if (!msgids.has(msgid)) msgids.set(msgid, []);
      const ref = `${rel}:${idx + 1}`;
      if (!msgids.get(msgid).includes(ref)) msgids.get(msgid).push(ref);
      m = re.exec(line);
    }
  });
}

let out = 'msgid ""\nmsgstr ""\n'
  + '"Content-Type: text/plain; charset=UTF-8\\n"\n'
  + '"Content-Transfer-Encoding: 8bit\\n"\n'
  + '"Project-Id-Version: joplin-plugin-outline-i18n\\n"\n';
for (const [msgid, refs] of msgids) {
  out += `\n#: ${refs.join(' ')}\n`;
  if (msgid.includes('%s')) out += '#, c-format\n';
  out += `msgid "${escapePo(msgid)}"\nmsgstr ""\n`;
}

if (process.argv.includes('--check')) {
  const existing = fs.existsSync(potFile) ? fs.readFileSync(potFile, 'utf8').replace(/\r\n/g, '\n') : '';
  if (existing !== out) {
    console.error('locales/outline.pot is out of date. Run: node scripts/extract-pot.js');
    process.exit(1);
  }
  console.info(`extract-pot: up to date (${msgids.size} messages)`);
} else {
  fs.mkdirSync(path.dirname(potFile), { recursive: true });
  fs.writeFileSync(potFile, out, 'utf8');
  console.info(`extract-pot: wrote ${msgids.size} messages to locales/outline.pot`);
}
