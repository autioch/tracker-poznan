import boundaries from './data/boundaries.json';
import { bigShops, misc, transport } from './groups';
import prepare from './prepare';
const LS_KEY = 'tracker-poznan-settings1';

const serialized = JSON.parse(localStorage.getItem(LS_KEY) || '{}');

prepare(serialized, transport, bigShops, misc);

function saveSettings() {
  const settings = Object.fromEntries([...transport, ...bigShops, ...misc].map((group) => [group.id, {
    isVisible: group.isVisible,
    isMeasured: group.isMeasured,
    showRange: group.showRange
  }]));

  localStorage.setItem(LS_KEY, JSON.stringify(settings));
}

const groups = [...bigShops, ...misc, ...transport];

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

export {
  categories,
  groups,
  boundaries,
  saveSettings
};
