const callbacks = [];

const LS_KEY = 'tracker-poznan-settings2';
const settings = JSON.parse(localStorage.getItem(LS_KEY) || '{}');

function changeSetting(key, item, value) {
  if (!settings[item.id]) {
    settings[item.id] = {};
  }

  settings[item.id][key] = value;
  callbacks.forEach((fn) => fn());
  localStorage.setItem(LS_KEY, JSON.stringify(settings));
}

export default {
  changeVisibility: changeSetting.bind(null, 'isVisible'),
  changeMeasuring: changeSetting.bind(null, 'isMeasured'),
  changeRange: changeSetting.bind(null, 'showRange'),
  addCallback: callbacks.push.bind(callbacks),
  getSetting: (id) => settings[id] || {}
};
