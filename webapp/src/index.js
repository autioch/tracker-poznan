import './styles';

import runModules from './modules';
import { createMap } from './utils';

const mapInstance = createMap('tpMap');

runModules(mapInstance);
