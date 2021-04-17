import './styles';

import { loadGroups } from './services/groups';
import { createMap } from './utils';

const mapInstance = createMap('tpMap');

mapInstance.setView([52.409538, 16.931992], 12);

loadGroups()
  .then(() => {
    import('./modules' /* webpackChunkName: "modules" */).then((runModules) => runModules.default(mapInstance));
  });
