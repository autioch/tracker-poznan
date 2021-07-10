import fs from 'fs';

import { getPage, joinFromCurrentDir } from '../utils.mjs';

const join = joinFromCurrentDir(import.meta, 'db');
const pageCount = 5;
const url = `https://www.gdziepolek.pl/apteki/w-poznaniu/`;

const reqs = new Array(pageCount).fill(null).map((el, i) => getPage(`${url}${i + 1}?openFilter=none`)); // eslint-disable-line no-unused-vars
const htmls = await Promise.all(reqs);

await Promise.all(htmls.map((html, i) => fs.promises.writeFile(join(`page${i + 1}.html`), html)));
