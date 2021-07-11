import { saveOutputItems } from '../../utils/index.mjs';
import { NIGHT_ROUTE } from './consts.mjs';
import generateRanges from './generateRanges.mjs';
import optimizeShapeGroup from './optimizeShapeGroup.mjs';

export const pickRouteId = ({ route_id }) => route_id;

const sortPoints = ([a], [b]) => a - b;
const pickLatLng = ([, lat, lng]) => [lat, lng];

export const isDailyRoute = (routeId) => !NIGHT_ROUTE.test(routeId);
export const isNightlyRoute = (routeId) => NIGHT_ROUTE.test(routeId);

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

  const shapeIds = uniqStr(trips.filter((trip) => routeIds.has(trip.route_id)).map(({ shape_id }) => shape_id));
  const shapes = optimizeShapeGroup(shapeIds.map((shapeId) => shapesDict[shapeId].sort(sortPoints).map(pickLatLng)));

  await saveOutputItems(`${groupName}Lines`, shapes, true);

  const ranges = generateRanges(stops);

  await saveOutputItems(`${groupName}Ranges`, ranges, true);
}
