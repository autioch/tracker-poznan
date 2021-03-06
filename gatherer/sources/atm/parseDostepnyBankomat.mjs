import { require } from '../../utils/index.mjs'; // eslint-disable-line no-shadow

function parseHours(hours) {
  if (!hours) {
    return false;
  }

  if (hours.full) {
    return 'Open 24/7';
  }
  if (hours.partial) {
    return hours.partial.split(',').map((t) => t.split('>').join(': ')).join(', ');
  }

  return Object.entries(hours).map(([key, value]) => `${key}: ${value}`).join(', ');
}

export default function dostepnybankomat() {
  const { banks, owners } = require('../sources/atm/manual/dostepnybankomat.pl.banks.json');
  const { atms } = require('../sources/atm/manual/dostepnybankomat.pl.json');

  return Object.values(atms).map(({ id, id_bank, id_owner, prefix, street, number, city, lat, lng, location_desc, hours }) => ({
    id,
    label: location_desc.replace(/^<p>/, '').replace(/<\/p>$/, '').trim(),
    address: [prefix, street, number].filter(Boolean).join(' ').trim(),
    city,
    longitude: parseFloat(lng),
    latitude: parseFloat(lat),
    popupLines: [
      banks[id_bank].name,
      owners[id_owner].name,
      parseHours(hours)
    ].filter(Boolean)
  }));
}
