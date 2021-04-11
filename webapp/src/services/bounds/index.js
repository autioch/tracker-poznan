import { getMinimalBounds } from 'utils';

function fitMinimalBounds(mapInstance, pointList) {
  const itemPoints = pointList.map((item) => [item.latitude, item.longitude]);

  const minimalBounds = getMinimalBounds(itemPoints);

  mapInstance.fitBounds(minimalBounds);
}

function centerMap(mapInstance, latLng) {
  mapInstance.flyTo(latLng);
}

export default {
  fitMinimalBounds,
  centerMap
};

// TODO Inject map (with a method)
