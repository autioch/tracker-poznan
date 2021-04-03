import icons from 'icons';
import tag from 'lean-tag';

const LS_KEY = 'tracker-poznan-about1';

export default function about() {
  const contentEl = tag(
    'div.tp-panel.is-hidden',
    tag('div.tp-panel__header', 'Poznan tracker'),
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
    tag('div.tp-panel__header', 'Have fun!'),
    tag('div.tp-panel__close', {
      onclick: toggleAbout // eslint-disable-line no-use-before-define
    })
  );

  function toggleAbout() {
    const isActive = window.tpAbout.classList.contains('is-active');

    window.tpAbout.classList.toggle('is-active', !isActive);
    contentEl.classList.toggle('is-hidden', isActive);
  }

  window.tpAbout.addEventListener('click', toggleAbout);
  window.tpAbout.append(tag('img', {
    src: icons.about
  }));
  window.tpAbout.classList.remove('is-hidden');

  const serialized = localStorage.getItem(LS_KEY);

  if (!serialized) {
    toggleAbout();

    localStorage.setItem(LS_KEY, '1');
  }

  document.body.append(contentEl);
}
