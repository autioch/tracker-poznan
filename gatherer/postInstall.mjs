import { existsSync } from 'fs';
import { mkdir, readdir } from 'fs/promises';

import { joinFromCurrentDir } from './utils/index.mjs';

const join = joinFromCurrentDir(import.meta);

const folders = await readdir(join('sources'), {
  withFileTypes: true
});

const sources = folders.filter((dirent) => dirent.isDirectory());

for (const source of sources) {
  const dbPath = join('sources', source.name, 'db');

  if (!existsSync(dbPath)) {
    await mkdir(dbPath); // eslint-disable-line no-await-in-loop
  }
}

if (!existsSync(join('output'))) {
  await mkdir(join('output'));
}
