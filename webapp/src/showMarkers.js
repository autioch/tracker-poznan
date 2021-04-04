import { bigShops, misc, transport } from './store';

const all = [...bigShops, ...misc, ...transport];

export default function showMarkers(mapInstance) {
  all.forEach((group) => {
    if (group.isVisible) {
      mapInstance.addLayer(group.layer);
    } else {
      mapInstance.removeLayer(group.layer);
    }

    if (group.rangeLayers) {
      Object.values(group.rangeLayers).forEach((layer) => mapInstance.removeLayer(layer));

      mapInstance.addLayer(group.rangeLayers[group.showRange]);
    }
  });
}
