import './favicon.ico';
import './styles';
import './512.png';
import './256.png';
import './screenshot1.png';

import { loadGroups } from './services/groups';
import PersistenceService from './services/persistence';
import { createMap } from './utils';

const mapInstance = createMap('tpMap');

PersistenceService.restoreLatLngZoom(mapInstance);

loadGroups().then(() => import(/* webpackChunkName: "modules" */'./modules').then((runModules) => runModules.default(mapInstance)));
