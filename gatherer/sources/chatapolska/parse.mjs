import fs from 'fs/promises';

import { joinFromCurrentDir, saveOutputItems } from '../../utils/index.mjs';

const html = await fs.readFile(joinFromCurrentDir(import.meta, 'db', 'page.html')(), 'utf8');

const lines = html.split('\n').map((line) => line.trim());

const indexBeforeList = lines.indexOf('var locations = [');
const indexAfterList = lines.indexOf(`var map = new google.maps.Map(document.getElementById('map'), {`);
const linesWithDefinitions = lines.slice(indexBeforeList, indexAfterList);

if (linesWithDefinitions.some((line) => line.includes('<script') || line.includes('()'))) {
  throw Error('Unsafe data detected in string to be evaluated as code.');
}

const locations = new Function(`${linesWithDefinitions.join('\n')}return locations;`)(); // eslint-disable-line no-new-func

const shopList = locations
  .filter(([, latitude, longitude]) => !!latitude && !!longitude)
  .map((item, index) => {
    const [text, latitude, longitude] = item;
    const [label, address, city] = text.split('<br>').map((text2) => text2.trim());

    return {
      id: index.toString(),
      label,
      address,
      city,
      longitude,
      latitude,
      popupLines: []
    };
  });

saveOutputItems('chatapolska', shopList);
