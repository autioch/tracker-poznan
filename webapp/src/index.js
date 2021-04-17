import './styles';

import { loadGroups } from './services/groups';
import { createMap } from './utils';

const mapInstance = createMap('tpMap');

loadGroups()
  .then(() => {
    import('./modules' /* modules  */).then((runModules) => runModules.default(mapInstance));
  });
