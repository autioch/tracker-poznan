import ActiveLocationService from 'services/activeLocation';
import ButtonBarService from 'services/buttonBar';

import icons from './icons';

export default function currentLocation(mapInstance) {
  let watchId;

  function success(position) {
    const { latitude, longitude } = position.coords;

    mapInstance.setView([latitude, longitude]);

    ActiveLocationService.setLocation([latitude, longitude]);
  }

  function error() {
    alert('Unable to follow your location');
  }

  const buttonEl = ButtonBarService.addButton(icons.currentLocation, 'Follow current location', () => {
    const isActive = !buttonEl.classList.contains('is-active');

    buttonEl.classList.toggle('is-active', isActive);

    if (isActive && !watchId) {
      watchId = navigator.geolocation.watchPosition(success, error, {
        enableHighAccuracy: true,
        maximumAge: 5000
      });
    }

    if (!isActive && watchId) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  });
}
