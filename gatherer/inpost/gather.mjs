// https://inpost.pl/sites/default/files/points.json
// https://inpost.pl/en/find-location

import fs from 'fs';

import { getPage, joinFromCurrentDir } from '../utils.mjs'; // eslint-disable-line no-shadow

const join = joinFromCurrentDir(import.meta, 'db');

// https://inpost.pl/en/find-location
const url = `https://inpost.pl/sites/default/files/points.json`;

(async () => {
  if (!fs.existsSync(join())) {
    await fs.promises.mkdir(join());
  }

  const points = await getPage(url);

  await fs.promises.writeFile(join(`points.json`), points);
})();
