import L from 'leaflet';

import icons from './icons';
import createPanel from './panel';
import { groups, setupClosest } from './store';
import { getMinimalBounds } from './utils';

const myIcon = L.icon({
  iconUrl: icons.currentLocation,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, 0]
});

let layers = [];

function removeDistances() {
  layers.forEach((polyline) => polyline.remove());
  layers = [];
}

function showDistances(sources, mapInstance, latlng) {
  const clickMarker = new L.Marker(latlng, { // todo can be array or has to be object?
    icon: myIcon
  });

  const polylines = sources.map((group) => L.polyline([
    group.closest.map(([, item]) => [latlng, [item.latitude, item.longitude] ])
  ], {
    weight: 2,
    color: group.color
  }));

  const iconsLayer = L.layerGroup(
    sources
      .filter((group) => !group.isVisible)
      .flatMap((group) => group.closest.map(([, item]) => L
        .marker([item.latitude, item.longitude], {
          icon: group.iconLayer
        })
        .bindPopup(item.popupHtml)
      ))
  );

  layers.push(...polylines, iconsLayer, clickMarker);
  layers.forEach((layer) => mapInstance.addLayer(layer));
}

const { panelEl, contentEl } = createPanel('Closest points', removeDistances, {
  style: {
    'max-height': '50%'
  }
});

export default function showClosest(mapInstance, latlng) {
  removeDistances();
  setupClosest(latlng);

  const measuredGroups = groups.filter((group) => group.isMeasured);

  showDistances(measuredGroups, mapInstance, latlng);

  const points = measuredGroups.flatMap((source) => source.closest.map(([, { latitude, longitude }]) => [latitude, longitude]));
  const minimalBounds = getMinimalBounds([...points, latlng]);

  mapInstance.fitBounds(minimalBounds);

  contentEl.innerHTML = measuredGroups.map((group) => group.detailFn(group)).join('');
  panelEl.classList.remove('is-hidden');
}
