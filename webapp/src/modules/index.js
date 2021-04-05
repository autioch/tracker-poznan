import about from './about';
import center from './center';
import custom from './custom';
import locate from './locate';
import persistence from './persistence';
import settings from './settings';

// order defines buttons in the bar
const modules = [
  persistence,
  settings,
  custom,
  locate,
  center,
  about
];

export default function runModules(mapInstance) {
  modules.forEach((fn) => fn(mapInstance));
}
