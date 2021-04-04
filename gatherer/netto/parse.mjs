/* eslint-disable no-param-reassign */
/* eslint-disable max-len */

import { require, saveOutputItems } from '../utils.mjs'; // eslint-disable-line no-shadow

const data = require('./netto/db/raw.json');

const itemList = data
  .sort((a, b) => a.id.localeCompare(b.id))
  .map(({ id, name, coordinates: [lng, lat], address: { city, street } }) => ({ // eslint-disable-line no-shadow
    id,
    label: name,
    address: street,
    city,
    longitude: lng,
    latitude: lat,
    description: [] // todo opening times are mixed up
  }));

saveOutputItems('netto', itemList);
