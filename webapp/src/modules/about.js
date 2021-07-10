import './about.scss';

import tag from 'lean-tag';
import ButtonBarService from 'services/buttonBar';
import PanelService from 'services/panel';

import icons from './icons';

const LS_KEY = 'tracker-poznan-about1';
const LAST_UPDATE = '2021.07.10';

function getPanelContent() {
  return [
    tag('p', `Find closest communication, shops and other POI (Points Of Interest).`),
    tag('p', `Last updated ${LAST_UPDATE}`),
    tag('div.tp-panel__header', 'Terms of use'),
    tag('ol',
        tag('li', 'You\'re using this application on your own.'),
        tag('li', 'I claim no rights to the presented data.'),
        tag('li', 'I take no responsibility for any actions based on this app or its contents.'),
        tag('li', 'Data was collected using resources available on the internet.')
    ),
    tag('div.tp-panel__header', 'Usage'),
    tag('div.tutorial',
        tag('div.tutorial__item',
            tag('img.tutorial__icon', {
              src: icons.plus,
              alt: 'Zoom in'
            }),
            'Zoom in'
        ),
        tag('div.tutorial__item',
            tag('img.tutorial__icon', {
              src: icons.minus,
              alt: 'Zoom out'
            }),
            'Zoom out'
        ),
        tag('div.tutorial__item',
            tag('img.tutorial__icon', {
              src: icons.settings,
              alt: 'Settings'
            }),
            'Change displayed and measured POIs'
        ),
        tag('div.tutorial__item',
            tag('img.tutorial__icon', {
              src: icons.measure,
              alt: 'Measure details'
            }),
            'Display details about closest POIs'
        ),
        tag('div.tutorial__item',
            tag('img.tutorial__icon', {
              src: icons.custom,
              alt: 'Click on map'
            }),
            'Click on map to find closest POIs'
        ),
        tag('div.tutorial__item',
            tag('img.tutorial__icon', {
              src: icons.currentLocation,
              alt: 'Current location'
            }),
            'Follow current location to find closest POIs'
        ),
        tag('div.tutorial__item',
            tag('img.tutorial__icon', {
              src: icons.center,
              alt: 'Center'
            }),
            'Focus map on the Kaponiera'
        ),
        tag('div.tutorial__item',
            tag('img.tutorial__icon', {
              src: icons.about,
              alt: 'About'
            }),
            'Show this panel again'
        )
    ),
    tag('div.tp-panel__header', 'Measuring distances'),
    tag('p', `Distances are measured in straight line - no obstacles are taken into account (rivers, roads, etc.).
Finding closest points would require a payed API, with a lot of requests needed.`),
    tag('div.tp-panel__header', 'Potential next features'),
    tag('ul',
        tag('li', 'Search by address'),
        tag('li', 'Translating current location to an address'),
        tag('li', 'Button to reset to see all items (selected or not)'),
        tag('li', 'Display inactive mpk stops'),
        tag('li', 'Display only icons visible in the viewport'),
        tag('li', 'Check items available on ', tag('a', 'interia.pl', {
          href: 'https://promocyjni.interia.pl/duza-mapa',
          target: '_blank',
          rel: 'noreferrer'
        }))
    ),
    tag('div.tp-panel__header', 'Have fun!')
  ];
}

export default function about() {
  const buttonEl = ButtonBarService.addButton(icons.about, 'About', togglePanel);// eslint-disable-line no-use-before-define

  function openPanel() {
    buttonEl.classList.add('is-active');

    PanelService.show(
      'Poznan tracker',
      () => buttonEl.classList.remove('is-active'),
      getPanelContent()
    );
  }

  function togglePanel() {
    if (buttonEl.classList.contains('is-active')) {
      PanelService.hide();
      buttonEl.classList.remove('is-active');
    } else {
      openPanel();
    }
  }

  const serialized = localStorage.getItem(LS_KEY);

  if (!serialized) {
    openPanel();

    localStorage.setItem(LS_KEY, '1');
  }
}
