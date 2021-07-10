import fs from 'fs/promises';

import { getPage, joinFromCurrentDir } from '../utils.mjs';

const rawJson = await getPage('https://www.zabka.pl/ajax/shop-clusters.json');// https://www.zabka.pl/znajdz-sklep

await fs.writeFile(joinFromCurrentDir(import.meta, 'db', 'raw.json')(), rawJson);
