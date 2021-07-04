import { joinFromCurrentDir, require } from '../utils.mjs'; // eslint-disable-line no-shadow
import { BUS_ROUTE, MPK_AGENCY, TOURIST_LINES, TRAM_ROUTE } from './consts.mjs';
import { finalizeGroup, isDailyRoute, isNightlyRoute, pickRouteId, pickTripId, uniqStr } from './utils.mjs';

const join = joinFromCurrentDir(import.meta, 'db');

const stops = require(join('stops.json'));
const stopTimes = require(join('stop_times.json'));
const trips = require(join('trips.json'));
const routes = require(join('routes.json'));
const shapes = require(join('shapes.json'));

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

const tripMap = new Map(trips.map((trip) => [trip.trip_id, trip]));
const getRouteId = (tripId) => tripMap.get(tripId).route_id;

const standardRoutes = routes.filter((route) => !TOURIST_LINES.has(route.route_id));

const tramRouteIds = new Set(standardRoutes.filter((route) => route.route_type === TRAM_ROUTE).map(pickRouteId).filter(isDailyRoute));
const mpkBusRouteIds = new Set(standardRoutes.filter((route) => route.route_type === BUS_ROUTE && route.agency_id === MPK_AGENCY).map(pickRouteId).filter(isDailyRoute));
const otherBusRouteIds = new Set(standardRoutes.filter((route) => route.route_type === BUS_ROUTE && route.agency_id !== MPK_AGENCY).map(pickRouteId).filter(isDailyRoute));
const nightRouteIds = new Set(standardRoutes.map(pickRouteId).filter(isNightlyRoute));

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

const shapesDict = shapes.reduce((obj, { shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence }) => {
  if (!obj[shape_id]) {
    obj[shape_id] = [];
  }
  obj[shape_id].push([shape_pt_sequence, shape_pt_lat, shape_pt_lon]);

  return obj;
}, {});

(async () => {
  await finalizeGroup('tram', tramStops, shapesDict, trips, tramRouteIds);
  await finalizeGroup('bus', mpkBusStops, shapesDict, trips, mpkBusRouteIds);
  await finalizeGroup('otherBus', otherBusStops, shapesDict, trips, otherBusRouteIds);
  await finalizeGroup('night', nightStops, shapesDict, trips, nightRouteIds);
})();
