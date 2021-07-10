import { require, saveOutputItems } from '../../utils/index.mjs'; // eslint-disable-line no-shadow

const data = require('../sources/netto/db/raw.json');

const itemList = data.map(({ id, name: label, coordinates: [lng, lat], address: { city, street } }) => ({
  id,
  label,
  address: street,
  city,
  longitude: lng,
  latitude: lat,
  popupLines: [] // todo opening times are mixed up
}));

saveOutputItems('netto', itemList);
