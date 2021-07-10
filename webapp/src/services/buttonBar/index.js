import './styles.scss';

import tag from 'lean-tag';

const barEl = window.tpBar;

function addButton(icon, title, clickCallback) {
  const buttonEl = tag(
    'div.tp-bar__button',
    {
      title
    },
    tag('img', {
      src: icon,
      alt: title
    }),
    {
      onclick: clickCallback
    }
  );

  barEl.append(buttonEl);

  return buttonEl;
}

export default {
  addButton
};
