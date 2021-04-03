import about from './about';
import custom from './custom';
import locate from './locate';
import persistence from './persistence';
import settings from './settings';

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
