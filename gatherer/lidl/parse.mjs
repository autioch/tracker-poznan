import { require, saveOutput } from '../utils.mjs'; // eslint-disable-line no-shadow

const data = require('./lidl/db/raw.json');

const shopList = data.d.results.map((shop) => ({
  id: shop.EntityID,
  longitude: shop.Longitude,
  latitude: shop.Latitude,
  locality: shop.Locality,
  address: shop.AddressLine,
  openingTimes: shop.OpeningTimes.split(',').map((time) => time.trim())
}));

console.log(`Found ${shopList.length} Lidl shops.`);

saveOutput('lidlShops', shopList, true);
