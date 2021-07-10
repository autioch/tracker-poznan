import turf from '@turf/turf';
import union from '@turf/union';
import spherical from 'spherical';

import { saveOutputItems } from '../utils.mjs';
import { NIGHT_ROUTE } from './consts.mjs';
import optimizeShapeGroup from './optimizeShapeGroup.mjs';

export const pickRouteId = ({ route_id }) => route_id;
export const pickTripId = ({ trip_id }) => trip_id;
export const pickShapeId = ({ shape_id }) => shape_id;

const sortPoints = ([a], [b]) => a - b;
const pickLatLng = ([, lat, lng]) => [lat, lng];

export const isDailyRoute = (routeId) => !NIGHT_ROUTE.test(routeId);
export const isNightlyRoute = (routeId) => NIGHT_ROUTE.test(routeId);

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

export function uniqStr(strArr) {
  const n = {};

  for (let i = 0; i < strArr.length; i++) {
    if (!n[strArr[i]]) {
      n[strArr[i]] = true;
    }
  }

  return Object.keys(n);
}

export async function finalizeGroup(groupName, stops, shapesDict, trips, routeIds) { // eslint-disable-line max-params
  await saveOutputItems(`${groupName}`, stops, true);

  const shapeIds = uniqStr(trips.filter((trip) => routeIds.has(trip.route_id)).map(pickShapeId));
  const shapes = optimizeShapeGroup(shapeIds.map((shapeId) => shapesDict[shapeId].sort(sortPoints).map(pickLatLng)));

  await saveOutputItems(`${groupName}Lines`, shapes, true);

  const ranges = modes.map(([mode, fn]) => [mode, fn(stops)]);

  await saveOutputItems(`${groupName}Ranges`, ranges, true);
}
