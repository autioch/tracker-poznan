/* eslint-disable object-curly-newline , object-property-newline, max-len */
import './settings.scss';
import tag from 'lean-tag';

import createBarButton from '../barButton';
import icons from '../icons';
import createPanel from '../panel';
import { categories, saveSettings } from '../store';

export default function settings(mapInstance) {
  const { contentEl, panelEl } = createPanel('Settings', closePanel, { style: { width: 'calc(100% - 20px)' } }); // eslint-disable-line no-use-before-define
  const buttonEl = createBarButton(icons.settings, togglePanel); // eslint-disable-line no-use-before-define

  function closePanel() {
    panelEl.classList.add('is-hidden');
    buttonEl.classList.remove('is-active');
  }

  function openPanel() {
    panelEl.classList.remove('is-hidden');
    buttonEl.classList.add('is-active');
  }

  function togglePanel() {
    buttonEl.classList.contains('is-active') ? closePanel() : openPanel(); // eslint-disable-line no-unused-expressions
  }

  function changeVisibility(item, isVisible) {
    item.isVisible = isVisible;

    if (isVisible) {
      mapInstance.addLayer(item.layer);
    } else {
      mapInstance.removeLayer(item.layer);
    }
    saveSettings();
  }

  function changeMeasuring(item, isMeasured) {
    item.isMeasured = isMeasured;
    saveSettings();
  }

  function changeRange(item, showRange) {
    item.showRange = showRange;

    Object.values(item.rangeLayers).forEach((layer) => layer.remove());

    mapInstance.addLayer(item.rangeLayers[showRange]);
    saveSettings();
  }

  function groupRow(group) {
    return tag(
      'div.tp-settings-group',
      tag('img.tp-settings-group__img', { src: group.iconRound }),
      tag('div.tp-settings-group__info',
          tag('', group.label),
          tag('.tp-settings__detail', `${group.items.length} items`)
      ),
      tag('label.tp-settings-group__cell',
          tag('input', { type: 'checkbox', checked: group.isVisible, onchange: (ev) => changeVisibility(group, ev.target.checked) }),
          tag('div', `Display`)
      ),
      tag('label.tp-settings-group__cell',
          tag('input', { type: 'checkbox', checked: group.isMeasured, onchange: (ev) => changeMeasuring(group, ev.target.checked) }),
          tag('div.tp-settings-group__text', `Track`)
      ),
      tag('div.tp-settings-group__cell',
          group.rangeLayers ? [
            tag('select',
                { onchange: (ev) => changeRange(group, ev.target.value), value: group.showRange },
                [0, 100, 200, 300, 400, 500].map((range) => tag('option', `${range}m`, { value: range, selected: group.showRange == range })) // eslint-disable-line eqeqeq
            ),
            tag('div.tp-settings-group__text', `Range`)
          ] : []
      )
    );
  }

  contentEl.append(
    ...categories.flatMap(({ label, groups }) => [
      tag('div.tp-panel__subheader', label),
      ...groups.map(groupRow)
    ])
  );
}
