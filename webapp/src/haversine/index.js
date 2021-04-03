/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
const degToRad = (deg) => deg / 180.0 * Math.PI;
const EARTH_RADIUS_KM = 6372.8; // km, optionally 6367, 6378.1370

const sqrSinHalf = (val) => Math.sin(val / 2) * Math.sin(val / 2);

function haversine1([lat1, lon1], [lat2, lon2]) {
  lat1 = degToRad(lat1);
  lat2 = degToRad(lat2);

  const halfLapsAroundGlobe = sqrSinHalf(lat2 - lat1) + (sqrSinHalf(degToRad(lon2) - degToRad(lon1)) * Math.cos(lat1) * Math.cos(lat2));
  const c = 2 * Math.asin(Math.sqrt(halfLapsAroundGlobe));

  return EARTH_RADIUS_KM * c;
}

function haversine2([lat1, lon1], [lat2, lon2]) {
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);

  lat1 = degToRad(lat1);
  lat2 = degToRad(lat2);

  const halfLapsAroundGlobe = sqrSinHalf(dLat) + (sqrSinHalf(dLon) * Math.cos(lat1) * Math.cos(lat2));
  const c = 2 * Math.atan2(Math.sqrt(halfLapsAroundGlobe), Math.sqrt(1 - halfLapsAroundGlobe));

  return EARTH_RADIUS_KM * c;
}

export {
  haversine1,
  haversine2
};
