/* eslint-disable no-param-reassign, max-len */

export function getMinimalBounds(points) {
  /* Inverted for purpose of finding min rect. */
  let minLat = 90;

  let maxLat = -90;

  let minLng = 180;

  let maxLng = -180;

  points.forEach(([lat, lng]) => {
    if (lat < minLat) {
      minLat = lat;
    }
    if (lat > maxLat) {
      maxLat = lat;
    }
    if (lng < minLng) {
      minLng = lng;
    }
    if (lng > maxLng) {
      maxLng = lng;
    }
  });

  return [
    [minLat, minLng],
    [maxLat, maxLng]
  ];
}

const degToRad = (deg) => deg / 180.0 * Math.PI;
const EARTH_RADIUS_KM = 6372.8; // km, optionally 6367, 6378.1370

const sqrSinHalf = (val) => Math.sin(val / 2) * Math.sin(val / 2);

export function haversine([lat1, lon1], [lat2, lon2]) {
  lat1 = degToRad(lat1);
  lat2 = degToRad(lat2);

  const halfLapsAroundGlobe = sqrSinHalf(lat2 - lat1) + (sqrSinHalf(degToRad(lon2) - degToRad(lon1)) * Math.cos(lat1) * Math.cos(lat2));
  const c = 2 * Math.asin(Math.sqrt(halfLapsAroundGlobe));

  return EARTH_RADIUS_KM * c;
}
