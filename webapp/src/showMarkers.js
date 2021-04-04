import { groups } from './store';

function toggleGroup(group, mapInstance) {
  if (group.isVisible) {
    mapInstance.addLayer(group.layer);
  } else {
    mapInstance.removeLayer(group.layer);
  }

  if (group.rangeLayers) {
    Object.values(group.rangeLayers).forEach((layer) => mapInstance.removeLayer(layer));

    mapInstance.addLayer(group.rangeLayers[group.showRange]);
  }
}

export default function showMarkers(mapInstance) {
  groups.forEach((group) => toggleGroup(group, mapInstance));
}
