import { joinFromCurrentDir, require, saveOutputItems } from '../utils.mjs'; // eslint-disable-line no-shadow
import { getRouteIds, pickShapeId, uniqStr } from './utils.mjs';

const optimizeShapeGroup = require(joinFromCurrentDir(import.meta)('optimizeShapeGroup.js'));

const sortPoints = ([a], [b]) => a - b;
const pickLatLng = ([, lat, lng]) => [lat, lng];

export default function parseLines(shapes, routes, trips) {
  const { tramRouteIds, mpkBusRouteIds, otherBusRouteIds, nightRouteIds } = getRouteIds(routes);

  const tramShapeIds = uniqStr(trips.filter((trip) => tramRouteIds.has(trip.route_id)).map(pickShapeId));
  const mpkBusShapeIds = uniqStr(trips.filter((trip) => mpkBusRouteIds.has(trip.route_id)).map(pickShapeId));
  const otherBusShapeIds = uniqStr(trips.filter((trip) => otherBusRouteIds.has(trip.route_id)).map(pickShapeId));
  const nightShapeIds = uniqStr(trips.filter((trip) => nightRouteIds.has(trip.route_id)).map(pickShapeId));

  const shapesDict = shapes.reduce((obj, { shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence }) => {
    if (!obj[shape_id]) {
      obj[shape_id] = [];
    }
    obj[shape_id].push([shape_pt_sequence, shape_pt_lat, shape_pt_lon]);

    return obj;
  }, {});

  const tramShapes = optimizeShapeGroup(tramShapeIds.map((shapeId) => shapesDict[shapeId].sort(sortPoints).map(pickLatLng)));
  const busShapes = optimizeShapeGroup(mpkBusShapeIds.map((shapeId) => shapesDict[shapeId].sort(sortPoints).map(pickLatLng)));
  const otherBusShapes = optimizeShapeGroup(otherBusShapeIds.map((shapeId) => shapesDict[shapeId].sort(sortPoints).map(pickLatLng)));
  const nightShapes = optimizeShapeGroup(nightShapeIds.map((shapeId) => shapesDict[shapeId].sort(sortPoints).map(pickLatLng)));

  saveOutputItems('tramLines', tramShapes, true);
  saveOutputItems('busLines', busShapes, true);
  saveOutputItems('otherBusLines', otherBusShapes, true);
  saveOutputItems('nightLines', nightShapes, true);
}
