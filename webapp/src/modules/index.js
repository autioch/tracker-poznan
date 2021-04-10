import about from './about';
import center from './center';
import custom from './custom';
import lines from './lines';
import locate from './locate';
import markers from './markers';
import measure from './measure';
import persistence from './persistence';
import settings from './settings';
import zoom from './zoom';

// order defines buttons in the bar
const modules = [
  persistence,
  zoom,
  settings,
  measure,
  markers,
  lines,
  locate,
  custom,
  center,
  about
];

export default function runModules(mapInstance) {
  modules.forEach((fn) => fn(mapInstance));
}
