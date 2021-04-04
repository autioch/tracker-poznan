/* eslint-disable no-param-reassign */
/* eslint-disable max-len */

import { isAtMost25kmFromPoznanCenter, require, saveOutput } from '../utils.mjs'; // eslint-disable-line no-shadow

const data = require('./inpost/db/points.json');

// b - lokal
// c - miejscowosc
// d - opis
// e - ulica
// g - miejscowosc znormalizowane
// h - godziny otwarcia
// i - ?
// l - a = lat, o = lng
// n - id
// o - kod pocztowy
// p - ?
// r - województwo
// s - ?
// t - ?

const itemList = data.items
  .filter(({ l: { a: lat, o: lng } }) => isAtMost25kmFromPoznanCenter(lat, lng))
  .map(({ b, c, d, e, g, h, l, n }) => ({
    id: n,
    label: d,
    address: [e, b].map((t = '') => t.trim()).join(' ').trim(),
    city: (c || g || '').trim(),
    longitude: l.o,
    latitude: l.a,
    description: [h]
  }));

console.log(`Found ${itemList.length} inposts.`);

saveOutput('inposts', itemList, true);
