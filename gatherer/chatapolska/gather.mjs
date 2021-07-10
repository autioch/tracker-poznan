import fs from 'fs';

import { getPage, joinFromCurrentDir } from '../utils.mjs';

const join = joinFromCurrentDir(import.meta, 'db');
const url = `https://www.chatapolska.pl/sklepy/wielkopolskie,18.html`;

const html = await getPage(url);

fs.promises.writeFile(join(`page.html`), html);
