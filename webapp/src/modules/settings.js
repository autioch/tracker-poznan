import './settings.scss';

import tag from 'lean-tag';
import ButtonBarService from 'services/buttonBar';
import groups from 'services/groups';
import PanelService from 'services/panel';
import SettingsService from 'services/settings';

import icons from './icons';

const LIMIT_OPTIONS = [0, 1, 2, 3, 4, 5].map((value) => ({
  value,
  label: value === 0 ? 'None' : value.toString()
}));

const categories = [
  {
    id: 'transport',
    label: 'Transport',
    groups: groups.filter((group) => group.category === 'transport')
  },
  {
    id: 'shops',
    label: 'Shops',
    groups: groups.filter((group) => group.category === 'shop'),
    allowLimit: true
  },
  {
    id: 'misc',
    label: 'Miscellaneous',
    groups: groups.filter((group) => group.category === 'misc')
  }
];

function groupRow(group) {
  const setting = SettingsService.getSetting(group.id);

  return tag(
    'div.tp-settings-group',
    tag('img.tp-settings-group__img', {
      src: group.iconUrl,
      alt: group.label
    }),
    tag('div.tp-settings-group__info',
        tag('.tp-settings-group__label', group.label, {
          style: {
            color: group.color
          }
        }),
        tag('.tp-settings__detail', `${group.items.length} items`)
    ),
    tag('label.tp-settings-group__cell',
        tag('input', {
          type: 'checkbox',
          checked: !!setting.isVisible,
          onchange: (ev) => SettingsService.changeVisibility(group, ev.target.checked)
        }),
        tag('div', `Display`)
    ),
    tag('label.tp-settings-group__cell',
        tag('input', {
          type: 'checkbox',
          checked: !!setting.isMeasured,
          onchange: (ev) => SettingsService.changeMeasuring(group, ev.target.checked)
        }),
        tag('div.tp-settings-group__text', `Measure`)
    ),
    tag('div.tp-settings-group__cell',
        group.rangeLayers.length > 1 ? [
          tag('select',
              {
                onchange: (ev) => SettingsService.changeRange(group, ev.target.value),
                value: setting.showRange || 0
              },
              group.rangeLayers.map(([key]) => tag('option', `${key}m`, {
                value: key,
                selected: setting.showRange == key // eslint-disable-line eqeqeq
              }))
          ),
          tag('div.tp-settings-group__text', 'Reach')
        ] : []
    )
  );
}

function getPanelContent() {
  return categories.flatMap((category) => [
    tag('div.tp-panel__subheader', category.label),
    category.allowLimit ? tag('div.tp-settings__limit', [
      tag('div', 'Limit total measured shops to: '),
      tag('select',
          {
            onchange: (ev) => SettingsService.setShopLimit(ev.target.value),
            value: SettingsService.getShopLimit()
          },
          LIMIT_OPTIONS.map(({ value, label }) => tag('option', label, {
            value,
            selected: value == SettingsService.getShopLimit() // eslint-disable-line eqeqeq
          }))
      )
    ]) : [],
    ...category.groups.map(groupRow)
  ]).flat();
}

export default function settingsModule() {
  const buttonEl = ButtonBarService.addButton(icons.settings, 'Settings', togglePanel); // eslint-disable-line no-use-before-define

  function openPanel() {
    buttonEl.classList.add('is-active');

    PanelService.show(
      'Settings',
      () => buttonEl.classList.remove('is-active'),
      getPanelContent()
    );
  }

  function togglePanel() {
    if (buttonEl.classList.contains('is-active')) {
      PanelService.hide();
      buttonEl.classList.remove('is-active');
    } else {
      openPanel();
    }
  }
}
