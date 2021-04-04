/* eslint-disable max-len */
import debounce from 'lodash.debounce';

import { boundaries } from '../store';

const LS_KEY = 'tracker-poznan-viewport1';

function restoreLatLngZoom(mapInstance) {
  const serialized = localStorage.getItem(LS_KEY);

  if (serialized) {
    const { latlng, zoom } = JSON.parse(serialized);

    mapInstance.setView(latlng, zoom);

    return;
  }

  const { minLatitude, minLongitude, maxLatitude, maxLongitude } = boundaries;

  mapInstance.fitBounds([
    [minLatitude, minLongitude],
    [maxLatitude, maxLongitude]
  ]);
}

const saveLatLngZoom = debounce(({ target }) => {
  const serialized = {
    latlng: target.getCenter(),
    zoom: target.getZoom()
  };

  localStorage.setItem(LS_KEY, JSON.stringify(serialized));
}, 100);

export default function persistence(mapInstance) {
  restoreLatLngZoom(mapInstance);

  mapInstance.on('zoomend', saveLatLngZoom);
  mapInstance.on('moveend', saveLatLngZoom);
}
