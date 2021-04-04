import boundaries from './data/boundaries.json';
import { bigShops, misc, transport } from './groups';
import prepare from './prepare';
const LS_KEY = 'tracker-poznan-settings1';

const serialized = (() => {
  const text = localStorage.getItem(LS_KEY);

  return text ? JSON.parse(text) : {};
})();

prepare(serialized, transport, bigShops, misc);

function saveSettings() {
  const settings = Object.fromEntries([...transport, ...bigShops, ...misc].map((group) => [group.id, {
    isVisible: group.isVisible,
    isMeasured: group.isMeasured,
    showRange: group.showRange
  }]));

  localStorage.setItem(LS_KEY, JSON.stringify(settings));
}

export {
  transport,
  bigShops,
  misc,
  boundaries,
  saveSettings
};
