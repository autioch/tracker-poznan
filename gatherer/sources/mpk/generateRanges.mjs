import { cleanCoords } from '@turf/turf';
import polygonClipping from 'polygon-clipping';
import { radial } from 'spherical';

import { roundToMeters } from '../../utils/index.mjs';

const ARC_COUNT = 18;
const MODE_LIST = [100, 200, 300, 400, 500];

function roundGeo(coordinates) {
  if (Array.isArray(coordinates)) {
    return coordinates.map(roundGeo);
  }

  return roundToMeters(coordinates);
}

export default function generateRanges(stops, modeList = MODE_LIST, arcCount = ARC_COUNT) {
  const angles = new Array(arcCount + 1).fill(null).map((_, i) => (i / arcCount) * 360); // eslint-disable-line no-unused-vars

  return modeList.map((mode) => {
    const circles = stops.map(({ latitude, longitude }) => [angles.map((angle) => radial([longitude, latitude], angle, mode))]);
    const unioned = polygonClipping.union(...circles);

    const feature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: unioned.length > 1 ? 'MultiPolygon' : 'Polygon',
        coordinates: roundGeo(unioned.length > 1 ? unioned : unioned[0])
      }
    };

    const clean = cleanCoords(feature);

    return [mode, clean];
  });
}
