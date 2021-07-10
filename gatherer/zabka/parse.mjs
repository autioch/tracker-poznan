import { require, saveOutputItems } from '../utils.mjs'; // eslint-disable-line no-shadow

const data = require('./zabka/db/raw.json');

const itemList = data.map(({ id, lat, lng }) => ({
  id,
  label: id,
  address: '',
  city: '',
  longitude: lng,
  latitude: lat,
  popupLines: []
}));

saveOutputItems('zabka', itemList);
