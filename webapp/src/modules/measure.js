import './about.scss';

import tag from 'lean-tag';
import ActiveLocationService from 'services/activeLocation';
import ButtonBarService from 'services/buttonBar';
import groups from 'services/groups';
import PanelService from 'services/panel';
import SettingsService from 'services/settings';

import icons from './icons';

function getPanelContent() {
  return groups.filter((group) => SettingsService.getSetting(group.id).isMeasured).flatMap((group) => [
    tag('div', group.label),
    tag('ol', group.closest
      .map(([dist, { label, closestLines = [] }]) => tag('li', `${label} (${(dist * 1000).toFixed(0)}m)${closestLines.length ? ': ' : ''}${closestLines.join(', ')}`)))
  ]);
}

export default function measure() {
  const buttonEl = ButtonBarService.addButton(icons.measure, 'Show distances', togglePanel);// eslint-disable-line no-use-before-define

  function openPanel() {
    const latLng = ActiveLocationService.getLocation();

    if (latLng) {
      PanelService.show(
        `Closest points (${latLng.map((num) => num.toFixed(5)).join(',')})`,
        () => buttonEl.classList.remove('is-active'),
        getPanelContent()
      );
    } else {
      PanelService.show(
        `Closest points`,
        () => buttonEl.classList.remove('is-active'),
        tag('div.tp-panel__subheader', 'Select a point on map')
      );
    }

    buttonEl.classList.add('is-active');
  }

  function togglePanel() {
    if (buttonEl.classList.contains('is-active')) {
      PanelService.hide();
      buttonEl.classList.remove('is-active');
    } else {
      openPanel();
    }
  }

  function checkOpenPanel() {
    if (buttonEl.classList.contains('is-active')) {
      openPanel();
    }
  }

  ActiveLocationService.addCallback(checkOpenPanel);
  SettingsService.addCallback(checkOpenPanel);
}
