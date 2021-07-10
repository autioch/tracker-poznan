// https://inpost.pl/sites/default/files/points.json
// https://inpost.pl/en/find-location

import fs from 'fs';

import { getPage, joinFromCurrentDir } from '../utils.mjs';

const join = joinFromCurrentDir(import.meta, 'db');

// https://inpost.pl/en/find-location
const url = `https://inpost.pl/sites/default/files/points.json`;
const points = await getPage(url);

await fs.promises.writeFile(join(`points.json`), points);
