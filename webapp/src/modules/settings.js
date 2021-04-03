/* eslint-disable object-curly-newline , object-property-newline, max-len */
import './settings.scss';
import icons from 'icons';
import tag from 'lean-tag';
import { bigShops, misc, saveSettings, transport } from 'store';

export default function settings(mapInstance) {
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

    Object.values(item.rangeLayers).forEach((layer) => mapInstance.removeLayer(layer));

    mapInstance.addLayer(item.rangeLayers[showRange]);
    saveSettings();
  }

  function headerRow(label) {
    return tag(
      'div.tp-panel__header',
      label
    );
  }

  function groupRow(group) {
    return tag(
      'div.tp-settings-group',
      tag('img.tp-settings-group__img', { src: group.iconRaw }),
      tag('div.tp-settings-group__info', tag('', group.label), tag('.tp-settings__detail', `${group.items.length} items`)),
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
                [0, 100, 200, 300, 400, 500].map((range) => tag('option', `${range}m`, { value: range, selected: group.showRange == range }))
            ),
            tag('div.tp-settings-group__text', `Range`)
          ] : []
      )
    );
  }

  const contentEl2 = tag(
    'div.tp-panel.is-hidden',
    headerRow('Transport'),
    transport.map(groupRow),
    headerRow('Shops'),
    bigShops.map(groupRow),
    headerRow('Miscellaneous'),
    misc.map(groupRow),
    tag('div.tp-panel__close', {
      onclick: toggleSettings // eslint-disable-line no-use-before-define
    })
  );

  function toggleSettings() {
    const isActive = window.tpSettings.classList.contains('is-active');

    window.tpSettings.classList.toggle('is-active', !isActive);
    contentEl2.classList.toggle('is-hidden', isActive);
  }

  window.tpSettings.addEventListener('click', toggleSettings);
  window.tpSettings.append(tag('img', { src: icons.settings }));
  window.tpSettings.classList.remove('is-hidden');

  document.body.append(contentEl2);
}
