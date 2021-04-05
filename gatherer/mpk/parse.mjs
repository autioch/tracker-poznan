import { joinFromCurrentDir, require, saveOutputItems } from '../utils.mjs'; // eslint-disable-line no-shadow
import { BUS_ROUTE, BUS_TOURIST, MPK_AGENCY, NIGHT_ROUTE, TRAM_ROUTE, TRAM_TOURIST } from './consts.mjs';

const pickRouteId = ({ route_id }) => route_id;
const pickTripId = ({ trip_id }) => trip_id;
const join = joinFromCurrentDir(import.meta, 'db');

const stops = require(join('stops.json'));
const stopTimes = require(join('stop_times.json'));
const trips = require(join('trips.json'));
const routes = require(join('routes.json'));

const tripMap = new Map(trips.map((trip) => [trip.trip_id, trip]));
const getRouteId = (tripId) => tripMap.get(tripId).route_id;
const isDailyRoute = (routeId) => routeId !== TRAM_TOURIST && routeId !== BUS_TOURIST && !NIGHT_ROUTE.test(routeId);
const tramRouteIds = new Set(routes.filter((route) => route.route_type === TRAM_ROUTE).map(pickRouteId).filter(isDailyRoute));
const mpkBusRouteIds = new Set(routes.filter((route) => route.route_type === BUS_ROUTE && route.agency_id === MPK_AGENCY).map(pickRouteId).filter(isDailyRoute));
const otherBusRouteIds = new Set(routes.filter((route) => route.route_type === BUS_ROUTE && route.agency_id !== MPK_AGENCY).map(pickRouteId).filter(isDailyRoute));

const { mpkBusTripIds, otherBusTripIds, tramTripIds } = trips.reduce((obj, { route_id, trip_id }) => {
  if (tramRouteIds.has(route_id)) {
    obj.tramTripIds.add(trip_id);
  } else if (mpkBusRouteIds.has(route_id)) {
    obj.mpkBusTripIds.add(trip_id);
  } else if (otherBusRouteIds.has(route_id)) {
    obj.otherBusTripIds.add(trip_id);
  }

  return obj;
}, {
  tramTripIds: new Set(),
  mpkBusTripIds: new Set(),
  otherBusTripIds: new Set()
});

const { tramStopIds, mpkBusStopIds, otherBusStopIds } = stopTimes.reduce((obj, { trip_id, stop_id }) => {
  if (tramTripIds.has(trip_id)) {
    obj.tramStopIds.add(stop_id);
  } else if (mpkBusTripIds.has(trip_id)) {
    obj.mpkBusStopIds.add(stop_id);
  } else if (otherBusTripIds.has(trip_id)) {
    obj.otherBusStopIds.add(stop_id);
  }

  return obj;
}, {
  tramStopIds: new Set(),
  mpkBusStopIds: new Set(),
  otherBusStopIds: new Set()
});

function getClosestLines(tramRoutes, busRoutes, otherBusRoutes) {
  const existingRoutes = (tramRoutes.length > 0) + (busRoutes.length > 0) + (otherBusRoutes.length > 0);

  // console.log(tramRoutes.length, busRoutes.length, otherBusRoutes.length);
  if (!existingRoutes < 2) {
    return [...tramRoutes, ...busRoutes, ...otherBusRoutes];
  }

  const tramText = tramRoutes.length ? `Tram: ${tramRoutes.join(',')}` : '';
  const busText = busRoutes.length ? `Bus: ${busRoutes.join(',')}` : '';
  const otherBusText = otherBusRoutes.length ? `Other bus: ${otherBusRoutes.join(',')}` : ''; // TODO Add agencies?

  return [tramText, busText, otherBusText].filter(Boolean);
}

function uniqStr(strArr) {
  const n = {};

  for (let i = 0; i < strArr.length; i++) {
    if (!n[strArr[i]]) {
      n[strArr[i]] = true;
    }
  }

  return Object.keys(n);
}

const { tramStops, mpkBusStops, otherBusStops } = stops.reduce((obj, stopItem) => {
  const { stop_id, stop_name, stop_lat, stop_lon } = stopItem;

  const tripIds = uniqStr(stopTimes.filter((stopTime) => stopTime.stop_id === stop_id).map(pickTripId));

  const tramRoutes = uniqStr(tripIds.filter((tripId) => tramTripIds.has(tripId)).map(getRouteId));
  const busRoutes = uniqStr(tripIds.filter((tripId) => mpkBusTripIds.has(tripId)).map(getRouteId));
  const otherBusRoutes = uniqStr(tripIds.filter((tripId) => otherBusTripIds.has(tripId)).map(getRouteId));

  const closestLines = getClosestLines(tramRoutes, busRoutes, otherBusRoutes);
  const stopEl = {
    id: stop_id,
    label: stop_name,
    address: '',
    city: '',
    longitude: stop_lon,
    latitude: stop_lat,
    closestLines,
    popupLines: [closestLines.join(',')]
  };

  if (tramStopIds.has(stop_id)) {
    obj.tramStops.push(stopEl);
  } else if (mpkBusStopIds.has(stop_id)) {
    obj.mpkBusStops.push(stopEl);
  } else if (otherBusStopIds.has(stop_id)) {
    obj.otherBusStops.push(stopEl);
  }

  return obj;
}, {
  tramStops: [],
  mpkBusStops: [],
  otherBusStops: []
});

saveOutputItems('tram', tramStops, true);
saveOutputItems('bus', mpkBusStops, true);
saveOutputItems('otherBus', otherBusStops, true);
