import turf from '@turf/turf';
import union from '@turf/union';
import spherical from 'spherical';

import { AGENCY_COLORS, BUS_ROUTE, BUS_TOURIST, MPK_AGENCY, NIGHT_ROUTE, TRAM_ROUTE, TRAM_TOURIST } from './consts.mjs';

const isDailyRoute = (routeId) => routeId !== TRAM_TOURIST && routeId !== BUS_TOURIST && !NIGHT_ROUTE.test(routeId);

export function mapAgencies(agencies) {
  return Object.fromEntries(agencies.map((agency) => [agency['\ufeffagency_id'], {
    id: agency['\ufeffagency_id'],
    label: agency.agency_name,
    url: agency.agency_url,
    phone: agency.agency_phone,
    color: AGENCY_COLORS[agency['\ufeffagency_id']]
  }]));
}

export function mapStops(stops, stopTimes, routes, trips) { // eslint-disable-line max-statements
  console.timeLog('stops', 'start');
  const routeMap = new Map(routes.map((route) => [route.route_id, route]));
  const mpkBusRouteIds = new Set(routes.filter((route) => route.route_type === BUS_ROUTE && routeMap.get(route.route_id).agency_id === MPK_AGENCY).map(({ route_id }) => route_id));
  const otherBusRouteIds = new Set(routes.filter((route) => route.route_type === BUS_ROUTE && routeMap.get(route.route_id).agency_id !== MPK_AGENCY).map(({ route_id }) => route_id));
  const tramRouteIds = new Set(routes.filter((route) => route.route_type === TRAM_ROUTE).map(({ route_id }) => route_id));
  const tripMap = new Map(trips.map((trip) => [trip.trip_id, trip]));
  const getRouteId = ({ trip_id }) => tripMap.get(trip_id).route_id;
  const getAgencyId = (routeId) => routeMap.get(routeId).agency_id;
  const isMpkBusRoute = (routeId) => mpkBusRouteIds.has(routeId);
  const isOtherBusRoute = (routeId) => otherBusRouteIds.has(routeId);
  const isTramRoute = (routeId) => tramRouteIds.has(routeId);

  console.timeLog('stops', 'setup');

  const stops1 = stops.map((stopItem) => ({
    ...stopItem,
    routeIds: [...new Set(stopTimes.filter((stopTime) => stopTime.stop_id === stopItem.stop_id).map(getRouteId))].filter(isDailyRoute).sort()
  }));

  console.timeLog('stops', 'stops1');
  const stops2 = stops1.filter(({ routeIds }) => routeIds.length > 0);

  console.timeLog('stops', 'stops2');
  const stops3 = stops2.map(({ stop_id, stop_name, stop_lat, stop_lon, zone_id, routeIds }) => ({
    stopId: stop_id,
    stopName: stop_name,
    latitude: stop_lat,
    longitude: stop_lon,
    zoneId: zone_id,
    routeIds,
    agencyIds: [...new Set(routeIds.map(getAgencyId))],
    isForMpkBus: routeIds.some(isMpkBusRoute),
    isForOtherBus: routeIds.some(isOtherBusRoute),
    isForTram: routeIds.some(isTramRoute)
  }));

  console.timeLog('stops', 'stops3');
  const stops4 = stops3.sort((a, b) => a.stopName.localeCompare(b.stopName));

  console.timeLog('stops', 'stops4');

  return stops4;
}

const sortPoints = ([a], [b]) => a - b;

function extractRouteIds(shapeIds, trips) {
  const shapeSet = new Set(shapeIds);

  const matchingRouteIds = trips
    .filter(({ shape_id }) => shapeSet.has(shape_id))
    .map(({ route_id }) => route_id)
    .sort();

  return [...new Set(matchingRouteIds)];
}

export function mapRouteLines(shapes, routes, trips) {
  const shapesDict = shapes.reduce((obj, { shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence }) => {
    if (!obj[shape_id]) {
      obj[shape_id] = [];
    }
    obj[shape_id].push([shape_pt_sequence, parseFloat(shape_pt_lat), parseFloat(shape_pt_lon)]);

    return obj;
  }, {});

  const uniqueShapeDict = {};

  Object.entries(shapesDict).forEach(([shapeId, rawPoints]) => {
    const points = rawPoints.sort(sortPoints).map(([, x, y]) => [x, y]);
    const pointsHash1 = JSON.stringify(points);
    const pointsHash2 = JSON.stringify(points.reverse());

    if (uniqueShapeDict[pointsHash1]) {
      uniqueShapeDict[pointsHash1].push(shapeId);
    } else if (uniqueShapeDict[pointsHash2]) {
      uniqueShapeDict[pointsHash2].push(shapeId);
    } else {
      uniqueShapeDict[pointsHash1] = [shapeId];
    }
  });

  const routesMap = new Map(routes.map((route) => [route.route_id, route]));

  return Object.entries(uniqueShapeDict)
    .map(([pointsHash, shapeIds]) => {
      const routeIds = extractRouteIds(shapeIds, trips).filter(isDailyRoute);

      if (routeIds.length === 0) {
        return false;
      }

      const isForTram = routeIds.some((routeId) => routesMap.get(routeId).route_type === TRAM_ROUTE);
      const isForMpkBus = routeIds.some((routeId) => routesMap.get(routeId).route_type === BUS_ROUTE && routesMap.get(routeId).agency_id === MPK_AGENCY);
      const isForOtherBus = routeIds.some((routeId) => routesMap.get(routeId).route_type === BUS_ROUTE && routesMap.get(routeId).agency_id !== MPK_AGENCY);

      return {
        points: JSON.parse(pointsHash),
        routeIds,
        isForTram,
        isForMpkBus,
        isForOtherBus
      };
    })
    .filter(Boolean);
}

// arrays have 200000 items, no spread or math.min/max
function getMaxMin(arr) {
  let [min, max] = arr;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];

    min = min > item ? item : min;
    max = max > item ? max : item;
  }

  return [min, max];
}

export function mapBoundaries(stops) {
  const [minLatitude, maxLatitude] = getMaxMin(stops.map(({ latitude }) => parseFloat(latitude)));
  const [minLongitude, maxLongitude] = getMaxMin(stops.map(({ longitude }) => parseFloat(longitude)));

  return {
    minLatitude,
    maxLatitude,
    minLongitude,
    maxLongitude
  };
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

export function mapRanges(allStops) {
  console.timeLog('ranges', 'ranges1');
  const stops = allStops.filter(({ isNightOnly }) => !isNightOnly);

  const trams = stops.filter(({ isForTram }) => isForTram);
  const tramSet = new Set(trams);

  const mpkBuses = stops.filter((stopItem) => !tramSet.has(stopItem) && stopItem.agencyIds.some((agencyId) => agencyId === MPK_AGENCY));

  const usedStops = new Set([...tramSet, ...mpkBuses]);
  const otherBuses = stops.filter((stopItem) => !usedStops.has(stopItem));

  const sortedStops = {
    trams,
    mpkBuses,
    otherBuses
  };

  return Object.entries(sortedStops).reduce((obj, [key, stopList]) => {
    obj[key] = modes.reduce((obj2, [mode, fn]) => {
      console.timeLog('ranges', 'ranges2', key, mode);
      obj2[mode] = fn(stopList);

      return obj2;
    }, {});

    return obj;
  }, {});
}
