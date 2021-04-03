import icons from 'icons';
import tag from 'lean-tag';
import showClosest from 'showClosest';

export default function custom(mapInstance) {
  function showCustomLocation(ev) {
    showClosest(mapInstance, [ev.latlng.lat, ev.latlng.lng]);
  }

  const btn = window.tpCustom;

  function toggleClicking() {
    const isActive = btn.classList.contains('is-active');

    btn.classList.toggle('is-active', !isActive);

    window.tpMap.style.cursor = isActive ? '' : 'pointer';

    mapInstance.off('click', showCustomLocation);

    if (!isActive) {
      mapInstance.on('click', showCustomLocation);
    }
  }

  btn.addEventListener('click', toggleClicking);
  btn.append(tag('img', {
    src: icons.custom
  }));
  btn.classList.remove('is-hidden');
}
