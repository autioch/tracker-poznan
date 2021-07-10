import { existsSync } from 'fs';
import { mkdir, readdir } from 'fs/promises';

import { joinFromCurrentDir } from './utils.mjs';

const join = joinFromCurrentDir(import.meta, 'sources');

const folders = await readdir(join(), {
  withFileTypes: true
});

const sources = folders.filter((dirent) => dirent.isDirectory());

for (const source of sources) {
  const dbPath = join(source.name, 'db');

  if (!existsSync(dbPath)) {
    await mkdir(dbPath); // eslint-disable-line no-await-in-loop
  }
}

if (!existsSync(join('output'))) {
  await mkdir(join('output'));
}
