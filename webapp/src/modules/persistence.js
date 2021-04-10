import debounce from 'lodash.debounce';
import BoundsService from 'services/bounds';
import groups from 'services/groups';
import SettingsService from 'services/settings';

const LS_KEY = 'tracker-poznan-viewport1';

function restoreLatLngZoom(mapInstance) {
  const serialized = localStorage.getItem(LS_KEY);

  if (serialized) {
    const { latlng, zoom } = JSON.parse(serialized);

    mapInstance.setView(latlng, zoom);

    return;
  }

  const visibleGroups = groups.filter((group) => SettingsService.getSetting(group.id).isVisible);
  const chosenGroups = visibleGroups.length ? visibleGroups : groups;
  const items = chosenGroups.flatMap((group) => group.items);

  BoundsService.fitMinimalBounds(mapInstance, items);
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
