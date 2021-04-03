/* eslint-disable no-param-reassign */
/* eslint-disable max-len */

import { isAtMost25kmFromPoznanCenter, require, saveOutput } from '../utils.mjs'; // eslint-disable-line no-shadow

const data = require('./netto/db/raw.json');

const itemList = data
  .filter(({ coordinates: [lng, lat] }) => isAtMost25kmFromPoznanCenter(lat, lng))
  .sort((a, b) => a.id.localeCompare(b.id))
  .map(({ id, name, coordinates: [lng, lat], address: { city, street } }) => ({ // eslint-disable-line no-shadow
    id,
    longitude: lng,
    latitude: lat,
    locality: city,
    address: street,
    openingTimes: [],
    label: name
  }));

console.log(`Found ${itemList.length} Netto shops.`);

saveOutput('nettoShops', itemList, true);
