import groups from 'services/groups';

import SettingsService from '../services/settings';

function showGroups(mapInstance) {
  groups.forEach((group) => {
    const setting = SettingsService.getSetting(group.id);

    if (setting.isVisible) {
      mapInstance.addLayer(group.layer);
    } else {
      mapInstance.removeLayer(group.layer);
    }

    group.rangeLayers.forEach(([, layer]) => mapInstance.removeLayer(layer));

    const rangeToShow = group.rangeLayers.find(([key]) => key == setting.showRange); // eslint-disable-line eqeqeq

    rangeToShow && mapInstance.addLayer(rangeToShow[1]);
  });
}

export default function markers(mapInstance) {
  SettingsService.addCallback(() => showGroups(mapInstance));

  showGroups(mapInstance);
}
