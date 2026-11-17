// Minimal gettext PO parser (no external dependencies).
// Supports msgctxt, msgid, msgstr, multi-line strings and the usual escapes.
// Plural forms (msgid_plural / msgstr[n]) are parsed but only msgstr[0] is kept.

function unescapePoString(s) {
  return s.replace(/\\(.)/g, (match, ch) => {
    switch (ch) {
      case 'n': return '\n';
      case 't': return '\t';
      case 'r': return '\r';
      case '"': return '"';
      case '\\': return '\\';
      default: return ch;
    }
  });
}

function parsePo(content) {
  const entries = [];
  let current = null;
  let field = null;

  const flush = () => {
    if (current && current.msgid !== undefined) entries.push(current);
    current = null;
    field = null;
  };

  const lines = (content.charCodeAt(0) === 0xfeff ? content.slice(1) : content).split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === '') {
      flush();
    } else if (line.startsWith('#')) {
      // Comment. A comment after a complete entry starts a new one.
      if (current && current.msgstr !== undefined) flush();
    } else {
      const m = line.match(/^(msgctxt|msgid_plural|msgid|msgstr(?:\[(\d+)\])?)\s+"(.*)"$/);
      if (m) {
        const keyword = m[1];
        const value = unescapePoString(m[3]);
        if ((keyword === 'msgctxt' || keyword === 'msgid') && current && current.msgstr !== undefined) {
          flush();
        }
        if (!current) current = {};

        if (keyword.startsWith('msgstr')) {
          field = (m[2] === undefined || m[2] === '0') ? 'msgstr' : null;
          if (field) current.msgstr = value;
          else if (current.msgstr === undefined) current.msgstr = '';
        } else {
          field = keyword;
          current[field] = value;
        }
      } else {
        const cont = line.match(/^"(.*)"$/);
        if (!cont) throw new Error(`Invalid PO line: ${rawLine}`);
        if (current && field) current[field] += unescapePoString(cont[1]);
      }
    }
  }
  flush();
  return entries;
}

// Returns { "[msgctxt\u0004]msgid": msgstr } excluding the header and untranslated entries.
function poToCatalog(content) {
  const catalog = {};
  for (const entry of parsePo(content)) {
    if (entry.msgid !== '' && entry.msgstr) {
      const key = entry.msgctxt !== undefined ? `${entry.msgctxt}\u0004${entry.msgid}` : entry.msgid;
      catalog[key] = entry.msgstr;
    }
  }
  return catalog;
}

module.exports = { parsePo, poToCatalog, unescapePoString };
