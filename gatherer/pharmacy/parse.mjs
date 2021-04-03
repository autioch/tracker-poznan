import cheerio from 'cheerio';
import fs from 'fs/promises';

import { joinFromCurrentDir, saveOutput } from '../utils.mjs'; // eslint-disable-line no-shadow

const join = joinFromCurrentDir(import.meta, 'db');

function getItemList(html) {
  const $ = cheerio.load(html);

  const shopList = $('.row.offer').get().map((el) => {
    const $el = $(el);
    const fullAddress = $el.find('.address').text().split(',');
    const locality = fullAddress.pop().trim();
    const $openingTimesDropdown = $el.find('.text-master-lighter').eq(1).children('.cursor-pointer');
    const openingTimes = ($openingTimesDropdown.attr('data-content') || '').replace(/<\/?strong>/g, '').split('<br />');

    return {
      id: $el.attr('data-pharmacyid'),
      longitude: parseFloat($el.attr('data-lng').replace(',', '.')),
      latitude: parseFloat($el.attr('data-lat').replace(',', '.')),
      locality,
      address: fullAddress.join(',').trim(),
      openingTimes: openingTimes.map((text) => text.trim()).filter(Boolean)
    };
  });

  return shopList;
}

(async () => {
  const fileNames = await fs.readdir(join());
  const tablePromises = fileNames.map((fileName) => fs.readFile(join(fileName), 'utf8'));

  const htmls = await Promise.all(tablePromises);
  const itemList = htmls.flatMap(getItemList);

  itemList.sort((a, b) => a.id.localeCompare(b.id));

  console.log(`Found ${itemList.length} pharmacies.`);

  saveOutput('pharmacies', itemList, true);
})();
