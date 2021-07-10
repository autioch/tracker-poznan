import fs from 'fs';

import { getPage, joinFromCurrentDir } from '../../utils/index.mjs';

const join = joinFromCurrentDir(import.meta, 'db');
const pageCount = 4;
const url = `https://www.biedronka.pl/pl/sklepy/lista,city,poznan,page,`;

const reqs = new Array(pageCount).fill(null).map((el, i) => getPage(`${url}${i + 1}`)); // eslint-disable-line no-unused-vars
const htmls = await Promise.all(reqs);

await Promise.all(htmls.map((html, i) => fs.promises.writeFile(join(`page${i + 1}.html`), html)));
