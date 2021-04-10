const degToRad = (deg) => deg / 180.0 * Math.PI;
const EARTH_RADIUS_KM = 6372.8; // km, optionally 6367, 6378.1370

const sqrSinHalf = (val) => Math.sin(val / 2) * Math.sin(val / 2);

export function haversine([lat1, lon1], [lat2, lon2]) {
  lat1 = degToRad(lat1);// eslint-disable-line no-param-reassign
  lat2 = degToRad(lat2);// eslint-disable-line no-param-reassign

  const halfLapsAroundGlobe = sqrSinHalf(lat2 - lat1) + (sqrSinHalf(degToRad(lon2) - degToRad(lon1)) * Math.cos(lat1) * Math.cos(lat2));
  const c = 2 * Math.asin(Math.sqrt(halfLapsAroundGlobe));

  return EARTH_RADIUS_KM * c;
}
