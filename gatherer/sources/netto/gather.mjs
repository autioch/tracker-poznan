import fs from 'fs';

import { getPage, joinFromCurrentDir } from '../../utils/index.mjs';

// https://netto.pl/znajdz-sklep?mapData={%22coordinates%22:{%22lat%22:52.33251384222145,%22lng%22:18.295774500000004},%22zoom%22:7,%22input%22:%22%22}
const url = `https://netto.pl/umbraco/api/StoresData/StoresV2`;
const rawJson = await getPage(url);

await fs.promises.writeFile(joinFromCurrentDir(import.meta, 'db', 'raw.json')(), rawJson);
