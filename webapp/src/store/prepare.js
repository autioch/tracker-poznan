import L from 'leaflet';

// import agencies from './data/agencies.json';
import mpkRanges from './data/mpkRanges.json';

function itemDetail([dist, { label, closestLines = [] }]) {
  const distance = `${(dist * 1000).toFixed(0)}m`;

  return `<li>${label} (${distance})${closestLines.length ? ': ' : ''}${closestLines.join(', ')}</li>`;
}

function groupDetailFn({ label, closest }) {
  return `<div>${label}</div><ol>${closest.map(itemDetail).join('')}</ol>`;
}

function popupHtml({ label, popupLines = [], address }) {
  return `<h3>${label}</h3>${address ? `<h4>${address}</h4>` : ''}${popupLines.map((line) => `<p>${line}</p>`).join('')}`;
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
      item.popupHtml = popupHtml(item);
      item.group = group;
    });
    group.iconLayer = L.icon({
      iconUrl: group.iconRound,
      iconSize: [ICON_SIZE, ICON_SIZE],

      // iconAnchor: [ICON_SIZE / 2, ICON_SIZE], // this would put it directly above, not in range circle
      popupAnchor: [0, -ICON_SIZE]
    });
  });

  transport.forEach((group) => {
    group.detailFn = groupDetailFn;
    group.layer = L.layerGroup(
      [
        ...group.items.map(
          (item) => L
            .marker([item.latitude, item.longitude], {
              icon: group.iconLayer
            })
            .bindPopup(item.popupHtml)
        ),
        L.polyline(group.routeLines, {
          color: group.color,
          weight: 2
        })
      ]
    );

    group.rangeLayers = {
      '0': renderRange([], group.color),
      '100': renderRange(mpkRanges[group.rangesKey][100], group.color),
      '200': renderRange(mpkRanges[group.rangesKey][200], group.color),
      '300': renderRange(mpkRanges[group.rangesKey][300], group.color),
      '400': renderRange(mpkRanges[group.rangesKey][400], group.color),
      '500': renderRange(mpkRanges[group.rangesKey][500], group.color)
    };
  });

  [...shops, ...misc].forEach((group) => {
    group.detailFn = groupDetailFn;
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
