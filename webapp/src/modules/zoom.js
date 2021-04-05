import createBarButton from '../barButton';
import icons from '../icons';

export default function zoom(mapInstance) {
  function checkZoom(change) {
    const maxZoom = mapInstance.getMaxZoom();
    const minZoom = mapInstance.getMinZoom();
    const current = mapInstance.getZoom() + change;

    zoomInButtonEl.classList.toggle('is-disabled', !(current < maxZoom)); // eslint-disable-line no-use-before-define
    zoomOutButtonEl.classList.toggle('is-disabled', !(current > minZoom));// eslint-disable-line no-use-before-define
  }

  const zoomInButtonEl = createBarButton(icons.plus, (ev, buttonEl) => { // eslint-disable-line no-unused-vars
    mapInstance.zoomIn();
    checkZoom(1);
  });
  const zoomOutButtonEl = createBarButton(icons.minus, (ev, buttonEl) => { // eslint-disable-line no-unused-vars
    mapInstance.zoomOut();
    checkZoom(-1);
  });

  checkZoom(0);
}
