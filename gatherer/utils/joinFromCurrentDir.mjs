import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export default function joinFromCurrentDir(importMeta, ...subfolders) {
  const baseDir = dirname(fileURLToPath(importMeta.url));
  const basePath = join(baseDir, ...subfolders);

  return join.bind(null, basePath);
}
