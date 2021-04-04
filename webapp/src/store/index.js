import { haversine } from '../utils';
import { bigShops, misc, transport } from './groups';
import prepare from './prepare';

const LS_KEY = 'tracker-poznan-settings1';

const serialized = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
const getItems = (group) => group.items;

prepare(serialized, transport, bigShops, misc);

const groups = [...bigShops, ...misc, ...transport];
const items = [...bigShops.flatMap(getItems), ...misc.flatMap(getItems), ...transport.flatMap(getItems)];

const categories = [
  {
    id: 'transport',
    label: 'Transport',
    groups: transport
  },
  {
    id: 'shops',
    label: 'Shops',
    groups: bigShops
  },
  {
    id: 'miscellaneous',
    label: 'Miscellaneous',
    groups: misc
  }
];

function saveSettings() {
  const settings = Object.fromEntries([...transport, ...bigShops, ...misc].map((group) => [group.id, {
    isVisible: group.isVisible,
    isMeasured: group.isMeasured,
    showRange: group.showRange
  }]));

  localStorage.setItem(LS_KEY, JSON.stringify(settings));
}

function setupClosest(latlng) {
  groups
    .filter((source) => source.isMeasured)
    .forEach((source) => {
      const distances = source.items.map((item) => [haversine(latlng, [item.latitude, item.longitude]), item]);

      distances.sort(([dist1], [dist2]) => dist1 - dist2);
      source.closest = distances.slice(0, source.measureCount);
    });
}

export {
  categories,
  groups,
  items,
  saveSettings,
  setupClosest
};
