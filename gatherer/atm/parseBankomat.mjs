import { require } from '../utils.mjs'; // eslint-disable-line no-shadow
import cleanupList from './cleanupList.mjs';

export default function bankomatPl() {
  const providers = require('./atm/manual/bankomat.pl.providers.json');
  const items = require('./atm/manual/bankomat.pl.json');

  const providerMap = new Map(providers.map(({ name: label, acronym }) => [acronym, label]));

  // props:
  // location - coordinates: lat,lng
  // atmId - id
  // name - label,
  // addressTxt - street
  // description - description
  // provider - provider id
  // __v - ? 0
  // distance - from what?
  // dist - wrapped location?

  const mapped = items.map(({ location: loc, atmId, name: label, addressTxt, description, provider }) => {
    const { coordinates: [lat1, lng1] } = loc;
    const [city, ...address] = addressTxt.split(',').map((t) => t.trim());

    return {
      id: atmId,
      label,
      address: address.join(', '),
      city,
      longitude: parseFloat(lng1),
      latitude: parseFloat(lat1),
      source: 'bankomat',
      popupLines: [description, providerMap.get(provider)].filter(Boolean)
    };
  });

  return cleanupList(mapped, 'bankomat');
}
