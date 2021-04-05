import './styles.scss';
import tag from 'lean-tag';

import icons from '../icons';

export default function createPanel(title, closeCallback, panelOptions = {}) {
  const panelEl = tag('div.tp-panel.is-hidden', panelOptions);
  const headerEl = tag('div.tp-panel__header', title);
  const contentEl = tag('div.tp-panel__content');
  const closeEl = tag(
    'div.tp-panel__close',
    {
      onclick() {
        panelEl.classList.add('is-hidden');
        closeCallback();
      }
    },

    tag('img.tp-panel__img', {
      src: icons.closeIcon
    })
  );
  const headlineEl = tag('div.tp-panel__headline', headerEl, closeEl);

  panelEl.append(headlineEl, contentEl);

  document.body.append(panelEl);

  return {
    panelEl,
    headerEl,
    contentEl
  };
}
