import { require, saveOutputItems } from '../utils.mjs'; // eslint-disable-line no-shadow

const data = require('./lidl/db/raw.json');

const shopList = data.d.results.map((shop) => ({
  id: shop.EntityID,
  label: shop.AddressLine,
  address: shop.AddressLine,
  city: shop.Locality,
  longitude: shop.Longitude,
  latitude: shop.Latitude,
  description: shop.OpeningTimes.split(',').map((time) => time.trim())
}));

saveOutputItems('lidl', shopList);
