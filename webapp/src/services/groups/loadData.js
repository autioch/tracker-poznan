/* eslint-disable camelcase */
import tag from 'lean-tag';
import { getLabel, jsonFromBytes, readBytes } from 'utils';

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
  'lidl',
  'netto',

  'atm',
  'zabka',
  'inpost',
  'pharmacy'
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

  atm: {
    items: 'atm'
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
      const progressEl = tag('div.loader-item__progress');
      const itemEl = tag(
        'div.loader-item',
        progressEl,
        tag('div.loader-item__label', getLabel(item))
      );

      window.tpSplashContent.append(itemEl);

      return fetch(`data/${item}.json`)
        .then((resp) => {
          const reader = resp.body.getReader();

          const contentLength = Number(resp.headers.get('Content-Length') || 2000000);

          return readBytes(reader, contentLength, (percent) => {
            progressEl.style.width = `${percent}%`;
          })
            .then(({ chunks, receivedLength }) => {
              const data = jsonFromBytes(chunks, receivedLength);

              itemEl.classList.add('is-loaded');

              return [item, data];
            });
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
