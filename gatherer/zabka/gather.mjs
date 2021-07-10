import fs from 'fs/promises';

import { getPage, joinFromCurrentDir } from '../utils.mjs';

const join = joinFromCurrentDir(import.meta, 'db');
const url = `https://www.zabka.pl/ajax/shop-clusters.json`; // https://www.zabka.pl/znajdz-sklep
const rawJson = await getPage(url);

await fs.writeFile(join(`raw.json`), rawJson);
