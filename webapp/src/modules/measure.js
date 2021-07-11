import './meaure.scss';

import tag from 'lean-tag';
import ActiveLocationService from 'services/activeLocation';
import BoundsService from 'services/bounds';
import ButtonBarService from 'services/buttonBar';
import groups from 'services/groups';
import PanelService from 'services/panel';
import SettingsService from 'services/settings';

import icons from './icons';

function getCategoryRows(categoryLabel, categoryGroups, mapInstance) {
  return categoryGroups.length ? [
    tag('div.tp-panel__header', categoryLabel),
    ...categoryGroups.flatMap((group) => [
      tag('div.measure-subheader', group.label),
      tag('ol', group.closest
        .map(([dist, { label, latitude, longitude, closestLines = [] }]) => tag(
          'li.measure-link',
          `${label} (${(dist * 1000).toFixed(0)}m)${closestLines.length ? ': ' : ''}${closestLines.join(', ')}`,
          {
            onclick: () => BoundsService.centerMap(mapInstance, [latitude, longitude])
          }
        )))
    ])
  ] : [];
}

function getPanelContents(mapInstance) {
  const latLng = ActiveLocationService.getLocation();

  if (!latLng) {
    return tag('div.tutorial',
               tag('div.tp-panel__subheader', 'Select a point on map using one of the options:'),
               tag('div.tutorial__item',
                   tag('img.tutorial__icon', {
                     src: icons.custom,
                     alt: 'Click on map'
                   }),
                   'Click on map to find closest POIs'
               ),
               tag('div.tutorial__item',
                   tag('img.tutorial__icon', {
                     src: icons.currentLocation,
                     alt: 'Current location'
                   }),
                   'Use current location to find closest POIs'
               )
    );
  }

  const measuredGroups = groups.filter((group) => SettingsService.getSetting(group.id).isMeasured && group.closest.length);

  if (!measuredGroups.length) {
    return tag('div.tutorial__item',
               tag('img.tutorial__icon', {
                 src: icons.settings,
                 alt: 'Settings'
               }),
               'Set some measured POIs'
    );
  }

  const transport = measuredGroups.filter((group) => group.category === 'transport');
  const shop = measuredGroups.filter((group) => group.category === 'shop');
  const misc = measuredGroups.filter((group) => group.category === 'misc');

  return [
    tag('.measure-link.measure-header', `Selected: ${latLng.map((num) => num.toFixed(5)).join(',')}`),
    getCategoryRows('Transport', transport, mapInstance),
    getCategoryRows('Shops', shop, mapInstance),
    getCategoryRows('Miscellaneous', misc, mapInstance)
  ].flat();
}

export default function measure(mapInstance) {
  const buttonEl = ButtonBarService.addButton(icons.measure, 'Show distances', togglePanel);// eslint-disable-line no-use-before-define

  function openPanel() {
    const content = getPanelContents(mapInstance);

    PanelService.show(
      `Closest points`,
      () => buttonEl.classList.remove('is-active'),
      content,
      true
    );

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
