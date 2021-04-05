import { joinFromCurrentDir, require, saveOutputItems } from '../utils.mjs'; // eslint-disable-line no-shadow
import { BUS_ROUTE, MPK_AGENCY, TRAM_ROUTE } from './consts.mjs';

const pickRouteId = ({ route_id }) => route_id;
const join = joinFromCurrentDir(import.meta, 'db');

const stops = require(join('stops.json'));
const stopTimes = require(join('stop_times.json'));
const trips = require(join('trips.json'));
const routes = require(join('routes.json'));

console.log('routes');
const tramRouteIds = new Set(routes.filter((route) => route.route_type === TRAM_ROUTE).map(pickRouteId));
const mpkBusRouteIds = new Set(routes.filter((route) => route.route_type === BUS_ROUTE && route.agency_id === MPK_AGENCY).map(pickRouteId));
const otherBusRouteIds = new Set(routes.filter((route) => route.route_type === BUS_ROUTE && route.agency_id !== MPK_AGENCY).map(pickRouteId));

console.log('trips ids');
const { mpkBusTripIds, otherBusTripIds, tramTripIds } = trips.reduce((obj, { route_id, trip_id }) => {
  if (tramRouteIds.has(route_id)) {
    obj.tramTripIds.add(trip_id);
  } else if (mpkBusRouteIds.has(route_id)) {
    obj.mpkBusTripIds.add(trip_id);
  } else if (otherBusRouteIds.has(route_id)) {
    obj.otherBusTripIds.add(trip_id);
  } else {
    throw Error('Invalid trip.');
  }

  return obj;
}, {
  tramTripIds: new Set(),
  mpkBusTripIds: new Set(),
  otherBusTripIds: new Set()
});

console.log('stop ids');
const { tramStopIds, mpkBusStopIds, otherBusStopIds } = stopTimes.reduce((obj, { trip_id, stop_id }) => {
  if (tramTripIds.has(trip_id)) {
    obj.tramStopIds.add(stop_id);
  } else if (mpkBusTripIds.has(trip_id)) {
    obj.mpkBusStopIds.add(stop_id);
  } else if (otherBusTripIds.has(trip_id)) {
    obj.otherBusStopIds.add(stop_id);
  } else {
    throw Error('Invalid stop time.');
  }

  return obj;
}, {
  tramStopIds: new Set(),
  mpkBusStopIds: new Set(),
  otherBusStopIds: new Set()
});

console.log('stops');
const { tramStops, mpkBusStops, otherBusStops } = stops.reduce((obj, stopItem) => {
  const { stop_id, stop_name, stop_lat, stop_lon } = stopItem;

  const stopEl = {
    id: stop_id,
    label: stop_name,
    address: '',
    city: '',
    longitude: stop_lon,
    latitude: stop_lat,
    description: [], // todo rename
    summary: [] // todo rename route ids
  };

  if (tramStopIds.has(stop_id)) {
    obj.tramStops.push(stopEl);
  } else if (mpkBusStopIds.has(stop_id)) {
    obj.mpkBusStops.push(stopEl);
  } else if (otherBusStopIds.has(stop_id)) {
    obj.otherBusStops.push(stopEl);
  } else {
    throw Error('Invalid stop time.');
  }

  return obj;
}, {
  tramStops: [],
  mpkBusStops: [],
  otherBusStops: []
});

console.log('files');

saveOutputItems('tram', tramStops, true);
saveOutputItems('bus', mpkBusStops, true);
saveOutputItems('otherBus', otherBusStops, true);
