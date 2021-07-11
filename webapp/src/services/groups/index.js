import './styles.scss';

import loadData from './loadData';
import parseData from './parseData';

const groups = [];

export function loadGroups() {
  return loadData().then((loadedGroups) => {
    const parsedGroups = parseData(loadedGroups);

    groups.push(...parsedGroups);
  });
}

export default groups;
