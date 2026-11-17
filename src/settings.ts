import { SettingItemSubType, SettingItemType } from 'api/types';
import joplin from '../api';
import { _ } from './i18n';

export function pluginIconName(): string {
  return 'fas fa-list';
}

export async function registerSettings(): Promise<void> {
  await joplin.settings.registerSection('outlineI18n.settings', {
    label: _('Outline'),
    iconName: pluginIconName(),
  });

  await joplin.settings.registerSettings({
    isVisible: {
      type: SettingItemType.Bool,
      value: true,
      section: 'outlineI18n.settings',
      public: false,
      label: 'isVisible',
    },

    showNumber: {
      type: SettingItemType.Bool,
      value: false,
      description: _('show numbered headers'),
      section: 'outlineI18n.settings',
      public: true,
      label: _('Show Number'),
    },
    collapsible: {
      type: SettingItemType.Bool,
      value: false,
      description: _('headers can be collapsed'),
      section: 'outlineI18n.settings',
      public: true,
      label: _('Collapsible'),
    },
    autoHide: {
      type: SettingItemType.Bool,
      value: false,
      description: _('Automatically hide the panel when there is no content'),
      section: 'outlineI18n.settings',
      public: true,
      label: _('Auto Hide'),
    },
    hoverStyleType: {
      type: SettingItemType.Int,
      value: 0,
      description: _('Item hover style type'),
      section: 'outlineI18n.settings',
      public: true,
      label: _('Hover Style Type'),
      isEnum: true,
      options: {
        0: _('bold'),
        1: _('highlight'),
      },
    },
    headerDepth: {
      type: SettingItemType.Int,
      value: 6,
      description: _('Header depth'),
      section: 'outlineI18n.settings',
      public: true,
      label: _('Header Depth'),
    },
    itemPadding: {
      type: SettingItemType.Int,
      section: 'outlineI18n.settings',
      public: true,
      label: _('Item Padding'),
      description: _('This setting is used to change the height of toc item. The unit is px'),
      value: 2,
    },

    userStyleFile: {
      type: SettingItemType.String,
      value: `${await joplin.settings.globalValue('profileDir')}/outline.css`,
      description: _('User style file (CSS)'),
      section: 'outlineI18n.settings',
      public: true,
      label: _('User Style File'),
      advanced: true,
      subType: SettingItemSubType.FilePath,
    },
    disableLinewrap: {
      type: SettingItemType.Bool,
      value: false,
      description: _('Disable the linewrap'),
      section: 'outlineI18n.settings',
      public: true,
      advanced: true,
      label: _('Disable Linewrap'),
    },
    headerIndent: {
      type: SettingItemType.Int,
      value: 15,
      description: _('Default: %s', '15px'),
      section: 'outlineI18n.settings',
      public: true,
      label: _('Header Indent (px)'),
      advanced: true,
    },
    fontFamily: {
      type: SettingItemType.String,
      value: 'var(--joplin-font-family)',
      description: 'var(--joplin-font-family)',
      section: 'outlineI18n.settings',
      public: true,
      label: _('Font Family'),
      advanced: true,
    },
    fontSize: {
      type: SettingItemType.Int,
      value: '10',
      description: _('Default: %s', '10pt'),
      section: 'outlineI18n.settings',
      public: true,
      label: _('Font Size (pt)'),
      advanced: true,
    },
    fontColor: {
      type: SettingItemType.String,
      value: 'var(--joplin-color)',
      description: 'var(--joplin-color)',
      section: 'outlineI18n.settings',
      public: true,
      label: _('Font Color'),
      advanced: true,
    },
    bgColor: {
      type: SettingItemType.String,
      value: 'var(--joplin-background-color)',
      description: 'var(--joplin-background-color)',
      section: 'outlineI18n.settings',
      public: true,
      label: _('Background Color'),
      advanced: true,
    },
    userStyle: {
      type: SettingItemType.String,
      value: '',
      description: _('User style'),
      section: 'outlineI18n.settings',
      public: true,
      label: _('User Style'),
      advanced: true,
    },
    h1Prefix: {
      type: SettingItemType.String,
      value: '',
      section: 'outlineI18n.settings',
      public: true,
      label: _('H%s Prefix', '1'),
      advanced: true,
    },
    h2Prefix: {
      type: SettingItemType.String,
      value: '',
      section: 'outlineI18n.settings',
      public: true,
      label: _('H%s Prefix', '2'),
      advanced: true,
    },
    h3Prefix: {
      type: SettingItemType.String,
      value: '',
      section: 'outlineI18n.settings',
      public: true,
      label: _('H%s Prefix', '3'),
      advanced: true,
    },
    h4Prefix: {
      type: SettingItemType.String,
      value: '',
      section: 'outlineI18n.settings',
      public: true,
      label: _('H%s Prefix', '4'),
      advanced: true,
    },
    h5Prefix: {
      type: SettingItemType.String,
      value: '',
      section: 'outlineI18n.settings',
      public: true,
      label: _('H%s Prefix', '5'),
      advanced: true,
    },
    h6Prefix: {
      type: SettingItemType.String,
      value: '',
      section: 'outlineI18n.settings',
      public: true,
      label: _('H%s Prefix', '6'),
      advanced: true,
    },
  });
}

export function settingValue(key: string): Promise<any> {
  return joplin.settings.value(key);
}
