import { joinFromCurrentDir, outputJoin, require, saveOutput } from '../utils.mjs'; // eslint-disable-line no-shadow
import { mapAgencies, mapBoundaries, mapRanges, mapRouteLines, mapStops } from './mappers.mjs';

const join = joinFromCurrentDir(import.meta, 'db');

async function prepareWebData(fileName, mappingFn, tableNames, outputNames = []) {
  const tables = tableNames.map((dbName) => require(join(`${dbName}.json`)));
  const outputs = outputNames.map((outputName) => require(outputJoin(`${outputName}.json`)));

  console.log(fileName);
  console.time(fileName);
  const mapped = mappingFn(...tables, ...outputs);

  console.timeLog(fileName, 'mapped');

  await saveOutput(fileName, mapped);
  console.timeEnd(fileName);
}

(async () => {
  await prepareWebData('agencies', mapAgencies, ['agency']);
  await prepareWebData('stops', mapStops, ['stops', 'stop_times', 'routes', 'trips']);
  await prepareWebData('routeLines', mapRouteLines, ['shapes', 'routes', 'trips']);
  await prepareWebData('boundaries', mapBoundaries, [], ['stops']);
  await prepareWebData('ranges', mapRanges, [], ['stops']);
})();
