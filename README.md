<div align="center">
  <h1>Joplin Outline Plugin</h1>
  <i>This is a outline plugin for <a href="https://github.com/laurent22/joplin">Joplin</a>. Refer to <a href="https://github.com/laurent22/joplin/tree/dev/packages/app-cli/tests/support/plugins/toc/">joplin toc</a>.</i>
  <p align="center">
    <a href="README.md">English</a>
    ·
    <a href="README.zh-CN.md">简体中文</a>
    <br />
  </p>
  <p>
    <a href="https://github.com/cqroot/joplin-outline/actions">
      <img src="https://github.com/cqroot/joplin-outline/workflows/test/badge.svg" alt="Action Status" />
    </a>
    <img src="https://img.shields.io/github/issues/cqroot/joplin-outline" />
    <img src="https://img.shields.io/github/license/cqroot/joplin-outline" />
    <img src="https://img.shields.io/npm/v/joplin-plugin-outline?label=version" />
    <img src="https://img.shields.io/github/downloads/cqroot/joplin-outline/total?label=github%20downloads" />
    <img src="https://img.shields.io/npm/dt/joplin-plugin-outline?label=npm%20downloads" />
  </p>
  <hr>
</div>

> [!IMPORTANT]
> **This is an unofficial fork (i18n test build).** It adds UI translations with gettext PO files to [cqroot/joplin-outline](https://github.com/cqroot/joplin-outline). It is not released or supported by the original author, so please do not report issues from this fork to the original repository.
>
> **これは非公式のフォーク版（UI翻訳のテスト版）です。** [cqroot/joplin-outline](https://github.com/cqroot/joplin-outline) に、gettext の PO ファイルを使った UI 翻訳を追加しています。原作者によるリリースではなく、原作者のサポート対象でもありません。このフォーク版で起きた問題を原作リポジトリへ報告しないでください。

## About this fork / このフォーク版について

### English

- **UI translations**: settings, menus, commands and the outline panel are translated. The language follows Joplin's own language setting (restart Joplin after changing it). Unsupported languages fall back to English.
- **Supported languages**: Japanese (`ja`), Chinese Simplified (`zh_CN`), Chinese Traditional (`zh_TW`), Korean (`ko`), German (`de`), French (`fr`), Spanish (`es`), Italian (`it`), Portuguese Brazil (`pt_BR`), Russian (`ru`).
- **Different plugin identity**: plugin ID `com.akiratamcat.joplin-outline-i18n`, name **Outline (i18n test)**, authors: cqroot (original), akiratamcat (translation build). Settings are not shared with the original plugin.
- **Coexistence**: command and view IDs are prefixed with `outlineI18n`, so this fork can be installed next to the original plugin. Disabling one of them is recommended to avoid two outline panels.
- **Download**: the `.jpl` file is on the [Releases](https://github.com/akiratamcat/joplin-outline/releases) page (prereleases). Install it from **Tools > Options > Plugins > (gear icon) > Install from file**.
- Translations were machine-assisted and may be inaccurate. Corrections are welcome (see [Translations](#translations--翻訳)).

### 日本語

- **UI翻訳**：設定画面、メニュー、コマンド、アウトラインパネルを翻訳しています。表示言語は Joplin 本体の言語設定に追従します（変更後は Joplin を再起動してください）。対応していない言語では英語で表示されます。
- **対応言語**：日本語（`ja`）、中国語簡体字（`zh_CN`）、中国語繁体字（`zh_TW`）、韓国語（`ko`）、ドイツ語（`de`）、フランス語（`fr`）、スペイン語（`es`）、イタリア語（`it`）、ポルトガル語ブラジル（`pt_BR`）、ロシア語（`ru`）。
- **プラグインの識別情報**：プラグインIDは `com.akiratamcat.joplin-outline-i18n`、名称は **Outline (i18n test)**、作者は cqroot（原作）と akiratamcat（翻訳版）です。設定は原作版と共有されません。
- **原作版との共存**：コマンドとビューのIDに `outlineI18n` を付けているため、原作版と同時にインストールできます。ただし、アウトラインパネルが2つ表示されないよう、どちらかを無効にすることをおすすめします。
- **ダウンロード**：`.jpl` ファイルは [Releases](https://github.com/akiratamcat/joplin-outline/releases) ページ（プレリリース）にあります。**ツール > オプション > プラグイン > 歯車アイコン > ファイルからインストール** でインストールします。
- 翻訳には機械翻訳を利用しているため、不正確な箇所があるかもしれません。修正の方法は [Translations / 翻訳](#translations--翻訳) を参照してください。

![screenshot](.github/screenshot.png)

## Features

- Support atx-style headers (`#`), not setext-style headers (`---`, `===`).
- Support right click to paste markdown inner link.
- Support collapsible outline.
- Support automatic numbering.
- Support custom style.
- Support adding custom symbols before headings. 
- Support jumping to header in Editor Mode. (contributed by [@jerrylususu](https://github.com/jerrylususu/joplin-outline))

## Documentation

- [Custom panel style](https://github.com/cqroot/joplin-outline/wiki/Custom-panel-style)

## Requirements

- Joplin 1.3.15 or higher for application plugins support.

## Installation

To install joplin-outline, copy [outline.jpl](https://github.com/cqroot/joplin-outline/releases/latest) to your profile's `plugins` directory. The outline will be automatically loaded and executed when you restart the application.

## Building

### Building the plugin

The plugin is built using Webpack, which creates the compiled code in `/dist`. A JPL archive will also be created at the root, which can use to distribute the plugin.

To build the plugin, simply run `npm run dist`.

The project is setup to use TypeScript, although you can change the configuration to use plain JavaScript.

### Updating the plugin framework

To update the plugin framework, run `yo joplin --update`

Keep in mind that doing so will overwrite all the framework-related files **outside of the "src/" directory** (your source code will not be touched). So if you have modified any of the framework-related files, such as package.json or .gitignore, make sure your code is under version control so that you can check the diff and re-apply your changes.

For that reason, it's generally best not to change any of the framework files or to do so in a way that minimises the number of changes. For example, if you want to modify the Webpack config, create a new separate JavaScript file and include it in webpack.config.js. That way, when you update, you only have to restore the line that include your file.

## Translations / 翻訳

### How it works

| Path | Role |
| --- | --- |
| `src/**/*.ts` | UI strings are wrapped in `_('...')` (from `src/i18n.ts`). `%s` is replaced by extra arguments, e.g. `_('Default: %s', '10pt')`. |
| `locales/outline.pot` | Template with every `msgid`. Generated by `npm run i18n:extract`. Do not edit it by hand. |
| `locales/<locale>.po` | One translation file per language. The file name is the locale code (`ja`, `zh_TW`, `pt_BR`, ...). |
| `src/locales/translations.ts` | Generated from the PO files by `npm run i18n` (also run by `dist`, `test` and `lint`). Not committed. |

At startup, the plugin reads Joplin's `locale` setting and picks a catalog in this order: exact match (`zh_TW`) → language only (`ja_JP` → `ja`) → another variant of the same language (`pt_PT` → `pt_BR`; `zh_HK` → `zh_TW`) → English. Empty `msgstr` entries also fall back to English.

### Add a new language

1. Copy the template. The file name must be a Joplin locale code.

   ```sh
   cp locales/outline.pot locales/nl.po
   ```

2. Edit the header of `locales/nl.po`: add `"Language: nl\n"` and a `"Plural-Forms: ...\n"` line for the language.
3. Fill in every `msgstr`. Keep `%s` placeholders, and keep the same number of them.
4. Add the locale code to the `available` list in `src/i18n.test.ts`.
5. Check and build:

   ```sh
   npm test        # every msgid is translated and placeholders match
   npm run dist    # creates publish/com.akiratamcat.joplin-outline-i18n.jpl
   ```

6. Install the `.jpl` in Joplin, switch Joplin to that language, restart Joplin, and check the settings screen, the Tools menu, the editor context menu and the outline panel.

### Fix an existing translation

Edit the `msgstr` in `locales/<locale>.po`, then run `npm test` and `npm run dist`.

### Add or change UI strings

1. Wrap the new English string in `_('...')` in `src/`.
   - Strings used in `src/webview.js` cannot call `_()`. Pass them as a `data-i18n-*` attribute in `src/panelHtml.ts` (see `i18nAttrs`) and read them with `i18n('i18nKey', 'English fallback')` in `webview.js`.
2. Update the template: `npm run i18n:extract`. `npm run i18n:check` fails if the template is out of date.
3. Add the new entries to every PO file. With GNU gettext installed you can run:

   ```sh
   for f in locales/*.po; do msgmerge --update --backup=none "$f" locales/outline.pot; done
   ```

   The bundled parser does **not** skip `#, fuzzy` entries, so review any fuzzy translations msgmerge produces and remove the `fuzzy` flag (or clear the `msgstr`).
4. Translate the new entries, then run `npm test` and `npm run dist`.

### 翻訳の仕組み

| パス | 役割 |
| --- | --- |
| `src/**/*.ts` | UI 文字列を `_('...')`（`src/i18n.ts`）で囲みます。`%s` は追加の引数で置き換わります（例：`_('Default: %s', '10pt')`）。 |
| `locales/outline.pot` | すべての `msgid` を集めたテンプレートです。`npm run i18n:extract` で生成するので、手で編集しないでください。 |
| `locales/<ロケール>.po` | 言語ごとの翻訳ファイルです。ファイル名はロケールコード（`ja`、`zh_TW`、`pt_BR` など）にします。 |
| `src/locales/translations.ts` | `npm run i18n` で PO ファイルから生成されます（`dist`、`test`、`lint` の実行時にも自動で生成されます）。git には含めません。 |

プラグインは起動時に Joplin の `locale` 設定を読み、次の順で翻訳を選びます：完全一致（`zh_TW`）→ 言語コードのみ（`ja_JP` → `ja`）→ 同じ言語の別の地域（`pt_PT` → `pt_BR`、`zh_HK` → `zh_TW`）→ 英語。`msgstr` が空の項目も英語で表示されます。

### 新しい言語を追加する

1. テンプレートをコピーします。ファイル名は Joplin のロケールコードにします。

   ```sh
   cp locales/outline.pot locales/nl.po
   ```

2. `locales/nl.po` のヘッダーに `"Language: nl\n"` と、その言語の `"Plural-Forms: ...\n"` を追加します。
3. すべての `msgstr` を埋めます。`%s` は消さず、個数も原文と同じにしてください。
4. `src/i18n.test.ts` の `available` にロケールコードを追加します。
5. 確認してビルドします。

   ```sh
   npm test        # 全項目が翻訳済みか、%s の個数が合っているかを確認
   npm run dist    # publish/com.akiratamcat.joplin-outline-i18n.jpl を生成
   ```

6. `.jpl` を Joplin にインストールし、Joplin の言語を切り替えて再起動します。設定画面、ツールメニュー、エディタの右クリックメニュー、アウトラインパネルの表示を確認してください。

### 既存の翻訳を直す

`locales/<ロケール>.po` の `msgstr` を編集し、`npm test` と `npm run dist` を実行します。

### UI 文字列を追加・変更する

1. `src/` 内の新しい英語の文字列を `_('...')` で囲みます。
   - `src/webview.js` の中では `_()` を使えません。`src/panelHtml.ts` の `i18nAttrs` に `data-i18n-*` 属性として追加し、`webview.js` では `i18n('i18nKey', '英語の既定値')` で読み出します。
2. テンプレートを更新します：`npm run i18n:extract`。テンプレートが古いままだと、`npm run i18n:check` が失敗します。
3. すべての PO ファイルに新しい項目を追加します。GNU gettext が入っていれば、次のコマンドで追加できます。

   ```sh
   for f in locales/*.po; do msgmerge --update --backup=none "$f" locales/outline.pot; done
   ```

   同梱のパーサは `#, fuzzy` の付いた項目も**そのまま使います**。msgmerge が推測で埋めた fuzzy の訳は内容を確認し、`fuzzy` の印を消すか、`msgstr` を空にしてください。
4. 新しい項目を翻訳し、`npm test` と `npm run dist` を実行します。

## Community

[A markdown outline sidebar plugin for Joplin](https://discourse.joplinapp.org/t/a-markdown-outline-sidebar-plugin-for-joplin/13364)

[Toc as the sidebar](https://discourse.joplinapp.org/t/toc-as-the-sidebar/5979/64)

## Contributors

<a href="https://github.com/cqroot/joplin-outline/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=cqroot/joplin-outline" />
</a>
