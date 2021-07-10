import { saveOutputItems } from '../utils.mjs';
import cleanupList from './cleanupList.mjs';
import parseBankomat from './parseBankomat.mjs';
import parseDostepnyBankomat from './parseDostepnyBankomat.mjs';
import parseMastercard from './parseMastercard.mjs';
import parsePlanetCash from './parsePlanetCash.mjs';

const bankomat = parseBankomat();
const dostepnyBankomat = parseDostepnyBankomat();
const mastercard = await parseMastercard();
const planetCash = parsePlanetCash();

const atms = [
  ...dostepnyBankomat,
  ...bankomat,
  ...mastercard,
  ...planetCash
];

const cleanedUp = cleanupList(atms);

await saveOutputItems('atm', cleanedUp);
