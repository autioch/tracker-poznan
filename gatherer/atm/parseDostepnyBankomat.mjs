import { require } from '../utils.mjs'; // eslint-disable-line no-shadow

function parseHours(hours) {
  if (!hours) {
    return '';
  }

  if (hours.full) {
    return ['24/7'];
  }
  if (hours.partial) {
    return hours.partial.split(',').map((t) => t.split('>').join(': '));
  }

  return Object.entries(hours).map(([key, value]) => `${key}: ${value}`);
}

export default function dostepnybankomat() {
  const { banks, owners } = require('./atm/manual/dostepnybankomat.pl.banks.json');
  const { atms } = require('./atm/manual/dostepnybankomat.pl.json');

  const mapped = Object.values(atms).map(({ id, id_bank, id_owner, prefix, street, number, city, lat, lng, location_desc, hours }) => ({
    id,
    label: banks[id_bank].name,
    address: [prefix, street, number].filter(Boolean).join(' ').trim(),
    city,
    longitude: parseFloat(lng),
    latitude: parseFloat(lat),
    source: 'dostepnyBankomat',
    popupLines: [
      location_desc.replace(/^<p>/, '').replace(/<\/p>$/, '').trim(),
      owners[id_owner].name,
      ...parseHours(hours)
    ].filter(Boolean)
  }));

  return mapped;
}
