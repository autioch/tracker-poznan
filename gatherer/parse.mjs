import './sources/atm/parse.mjs';
import './sources/biedronka/parse.mjs';
import './sources/chatapolska/parse.mjs';
import './sources/inpost/parse.mjs';
import './sources/lidl/parse.mjs';
import './sources/mpk/parse.mjs';
import './sources/netto/parse.mjs';
import './sources/pharmacy/parse.mjs';
import './sources/zabka/parse.mjs';

import { saveOutputItems } from './utils/index.mjs';

const date = new Date();

await saveOutputItems('info', {
  dataUpdate: `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
}, true);
