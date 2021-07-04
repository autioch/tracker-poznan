import turf from '@turf/turf';
import union from '@turf/union';
import spherical from 'spherical';

import { joinFromCurrentDir, require, saveOutputItems } from '../utils.mjs'; // eslint-disable-line no-shadow
import { getRouteIds, pickShapeId, pickTripId, uniqStr } from './utils.mjs';

const join = joinFromCurrentDir(import.meta, 'db');

const stops = require(join('stops.json'));
const stopTimes = require(join('stop_times.json'));
const trips = require(join('trips.json'));
const routes = require(join('routes.json'));
const shapes = require(join('shapes.json'));
const optimizeShapeGroup = require(joinFromCurrentDir(import.meta)('optimizeShapeGroup.js'));

function getClosestLines(tramRoutes, busRoutes, otherBusRoutes, nightRoutes) {
  // minor int <-> bool conversion trick
  const existingRoutes = (tramRoutes.length > 0) + (busRoutes.length > 0) + (otherBusRoutes.length > 0) + (nightRoutes.length > 0);

  if (existingRoutes < 2) {
    return [[...tramRoutes, ...busRoutes, ...otherBusRoutes, ...nightRoutes].join(', ')];
  }

  const tramText = tramRoutes.length ? `Tram: ${tramRoutes.join(', ')}` : '';
  const busText = busRoutes.length ? `Bus: ${busRoutes.join(', ')}` : '';
  const otherBusText = otherBusRoutes.length ? `Other bus: ${otherBusRoutes.join(', ')}` : '';
  const nightText = nightRoutes.length ? `Night: ${nightRoutes.join(', ')}` : '';

  return [tramText, busText, otherBusText, nightText].filter(Boolean);
}

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

const sortPoints = ([a], [b]) => a - b;
const pickLatLng = ([, lat, lng]) => [lat, lng];

const tripMap = new Map(trips.map((trip) => [trip.trip_id, trip]));
const getRouteId = (tripId) => tripMap.get(tripId).route_id;
const { tramRouteIds, mpkBusRouteIds, otherBusRouteIds, nightRouteIds } = getRouteIds(routes);

const { mpkBusTripIds, otherBusTripIds, tramTripIds, nightBusTripIds } = trips.reduce((obj, { route_id, trip_id }) => {
  if (tramRouteIds.has(route_id)) {
    obj.tramTripIds.add(trip_id);
  } else if (mpkBusRouteIds.has(route_id)) {
    obj.mpkBusTripIds.add(trip_id);
  } else if (otherBusRouteIds.has(route_id)) {
    obj.otherBusTripIds.add(trip_id);
  } else if (nightRouteIds.has(route_id)) {
    obj.nightBusTripIds.add(trip_id);
  }

  return obj;
}, {
  tramTripIds: new Set(),
  mpkBusTripIds: new Set(),
  otherBusTripIds: new Set(),
  nightBusTripIds: new Set()
});

const { tramStopIds, mpkBusStopIds, otherBusStopIds, nightBusStopIds } = stopTimes.reduce((obj, { trip_id, stop_id }) => {
  if (tramTripIds.has(trip_id)) {
    obj.tramStopIds.add(stop_id);
  }
  if (mpkBusTripIds.has(trip_id)) {
    obj.mpkBusStopIds.add(stop_id);
  }
  if (otherBusTripIds.has(trip_id)) {
    obj.otherBusStopIds.add(stop_id);
  }
  if (nightBusTripIds.has(trip_id)) {
    obj.nightBusStopIds.add(stop_id);
  }

  return obj;
}, {
  tramStopIds: new Set(),
  mpkBusStopIds: new Set(),
  otherBusStopIds: new Set(),
  nightBusStopIds: new Set()
});

const { tramStops, mpkBusStops, otherBusStops, nightStops } = stops.reduce((obj, stopItem) => {
  const { stop_id, stop_name, stop_lat, stop_lon } = stopItem;

  const tripIds = uniqStr(stopTimes.filter((stopTime) => stopTime.stop_id === stop_id).map(pickTripId));

  const tramRoutes = uniqStr(tripIds.filter((tripId) => tramTripIds.has(tripId)).map(getRouteId));
  const busRoutes = uniqStr(tripIds.filter((tripId) => mpkBusTripIds.has(tripId)).map(getRouteId));
  const otherBusRoutes = uniqStr(tripIds.filter((tripId) => otherBusTripIds.has(tripId)).map(getRouteId));
  const nightRoutes = uniqStr(tripIds.filter((tripId) => nightBusTripIds.has(tripId)).map(getRouteId));

  const closestLines = getClosestLines(tramRoutes, busRoutes, otherBusRoutes, nightRoutes);
  const stopEl = {
    id: stop_id,
    label: stop_name,
    address: '',
    city: '',
    longitude: stop_lon,
    latitude: stop_lat,
    closestLines,
    popupLines: closestLines
  };

  if (tramStopIds.has(stop_id)) {
    obj.tramStops.push(stopEl);
  }
  if (mpkBusStopIds.has(stop_id)) {
    obj.mpkBusStops.push(stopEl);
  }
  if (otherBusStopIds.has(stop_id)) {
    obj.otherBusStops.push(stopEl);
  }
  if (nightBusStopIds.has(stop_id)) {
    obj.nightStops.push(stopEl);
  }

  return obj;
}, {
  tramStops: [],
  mpkBusStops: [],
  otherBusStops: [],
  nightStops: []
});

const parsedStops = {
  tramStops,
  mpkBusStops,
  otherBusStops,
  nightStops
};

const allRanges = Object.entries(parsedStops).map(([groupName, stopList]) => {
  const modeList = modes.map(([mode, fn]) => [mode, fn(stopList)]);

  return [groupName, modeList];
});

for (let i = 0; i < allRanges.length; i++) {
  const [groupName, modeList] = allRanges[i];

  saveOutputItems(groupName.replace('Stops', 'Ranges'), modeList, true);
}

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

saveOutputItems('tram', tramStops, true);
saveOutputItems('bus', mpkBusStops, true);
saveOutputItems('otherBus', otherBusStops, true);
saveOutputItems('night', nightStops, true);

saveOutputItems('tramLines', tramShapes, true);
saveOutputItems('busLines', busShapes, true);
saveOutputItems('otherBusLines', otherBusShapes, true);
saveOutputItems('nightLines', nightShapes, true);
