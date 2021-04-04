/* eslint-disable no-param-reassign */
/* eslint-disable max-len */

import { require, saveOutputItems } from '../utils.mjs'; // eslint-disable-line no-shadow

const data = require('./zabka/db/raw.json');

const itemList = data
  .sort((a, b) => a.id.localeCompare(b.id))
  .map(({ id, lat, lng }) => ({
    id,
    label: id,
    address: '',
    city: '',
    longitude: lng,
    latitude: lat,
    description: []
  }));

saveOutputItems('zabka', itemList);
