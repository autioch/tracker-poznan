import { getMinimalBounds } from 'utils';

function fitMinimalBounds(mapInstance, pointList) {
  const itemPoints = pointList.map((item) => [item.latitude, item.longitude]);

  const minimalBounds = getMinimalBounds(itemPoints);

  mapInstance.fitBounds(minimalBounds);
}

export default {
  fitMinimalBounds
};
