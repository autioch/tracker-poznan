import { require } from '../../utils/index.mjs'; // eslint-disable-line no-shadow

export default function bankomatPl() {
  const providers = require('../sources/atm/manual/bankomat.pl.providers.json');
  const items = require('../sources/atm/manual/bankomat.pl.json');

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

  return items.map(({ location: loc, atmId, name: label, addressTxt, description, provider }) => {
    const { coordinates: [lat1, lng1] } = loc;
    const [city, ...address] = addressTxt.split(',').map((t) => t.trim());

    return {
      id: atmId,
      label: description,
      address: address.join(', '),
      city,
      longitude: parseFloat(lng1),
      latitude: parseFloat(lat1),
      popupLines: [label.replace('Bankomat ', ''), providerMap.get(provider)].filter(Boolean)
    };
  });
}
