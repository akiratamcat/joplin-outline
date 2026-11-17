import joplin from 'api';
import { ToolbarButtonLocation, ContentScriptType, MenuItemLocation } from 'api/types';
import { registerSettings, settingValue, pluginIconName } from './settings';
import markdownHeaders from './markdownHeaders';
import panelHtml from './panelHtml';
import { _, setLocale } from './i18n';

// Command / view IDs are prefixed so this fork can coexist with the original plugin.
const CMD_TOGGLE = 'outlineI18n.toggleOutline';
const CMD_TOGGLE_COLLAPSE = 'outlineI18n.toggleOutlineCollapse';

joplin.plugins.register({
  async onStart() {
    // Follow Joplin's UI language (a language change requires restarting Joplin).
    setLocale(String((await joplin.settings.globalValue('locale')) || 'en'));
    await registerSettings();

    await joplin.contentScripts.register(
      ContentScriptType.CodeMirrorPlugin,
      'outlineI18n.codeMirror5Scroller',
      './codeMirror5Scroller.js',
    );
    await joplin.contentScripts.register(
      ContentScriptType.CodeMirrorPlugin,
      'outlineI18n.codeMirror6Scroller',
      './codeMirror6Scroller.js',
    );

    const { panels } = joplin.views;
    const view = await (panels as any).create('outlineI18n.panel');

    await panels.setHtml(view, _('Loading outline panel ...'));
    await panels.addScript(view, './webview.js');
    await panels.addScript(view, './webview.css');
    // cp ../node_modules/katex/dist/katex.min.* ./katex/
    await panels.addScript(view, './katex/katex.min.css');
    await panels.addScript(view, './katex/katex.min.js');

    await panels.onMessage(view, async (message: any) => {
      if (message.name === 'scrollToHeader') {
        const isMarkdown = !!(await joplin.settings.globalValue('editor.codeView'));
        const panes = await joplin.settings.globalValue('noteVisiblePanes') as string[];
        const editorVisible = panes.includes('editor');
        const hash = !isMarkdown && message.hash === 'rendered-md' ? 'tinymce' : message.hash;

        if (isMarkdown && editorVisible) {
          // Markdown editor: use scrollToLine command (viewer follows editor scroll in split view)
          await joplin.commands.execute('editor.execCommand', {
            name: 'outlineI18nScrollToLine',
            args: [parseInt(message.lineno, 10)],
          });
        } else {
          // Viewer-only Markdown or Rich Text Editor: use built in scrollToHash command
          await joplin.commands.execute('scrollToHash', hash);
        }
      } else if (message.name === 'contextMenu') {
        const noteId = (await joplin.workspace.selectedNoteIds())[0];
        const noteTitle = (await joplin.data.get(['notes', noteId], { fields: ['title'] })).title;
        let innerLink:string;
        if (message.hash === '') {
          innerLink = `[${noteTitle}](:/${noteId})`;
        } else {
          innerLink = `[${noteTitle}#${message.content}](:/${noteId}#${message.hash})`;
        }

        await joplin.clipboard.writeText(innerLink);
      }
    });

    async function updateTocView() {
      const note = await joplin.workspace.selectedNote();

      // Settings
      const autoHide = await settingValue('autoHide');

      let headers;
      if (note) {
        headers = markdownHeaders(note.body);
      } else {
        headers = [];
      }
      if (headers.length === 0) {
        if (autoHide && await (panels as any).visible(view)) {
          await (panels as any).hide(view);
        }
      } else if (!await (panels as any).visible(view) && (await settingValue('isVisible'))) {
        (panels as any).show(view);
      }

      const htmlText = await panelHtml(headers);
      await panels.setHtml(view, htmlText);
    }

    await joplin.workspace.onNoteSelectionChange(() => {
      updateTocView();
    });
    await joplin.workspace.onNoteChange(() => {
      updateTocView();
    });
    await joplin.settings.onChange(() => {
      updateTocView();
    });

    await updateTocView();

    await joplin.commands.register({
      name: CMD_TOGGLE,
      label: _('Toggle outline'),
      iconName: pluginIconName(),
      execute: async () => {
        const isVisible = !await settingValue('isVisible');
        await joplin.settings.setValue('isVisible', isVisible);

        const note = await joplin.workspace.selectedNote();
        const headers = markdownHeaders(note.body);
        if (headers.length !== 0 || await settingValue('autoHide') === false) {
          (panels as any).show(view, isVisible);
        }
      },
    });
    await joplin.commands.register({
      name: CMD_TOGGLE_COLLAPSE,
      label: _('Toggle outline collapse all'),
      iconName: 'fas fa-chevron-up',
      execute: async () => {
        panels.postMessage(view, { name: 'toggleAll' });
      },
    });
    await joplin.views.toolbarButtons.create('outlineI18nToggleButton', CMD_TOGGLE, ToolbarButtonLocation.NoteToolbar);
    await joplin.views.menus.create('outlineI18nMenu', _('Outline'), [
      {
        label: _('Toggle outline'),
        commandName: CMD_TOGGLE,
      },
      {
        label: _('Toggle outline collapse all'),
        commandName: CMD_TOGGLE_COLLAPSE,
      },
    ], MenuItemLocation.Tools);
    await joplin.views.menuItems.create('outlineI18nMenuItem', CMD_TOGGLE, MenuItemLocation.EditorContextMenu);
    await joplin.views.menuItems.create('outlineI18nCollapseMenuItem', CMD_TOGGLE_COLLAPSE, MenuItemLocation.EditorContextMenu);
  },
});
