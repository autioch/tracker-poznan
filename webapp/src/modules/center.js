import createBarButton from '../barButton';
import icons from '../icons';

const KAPONIERA_LAT = 52.40777954910866;
const KAPONIERA_LNG = 16.912470459938053;

export default function custom(mapInstance) {
  createBarButton(icons.center, () => {
    mapInstance.flyTo([KAPONIERA_LAT, KAPONIERA_LNG]);
  });
}
