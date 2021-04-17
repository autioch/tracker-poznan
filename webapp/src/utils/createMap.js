import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

const mapbox = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;
const maxZoom = 18;
const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
  '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const tileTypeId = 'mapbox/streets-v11'; // 'mapbox/satellite-v9'
const tileSize = 512;
const zoomOffset = -1;

export function createMap(elementId) {
  const mapInstance = L.map(elementId);

  L
    .tileLayer(mapbox, {
      maxZoom,
      attribution,
      id: tileTypeId,
      tileSize,
      zoomOffset,
      zoomSnap: 0.5
    })
    .addTo(mapInstance);

  mapInstance.zoomControl.remove(); // zoomControl: false doesn't seem to work?

  mapInstance.attributionControl.setPosition('bottomleft');

  return mapInstance;
}
