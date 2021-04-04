/* eslint-disable max-len */
import L from 'leaflet';

import icons from './icons';
import createPanel from './panel';
import { groups } from './store';
import { getMinimalBounds, haversine } from './utils';

const myIcon = L.icon({
  iconUrl: icons.currentLocation,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, 0]
});

let layers = [];

function setupClosest(latlng) {
  const sources = groups.filter((source) => source.isMeasured);

  sources.forEach((source) => {
    const distances = source.items.map((item) => [haversine(latlng, [item.latitude, item.longitude]), item]);

    distances.sort(([dist1], [dist2]) => dist1 - dist2);
    source.closest = distances.slice(0, source.measureCount);
  });

  return sources;
}

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
        .bindPopup(group.popupFn(item))
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

  const sources = setupClosest(latlng);

  showDistances(sources, mapInstance, latlng);

  const points = sources.flatMap((source) => source.closest.map(([, { latitude, longitude }]) => [latitude, longitude]));
  const minimalBounds = getMinimalBounds([...points, latlng]);

  mapInstance.fitBounds(minimalBounds);

  contentEl.innerHTML = groups.filter((group) => group.isMeasured).map((group) => group.detailFn(group)).join('');
  panelEl.classList.remove('is-hidden');
}
