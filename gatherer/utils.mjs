/* eslint-disable no-underscore-dangle */
import fs from 'fs/promises';
import https from 'https';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import apikey from './opencagekey.mjs';

const degToRad = (deg) => deg / 180.0 * Math.PI;
const EARTH_RADIUS_KM = 6372.8; // km, optionally 6367, 6378.1370
const POZNAN_CENTER_LAT = degToRad(52.409538);
const POZNAN_CENTER_LNG = degToRad(16.931992);
const sqrSinHalf = (val) => Math.sin(val / 2) * Math.sin(val / 2);
const MAX_DISTANCE = 20; // distance from poznan center;

export function isNearPoznanCenter(lat, lng) { // haversine
  const latRad = degToRad(lat);
  const halfLapsAroundGlobe = sqrSinHalf(POZNAN_CENTER_LAT - latRad) + (sqrSinHalf(POZNAN_CENTER_LNG - degToRad(lng)) * Math.cos(latRad) * Math.cos(POZNAN_CENTER_LAT));
  const c = 2 * Math.asin(Math.sqrt(halfLapsAroundGlobe));

  return EARTH_RADIUS_KM * c < MAX_DISTANCE;
}

export function joinFromCurrentDir(importMeta, ...subfolders) {
  const baseDir = dirname(fileURLToPath(importMeta.url));
  const basePath = join(baseDir, ...subfolders);

  return join.bind(null, basePath);
}

export const outputJoin = joinFromCurrentDir(import.meta, '..', 'webapp', 'src', 'services', 'groups', 'data');
export const require = createRequire(import.meta.url); // eslint-disable-line no-shadow

export function saveOutput(fileName, fileContent, debug = false) {
  return fs.writeFile(outputJoin(`${fileName}.json`), JSON.stringify(fileContent, null, debug ? 2 : undefined)); // eslint-disable-line no-undefined
}

export function saveOutputItems(fileName, items, skipDistanceCheck = false) {
  if (skipDistanceCheck) {
    console.log(`${fileName}: ${items.length} saved.`);

    return saveOutput(fileName, items);
  }

  const nearCenter = items.filter((item) => isNearPoznanCenter(item.latitude, item.longitude)); // eslint-disable-line no-use-before-define

  console.log(`${fileName}: ${items.length} found, ${nearCenter.length} saved.`);

  return saveOutput(fileName, nearCenter);
}

export function getPage(url) {
  let content = '';

  return new Promise((res) => {
    const req = https.get(url, (resp) => {
      resp.setEncoding('utf8');
      resp.on('data', (chunk) => {
        content += chunk;
      });

      resp.on('end', () => res(content));
    });

    req.end();
  });
}

// https://opencagedata.com/api#forward
// https://opencagedata.com/tutorials/geocode-in-javascript
// https://opencagedata.com/tutorials/geocode-in-nodejs

const API_URL = 'https://api.opencagedata.com/geocode/v1/json';

export async function forwardGeocode(address, city) {
  const params = [
    ['key', apikey],
    ['q', encodeURIComponent([address, city, 'Poland'].join(', '))],
    ['pretty', 1],
    ['countrycode', 'PL'],
    ['language', 'pl'],
    ['limit', 1],
    ['no_annotations', 1],
    ['bounds', '12.96021,48.63291,24.96094,54.99018'] // https://opencagedata.com/bounds-finder
  ]
    .map(([key, value]) => `${key}=${value}`).join('&');

  const requestUrl = `${API_URL}?${params}`;
  const response = await getPage(requestUrl);

  const { results } = JSON.parse(response);

  if (!results.length) {
    return false;
  }

  return results[0].geometry;
}
