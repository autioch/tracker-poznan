import fs from 'fs';

import { getPage, joinFromCurrentDir } from '../../utils/index.mjs';

// https://inpost.pl/sites/default/files/points.json
// https://inpost.pl/en/find-location
const points = await getPage('https://inpost.pl/sites/default/files/points.json');

await fs.promises.writeFile(joinFromCurrentDir(import.meta, 'db', 'raw.json')(), points);
