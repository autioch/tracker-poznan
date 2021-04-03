import fs from 'fs';

import { getPage, joinFromCurrentDir } from '../utils.mjs'; // eslint-disable-line no-shadow

const join = joinFromCurrentDir(import.meta, 'db');

// https://www.zabka.pl/znajdz-sklep
const url = `https://www.zabka.pl/ajax/shop-clusters.json`;

(async () => {
  if (!fs.existsSync(join())) {
    await fs.promises.mkdir(join());
  }

  const rawJson = await getPage(url);

  await fs.promises.writeFile(join(`raw.json`), rawJson);
})();
