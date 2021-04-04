import createBarButton from '../barButton';
import icons from '../icons';
import showClosest from '../showClosest';

export default function currentLocation(mapInstance) {
  createBarButton(icons.currentLocation, () => {
    function success(position) {
      const { latitude, longitude } = position.coords;

      mapInstance.setView([latitude, longitude]);

      showClosest(mapInstance, [latitude, longitude]);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, () => alert('Unable to retrieve your location'));
    } else {
      alert('Geolocation is not supported by your browser');
    }
  });
}
