import './styles.scss';
import tag from 'lean-tag';

export default function createBarButton(icon, clickCallback) {
  const buttonEl = tag(
    'div.tp-bar__button',
    tag('img', {
      src: icon
    }),
    {
      onclick: (ev) => clickCallback(ev, buttonEl)
    }
  );

  window.tpBar.append(buttonEl);

  return buttonEl;
}
