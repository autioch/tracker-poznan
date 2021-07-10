import { saveOutputItems } from '../utils.mjs';
import tmp from './tmp.mjs';

const shopList = tmp
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
