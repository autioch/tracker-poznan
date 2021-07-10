import { require, saveOutputItems } from '../../utils/index.mjs'; // eslint-disable-line no-shadow

const data = require('../sources/zabka/db/raw.json');

const itemList = data.map(({ id, lat, lng }) => ({
  id,
  label: id,
  address: '',
  city: '',
  longitude: lng,
  latitude: lat,
  popupLines: []
}));

await saveOutputItems('zabka', itemList);
