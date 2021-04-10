import ActiveLocationService from 'services/activeLocation';
import ButtonBarService from 'services/buttonBar';

import icons from './icons';

export default function currentLocation(mapInstance) {
  ButtonBarService.addButton(icons.currentLocation, 'Set current location', () => {
    function success(position) {
      const { latitude, longitude } = position.coords;

      mapInstance.setView([latitude, longitude]);

      ActiveLocationService.setLocation([latitude, longitude]);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, () => alert('Unable to retrieve your location'));
    } else {
      alert('Geolocation is not supported by your browser');
    }
  });
}
