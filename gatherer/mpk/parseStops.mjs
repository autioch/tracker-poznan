import { saveOutputItems } from '../utils.mjs'; // eslint-disable-line no-shadow
import { getRouteIds, pickTripId, uniqStr } from './utils.mjs';

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

export default function parseStops(stops, stopTimes, trips, routes) {
  const tripMap = new Map(trips.map((trip) => [trip.trip_id, trip]));
  const getRouteId = (tripId) => tripMap.get(tripId).route_id;
  const { tramRouteIds, mpkBusRouteIds, otherBusRouteIds, nightRouteIds } = getRouteIds(routes);

  console.timeLog('stops', 'prepare');

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

  console.timeLog('stops', 'trips');

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

  console.timeLog('stops', 'stops');

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

  console.timeLog('stops', 'stops');

  saveOutputItems('tram', tramStops, true);
  saveOutputItems('bus', mpkBusStops, true);
  saveOutputItems('otherBus', otherBusStops, true);
  saveOutputItems('night', nightStops, true);

  return {
    tramStops,
    mpkBusStops,
    otherBusStops,
    nightStops
  };
}
