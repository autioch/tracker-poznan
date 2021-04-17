/* eslint-disable camelcase */
import tag from 'lean-tag';
import { getLabel } from 'utils';

import definitions from './definitions';

const items = [
  'tram',
  'tramLines',
  'tramRanges',
  'bus',
  'busLines',
  'busRanges',
  'otherBus',
  'otherBusLines',
  'otherBusRanges',
  'night',
  'nightLines',
  'nightRanges',

  'biedronka',
  'chatapolska',
  'inpost',
  'lidl',
  'netto',
  'pharmacy',
  'zabka'
];

const dataKeys = {
  commune_tram: {
    items: 'tram',
    routeLines: 'tramLines',
    ranges: 'tramRanges'
  },
  commune_bus: {
    items: 'bus',
    routeLines: 'busLines',
    ranges: 'busRanges'
  },
  commune_other: {
    items: 'otherBus',
    routeLines: 'otherBusLines',
    ranges: 'otherBusRanges'
  },
  commune_night: {
    items: 'night',
    routeLines: 'nightLines',
    ranges: 'nightRanges'
  },
  lidl: {
    items: 'lidl'
  },
  biedronka: {
    items: 'biedronka'
  },
  netto: {
    items: 'netto'
  },
  chatapolska: {
    items: 'chatapolska'
  },
  zabka: {
    items: 'zabka'
  },
  inpost: {
    items: 'inpost'
  },
  pharmacy: {
    items: 'pharmacy'
  }
};

export default function loadData() {
  const dataPromises = items
    .map((item) => {
      const loaderEl = tag('div.loader-item__status.is-hidden', 'loaded');
      const itemEl = tag('div.loader-item', tag('div.loader-item__label', getLabel(item)), loaderEl);

      window.tpSplashContent.append(itemEl);

      return fetch(`data/${item}.json`)
        .then((resp) => resp.json())
        .then((data) => {
          loaderEl.classList.remove('is-hidden');
          itemEl.classList.add('is-loaded');

          return [item, data];
        });
    });

  return Promise
    .all(dataPromises)
    .then((allData) => {
      const data = Object.fromEntries(allData);

      definitions.forEach((group) => {
        const { id } = group;

        Object.entries(dataKeys[id]).forEach(([key, value]) => {
          group[key] = data[value];
        });
      });

      setTimeout(() => document.body.removeChild(window.tpSplash), 1000);

      return definitions;
    });
}
