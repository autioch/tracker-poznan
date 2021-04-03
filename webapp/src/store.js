import L from 'leaflet';

import agencies from './data/agencies.json';
import biedronkaShops from './data/biedronkaShops.json';
import inposts from './data/inposts.json';
import lidlShops from './data/lidlShops.json';
import pharmacies from './data/pharmacies.json';
import ranges from './data/ranges.json';
import routeLines from './data/routeLines.json';
import stops from './data/stops.json';
import zabkaShops from './data/zabkaShops.json';
import icons from './icons';

const forTram = ({ isForTram }) => isForTram;
const forMpkBus = ({ isForMpkBus }) => isForMpkBus;
const forOtherBus = ({ isForOtherBus }) => isForOtherBus;
const makeIcon = (img, width, height) => L.icon({
  iconUrl: img,
  iconSize: [width, height],
  popupAnchor: [0, -Math.ceil(height / 2)]
});

const LS_KEY = 'tracker-poznan-settings1';

const serialized = (() => {
  const text = localStorage.getItem(LS_KEY);

  return text ? JSON.parse(text) : {};
})();

export const transport = [
  {
    id: 'commune_tram',
    label: 'Tram',
    items: stops.filter(forTram),
    measureCount: 4,
    color: '#F0F',
    iconRaw: icons.tram,
    icon: makeIcon(icons.tram, 16, 16, 'tram'),
    rangesKey: 'trams',
    routeLines: routeLines.filter(forTram)
  },
  {
    id: 'commune_bus',
    label: 'Bus',
    items: stops.filter(forMpkBus),
    measureCount: 4,
    color: '#FA0',
    iconRaw: icons.bus,
    icon: makeIcon(icons.bus, 16, 16, 'bus'),
    rangesKey: 'mpkBuses',
    routeLines: routeLines.filter(forMpkBus)
  },
  {
    id: 'commune_other',
    label: 'Other bus',
    items: stops.filter(forOtherBus),
    measureCount: 4,
    color: '#333',
    iconRaw: icons.otherBus,
    icon: makeIcon(icons.otherBus, 16, 16, 'otherBus'),
    rangesKey: 'otherBuses',
    routeLines: routeLines.filter(forOtherBus)
  }
];

export const bigShops = [
  {
    id: 'lidl',
    label: 'Lidl',
    items: lidlShops,
    measureCount: 2,
    color: '#0050AA',
    iconRaw: icons.lidl,
    icon: makeIcon(icons.lidl, 32, 32, 'lidl')
  },
  {
    id: 'biedronka',
    label: 'Biedronka',
    items: biedronkaShops,
    measureCount: 2,
    color: '#E30713',
    iconRaw: icons.biedronka,
    icon: makeIcon(icons.biedronka, 32, 48, 'biedronka')
  }
];

export const misc = [
  {
    id: 'zabka',
    label: 'Żabka',
    items: zabkaShops,
    measureCount: 2,
    color: '#01672C',
    iconRaw: icons.zabka,
    icon: makeIcon(icons.zabka, 18, 24, 'zabka')
  },
  {
    id: 'inpost',
    label: 'Inpost',
    items: inposts,
    measureCount: 1,
    color: '#000000',
    iconRaw: icons.inpost,
    icon: makeIcon(icons.inpost, 36, 24, 'inpost')
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    items: pharmacies,
    measureCount: 2,
    color: '#007F0E',
    iconRaw: icons.pharmacy,
    icon: makeIcon(icons.pharmacy, 24, 24, 'pharmacy')
  }
];

const defaultSettings = {
  isVisible: false,
  isMeasured: false,
  showRange: 0
};

[...transport, ...bigShops, ...misc].forEach((group) => {
  if (!serialized[group.id]) {
    group.isVisible = false;
    group.isMeasured = false;
    group.showRange = 0;
  }
  Object.assign(group, serialized[group.id] || defaultSettings);
});

export function saveSettings() {
  const settings = Object.fromEntries([...transport, ...bigShops, ...misc].map((group) => [group.id, {
    isVisible: group.isVisible,
    isMeasured: group.isMeasured,
    showRange: group.showRange
  }]));

  localStorage.setItem(LS_KEY, JSON.stringify(settings));
}

function getStopPopup({ zoneId, stopName, routeIds, agencyIds }) {
  return `
    <h3>${zoneId} ${stopName}</h3>
    <p>Linie: ${routeIds.join(', ')}</p>
    ${agencyIds.map((agencyId) => `<p>${agencies[agencyId].label.replace('Sp. z o.o.', '').trim()}</p>`).join('')}
  `;
}

function renderRange(polygon, color) {
  return L.geoJson(polygon, {
    color,
    fillColor: color,
    fillOpacity: 0.2,
    stroke: false
  });
}

transport.forEach((group) => {
  group.layer = L.layerGroup(
    group.items
      .map((item) => L
        .marker([item.latitude, item.longitude], { icon: group.icon }) // eslint-disable-line object-curly-newline
        .bindPopup(getStopPopup(item))
      )
  );

  group.rangeLayers = {
    '0': renderRange([], group.color),
    '100': renderRange(ranges[group.rangesKey][100], group.color),
    '200': renderRange(ranges[group.rangesKey][200], group.color),
    '300': renderRange(ranges[group.rangesKey][300], group.color),
    '400': renderRange(ranges[group.rangesKey][400], group.color),
    '500': renderRange(ranges[group.rangesKey][500], group.color)
  };
});

[...bigShops, ...misc].forEach((group) => {
  group.layer = L.layerGroup(
    group.items.map((item) => L
      .marker([item.latitude, item.longitude], { icon: group.icon }) // eslint-disable-line object-curly-newline
      .bindPopup(`<h3>${item.address}</h3>${item.openingTimes.map((time) => `<p>${time}</p>`).join('')}`)
    )
  );
});
