/* eslint-disable camelcase */
import tag from 'lean-tag';
import { getLabel, jsonFromBytes, readBytes } from 'utils';

import definitions from './definitions';

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

const definitionColors = Object.fromEntries(definitions.map(({ id, color }) => [id, color]));

const itemsToLoad = Object.entries(dataKeys).flatMap(([dataKey, dicts]) => Object.values(dicts).map((key) => ({
  key,
  label: getLabel(key),
  color: definitionColors[dataKey]
})));

export default function loadData() {
  window.tpSlashList.innerHTML = '';

  const dataPromises = itemsToLoad
    .map(({ key, label, color }) => {
      const progressEl = tag('div.loader-item__progress');
      const progressBarEl = tag('div.loader-item__progress-bar', progressEl);
      const labelEl = tag('div.loader-item__label', label);
      const itemEl = tag('div.loader-item', labelEl, progressBarEl);

      progressEl.style.backgroundColor = color;
      window.tpSlashList.append(itemEl);

      return fetch(`data/${key}.json`)
        .then((resp) => {
          const reader = resp.body.getReader();
          const contentLength = Number(resp.headers.get('Content-Length') || 2000000);

          return readBytes(reader, contentLength, (percent) => {
            progressEl.style.width = `${percent}%`;
          })
            .then(({ chunks, receivedLength }) => {
              labelEl.classList.add('is-loaded');

              return [key, jsonFromBytes(chunks, receivedLength)];
            });
        })
        .catch(() => {
          labelEl.classList.add('is-error');

          return [key, [] ];
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

      return new Promise((res) => {
        setTimeout(() => document.body.removeChild(window.tpSplash), 100);
        setTimeout(() => res(definitions), 200);
      });
    });
}
