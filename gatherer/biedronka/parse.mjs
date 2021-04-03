import cheerio from 'cheerio';
import fs from 'fs/promises';

// import { createRequire } from 'module';
import { forwardGeocode, joinFromCurrentDir, saveOutput } from '../utils.mjs'; // eslint-disable-line no-shadow

// const require = createRequire(import.meta.url); // eslint-disable-line no-shadow
const join = joinFromCurrentDir(import.meta, 'db');

const ID_REGEX = / a href="\/pl\/shop,id,(\d+),title,.+" class="showShopOnMap">Zobacz więcej<\/a /;

function getShopId(commentEl, pageIndex, shopIndex) {
  const [, id] = commentEl.data.match(ID_REGEX) || [];

  return id || `${pageIndex}-${shopIndex}`;
}

function getShopList(html, pageIndex) {
  const $ = cheerio.load(html);

  const shopList = $('.shopListElement').get().map((el, shopIndex) => {
    const $shop = $(el);
    const address = $shop.find('.shopAddress').text();
    const locality = $shop.find('h4').text().replace(address, '').trim();
    const commentEl = $shop.contents().get().find((ele) => ele.type === 'comment');

    return {
      id: getShopId(commentEl, pageIndex, shopIndex),
      longitude: null,
      latitude: null,
      locality,
      address,
      openingTimes: $shop.find('p').html().split('<br>').map((text) => $(text.trim()).text()).slice(1, -1)
    };
  });

  return shopList;
}

async function geoLocateShop(shop) {
  const result = await forwardGeocode(shop.address, shop.locality);

  if (!result) {
    return;
  }

  const { lat, lng } = result;

  shop.latitude = lat;
  shop.longitude = lng;
}

(async () => {
  const fileNames = await fs.readdir(join());
  const tablePromises = fileNames.map((fileName) => fs.readFile(join(fileName), 'utf8'));

  const htmls = await Promise.all(tablePromises);
  const shopList = htmls.flatMap(getShopList);
  const geocodeReqs = shopList.map(geoLocateShop);

  await Promise.all(geocodeReqs);

  shopList.sort((a, b) => a.id.localeCompare(b.id));

  console.log(`Found ${shopList.length} Biedronka shops.`);

  saveOutput('biedronkaShops', shopList, true);
})();
