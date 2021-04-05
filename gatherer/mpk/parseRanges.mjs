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

const circle100 = stopToCircle(100);
const circle200 = stopToCircle(200);
const circle300 = stopToCircle(300);
const circle400 = stopToCircle(400);
const circle500 = stopToCircle(500);

const poly100 = (stopList) => turf.cleanCoords(stopList.map(circle100).reduce(union.default));
const poly200 = (stopList) => turf.cleanCoords(stopList.map(circle200).reduce(union.default));
const poly300 = (stopList) => turf.cleanCoords(stopList.map(circle300).reduce(union.default));
const poly400 = (stopList) => turf.cleanCoords(stopList.map(circle400).reduce(union.default));
const poly500 = (stopList) => turf.cleanCoords(stopList.map(circle500).reduce(union.default));

const modes = Object.entries({
  '100': poly100,
  '200': poly200,
  '300': poly300,
  '400': poly400,
  '500': poly500
});

export default function parseRanges(stops) {
  const { tramStops, mpkBusStops, otherBusStops } = stops;

  const sortedStops = {
    tramStops,
    mpkBusStops,
    otherBusStops
  };

  const mpkRanges = Object.entries(sortedStops).reduce((obj, [key, stopList]) => {
    obj[key] = modes.reduce((obj2, [mode, fn]) => {
      console.timeLog('ranges', 'ranges2', key, mode);
      obj2[mode] = fn(stopList);

      return obj2;
    }, {});

    return obj;
  }, {});

  saveOutputItems('mpkRanges', mpkRanges, true);
}
