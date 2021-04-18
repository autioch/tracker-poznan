/* eslint-disable max-nested-callbacks */
import fs from 'fs';

import { joinFromCurrentDir } from '../utils.mjs'; // eslint-disable-line no-shadow
import parseBankomat from './parseBankomat.mjs';
import parseDostepnyBankomat from './parseDostepnyBankomat.mjs';
import parseMastercard from './parseMastercard.mjs';
import parsePlanetCash from './parsePlanetCash.mjs';

const join = joinFromCurrentDir(import.meta, 'db');

// const PREC = 10;
const roundNum = (num) => num;// Math.round(num * PREC) / PREC;
const ensureDict = (obj, key, val) => obj[key] || (obj[key] = val);

(async () => {
  if (!fs.existsSync(join())) {
    await fs.promises.mkdir(join());
  }

  const bankomat = await parseBankomat();
  const dostepnyBankomat = await parseDostepnyBankomat();
  const mastercard = await parseMastercard();
  const planetCash = await parsePlanetCash();

  const atms = [
    ...bankomat,
    ...dostepnyBankomat,
    ...mastercard,
    ...planetCash
  ];

  const dict = atms
    .sort((a, b) => a.longitude - b.longitude)
    .sort((a, b) => a.latitude - b.latitude)
    .reduce((obj, atm) => {
      const { longitude, latitude } = atm;

      const lat = roundNum(latitude);
      const lng = roundNum(longitude);

      ensureDict(ensureDict(obj, lat, {}), lng, []).push(atm);

      return obj;
    }, {});

  const newDict = {};

  Object.entries(dict).forEach(([lat, latDict]) => {
    Object.entries(latDict).forEach(([lng, items]) => {
      if (items.length !== 1) {
        ensureDict(ensureDict(newDict, lat, {}), lng, []).push(...items);
      }
    });
  });

  await fs.promises.writeFile(join('grouped.json'), JSON.stringify(newDict, null, '  '), 'utf8');
  await fs.promises.writeFile(join('all.json'), JSON.stringify(atms, null, '  '), 'utf8');
})();
