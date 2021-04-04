import './styles.scss';
import tag from 'lean-tag';

export default function createBarButton(icon, clickCallback) {
  const buttonEl = tag(
    'div.tp-bar__button',
    tag('img', {
      src: icon
    }),
    {
      onclick: clickCallback
    }
  );

  window.tpBar.append(buttonEl);

  return buttonEl;
}
