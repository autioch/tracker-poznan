import about from './about';
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
  about
];

export default function runModules(mapInstance) {
  modules.forEach((fn) => fn(mapInstance));
}
