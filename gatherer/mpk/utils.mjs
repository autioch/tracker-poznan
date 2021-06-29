import { BUS_ROUTE, MPK_AGENCY, NIGHT_ROUTE, TOURIST_LINES, TRAM_ROUTE } from './consts.mjs';

export const pickRouteId = ({ route_id }) => route_id;
export const pickTripId = ({ trip_id }) => trip_id;
export const pickShapeId = ({ shape_id }) => shape_id;

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

let tramRouteIds;

let mpkBusRouteIds;

let otherBusRouteIds;

let nightRouteIds;

let isPrepared = false;

export function getRouteIds(routes) {
  const standardRoutes = routes.filter((route) => !TOURIST_LINES.has(route.route_id));

  if (!isPrepared) {
    tramRouteIds = new Set(standardRoutes.filter((route) => route.route_type === TRAM_ROUTE).map(pickRouteId).filter(isDailyRoute));
    mpkBusRouteIds = new Set(standardRoutes.filter((route) => route.route_type === BUS_ROUTE && route.agency_id === MPK_AGENCY).map(pickRouteId).filter(isDailyRoute));
    otherBusRouteIds = new Set(standardRoutes.filter((route) => route.route_type === BUS_ROUTE && route.agency_id !== MPK_AGENCY).map(pickRouteId).filter(isDailyRoute));
    nightRouteIds = new Set(standardRoutes.map(pickRouteId).filter(isNightlyRoute));
    isPrepared = true;
  }

  return {
    tramRouteIds,
    mpkBusRouteIds,
    otherBusRouteIds,
    nightRouteIds
  };
}
