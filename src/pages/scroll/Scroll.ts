import st from './scroll.module.scss';

import Component from '../../common/Component';
import { html } from '@/utils/template';
import { EventHandler } from '@/common/eventHolder';
import { throttle } from '@/utils/lodash';

type ScrollState = {
  isVisible: boolean;
};

class Scroll extends Component<ScrollState> {
  private TOP_TO_START_SHOWING: number = 300;

  constructor() {
    super({ isVisible: false });
  }

  render() {
    return html`
      <h3 class="${st.title}">Scrolling go to Top</h1>
      <article>Section 1</article>
      <article>Section 2</article>
      <article>Section 3</article>
      <article>Section 4</article>
      <svg class='${st['icon-scroll']} ${this.state.isVisible ? `${st.show}` : ''}' >
        <use href='/assets/icons/sprite.svg#icon-scroll'></use>
      </svg>
    `;
  }

  showIconHandler() {
    if (window.scrollY >= this.TOP_TO_START_SHOWING && !this.state.isVisible) this.setState({ isVisible: true });
    if (window.scrollY < this.TOP_TO_START_SHOWING && this.state.isVisible) {
      this.setState({ isVisible: false });
    }
  }

  scrollToTopHandler() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  protected addEventListeners(): EventHandler[] {
    return [
      { type: 'scroll', selector: 'window', handler: throttle(this.showIconHandler.bind(this), 100) },
      { type: 'click', selector: `.${st['icon-scroll']}`, handler: this.scrollToTopHandler },
    ];
  }
}

export default Scroll;
