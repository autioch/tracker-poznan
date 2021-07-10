// https://opencagedata.com/api#forward
// https://opencagedata.com/tutorials/geocode-in-javascript
// https://opencagedata.com/tutorials/geocode-in-nodejs
import apikey from '../opencagekey.mjs';
import getPage from './getPage.mjs';

const API_URL = 'https://api.opencagedata.com/geocode/v1/json';

export default async function forwardGeocode(address, city) {
  const params = [
    ['key', apikey],
    ['q', encodeURIComponent([address, city, 'Poland'].join(', '))],
    ['pretty', 1],
    ['countrycode', 'PL'],
    ['language', 'pl'],
    ['limit', 1],
    ['no_annotations', 1],
    ['bounds', '12.96021,48.63291,24.96094,54.99018'] // https://opencagedata.com/bounds-finder
  ]
    .map(([key, value]) => `${key}=${value}`).join('&');

  const requestUrl = `${API_URL}?${params}`;
  const response = await getPage(requestUrl);

  const { results } = JSON.parse(response);

  if (!results.length) {
    return false;
  }

  return results[0].geometry;
}
