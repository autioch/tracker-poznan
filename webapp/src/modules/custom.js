import createBarButton from '../barButton';
import icons from '../icons';
import showClosest from '../showClosest';

export default function custom(mapInstance) {
  function showCustomLocation(ev) {
    showClosest(mapInstance, [ev.latlng.lat, ev.latlng.lng]);
  }

  const buttonEl = createBarButton(icons.custom, () => {
    const isActive = buttonEl.classList.contains('is-active');

    buttonEl.classList.toggle('is-active', !isActive);

    window.tpMap.style.cursor = isActive ? '' : 'pointer';

    mapInstance.off('click', showCustomLocation);

    if (!isActive) {
      mapInstance.on('click', showCustomLocation);
    }
  });
}
