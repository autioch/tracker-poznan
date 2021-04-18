import fs from 'fs';

import { joinFromCurrentDir, saveOutputItems } from '../utils.mjs'; // eslint-disable-line no-shadow
import cleanupList from './cleanupList.mjs';
import parseBankomat from './parseBankomat.mjs';
import parseDostepnyBankomat from './parseDostepnyBankomat.mjs';
import parseMastercard from './parseMastercard.mjs';
import parsePlanetCash from './parsePlanetCash.mjs';

const join = joinFromCurrentDir(import.meta, 'db');

(async () => {
  if (!fs.existsSync(join())) {
    await fs.promises.mkdir(join());
  }

  const bankomat = await parseBankomat();
  const dostepnyBankomat = await parseDostepnyBankomat();
  const mastercard = await parseMastercard();
  const planetCash = await parsePlanetCash();

  const atms = [
    ...dostepnyBankomat,
    ...bankomat,
    ...mastercard,
    ...planetCash
  ];

  const cleanedUp = cleanupList(atms);

  await saveOutputItems('atm', cleanedUp, true);
})();
