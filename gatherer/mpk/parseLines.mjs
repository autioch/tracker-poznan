import { saveOutputItems } from '../utils.mjs';
import { BUS_ROUTE, BUS_TOURIST, MPK_AGENCY, NIGHT_ROUTE, TRAM_ROUTE, TRAM_TOURIST } from './consts.mjs';

const isDailyRoute = (routeId) => routeId !== TRAM_TOURIST && routeId !== BUS_TOURIST && !NIGHT_ROUTE.test(routeId);

const pickRouteId = ({ route_id }) => route_id;
const pickShapeId = ({ shape_id }) => shape_id;
const sortPoints = ([a], [b]) => a - b;

function uniqStr(strArr) {
  const n = {};

  for (let i = 0; i < strArr.length; i++) {
    if (!n[strArr[i]]) {
      n[strArr[i]] = true;
    }
  }

  return Object.keys(n);
}

export default function parseLines(shapes, routes, trips) {
  // TODO Same as in stops
  const tramRouteIds = new Set(routes.filter((route) => route.route_type === TRAM_ROUTE).map(pickRouteId).filter(isDailyRoute));
  const mpkBusRouteIds = new Set(routes.filter((route) => route.route_type === BUS_ROUTE && route.agency_id === MPK_AGENCY).map(pickRouteId).filter(isDailyRoute));
  const otherBusRouteIds = new Set(routes.filter((route) => route.route_type === BUS_ROUTE && route.agency_id !== MPK_AGENCY).map(pickRouteId).filter(isDailyRoute));

  const tramShapeIds = uniqStr(trips.filter((trip) => tramRouteIds.has(trip.route_id)).map(pickShapeId));
  const mpkBusShapeIds = uniqStr(trips.filter((trip) => mpkBusRouteIds.has(trip.route_id)).map(pickShapeId));
  const otherBusShapeIds = uniqStr(trips.filter((trip) => otherBusRouteIds.has(trip.route_id)).map(pickShapeId));

  // TODO They should be unique, like in old version.
  const shapesDict = shapes.reduce((obj, { shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence }) => {
    if (!obj[shape_id]) {
      obj[shape_id] = [];
    }
    obj[shape_id].push([shape_pt_sequence, parseFloat(shape_pt_lat), parseFloat(shape_pt_lon)]);

    return obj;
  }, {});

  const tramShapes = tramShapeIds.map((shapeId) => shapesDict[shapeId].sort(sortPoints).map(([, x, y]) => [x, y]));
  const busShapes = mpkBusShapeIds.map((shapeId) => shapesDict[shapeId].sort(sortPoints).map(([, x, y]) => [x, y]));
  const otherBusShapes = otherBusShapeIds.map((shapeId) => shapesDict[shapeId].sort(sortPoints).map(([, x, y]) => [x, y]));

  saveOutputItems('tramLines', tramShapes, true);
  saveOutputItems('busLines', busShapes, true);
  saveOutputItems('otherBusLines', otherBusShapes, true);
}
