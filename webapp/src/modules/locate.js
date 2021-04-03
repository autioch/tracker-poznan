/* eslint-disable no-alert */
import icons from 'icons';
import tag from 'lean-tag';
import showClosest from 'showClosest';

function error() {
  alert('Unable to retrieve your location');
}

function showCurrentLocation(mapInstance) {
  function success(position) {
    const { latitude, longitude } = position.coords;

    mapInstance.setView([latitude, longitude]);

    showClosest(mapInstance, [latitude, longitude]);
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert('Geolocation is not supported by your browser');
  }
}

export default function currentLocation(mapInstance) {
  window.tpLocate.addEventListener('click', () => showCurrentLocation(mapInstance));
  window.tpLocate.append(tag('img', {
    src: icons.currentLocation
  }));
  window.tpLocate.classList.remove('is-hidden');
}
