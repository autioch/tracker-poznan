import BoundsService from 'services/bounds';
import ButtonBarService from 'services/buttonBar';

import icons from './icons';

const KAPONIERA_LAT = 52.40777954910866;
const KAPONIERA_LNG = 16.912470459938053;
const KAPONIERA_LAT_LNG = [KAPONIERA_LAT, KAPONIERA_LNG];

export default function custom(mapInstance) {
  ButtonBarService.addButton(icons.center, 'Center on Kaponiera', () => {
    BoundsService.centerMap(mapInstance, KAPONIERA_LAT_LNG);
  });
}
