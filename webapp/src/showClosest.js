import icons from 'icons';
import L from 'leaflet';
import { bigShops, misc, transport } from 'store';

import { haversine1 } from './haversine';

const myIcon = L.icon({
  iconUrl: icons.currentLocation,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, 0]
});

let clickMarker;

// let closeEl;

let polylines = [];

function removeDistances(mapInstance) {
  if (clickMarker) {
    mapInstance.removeLayer(clickMarker);
    clickMarker = null;
  }
  polylines.forEach((polyline) => mapInstance.removeLayer(polyline));
  polylines = [];
}

function showDistances(sources, mapInstance, latlng) {
  polylines = sources.map((source) => L.polyline([
    source.closest.map(([, item]) => [latlng, [item.latitude, item.longitude] ])
  ], {
    weight: 2,
    color: source.color
  }));

  polylines.forEach((polyline) => mapInstance.addLayer(polyline));
}

// function stopInfo([dist, stp]) {
//   return `<li>${stp.stopName} (${(dist * 1000).toFixed(0)}m): ${stp.routeIds.join(', ')}</li>`;
// }
//
// function shopInfo([dist, shop]) {
//   return `<li>${shop.address} (${(dist * 1000).toFixed(0)}m)</li>`;
// }

// function showInfo(mapInstance) {
//   const communeHtml = commune
//     .filter((source) => source.isMeasured)
//     .map((source) => `<div>${source.label}</div><ol>${source.closest.map(stopInfo).join('')}</ol>`)
//     .join('');
//
//   const shopsHtml = shops
//     .filter((source) => source.isMeasured)
//     .map((source) => `<div>${source.label}</div><ol>${source.closest.map(shopInfo).join('')}</ol>`)
//     .join('');
//
//   window.distance.innerHTML = communeHtml + shopsHtml;
//
//   closeEl = document.createElement('div');
//
//   function hideInfo() {
//     closeEl.removeEventListener('click', hideInfo);
//     window.distance.innerHTML = '';
//     removeDistances(mapInstance);
//   }
//
//   closeEl.textContent = 'X';
//   closeEl.className = 'distance-close';
//   closeEl.addEventListener('click', hideInfo);
//
//   window.distance.append(closeEl);
// }

function setMinimumBounds(sources, mapInstance, latlng) {
/* Inverted for purpose of finding min rect. */
  let minLat = 90;

  let maxLat = -90;

  let minLng = 180;

  let maxLng = -180;

  const points = sources.flatMap((source) => source.closest.map(([, { latitude, longitude }]) => [latitude, longitude]));

  points.concat([latlng]).forEach(([lat, lng]) => {
    if (lat < minLat) {
      minLat = lat;
    }
    if (lat > maxLat) {
      maxLat = lat;
    }
    if (lng < minLng) {
      minLng = lng;
    }
    if (lng > maxLng) {
      maxLng = lng;
    }
  });

  mapInstance.fitBounds([
    [minLat, minLng],
    [maxLat, maxLng]
  ]);
}

function setupClosest(sources, latlng) {
  // const latlng = [lat, lng];

  sources.forEach((source) => {
    const distances = source.items.map((item) => [haversine1(latlng, [item.latitude, item.longitude]), item]);

    distances.sort(([dist1], [dist2]) => dist1 - dist2);
    source.closest = distances.slice(0, source.measureCount);
  });
}

export default function showClosest(mapInstance, latlng) {
  removeDistances(mapInstance);

  clickMarker = new L.Marker(latlng, { // todo can be array or has to be object?
    icon: myIcon
  });

  mapInstance.addLayer(clickMarker);

  const sources = [...transport, ...bigShops, ...misc].filter((source) => source.isMeasured);

  setupClosest(sources, latlng);
  showDistances(sources, mapInstance, latlng);
  setMinimumBounds(sources, mapInstance, latlng);

  // showInfo(mapInstance);
}
