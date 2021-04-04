import L from 'leaflet';

import agencies from './data/agencies.json';
import ranges from './data/ranges.json';

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

const ICON_SIZE = 24;

export default function prepare(serialized, transport, bigShops, misc) {
  const defaultSettings = {
    isVisible: false,
    isMeasured: false,
    showRange: 0
  };

  [...transport, ...bigShops, ...misc].forEach((group) => {
    if (!serialized[group.id]) {
      group.isVisible = group.isVisible || false;
      group.isMeasured = group.isMeasured || false;
      group.showRange = group.showRange || 0;
    }
    Object.assign(group, serialized[group.id] || defaultSettings);

    group.items.forEach((item) => {
      item.group = group;
    });
    group.iconLayer = L.icon({
      iconUrl: group.iconRound,
      iconSize: [ICON_SIZE, ICON_SIZE],
      iconAnchor: [ICON_SIZE / 2, ICON_SIZE],
      popupAnchor: [0, -ICON_SIZE]
    });
  });

  transport.forEach((group) => {
    group.layer = L.layerGroup(
      [...group.items
        .map((item) => L
          .marker([item.latitude, item.longitude], { icon: group.iconLayer }) // eslint-disable-line object-curly-newline
          .bindPopup(getStopPopup(item))
        ),
      L.polyline(group.routeLines.map(({ points }) => points), {
        color: group.color,
        weight: 2,
        dashArray: [3, 3]
      })
      ]
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
        .marker([item.latitude, item.longitude], { icon: group.iconLayer }) // eslint-disable-line object-curly-newline
        .bindPopup(`<h3>${item.address}</h3>${item.openingTimes.map((time) => `<p>${time}</p>`).join('')}`)
      )
    );
  });
}
