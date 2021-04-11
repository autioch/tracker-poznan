const callbacks = [];

const LS_KEY = 'tracker-poznan-settings3';
const settings = JSON.parse(localStorage.getItem(LS_KEY) || '{"items":{}}');

function commitChanges() {
  callbacks.forEach((fn) => fn());
  localStorage.setItem(LS_KEY, JSON.stringify(settings));
}

function changeSetting(key, item, value) {
  if (!settings.items[item.id]) {
    settings.items[item.id] = {};
  }

  settings.items[item.id][key] = value;
  commitChanges();
}

function setShopLimit(shopLimit) {
  settings.shopLimit = shopLimit;
  commitChanges();
}

export default {
  changeVisibility: changeSetting.bind(null, 'isVisible'),
  changeMeasuring: changeSetting.bind(null, 'isMeasured'),
  changeRange: changeSetting.bind(null, 'showRange'),
  setShopLimit,
  getShopLimit: () => settings.shopLimit || 0,
  addCallback: callbacks.push.bind(callbacks),
  getSetting: (id) => settings.items[id] || {}
};
