import Component from '@/common/Component';
import st from './darkMode.module.scss';
import { html } from '@/utils/template';
import { EventHandler } from '@/common/eventHolder';
import { getDarkModePreference } from '@/utils/helpers';

type DarkModeState = {
  isDarkMode: boolean;
};

class DarkMode extends Component<DarkModeState> {
  constructor() {
    super({
      isDarkMode: getDarkModePreference(),
    });
  }

  render() {
    return html`
      <section class="${st.container} ${this.state.isDarkMode ? st['dark-mode'] : ''}">
        <h1 class="${st.title}">Light / Dark Mode - Toggle Button</h1>
        <div class="${st.toggle}">
          <div class="${st['toggle-button']}"></div>
          <svg class="${st['icon-container']}">
            <use class="${st['icon-sun']}" href="/assets/icons/sprite.svg#icon-sun"></use>
          </svg>
          <svg class="${st['icon-container']}">
            <use class="${st['icon-moon']}" href="/assets/icons/sprite.svg#icon-moon"></use>
          </svg>
        </div>
        <article class="${st.description}">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum optio ab porro magni in sunt ipsam,
          doloremque minima, itaque sapiente consequatur, repellat velit voluptatum accusantium aperiam. Nostrum sunt
          reprehenderit nemo!
        </article>
      </section>
    `;
  }

  private toggleDarkMode() {
    const currnetIsDarkMode = !this.state.isDarkMode;

    localStorage.setItem('isDarkMode', JSON.stringify(currnetIsDarkMode));
    this.setState({ isDarkMode: currnetIsDarkMode });
  }

  protected addEventListeners(): EventHandler[] {
    return [{ type: 'click', selector: `.${st['toggle']}`, handler: this.toggleDarkMode.bind(this) }];
  }
}

export default DarkMode;
