import translations from './locales/translations';

type Catalog = Record<string, string>;

let catalog: Catalog = {};
let currentLocale = 'en';

// Resolves a Joplin locale (e.g. "ja_JP", "zh_TW", "pt-BR") to an available catalog name.
// Order: exact match -> language-only match -> same language variant -> null (English).
export function resolveLocale(locale: string, available: string[]): string | null {
  if (!locale) return null;
  const normalized = locale.replace('-', '_');
  const lower = normalized.toLowerCase();
  const lang = lower.split('_')[0];

  const exact = available.find((a) => a.toLowerCase() === lower);
  if (exact) return exact;

  const langOnly = available.find((a) => a.toLowerCase() === lang);
  if (langOnly) return langOnly;

  // Chinese: map script/region variants explicitly so zh_HK etc. use Traditional Chinese.
  if (lang === 'zh') {
    const traditional = ['zh_tw', 'zh_hk', 'zh_mo', 'zh_hant'].some((v) => lower.startsWith(v));
    const target = traditional ? 'zh_TW' : 'zh_CN';
    if (available.includes(target)) return target;
  }

  const sameLang = available.find((a) => a.toLowerCase().split('_')[0] === lang);
  return sameLang || null;
}

export function setLocale(locale: string, source: Record<string, Catalog> = translations): string {
  const resolved = resolveLocale(locale, Object.keys(source));
  catalog = resolved ? source[resolved] : {};
  currentLocale = resolved || 'en';
  return currentLocale;
}

export function getLocale(): string {
  return currentLocale;
}

// Translates a message. "%s" placeholders are replaced by args in order.
export function _(msgid: string, ...args: (string | number)[]): string {
  let text = catalog[msgid] || msgid;
  for (const arg of args) {
    text = text.replace('%s', String(arg));
  }
  return text;
}
