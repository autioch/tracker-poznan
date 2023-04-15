import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

const source = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const maxZoom = 19;
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileSize = 512;
const zoomOffset = -1;

export function createMap(elementId) {
  const mapInstance = L.map(elementId);

  L
    .tileLayer(source, {
      maxZoom,
      attribution,

      id: 'a',
      tileSize,
      zoomOffset,
      zoomSnap: 0
    })
    .addTo(mapInstance);

  mapInstance.zoomControl.remove(); // zoomControl: false doesn't seem to work?

  mapInstance.attributionControl.setPosition('bottomleft');

  return mapInstance;
}
