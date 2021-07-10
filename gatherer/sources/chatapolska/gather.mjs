import fs from 'fs';

import { getPage, joinFromCurrentDir } from '../../utils/index.mjs';

const html = await getPage('https://www.chatapolska.pl/sklepy/wielkopolskie,18.html');

fs.promises.writeFile(joinFromCurrentDir(import.meta, 'db', 'page.html')(), html);
