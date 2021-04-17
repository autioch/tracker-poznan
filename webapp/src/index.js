import './styles';

import { loadGroups } from './services/groups';
import PersistenceService from './services/persistence';
import { createMap } from './utils';

const mapInstance = createMap('tpMap');

PersistenceService.restoreLatLngZoom(mapInstance);

loadGroups().then(() => import('./modules' /* webpackChunkName: "modules" */).then((runModules) => runModules.default(mapInstance)));
