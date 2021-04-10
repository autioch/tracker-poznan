import ActiveLocationService from 'services/activeLocation';
import ButtonBarService from 'services/buttonBar';

import icons from './icons';

export default function custom(mapInstance) {
  function showCustomLocation(ev) {
    ActiveLocationService.setLocation([ev.latlng.lat, ev.latlng.lng]);
  }

  const buttonEl = ButtonBarService.addButton(icons.custom, 'Click on map', () => {
    const isActive = buttonEl.classList.contains('is-active');

    buttonEl.classList.toggle('is-active', !isActive);

    window.tpMap.style.cursor = isActive ? '' : 'pointer';

    mapInstance.off('click', showCustomLocation);

    if (!isActive) {
      mapInstance.on('click', showCustomLocation);
    }
  });
}
