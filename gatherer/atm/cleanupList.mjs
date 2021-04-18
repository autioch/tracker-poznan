import { isNearPoznanCenter } from '../utils.mjs'; // eslint-disable-line no-shadow

const pad = (item, len = 6) => item.toString().padEnd(len, ' ');

const IGNORED = new Set(['Inny', 'Inny Bank']);

function cleanupAtm(atm) {
  const { id, description, ...rest } = atm; // eslint-disable-line no-unused-vars

  const unique = [...new Set(description)].sort().filter((item) => !IGNORED.has(item));

  return {
    ...rest

    // description: unique
  };
}

export default function cleanupList(atms, label) {
  const nearPoznan = atms.filter((item) => isNearPoznanCenter(item.latitude, item.longitude));
  const serialized = nearPoznan.map((atm) => JSON.stringify(cleanupAtm(atm)));
  const unique = [...new Set(serialized)];
  const deserialized = unique.map((atm) => JSON.parse(atm));

  console.log(pad(label, 17), 'total', pad(atms.length), 'relevant', pad(nearPoznan.length), 'uniue', pad(deserialized.length));

  return deserialized;
}
