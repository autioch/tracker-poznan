/* eslint-disable max-nested-callbacks, no-param-reassign, no-bitwise, max-statements */
import { isNearPoznanCenter } from '../utils.mjs'; // eslint-disable-line no-shadow

const pad = (item, len = 6) => item.toString().padEnd(len, ' ');

const IGNORED = new Set(['Inny', 'Inny Bank']);

const PREC = 10000;
const roundNum = (num) => Math.round(num * PREC) / PREC;
const ensureDict = (obj, key, val) => obj[key] || (obj[key] = val);

const levenshtein = (a, b) => {
  const alen = a.length;

  const blen = b.length;

  if (alen === 0) {
    return blen;
  }
  if (blen === 0) {
    return alen;
  }
  let tmp;

  let i;

  let j;

  let prev;

  let val;

  let ma;

  let mb;

  let mc;

  let md;

  let bprev;

  if (alen > blen) {
    tmp = a;
    a = b;
    b = tmp;
  }

  const row = new Int8Array(alen + 1);

  // init the row
  for (i = 0; i <= alen; i++) {
    row[i] = i;
  }

  // fill in the rest
  for (i = 1; i <= blen; i++) {
    prev = i;
    bprev = b[i - 1];
    for (j = 1; j <= alen; j++) {
      if (bprev === a[j - 1]) {
        val = row[j - 1];
      } else {
        ma = prev + 1;
        mb = row[j] + 1;
        mc = ma - ((ma - mb) & ((mb - ma) >> 7));
        md = row[j - 1] + 1;
        val = mc - ((mc - md) & ((md - mc) >> 7));
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[alen] = prev;
  }

  return row[alen];
};

const uniqDiff = (items) => {
  const [first, ...other] = items;

  if (!other.length) {
    return [first];
  }

  const different = other.filter((item) => levenshtein(item.toLowerCase(), first.toLowerCase()) > 3);

  return [first, ...different];
};

const pick = (items, key) => uniqDiff([...new Set(items.map((item) => item[key]))].sort());

export default function cleanupList(atms) {
  const nearPoznan = atms.filter((item) => isNearPoznanCenter(item.latitude, item.longitude));

  const dict = nearPoznan
    .sort((a, b) => a.longitude - b.longitude)
    .sort((a, b) => a.latitude - b.latitude)
    .reduce((obj, atm) => {
      const { longitude, latitude } = atm;

      const lat = roundNum(latitude);
      const lng = roundNum(longitude);

      ensureDict(ensureDict(obj, lat, {}), lng, []).push(atm);

      return obj;
    }, {});

  const merged = Object.values(dict).flatMap((latDict) => Object.values(latDict).map((lngItems) => ({
    id: pick(lngItems, 'id').join(','),
    label: pick(lngItems, 'label', true).join(', '),
    address: pick(lngItems, 'address').join(', '),
    city: pick(lngItems, 'city').join(', '),
    longitude: lngItems[0].longitude,
    latitude: lngItems[0].latitude,
    popupLines: uniqDiff([...new Set(lngItems.flatMap((item) => item.popupLines))].filter((line) => !IGNORED.has(line)).sort())
  })));

  console.log('total', pad(atms.length), 'relevant', pad(nearPoznan.length), 'unique', pad(merged.length));

  return merged;
}
