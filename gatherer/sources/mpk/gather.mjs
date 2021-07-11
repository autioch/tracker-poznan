import csvParser from 'csv-parser';
import extract from 'extract-zip';
import fs from 'fs';
import https from 'https';
import { basename } from 'path';

import { joinFromCurrentDir } from '../../utils/index.mjs';

const join = joinFromCurrentDir(import.meta, 'db');

// https://www.ztm.poznan.pl/en/dla-deweloperow/gtfsFiles
const url = 'https://www.ztm.poznan.pl/en/dla-deweloperow/getGTFSFile';
const zipLocation = join('ZTMPoznanGTFS.zip');

function csvToJson(tableName) {
  return new Promise((res) => {
    const tableContent = [];

    fs.createReadStream(join(tableName))
      .pipe(csvParser({
        mapHeaders: ({ header }) => header.trim(), // route_id has bom or other character
        mapValues: ({ value }) => value.trim()
      }))
      .on('data', (data) => tableContent.push(data))
      .on('end', () => {
        fs.promises
          .writeFile(join(`${basename(tableName, '.txt')}.json`), JSON.stringify(tableContent))
          .then(res);
      });
  });
}

await new Promise((res) => {
  https.get(url, (resp) => {
    const filePath = fs.createWriteStream(zipLocation);

    resp.pipe(filePath);
    filePath.on('finish', () => {
      filePath.close();
      res();
    });
  });
});

await extract(zipLocation, {
  dir: join()
});

const tableNames = await fs.promises.readdir(join());
const tablePromises = tableNames.filter((tableName) => tableName.endsWith('.txt')).map(csvToJson);

await Promise.all(tablePromises);
