/* eslint-disable max-len */
import L from 'leaflet';

import icons from './icons';
import createPanel from './panel';
import { bigShops, misc, transport } from './store';
import { getMinimalBounds, haversine } from './utils';

const myIcon = L.icon({
  iconUrl: icons.currentLocation,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, 0]
});

let layers = [];

function setupClosest(latlng) {
  const sources = [...transport, ...bigShops, ...misc].filter((source) => source.isMeasured);

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
      .flatMap((group) => group.closest.map(([, item]) => L.marker([item.latitude, item.longitude], {
        icon: group.iconLayer
      })))
  );

  layers.push(...polylines, iconsLayer, clickMarker);
  layers.forEach((layer) => mapInstance.addLayer(layer));
}

const { panelEl, contentEl } = createPanel('Closest points', removeDistances, {
  style: {
    'max-height': '50%'
  }
});

function stopInfo([dist, stp]) {
  return `<li>${stp.stopName} (${(dist * 1000).toFixed(0)}m): ${stp.routeIds.join(', ')}</li>`;
}

function shopInfo([dist, shop]) {
  return `<li>${shop.address} (${(dist * 1000).toFixed(0)}m)</li>`;
}

function showInfo() {
  const transportHtml = transport
    .filter((source) => source.isMeasured)
    .map((source) => `<div>${source.label}</div><ol>${source.closest.map(stopInfo).join('')}</ol>`)
    .join('');

  const bigShopsHtml = bigShops
    .filter((source) => source.isMeasured)
    .map((source) => `<div>${source.label}</div><ol>${source.closest.map(shopInfo).join('')}</ol>`)
    .join('');

  const miscHtml = misc
    .filter((source) => source.isMeasured)
    .map((source) => `<div>${source.label}</div><ol>${source.closest.map(shopInfo).join('')}</ol>`)
    .join('');

  contentEl.innerHTML = transportHtml + bigShopsHtml + miscHtml;
  panelEl.classList.remove('is-hidden');
}

export default function showClosest(mapInstance, latlng) {
  removeDistances();

  const sources = setupClosest(latlng);

  showDistances(sources, mapInstance, latlng);

  const points = sources.flatMap((source) => source.closest.map(([, { latitude, longitude }]) => [latitude, longitude]));
  const minimalBounds = getMinimalBounds([...points, latlng]);

  mapInstance.fitBounds(minimalBounds);

  showInfo();
}
