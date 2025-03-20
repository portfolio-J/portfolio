import st from './palindrome.module.scss';
import { html } from '@/utils/template';
import Component from '../../common/Component';
import { EventHandler } from '@/common/eventHolder';

type PalindromeState = {
  value: string;
  isPalindrom: null | boolean;
};

class Palindrome extends Component<PalindromeState> {
  constructor() {
    super({
      value: '',
      isPalindrom: null,
    });
  }

  render() {
    return html`
      <section class="${st.page}">
        <h1 class="${st.title}">Is Palindrome?</h1>
        <section>
          <article class="${st.container}">
            <form class="${st.submit}">
              <input class="${st.input}" type="text" placeholder="Enter a word to check" />
              <button class="${st.button}">Check</button>
            </form>
            <span class="${st.result} ${this.state.value !== '' ? '' : st.hidden}"
              >"${this.state.value}" is a ${this.state.isPalindrom ? '' : 'not'} palindrome</span
            >
          </article>
        </section>
      </section>
    `;
  }

  isPalindrome(str: string): boolean {
    const normalizedStr = str.toLowerCase().replace(/[^a-zA-Z0-9가-힣]/g, '');
    const reverse = normalizedStr.split('').reverse().join('');

    return normalizedStr === reverse;
  }

  handleSubmit(e: Event) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const value = (target.querySelector(`.${st.input}`) as HTMLInputElement).value;
    const isPalindrorm = this.isPalindrome(value);

    this.setState({ isPalindrom: isPalindrorm, value });
  }

  protected addEventListeners(): EventHandler[] {
    return [{ type: 'submit', selector: `.${st.submit}`, handler: this.handleSubmit.bind(this) }];
  }
}

export default Palindrome;
