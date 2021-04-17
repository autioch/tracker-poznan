const LS_KEY = 'tracker-poznan-viewport1';

let isRestored = false;

function restoreLatLngZoom(mapInstance) {
  const serialized = localStorage.getItem(LS_KEY);

  if (serialized) {
    const { latlng, zoom } = JSON.parse(serialized);

    mapInstance.setView(latlng, zoom);
    isRestored = true;
  }
}

function saveLatLngZoom(latlng, zoom) {
  const serialized = {
    latlng,
    zoom
  };

  localStorage.setItem(LS_KEY, JSON.stringify(serialized));
}

export default {
  restoreLatLngZoom,
  saveLatLngZoom,
  wasRestored: () => isRestored
};
