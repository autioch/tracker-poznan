import fs from 'fs';

import { getPage, joinFromCurrentDir } from '../utils.mjs'; // eslint-disable-line no-shadow

const join = joinFromCurrentDir(import.meta, 'db');
const url = `https://www.chatapolska.pl/sklepy/wielkopolskie,18.html`;

(async () => {
  if (!fs.existsSync(join())) {
    await fs.promises.mkdir(join());
  }

  const html = await getPage(url); // eslint-disable-line no-unused-vars

  fs.promises.writeFile(join(`page.html`), html);
})();
