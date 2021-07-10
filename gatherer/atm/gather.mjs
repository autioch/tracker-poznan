import fs from 'fs';

import { getPage, joinFromCurrentDir } from '../utils.mjs';

const join = joinFromCurrentDir(import.meta, 'db');

// TODO
// https://miroslawmamczur.pl/jak-zmienic-adres-w-wspolrzedne-geograficzne-i-sprawdzic-np-najblizsze-restauracje-openstreetmap/
// https://nominatim.openstreetmap.org/ui/search.html
// https://wiki.openstreetmap.org/wiki/Nominatim/Special_Phrases/PL
// https://wiki.openstreetmap.org/wiki/Tag:atm%3Dyes

// https://www.mastercard.pl/pl-pl/klient-indywidualny/pomoc/lokalizator-bankomatow.html
const url = 'https://www.mastercard.pl/locator/NearestLocationsService/?latitude=52.406374&longitude=16.9251681&radius=5&distanceUnit=&locationType=atm&maxLocations=100&MERCH_ATTR_1=&instName=&supportEMV=&customAttr1=&locationTypeId=';

const xml = await getPage(url);

await fs.promises.writeFile(join('mastercard.xml'), xml);
