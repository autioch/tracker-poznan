import cheerio from 'cheerio';
import fs from 'fs/promises';

import { forwardGeocode, joinFromCurrentDir, saveOutputItems } from '../../utils/index.mjs';

const join = joinFromCurrentDir(import.meta, 'db');

const ID_REGEX = / a href="\/pl\/shop,id,(\d+),title,.+" class="showShopOnMap">Zobacz więcej<\/a /;

function getShopId($shop, pageIndex, shopIndex) {
  const commentEl = $shop.contents().get().find((ele) => ele.type === 'comment');
  const [, id] = commentEl.data.match(ID_REGEX) || [];

  return id || `${pageIndex}-${shopIndex}`;
}

function getShopList(html, pageIndex) {
  const $ = cheerio.load(html);

  return $('.shopListElement').get().map((el, shopIndex) => {
    const $shop = $(el);
    const addressWithPostalCode = $shop.find('.shopAddress').text();
    const address = addressWithPostalCode.split('\n').pop().trim();

    return {
      id: getShopId($shop, pageIndex, shopIndex),
      label: address,
      address,
      city: $shop.find('h4').text().replace(addressWithPostalCode, '').trim(),
      longitude: null,
      latitude: null,
      popupLines: [$shop.find('p').html().split('<br>').map((text) => $(text.trim()).text()).slice(1, -1).join('<br/>')]
    };
  });
}

async function geoLocateShop(shop) {
  const result = await forwardGeocode(shop.address, shop.city);

  if (result) {
    const { lat, lng } = result;

    shop.latitude = lat;
    shop.longitude = lng;
  }

  return shop;
}

const fileNames = await fs.readdir(join());
const tablePromises = fileNames.map((fileName) => fs.readFile(join(fileName), 'utf8'));

const htmls = await Promise.all(tablePromises);
const shopList = await Promise.all(htmls.flatMap(getShopList).map(geoLocateShop));

await saveOutputItems('biedronka', shopList);
