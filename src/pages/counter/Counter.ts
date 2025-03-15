import st from './counter.module.scss';
import { html } from '@/utils/template';
import Component from '../../common/Component';
import { EventHandler } from '@/common/eventHolder';
type CounterState = {
  counter: number;
};

class Counter extends Component<CounterState> {
  constructor() {
    super({ counter: 0 });
  }

  render() {
    return html`
      <h1 class="${st.title}">Counter</h1>
      <section class="${st.container}">
        <button class="${st.decrease}"><span>-</span></button>
        <span class="${st.counter}">${this.state.counter ? this.state.counter : '0'}</span>
        <button class="${st.increase} increase"><span>+<span></button>
      </section>
    `;
  }

  updateCounterHandler(e: Event) {
    const target = e.target as HTMLElement;

    if (target.closest(`.${st.decrease}`) && this.state.counter > 0) this.setState({ counter: --this.state.counter });
    if (target.closest(`.increase`)) {
      this.setState({ counter: ++this.state.counter });
    }
  }

  protected addEventListeners(): EventHandler[] {
    return [{ type: 'click', selector: `.${st.container}`, handler: this.updateCounterHandler.bind(this) }];
  }
}

export default Counter;
