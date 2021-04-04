import L from 'leaflet';

import agencies from './data/agencies.json';
import ranges from './data/ranges.json';

function transportItemDetail([dist, stp]) {
  return `<li>${stp.stopName} (${(dist * 1000).toFixed(0)}m): ${stp.routeIds.join(', ')}</li>`;
}

function transportDetail({ label, closest }) {
  return `<div>${label}</div><ol>${closest.map(transportItemDetail).join('')}</ol>`;
}

function shopItemDetail([dist, stp]) {
  return `<li>${stp.address} (${(dist * 1000).toFixed(0)}m)</li>`;
}

function shopDetail({ label, closest }) {
  return `<div>${label}</div><ol>${closest.map(shopItemDetail).join('')}</ol>`;
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

const defaultSettings = {
  isVisible: false,
  isMeasured: false,
  showRange: 0,
  closest: []

  // layer: null,
  // rangeLayers: null
};

export default function prepare(serialized, transport, shops, misc) {
  [...transport, ...shops, ...misc].forEach((group) => {
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
    group.detailFn = transportDetail;
    group.items.forEach((item) => {
      item.popupHtml = `
        <h3>${item.zoneId} ${item.stopName}</h3>
        <p>Linie: ${item.routeIds.join(', ')}</p>
        ${item.agencyIds.map((agencyId) => `<p>${agencies[agencyId].label.replace('Sp. z o.o.', '').trim()}</p>`).join('')}
      `;
    });
    group.layer = L.layerGroup(
      [...group.items
        .map((item) => L
          .marker([item.latitude, item.longitude], {
            icon: group.iconLayer
          })
          .bindPopup(item.popupHtml)
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

  [...shops, ...misc].forEach((group) => {
    group.detailFn = shopDetail;
    group.items.forEach((item) => {
      item.popupHtml = `<h3>${item.label}</h3><h4>${item.address}</h4>${item.description.map((line) => `<p>${line}</p>`).join('')}`;
    });
    group.layer = L.layerGroup(
      group.items.map((item) => L
        .marker([item.latitude, item.longitude], {
          icon: group.iconLayer
        })
        .bindPopup(item.popupHtml)
      )
    );
  });
}
