import debounce from 'lodash.debounce';
import BoundsService from 'services/bounds';
import groups from 'services/groups';
import PersistenceService from 'services/persistence';
import SettingsService from 'services/settings';

function restoreLatLngZoom(mapInstance) {
  if (PersistenceService.wasRestored()) {
    return;
  }

  const visibleGroups = groups.filter((group) => SettingsService.getSetting(group.id).isVisible);
  const chosenGroups = visibleGroups.length ? visibleGroups : groups;
  const items = chosenGroups.flatMap((group) => group.items);

  BoundsService.fitMinimalBounds(mapInstance, items);
}

const saveLatLngZoom = debounce(({ target }) => {
  const latlng = target.getCenter();
  const zoom = target.getZoom();

  PersistenceService.saveLatLngZoom(latlng, zoom);
}, 100);

export default function persistence(mapInstance) {
  restoreLatLngZoom(mapInstance);

  mapInstance.on('zoomend', saveLatLngZoom);
  mapInstance.on('moveend', saveLatLngZoom);
}
