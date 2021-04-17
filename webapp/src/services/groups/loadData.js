/* eslint-disable camelcase */
// import tag from 'lean-tag';

import definitions from './definitions';

const items = [
  'biedronka',
  'bus',
  'busLines',
  'busRanges',
  'chatapolska',
  'inpost',
  'lidl',
  'netto',
  'night',
  'nightLines',
  'nightRanges',
  'otherBus',
  'otherBusLines',
  'otherBusRanges',
  'pharmacy',
  'tram',
  'tramLines',
  'tramRanges',
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
    .map((item) => fetch(`data/${item}.json`)
      .then((resp) => resp.json())
      .then((data) => [item, data])
    );

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

      return definitions;
    });
}
