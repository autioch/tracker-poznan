import fs from 'fs/promises';

import joinFromCurrentDir from './joinFromCurrentDir.mjs';

const degToRad = (deg) => deg / 180.0 * Math.PI;
const EARTH_RADIUS_KM = 6372.8; // km, optionally 6367, 6378.1370
const POZNAN_CENTER_LAT = degToRad(52.409538);
const POZNAN_CENTER_LNG = degToRad(16.931992);
const sqrSinHalf = (val) => Math.sin(val / 2) * Math.sin(val / 2);
const MAX_DISTANCE = 20; // distance from poznan center;

const PREC = 1000000;
const roundNum = (num) => Math.round(num * PREC) / PREC;
const outputJoin = joinFromCurrentDir(import.meta, '..', '..', 'docs', 'data');

function isNearPoznanCenter(lat, lng) { // haversine
  const latRad = degToRad(lat);
  const halfLapsAroundGlobe = sqrSinHalf(POZNAN_CENTER_LAT - latRad) + (sqrSinHalf(POZNAN_CENTER_LNG - degToRad(lng)) * Math.cos(latRad) * Math.cos(POZNAN_CENTER_LAT));
  const c = 2 * Math.asin(Math.sqrt(halfLapsAroundGlobe));

  return EARTH_RADIUS_KM * c < MAX_DISTANCE;
}

export default function saveOutputItems(fileName, items, skipDistanceCheck = false) {
  if (skipDistanceCheck) {
    console.log(`${fileName}: ${items.length} saved.`);

    return fs.writeFile(outputJoin(`${fileName}.json`), JSON.stringify(items, null, 2));
  }

  const nearCenter = items.filter((item) => isNearPoznanCenter(item.latitude, item.longitude));

  nearCenter.sort((a, b) => a.id.localeCompare(b.id));

  console.log(`${fileName}: ${items.length} found, ${nearCenter.length} saved.`);

  // get rid of centimeter precision, meters are enough.
  nearCenter.forEach((item) => {
    item.latitude = roundNum(item.latitude);
    item.longitude = roundNum(item.longitude);
  });

  return fs.writeFile(outputJoin(`${fileName}.json`), JSON.stringify(nearCenter, null, 2));
}
