import chalk from 'chalk';
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
const padNum = (num) => num.toString().padStart(6, ' ').padEnd(7, ' ');

const readFile = (fileName) => fs.readFile(outputJoin(`${fileName}.json`), 'utf8');
const saveFile = (fileName, items) => fs.writeFile(outputJoin(`${fileName}.json`), JSON.stringify(items, null, 2));

function isNearPoznanCenter({ latitude, longitude }) { // haversine
  const latRad = degToRad(latitude);
  const halfLapsAroundGlobe = sqrSinHalf(POZNAN_CENTER_LAT - latRad) + (sqrSinHalf(POZNAN_CENTER_LNG - degToRad(longitude)) * Math.cos(latRad) * Math.cos(POZNAN_CENTER_LAT));
  const c = 2 * Math.asin(Math.sqrt(halfLapsAroundGlobe));

  return EARTH_RADIUS_KM * c < MAX_DISTANCE;
}

async function showInfo(fileName, current) {
  const currentJson = JSON.stringify(current, null, 2);
  const previousJson = await readFile(fileName);
  const previous = JSON.parse(previousJson);
  const message = `${fileName.padEnd(15, ' ')}${padNum(previous.length)}${padNum(current.length)}(prev/curr)`;

  if (currentJson === previousJson) {
    console.log(chalk.green(message));
  } else if (previous.length <= current.length) {
    console.log(chalk.yellow(message));
  } else {
    console.log(chalk.red(message));
  }
}

export default async function saveOutputItems(fileName, items, skipDistanceCheck = false) {
  if (skipDistanceCheck) {
    console.log(chalk.cyan(`${fileName.padEnd(15, ' ')}${padNum(items.length)}${padNum('')}(curr)`));

    return saveFile(fileName, items);
  }

  const current = items.filter(isNearPoznanCenter).sort((a, b) => a.id.localeCompare(b.id));

  // get rid of centimeter precision, meters are enough.
  current.forEach((item) => {
    item.latitude = roundNum(item.latitude);
    item.longitude = roundNum(item.longitude);
  });

  await showInfo(fileName, current);

  return saveFile(fileName, current);
}
