/* eslint-disable no-param-reassign */
/* eslint-disable max-len */

import { require, saveOutputItems } from '../utils.mjs'; // eslint-disable-line no-shadow

const data = require('./inpost/db/points.json');

// b - place
// c - city
// d - description
// e - street
// g - city normalized
// h - openning hours
// i - ?
// l - a = lat, o = lng
// n - id
// o - postal code
// p - ?
// r - voivodeship
// s - ?
// t - ?

const itemList = data.items
  .map(({ b, c, d, e, g, h, l, n }) => ({
    id: n,
    label: d,
    address: [e, b].map((t = '') => t.trim()).join(' ').trim(),
    city: (c || g || '').trim(),
    longitude: l.o,
    latitude: l.a,
    popupLines: [h]
  }));

saveOutputItems('inpost', itemList);
