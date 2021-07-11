import './styles.scss';

import tag from 'lean-tag';

import closeIcon from './close.png';

let currentCallback;

function callCallback() {
  if (currentCallback) {
    currentCallback();
    currentCallback = null;
  }
}

const panelEl = tag('div.tp-panel.is-hidden');
const headerEl = tag('div.tp-panel__header');
const contentEl = tag('div.tp-panel__content');
const closeEl = tag(
  'div.tp-panel__close',
  {
    onclick() {
      panelEl.classList.add('is-hidden');
      callCallback();
    }
  },
  tag('img.tp-panel__img', {
    src: closeIcon,
    alt: 'Close panel'
  })
);

const headlineEl = tag('div.tp-panel__headline', headerEl, closeEl);

panelEl.append(headlineEl, contentEl);

document.body.append(panelEl);

function show(title, closeCallback, contentEls, isPartial = false) {
  const newContent = Array.isArray(contentEls) ? contentEls : [contentEls];

  if (currentCallback !== closeCallback) {
    callCallback();
  }
  currentCallback = closeCallback;
  headerEl.textContent = title;
  panelEl.classList.remove('is-hidden');
  panelEl.classList.toggle('tp-panel--partial', isPartial);
  contentEl.replaceChildren(...newContent);
}

function hide() {
  panelEl.classList.add('is-hidden');
  callCallback();
}

export default {
  show,
  hide
};
