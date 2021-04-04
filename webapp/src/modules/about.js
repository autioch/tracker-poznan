import tag from 'lean-tag';

import createBarButton from '../barButton';
import icons from '../icons';
import createPanel from '../panel';

const LS_KEY = 'tracker-poznan-about1';

export default function about() {
  const { contentEl, panelEl } = createPanel('Poznan tracker', closePanel); // eslint-disable-line no-use-before-define
  const buttonEl = createBarButton(icons.about, togglePanel);// eslint-disable-line no-use-before-define

  function closePanel() {
    panelEl.classList.add('is-hidden');
    buttonEl.classList.remove('is-active');
  }

  function openPanel() {
    panelEl.classList.remove('is-hidden');
    buttonEl.classList.add('is-active');
  }

  function togglePanel() {
    buttonEl.classList.contains('is-active') ? closePanel() : openPanel(); // eslint-disable-line no-unused-expressions
  }

  contentEl.append(
    tag('div.tp-panel__header', 'About'),
    tag('p', `Simple app for finding out closest points of interest.`),
    tag('div.tp-panel__header', 'Data behind points of interest'),
    tag('ol',
        tag('li', 'You\'re using this application on your own. '),
        tag('li', 'I claim no rights to the presented data.'),
        tag('li', 'I take no responsibility for any acts based on this app.'),
        tag('li', 'Data was collected using resources available on the internet.')
    ),
    tag('div.tp-panel__header', 'Usage'),
    tag('ol',
        tag('li', 'Use settings to change active points of interest.'),
        tag('li', 'Use location to see nearby points of interest.'),
        tag('li', 'Use pointer to see points of interest at given location.'),
        tag('li', 'See about to see this message again.')
    ),
    tag('div.tp-panel__header', 'Measuring distances'),
    tag('p', `Distances are measured in straight line - no obstacles are taken into account (rivers, roads, etc.).
    Finding closest points would require a payed API, with a lot of requests needed.`),
    tag('div.tp-panel__header', 'Potential next features'),
    tag('ul',
        tag('li', 'Search by address'),
        tag('li', 'Translating current location to an address')
    ),
    tag('div.tp-panel__header', 'Have fun!')
  );

  const serialized = localStorage.getItem(LS_KEY);

  if (!serialized) {
    openPanel();

    localStorage.setItem(LS_KEY, '1');
  }
}
