import './about.scss';

import L from 'leaflet';
import ActiveLocationService from 'services/activeLocation';
import BoundsService from 'services/bounds';
import groups from 'services/groups';
import SettingsService from 'services/settings';

import icons from './icons';

const myIcon = L.icon({
  iconUrl: icons.currentLocation,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, 0]
});

let layers = [];

function removeDistances() {
  layers.forEach((polyline) => polyline.remove());
  layers = [];
}

function showDistances(sources, mapInstance, latlng) {
  const clickMarker = new L.Marker(latlng, { // todo can be array or has to be object?
    icon: myIcon,
    opacity: 0.8
  });

  const polylines = sources.map((group) => L.polyline([
    group.closest.map(([, item]) => [ [item.latitude, item.longitude], latlng])
  ], {
    weight: 2,
    color: group.color,
    dashArray: [4, 4]
  }));

  const iconsLayer = L.layerGroup(
    sources
      .filter((group) => !SettingsService.getSetting(group.id).isVisible)
      .flatMap((group) => group.closest.map(([, item]) => L
        .marker([item.latitude, item.longitude], {
          icon: group.iconLayer,
          opacity: 0.8
        })
        .bindPopup(item.popupHtml)
      ))
  );

  layers.push(...polylines, iconsLayer, clickMarker);
  layers.forEach((layer) => mapInstance.addLayer(layer));
}

export default function lines(mapInstance) {
  function showLines(updateBounds = false) {
    removeDistances();

    const latlng = ActiveLocationService.getLocation();

    if (!latlng) {
      return;
    }
    const measuredGroups = groups.filter((group) => !!SettingsService.getSetting(group.id).isMeasured);

    showDistances(measuredGroups, mapInstance, latlng);

    if (!updateBounds) {
      return;
    }
    const items = measuredGroups.flatMap((source) => source.closest.map(([, item]) => item));

    BoundsService.fitMinimalBounds(mapInstance, [...items, {
      latitude: latlng[0],
      longitude: latlng[1]
    }]);
  }

  ActiveLocationService.addCallback(() => showLines(false));
  SettingsService.addCallback(() => showLines(true));
}
