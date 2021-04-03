/* eslint-disable no-param-reassign */
/* eslint-disable max-len */

import { isAtMost25kmFromPoznanCenter, require, saveOutput } from '../utils.mjs'; // eslint-disable-line no-shadow

const data = require('./zabka/db/raw.json');

const itemList = data
  .filter(({ lat, lng }) => isAtMost25kmFromPoznanCenter(lat, lng))
  .sort((a, b) => a.id.localeCompare(b.id))
  .map(({ id, lat, lng }) => ({
    id,
    longitude: lng,
    latitude: lat,
    locality: '',
    address: '',
    openingTimes: []
  }));

console.log(`Found ${itemList.length} Żabka shops.`);

saveOutput('zabkaShops', itemList, true);
