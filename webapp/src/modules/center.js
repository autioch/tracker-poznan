import createBarButton from '../barButton';
import icons from '../icons';

const POZNAN_CENTER_LAT = 52.409538;
const POZNAN_CENTER_LNG = 16.931992;

export default function custom(mapInstance) {
  createBarButton(icons.center, () => {
    mapInstance.flyTo([POZNAN_CENTER_LAT, POZNAN_CENTER_LNG]);
  });
}
