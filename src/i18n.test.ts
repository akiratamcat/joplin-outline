/* eslint-disable no-undef */
import * as fs from 'fs';
import * as path from 'path';
import {
  _, resolveLocale, setLocale, getLocale,
} from './i18n';

// eslint-disable-next-line import/extensions
const { parsePo, poToCatalog } = require('../scripts/poParser.js');

const available = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'pt_BR', 'ru', 'zh_CN', 'zh_TW'];

describe('resolveLocale', () => {
  test.each([
    ['ja_JP', 'ja'],
    ['ja', 'ja'],
    ['zh_CN', 'zh_CN'],
    ['zh_TW', 'zh_TW'],
    ['zh_HK', 'zh_TW'],
    ['zh_SG', 'zh_CN'],
    ['pt_BR', 'pt_BR'],
    ['pt_PT', 'pt_BR'],
    ['pt-BR', 'pt_BR'],
    ['de_DE', 'de'],
    ['ko', 'ko'],
    ['ru_RU', 'ru'],
    ['en_GB', null],
    ['', null],
  ])('%s -> %s', (locale, expected) => {
    expect(resolveLocale(locale, available)).toBe(expected);
  });
});

describe('_', () => {
  const source = { ja: { Outline: 'アウトライン', 'H%s Prefix': 'H%s の接頭辞' } };

  afterEach(() => setLocale('en', source));

  test('translates with the selected catalog', () => {
    expect(setLocale('ja_JP', source)).toBe('ja');
    expect(getLocale()).toBe('ja');
    expect(_('Outline')).toBe('アウトライン');
  });

  test('replaces %s placeholders', () => {
    setLocale('ja', source);
    expect(_('H%s Prefix', 3)).toBe('H3 の接頭辞');
  });

  test('falls back to msgid for English and missing entries', () => {
    setLocale('en_US', source);
    expect(getLocale()).toBe('en');
    expect(_('Outline')).toBe('Outline');
    setLocale('ja', source);
    expect(_('Not translated')).toBe('Not translated');
    expect(_('Default: %s', '10pt')).toBe('Default: 10pt');
  });
});

describe('poParser', () => {
  test('parses context, multi-line strings, escapes and skips untranslated', () => {
    const po = [
      'msgid ""',
      'msgstr ""',
      '"Language: ja\\n"',
      '',
      '#: src/a.ts:1',
      'msgid "Hello"',
      'msgstr "こんにちは"',
      '',
      'msgctxt "menu"',
      'msgid "Open"',
      'msgstr "開く"',
      '',
      'msgid ""',
      '"Multi "',
      '"line"',
      'msgstr "複数\\"行\\"\\n"',
      '',
      'msgid "Untranslated"',
      'msgstr ""',
    ].join('\r\n');

    expect(parsePo(po)).toHaveLength(5);
    expect(poToCatalog(po)).toEqual({
      Hello: 'こんにちは',
      'menu\u0004Open': '開く',
      'Multi line': '複数"行"\n',
    });
  });
});

describe('locale files', () => {
  const localesDir = path.join(__dirname, '..', 'locales');
  const potIds = parsePo(fs.readFileSync(path.join(localesDir, 'outline.pot'), 'utf8'))
    .map((e: any) => e.msgid)
    .filter((id: string) => id !== '');
  const poFiles = fs.readdirSync(localesDir).filter((f) => f.endsWith('.po'));

  test('all expected languages exist', () => {
    expect(poFiles.map((f) => f.replace('.po', '')).sort()).toEqual(available);
  });

  test.each(poFiles)('%s translates every msgid and keeps placeholders', (file) => {
    const catalog = poToCatalog(fs.readFileSync(path.join(localesDir, file), 'utf8'));
    for (const id of potIds) {
      expect(catalog[id]).toBeTruthy();
      expect((catalog[id].match(/%s/g) || []).length).toBe((id.match(/%s/g) || []).length);
    }
  });
});
