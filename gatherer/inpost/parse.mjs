/* eslint-disable no-param-reassign */
/* eslint-disable max-len */

import { isAtMost25kmFromPoznanCenter, require, saveOutput } from '../utils.mjs'; // eslint-disable-line no-shadow

const data = require('./inpost/db/points.json');

// b - lokal
// c - miejscowosc
// d - punkt
// e - ulica
// g - miejscowosc
// h - godziny otwarcia
// l - a = lat, o = lng
// n - id
const itemList = data.items
  .filter(({ l: { a: lat, o: lng } }) => isAtMost25kmFromPoznanCenter(lat, lng))
  .map(({ b, c, d, e, h, l, n }) => ({
    id: n,
    longitude: l.o,
    latitude: l.a,
    locality: (c || '').trim(),
    address: [e, b, d].map((t = '') => t.trim()).join(' ').trim(),
    openingTimes: [h]
  }));

console.log(`Found ${itemList.length} inposts.`);

saveOutput('inposts', itemList, true);
