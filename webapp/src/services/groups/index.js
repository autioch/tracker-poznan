import L from 'leaflet';

import groups from './groups';

function popupHtml({ label, popupLines = [], address }) {
  return `<h3>${label}</h3>${address ? `<h4>${address}</h4>` : ''}${popupLines.map((line) => `<p>${line}</p>`).join('')}`;
}

groups.forEach((group) => {
  group.items.forEach((item) => {
    item.popupHtml = popupHtml(item);
    item.group = group;
  });
  group.iconLayer = L.icon({
    iconUrl: group.iconUrl,
    iconSize: [24, 24],
    popupAnchor: [0, -12]
  });

  const layerContents = group.items.map((item) => L.marker([item.latitude, item.longitude], {
    icon: group.iconLayer
  }).bindPopup(item.popupHtml));

  if (group.routeLines) {
    layerContents.push(L.polyline(group.routeLines, {
      color: group.color,
      weight: 2
    }));
  }

  group.layer = L.layerGroup(layerContents);
  group.rangeLayers = [
    [0, L.geoJson([])],
    ...Object.entries(group.ranges || {}).map(([key, polygon]) => [key, L.geoJson(polygon, {
      color: group.color,
      fillColor: group.color,
      fillOpacity: 0.2,
      stroke: false
    })])
  ];
});

export default groups;
