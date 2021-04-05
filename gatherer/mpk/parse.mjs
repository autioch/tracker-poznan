import { joinFromCurrentDir, require } from '../utils.mjs'; // eslint-disable-line no-shadow
import parseLines from './parseLines.mjs';

// import parseRanges from './parseRanges.mjs';
// import parseStops from './parseStops.mjs';

const join = joinFromCurrentDir(import.meta, 'db');

// const stops = require(join('stops.json'));
// const stopTimes = require(join('stop_times.json'));
const trips = require(join('trips.json'));
const routes = require(join('routes.json'));
const shapes = require(join('shapes.json'));

async function prepareWebData(step, fn, ...tables) {
  console.log(step);
  console.time(step);

  const result = await fn(...tables);

  console.timeEnd(step);

  return result;
}

(async () => {
  // const parsedStops = await prepareWebData('stops', parseStops, stops, stopTimes, trips, routes);

  // await prepareWebData('ranges', parseRanges, parsedStops);

  await prepareWebData('lines', parseLines, shapes, routes, trips);
})();
