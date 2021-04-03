import fs from 'fs';

import { getPage, joinFromCurrentDir } from '../utils.mjs'; // eslint-disable-line no-shadow

const join = joinFromCurrentDir(import.meta, 'db');
const pageCount = 5;
const url = `https://www.gdziepolek.pl/apteki/w-poznaniu/`;

(async () => {
  if (!fs.existsSync(join())) {
    await fs.promises.mkdir(join());
  }

  const reqs = new Array(pageCount).fill(null).map((el, i) => getPage(`${url}${i + 1}?openFilter=none`)); // eslint-disable-line no-unused-vars
  const htmls = await Promise.all(reqs);

  await Promise.all(htmls.map((html, i) => fs.promises.writeFile(join(`page${i + 1}.html`), html)));
})();
