import { existsSync } from 'fs';
import { mkdir, readdir } from 'fs/promises';

import { joinFromCurrentDir } from './utils.mjs';

const join = joinFromCurrentDir(import.meta);

const folders = await readdir(join(), {
  withFileTypes: true
});

const sources = folders.filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('_'));

for (const source of sources) {
  const dbPath = join(source.name, 'db');

  if (!existsSync(dbPath)) {
    await mkdir(dbPath); // eslint-disable-line no-await-in-loop
  }
}

if (!existsSync(join('_output'))) {
  await mkdir(join('_output'));
}
