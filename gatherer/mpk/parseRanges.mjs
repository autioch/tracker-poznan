import turf from '@turf/turf';
import union from '@turf/union';
import spherical from 'spherical';

import { saveOutputItems } from '../utils.mjs';

const ARCS = 18;
const ANGLES = new Array(ARCS + 1).fill(null).map((_, i) => (i / ARCS) * 360); // eslint-disable-line no-unused-vars

function stopToCircle(radius) {
  return ({ latitude, longitude }) => {
    const center = [longitude, latitude];

    return { // hack for invariant helper from truf
      coordinates: [ANGLES.map((angle) => spherical.radial(center, angle, radius))]
    };
  };
}

const modes = [100, 200, 300, 400, 500].map((mode) => {
  const circle = stopToCircle(mode);

  return [mode, (stopList) => turf.cleanCoords(stopList.map(circle).reduce(union.default))];
});

export default function parseRanges(stops) {
  const allRanges = Object.entries(stops).map(([groupName, stopList]) => {
    const modeList = modes.map(([mode, fn]) => {
      console.timeLog('ranges', 'ranges2', groupName, mode);

      return [mode, fn(stopList)];
    });

    return [groupName, modeList];
  });

  for (let i = 0; i < allRanges.length; i++) {
    const [groupName, modeList] = allRanges[i];

    saveOutputItems(groupName.replace('Stops', 'Ranges'), modeList, true);
  }
}
