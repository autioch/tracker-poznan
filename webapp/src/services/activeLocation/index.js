import groups from 'services/groups';
import SettingsService from 'services/settings';

import { haversine } from '../../utils';

let latlng;

const callbackFns = [];

function setupClosest(silent = false) {
  if (!latlng) {
    return;
  }

  const measuredGroups = groups.filter((group) => SettingsService.getSetting(group.id).isMeasured);
  const shopLimit = SettingsService.getShopLimit();

  measuredGroups.forEach((group) => {
    const distances = group.items.map((item) => [haversine(latlng, [item.latitude, item.longitude]), item]);

    distances.sort(([dist1], [dist2]) => dist1 - dist2);
    group.closest = distances.slice(0, group.measureCount);
  });

  if (shopLimit > 0) {
    const shopGroups = measuredGroups.filter((group) => group.category === 'shop');

    const allItems = shopGroups.flatMap((group) => group.closest);

    const limitedItems = allItems.sort(([dist1], [dist2]) => dist1 - dist2).slice(0, shopLimit);

    const byGroup = limitedItems.reduce((map, item) => {
      if (map.has(item[1].group)) {
        map.get(item[1].group).push(item);
      } else {
        map.set(item[1].group, [item]);
      }

      return map;
    }, new Map());

    shopGroups.forEach((group) => {
      group.closest = byGroup.get(group) || [];
    });
  }

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
