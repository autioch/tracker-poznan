import groups from 'services/groups';
import SettingsService from 'services/settings';

import { haversine } from '../../utils';

let latlng;

const callbackFns = [];

function setupClosest(silent = false) {
  if (!latlng) {
    return;
  }

  groups
    .filter((group) => SettingsService.getSetting(group.id).isMeasured)
    .forEach((group) => {
      const distances = group.items.map((item) => [haversine(latlng, [item.latitude, item.longitude]), item]);

      distances.sort(([dist1], [dist2]) => dist1 - dist2);
      group.closest = distances.slice(0, group.measureCount);
    });

  !silent && callbackFns.forEach((fn) => fn());
}

function setLocation(newLatlng, silent = false) {
  latlng = newLatlng;

  setupClosest(true);

  !silent && callbackFns.forEach((fn) => fn());
}

function getLocation() {
  return latlng;
}

function addCallback(callbackFn) {
  callbackFns.push(callbackFn);
}

SettingsService.addCallback(() => setupClosest(false));

export default {
  setLocation,
  getLocation,
  addCallback,
  setupClosest
};
